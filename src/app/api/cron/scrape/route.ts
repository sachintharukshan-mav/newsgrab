import { NextRequest, NextResponse } from 'next/server';
import { refreshAllNewsFeeds } from '@/lib/news-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Optional security check for cron authorization header (or internal cron header)
  const isInternalCron = request.headers.get('x-cron-trigger') === 'true';
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && !isInternalCron && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startedAt = Date.now();
    const counts = await refreshAllNewsFeeds();
    const durationMs = Date.now() - startedAt;

    return NextResponse.json({
      success: true,
      message: 'Automated newsroom background scrape completed successfully',
      timestamp: new Date().toISOString(),
      durationMs,
      articlesIngested: counts
    });
  } catch (err) {
    console.error('Scheduled scrape failed:', err);
    return NextResponse.json({
      success: false,
      error: (err as Error).message
    }, { status: 500 });
  }
}
