/**
 * AWS Configuration for M.O.S.A.D. Admin Dashboard
 *
 * HOW TO GET YOUR CREDENTIALS:
 * ─────────────────────────────
 * 1. Log in to AWS Console → IAM → Users → Create User (or use existing)
 * 2. Attach policies:  AmazonDynamoDBReadOnlyAccess  +  AmazonS3ReadOnlyAccess
 * 3. Under "Security credentials" → Create access key → choose "Application running outside AWS"
 * 4. Copy the Access Key ID and Secret Access Key into .env.local (never commit this file)
 *
 * DynamoDB Table Setup:
 * ─────────────────────
 * - Table name: set DYNAMODB_TABLE_NAME below (e.g. "mosad-events")
 * - Partition key: "eventId"  (String)
 * - Sort key: "timestamp"     (String / ISO-8601)
 * - Recommended GSI: "cameraId-timestamp-index" on (cameraId, timestamp)
 *
 * S3 Bucket Setup:
 * ────────────────
 * - Bucket name: set S3_BUCKET_NAME below (e.g. "mosad-frames")
 * - Each VLM frame image is stored as: frames/<cameraId>/<eventId>.jpg
 * - The dashboard generates pre-signed URLs (15-min TTL) so the bucket stays private
 */

export const AWS_CONFIG = {
  region: process.env.AWS_REGION || '',                          // e.g. 'us-east-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
} as const;

export const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || '';  // e.g. 'mosad-events'
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';            // e.g. 'mosad-frames'

/** Returns true only when all required env vars are set at runtime */
export function isAwsConfigured(): boolean {
  return !!(
    AWS_CONFIG.region &&
    AWS_CONFIG.accessKeyId &&
    AWS_CONFIG.secretAccessKey &&
    DYNAMODB_TABLE_NAME &&
    S3_BUCKET_NAME
  );
}
