import { NextResponse } from 'next/server';
import { S3_BUCKET, presignGetObject, s3Key } from '@/lib/s3';

const CV_FILENAME = 'CV-Software_Engineer-Tran_Trung_Nhut.pdf';
const URL_TTL_SECONDS = 60 * 60;

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!S3_BUCKET) {
    console.error('CV presign error: S3_BUCKET is not set');
    return NextResponse.json({ message: 'CV is unavailable right now.' }, { status: 500 });
  }

  try {
    const url = await presignGetObject(
      {
        Key: s3Key(CV_FILENAME),
        ResponseContentDisposition: `inline; filename="${CV_FILENAME}"`,
        ResponseContentType: 'application/pdf',
      },
      URL_TTL_SECONDS
    );

    return NextResponse.redirect(url, {
      status: 302,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('CV presign error:', error);
    return NextResponse.json({ message: 'CV is unavailable right now.' }, { status: 500 });
  }
}
