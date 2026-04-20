import { NextRequest, NextResponse } from 'next/server';
import { getArchiveClips } from '@/lib/aws/dynamodb';
import { getPresignedUrls } from '@/lib/aws/s3';
import { isAwsConfigured } from '@/lib/aws/config';
import { MOCK_ARCHIVE_CLIPS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const dateFrom = req.nextUrl.searchParams.get('from') ?? undefined;
  const dateTo   = req.nextUrl.searchParams.get('to')   ?? undefined;
  const tagsParam = req.nextUrl.searchParams.get('tags');
  const tags = tagsParam ? tagsParam.split(',') : undefined;

  try {
    if (!isAwsConfigured()) {
      return NextResponse.json({ clips: MOCK_ARCHIVE_CLIPS, source: 'mock' });
    }

    const clips = await getArchiveClips(dateFrom, dateTo, tags);
    const keys = clips.map(c => c.imageKey).filter(Boolean) as string[];
    const urls = keys.length ? await getPresignedUrls(keys) : {};
    const enriched = clips.map(c => ({
      ...c,
      imageUrl: c.imageKey ? (urls[c.imageKey] ?? null) : null,
    }));

    return NextResponse.json({ clips: enriched, source: 'dynamodb' });
  } catch (err) {
    console.error('Archives API error:', err);
    return NextResponse.json({ clips: MOCK_ARCHIVE_CLIPS, source: 'mock', error: String(err) });
  }
}
