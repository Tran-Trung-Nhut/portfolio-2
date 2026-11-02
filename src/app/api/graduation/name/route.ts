import { NextRequest, NextResponse } from 'next/server';
import { normalizeName, reviewGuestName } from '@/lib/guestReview';
import { GuestResponseBody } from '@/shared/interfaces';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GuestResponseBody;
    return NextResponse.json(await reviewGuestName(normalizeName(body?.name)));
  } catch {
    return NextResponse.json({ valid: false, reply: '' }, { status: 400 });
  }
}
