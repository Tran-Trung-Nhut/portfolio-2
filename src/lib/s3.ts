import 'server-only';
import { S3Client, GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const S3_BUCKET = process.env.S3_BUCKET?.trim() || '';
const S3_PREFIX = process.env.S3_PREFIX?.trim().replace(/^\/+|\/+$/g, '') || '';

export const s3Key = (fileName: string) => (S3_PREFIX ? `${S3_PREFIX}/${fileName}` : fileName);

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
  },
});

export const presignGetObject = (
  input: Omit<GetObjectCommandInput, 'Bucket'>,
  expiresIn: number,
  signingDate?: Date
) => getSignedUrl(s3, new GetObjectCommand({ Bucket: S3_BUCKET, ...input }), { expiresIn, signingDate });
