import { NextRequest, NextResponse } from 'next/server';
import { getRecentEvents, searchEvents } from '@/lib/aws/dynamodb';
import { getPresignedUrls } from '@/lib/aws/s3';
import { isAwsConfigured } from '@/lib/aws/config';
import { MOCK_EVENTS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10);

  try {
    if (!isAwsConfigured()) {
      return NextResponse.json({ events: MOCK_EVENTS, source: 'mock' });
    }

    const events = query
      ? await searchEvents(query, limit)
      : await getRecentEvents(limit);

    // Batch-fetch pre-signed URLs for any events that have S3 image keys
    const keys = events.map(e => e.imageKey).filter(Boolean) as string[];
    const urls = keys.length ? await getPresignedUrls(keys) : {};
    const enriched = events.map(e => ({
      ...e,
      imageUrl: e.imageKey ? (urls[e.imageKey] ?? null) : null,
    }));

    return NextResponse.json({ events: enriched, source: 'dynamodb' });
  } catch (err) {
    console.error('Events API error:', err);
    return NextResponse.json({ events: MOCK_EVENTS, source: 'mock', error: String(err) });
  }
}
