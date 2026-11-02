import { NextRequest, NextResponse } from 'next/server';
import { isGuestName, normalizeName } from '@/lib/guestName';
import { GuestResponseBody } from '@/shared/interfaces';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GuestResponseBody;
    return NextResponse.json({ valid: await isGuestName(normalizeName(body?.name)) });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
