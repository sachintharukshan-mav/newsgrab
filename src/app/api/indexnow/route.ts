import { NextRequest, NextResponse } from 'next/server';
import { 
  INDEXNOW_KEY, 
  submitUrlsToIndexNow, 
  submitArticlesToIndexNow, 
  pingSearchEngineSitemaps 
} from '@/lib/indexnow';
import { getAggregatedArticles } from '@/lib/news-service';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const SITE_URL = getSiteUrl();
  const shouldPing = searchParams.get('ping') === 'true';

  let sitemapPings = null;
  if (shouldPing) {
    sitemapPings = await pingSearchEngineSitemaps();
  }

  return NextResponse.json({
    status: 'active',
    protocol: 'IndexNow 1.0',
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    sitemapPings,
    instructions: {
      postUrlList: 'POST to this endpoint with JSON body: { "urls": ["https://..."] }',
      submitLatest: 'POST to this endpoint with JSON body: { "latest": true, "limit": 5 }',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { urls, latest, limit = 5 } = body;

    if (Array.isArray(urls) && urls.length > 0) {
      const result = await submitUrlsToIndexNow(urls);
      return NextResponse.json(result, { status: result.success ? 200 : 502 });
    }

    if (latest) {
      const enArticles = await getAggregatedArticles('en');
      const topArticles = enArticles.slice(0, Math.min(limit, 20));

      if (topArticles.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'No articles currently found in aggregated feeds.',
        }, { status: 404 });
      }

      const result = await submitArticlesToIndexNow(topArticles);
      return NextResponse.json({
        ...result,
        articlesSubmitted: topArticles.map((a) => a.id),
      }, { status: result.success ? 200 : 502 });
    }

    return NextResponse.json({
      error: 'Invalid request body. Expected { urls: string[] } or { latest: true }',
    }, { status: 400 });
  } catch (err) {
    return NextResponse.json({
      error: 'IndexNow submission failed',
      details: (err as Error).message,
    }, { status: 500 });
  }
}
