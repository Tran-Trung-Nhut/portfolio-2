import 'server-only';
import { hasSheetsConfig, readRows } from '@/lib/googleSheets';
import { InvitedGuest } from '@/shared/types';
import { cleanText } from '@/shared/utils';

const GUESTS_RANGE = "'Khách mời'!A2:B";
const CACHE_MS = 60_000;
const TOKEN_PATTERN = /^[A-Za-z0-9]{6,32}$/;

export const findInvitedGuest = async (token: unknown): Promise<InvitedGuest | null> => {
  if (!hasSheetsConfig || typeof token !== 'string' || !TOKEN_PATTERN.test(token)) return null;

  try {
    const rows = await readRows(GUESTS_RANGE, CACHE_MS);
    const name = cleanText(rows.find(([code]) => code === token)?.[1]);
    return name ? { token, name } : null;
  } catch (error) {
    console.error('Invitation lookup error:', error);
    return null;
  }
};
