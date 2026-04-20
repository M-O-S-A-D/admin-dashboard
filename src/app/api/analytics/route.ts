import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/aws/dynamodb';
import { isAwsConfigured } from '@/lib/aws/config';
import { MOCK_ANALYTICS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isAwsConfigured()) {
      return NextResponse.json({ analytics: MOCK_ANALYTICS, source: 'mock' });
    }

    const summary = await getAnalyticsSummary();
    // Merge real counts with the chart/heatmap data (which requires time-series aggregation beyond basic DynamoDB queries)
    const analytics = {
      ...MOCK_ANALYTICS,
      ...summary,
    };

    return NextResponse.json({ analytics, source: 'dynamodb' });
  } catch (err) {
    console.error('Analytics API error:', err);
    return NextResponse.json({ analytics: MOCK_ANALYTICS, source: 'mock', error: String(err) });
  }
}
