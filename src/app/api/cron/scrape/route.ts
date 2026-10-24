import { NextRequest, NextResponse } from 'next/server';
import { refreshAllNewsFeeds, getAggregatedArticles } from '@/lib/news-service';
import { submitArticlesToIndexNow, pingSearchEngineSitemaps } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

/** Constant-time string comparison to avoid leaking the secret via response timing. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function GET(request: NextRequest) {
  // The scrape endpoint always requires the shared secret. The Worker's scheduled()
  // handler (worker-entry.js) sends it as a Bearer token. Client-supplied headers such
  // as `x-cron-trigger` are NOT trusted, since any external caller can set them.
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // Fail closed: if the secret isn't configured, nobody may trigger a scrape.
    return NextResponse.json({ error: 'Cron endpoint is not configured' }, { status: 503 });
  }

  if (!timingSafeEqual(authHeader || '', `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startedAt = Date.now();
    const counts = await refreshAllNewsFeeds();

    // Push newly ingested lead stories to IndexNow (Bing, Copilot, Yandex, Yahoo)
    let indexNowSummary = null;
    try {
      const topArticles = (await getAggregatedArticles('en')).slice(0, 5);
      if (topArticles.length > 0) {
        indexNowSummary = await submitArticlesToIndexNow(topArticles);
      }
      await pingSearchEngineSitemaps().catch(() => {});
    } catch (indexNowErr) {
      console.warn('IndexNow cron push notice:', indexNowErr);
    }

    const durationMs = Date.now() - startedAt;

    return NextResponse.json({
      success: true,
      message: 'Automated newsroom background scrape completed successfully',
      timestamp: new Date().toISOString(),
      durationMs,
      articlesIngested: counts,
      indexNow: indexNowSummary ? {
        status: indexNowSummary.status,
        submittedCount: indexNowSummary.submittedCount,
        endpoint: indexNowSummary.endpoint,
      } : null,
    });
  } catch (err) {
    console.error('Scheduled scrape failed:', err);
    return NextResponse.json({
      success: false,
      error: (err as Error).message
    }, { status: 500 });
  }
}
