import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_CONFIG, S3_BUCKET_NAME, isAwsConfigured } from './config';

function getClient(): S3Client {
  return new S3Client({
    region: AWS_CONFIG.region,
    credentials: {
      accessKeyId: AWS_CONFIG.accessKeyId,
      secretAccessKey: AWS_CONFIG.secretAccessKey,
    },
  });
}

/**
 * Generate a pre-signed URL for a private S3 object.
 * TTL defaults to 15 minutes — tune to your retention requirements.
 *
 * S3 key convention used by M.O.S.A.D.:
 *   frames/<cameraId>/<eventId>.jpg
 */
export async function getPresignedUrl(
  key: string,
  expiresInSeconds = 900
): Promise<string | null> {
  if (!isAwsConfigured() || !key) return null;
  try {
    const client = getClient();
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });
    return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  } catch {
    return null;
  }
}

/** Build a batch of pre-signed URLs for multiple keys in parallel */
export async function getPresignedUrls(
  keys: string[],
  expiresInSeconds = 900
): Promise<Record<string, string>> {
  if (!isAwsConfigured()) return {};
  const entries = await Promise.all(
    keys.map(async key => {
      const url = await getPresignedUrl(key, expiresInSeconds);
      return [key, url ?? ''] as [string, string];
    })
  );
  return Object.fromEntries(entries.filter(([, url]) => url));
}

/** Build a key from camera + event IDs following the M.O.S.A.D. convention */
export function buildFrameKey(cameraId: string, eventId: string): string {
  return `frames/${cameraId}/${eventId}.jpg`;
}
