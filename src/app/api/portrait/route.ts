import { NextResponse } from 'next/server';
import { S3_BUCKET, presignGetObject, s3Key } from '@/lib/s3';

const PORTRAIT_FILENAME = 'image.JPG';
const URL_TTL_SECONDS = 3 * 24 * 60 * 60;
const WINDOW_SECONDS = 24 * 60 * 60;

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!S3_BUCKET) {
    console.error('Portrait presign error: S3_BUCKET is not set');
    return new NextResponse(null, { status: 404 });
  }

  try {
    const now = Date.now();
    const windowStart = Math.floor(now / 1000 / WINDOW_SECONDS) * WINDOW_SECONDS;
    const url = await presignGetObject(
      { Key: s3Key(PORTRAIT_FILENAME), ResponseCacheControl: `public, max-age=${URL_TTL_SECONDS}` },
      URL_TTL_SECONDS,
      new Date(windowStart * 1000)
    );
    const secondsLeftInWindow = windowStart + WINDOW_SECONDS - Math.floor(now / 1000);

    return NextResponse.redirect(url, {
      status: 302,
      headers: { 'Cache-Control': `private, max-age=${secondsLeftInWindow}` },
    });
  } catch (error) {
    console.error('Portrait presign error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
