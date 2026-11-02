import 'server-only';
import { createSign } from 'crypto';

const SHEET_ID = process.env.GOOGLE_SHEET_ID?.trim() || '';
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || '';
const PRIVATE_KEY = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const VALUES_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

export const hasSheetsConfig = Boolean(SHEET_ID && CLIENT_EMAIL && PRIVATE_KEY);

let cachedToken = { value: '', expiresAt: 0 };
const cachedRows = new Map<string, { rows: string[][]; expiresAt: number }>();

const toBase64Url = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

const getAccessToken = async () => {
  if (cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${toBase64Url({ alg: 'RS256', typ: 'JWT' })}.${toBase64Url({
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(PRIVATE_KEY, 'base64url');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!response.ok) throw new Error(`Google auth failed: ${await response.text()}`);

  const data = await response.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
};

const callSheets = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`${VALUES_URL}/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Google Sheets error: ${await response.text()}`);
  return response.json();
};

export const readRows = async (range: string, cacheMs = 0): Promise<string[][]> => {
  const cached = cachedRows.get(range);
  if (cached && cached.expiresAt > Date.now()) return cached.rows;

  const data = await callSheets(encodeURIComponent(range));
  const rows: string[][] = data.values ?? [];
  if (cacheMs) cachedRows.set(range, { rows, expiresAt: Date.now() + cacheMs });
  return rows;
};

export const appendRow = async (range: string, row: string[]) => {
  await callSheets(`${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values: [row] }),
  });
  cachedRows.clear();
};
