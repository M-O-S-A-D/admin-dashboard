import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { AWS_CONFIG, DYNAMODB_TABLE_NAME, isAwsConfigured } from './config';
import type { VLMEvent, ArchiveClip, AnalyticsData } from '@/types';

function getClient(): DynamoDBDocumentClient {
  const base = new DynamoDBClient({
    region: AWS_CONFIG.region,
    credentials: {
      accessKeyId: AWS_CONFIG.accessKeyId,
      secretAccessKey: AWS_CONFIG.secretAccessKey,
    },
  });
  return DynamoDBDocumentClient.from(base, {
    marshallOptions: { removeUndefinedValues: true },
  });
}

/**
 * Fetch the most recent N events (all cameras).
 * Scans the table and sorts client-side — use a GSI on `timestamp` in production
 * to avoid full table scans.
 */
export async function getRecentEvents(limit = 50): Promise<VLMEvent[]> {
  if (!isAwsConfigured()) return [];
  const client = getClient();
  const result = await client.send(
    new ScanCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Limit: limit * 2,   // over-fetch to get the N most recent after sort
    })
  );
  const items = (result.Items ?? []) as VLMEvent[];
  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Fetch events for a single camera, newest first.
 * Requires a GSI named "cameraId-timestamp-index" (partition: cameraId, sort: timestamp).
 */
export async function getEventsByCamera(
  cameraId: string,
  limit = 20
): Promise<VLMEvent[]> {
  if (!isAwsConfigured()) return [];
  const client = getClient();
  const result = await client.send(
    new QueryCommand({
      TableName: DYNAMODB_TABLE_NAME,
      IndexName: 'cameraId-timestamp-index',
      KeyConditionExpression: 'cameraId = :cid',
      ExpressionAttributeValues: { ':cid': cameraId },
      ScanIndexForward: false,   // newest first
      Limit: limit,
    })
  );
  return (result.Items ?? []) as VLMEvent[];
}

/**
 * Full-text search on VLM descriptions using DynamoDB FilterExpression.
 * For production, consider OpenSearch / ElasticSearch for better text search.
 */
export async function searchEvents(query: string, limit = 30): Promise<VLMEvent[]> {
  if (!isAwsConfigured()) return [];
  const client = getClient();
  const result = await client.send(
    new ScanCommand({
      TableName: DYNAMODB_TABLE_NAME,
      FilterExpression: 'contains(description, :q) OR contains(title, :q)',
      ExpressionAttributeValues: { ':q': query },
      Limit: 200,
    })
  );
  const items = (result.Items ?? []) as VLMEvent[];
  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/** Fetch a single event by its primary key */
export async function getEvent(eventId: string, timestamp: string): Promise<VLMEvent | null> {
  if (!isAwsConfigured()) return null;
  const client = getClient();
  const result = await client.send(
    new GetCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Key: { eventId, timestamp },
    })
  );
  return (result.Item as VLMEvent) ?? null;
}

/**
 * Fetch archive clips (VLM events that have associated frame images).
 * Filters for records that include an imageKey field.
 */
export async function getArchiveClips(
  dateFrom?: string,
  dateTo?: string,
  tags?: string[]
): Promise<ArchiveClip[]> {
  if (!isAwsConfigured()) return [];
  const client = getClient();

  let filterParts: string[] = ['attribute_exists(imageKey)'];
  const exprValues: Record<string, unknown> = {};

  if (dateFrom) {
    filterParts.push('#ts >= :from');
    exprValues[':from'] = dateFrom;
  }
  if (dateTo) {
    filterParts.push('#ts <= :to');
    exprValues[':to'] = dateTo;
  }

  const result = await client.send(
    new ScanCommand({
      TableName: DYNAMODB_TABLE_NAME,
      FilterExpression: filterParts.join(' AND '),
      ExpressionAttributeNames: filterParts.some(f => f.includes('#ts'))
        ? { '#ts': 'timestamp' }
        : undefined,
      ExpressionAttributeValues: Object.keys(exprValues).length ? exprValues : undefined,
    })
  );

  const items = (result.Items ?? []) as ArchiveClip[];
  return items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/** Aggregate analytics from the last 7 days of events */
export async function getAnalyticsSummary(): Promise<Partial<AnalyticsData>> {
  if (!isAwsConfigured()) return {};
  const events = await getRecentEvents(500);
  const threats = events.filter(e =>
    ['CRITICAL', 'ANOMALY'].includes(e.type)
  ).length;
  const confidences = events
    .filter(e => e.confidence != null)
    .map(e => e.confidence as number);
  const avgConfidence =
    confidences.length
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

  return {
    totalDetections: events.length,
    securityThreats: threats,
    objectConfidence: Math.round(avgConfidence * 10) / 10,
    recentFlagged: events.filter(e => e.type === 'CRITICAL').slice(0, 5),
  };
}
