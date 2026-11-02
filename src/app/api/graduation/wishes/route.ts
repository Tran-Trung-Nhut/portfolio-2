import { NextRequest, NextResponse } from 'next/server';
import { appendRow, hasSheetsConfig, readRows } from '@/lib/googleSheets';
import { isNameShaped, normalizeName } from '@/lib/guestName';
import { WISH_MAX_LENGTH } from '@/shared/graduationConfig';
import { GuestResponseBody } from '@/shared/interfaces';
import { GraduationWish } from '@/shared/types';

const CACHE_MS = 30_000;

let cache = { wishes: [] as GraduationWish[], expiresAt: 0 };

const toWish = ([, name = '', , wish = '', hidden = '']: string[]): GraduationWish | null =>
  wish.trim() && !hidden.trim() ? { name, wish } : null;

export async function GET() {
  if (!hasSheetsConfig) return NextResponse.json({ wishes: [] });

  try {
    if (cache.expiresAt < Date.now()) {
      const rows = await readRows('A2:E');
      const wishes = rows.map(toWish).filter((wish): wish is GraduationWish => wish !== null).reverse();
      cache = { wishes, expiresAt: Date.now() + CACHE_MS };
    }
    return NextResponse.json({ wishes: cache.wishes });
  } catch (error) {
    console.error('Graduation wishes read error:', error);
    return NextResponse.json({ wishes: cache.wishes }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GuestResponseBody;
    const name = normalizeName(body?.name);
    const wish = typeof body?.wish === 'string' ? body.wish.replace(/\s+/g, ' ').trim() : '';

    if (typeof body?.attending !== 'boolean' || Array.from(wish).length > WISH_MAX_LENGTH) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }
    if (!isNameShaped(name)) {
      return NextResponse.json({ error: 'INVALID_NAME' }, { status: 400 });
    }
    if (!hasSheetsConfig) {
      return NextResponse.json({ error: 'MISSING_KEYS' }, { status: 500 });
    }

    const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    await appendRow('A:E', [time, name, body.attending ? 'Tham gia' : 'Bận', wish]);
    cache.expiresAt = 0;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Graduation response error:', error);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
