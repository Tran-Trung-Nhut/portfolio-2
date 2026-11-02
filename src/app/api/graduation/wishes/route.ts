import { NextRequest, NextResponse } from 'next/server';
import { appendRow, hasSheetsConfig, readRows } from '@/lib/googleSheets';
import { isNameShaped, reviewWish } from '@/lib/guestReview';
import { findInvitedGuest } from '@/lib/invitations';
import { WISH_MAX_LENGTH } from '@/shared/graduationConfig';
import { GuestResponseBody } from '@/shared/interfaces';
import { GraduationWish } from '@/shared/types';
import { cleanText } from '@/shared/utils';

const WISHES_RANGE = "'Lời chúc'!A2:E";
const APPEND_RANGE = "'Lời chúc'!A:F";
const CACHE_MS = 30_000;

const toWish = ([, name = '', , wish = '', hidden = '']: string[]): GraduationWish | null =>
  wish.trim() && !hidden.trim() ? { name, wish } : null;

const resolveGuest = async ({ invite, name }: GuestResponseBody) => {
  if (invite) return findInvitedGuest(invite);
  const typedName = cleanText(name);
  return isNameShaped(typedName) ? { token: '', name: typedName } : null;
};

export async function GET() {
  if (!hasSheetsConfig) return NextResponse.json({ wishes: [] });

  try {
    const rows = await readRows(WISHES_RANGE, CACHE_MS);
    const wishes = rows.map(toWish).filter((wish): wish is GraduationWish => wish !== null).reverse();
    return NextResponse.json({ wishes });
  } catch (error) {
    console.error('Graduation wishes read error:', error);
    return NextResponse.json({ wishes: [] }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = ((await req.json()) ?? {}) as GuestResponseBody;
    const wish = cleanText(body.wish);

    if (typeof body.attending !== 'boolean' || Array.from(wish).length > WISH_MAX_LENGTH) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }
    if (!hasSheetsConfig) {
      return NextResponse.json({ error: 'MISSING_KEYS' }, { status: 500 });
    }

    const guest = await resolveGuest(body);
    if (!guest) {
      return NextResponse.json({ error: 'INVALID_GUEST' }, { status: 400 });
    }
    if (wish) {
      const review = await reviewWish(wish);
      if (!review.valid) {
        return NextResponse.json({ error: 'INAPPROPRIATE_WISH', reply: review.reply }, { status: 422 });
      }
    }

    const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    await appendRow(APPEND_RANGE, [time, guest.name, body.attending ? 'Tham gia' : 'Bận', wish, '', guest.token]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Graduation response error:', error);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
