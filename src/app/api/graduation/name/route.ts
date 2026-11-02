import { NextRequest, NextResponse } from 'next/server';
import { reviewGuestName } from '@/lib/guestReview';
import { GuestResponseBody } from '@/shared/interfaces';
import { cleanText } from '@/shared/utils';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GuestResponseBody;
    return NextResponse.json(await reviewGuestName(cleanText(body?.name)));
  } catch {
    return NextResponse.json({ valid: false, reply: '' }, { status: 400 });
  }
}
