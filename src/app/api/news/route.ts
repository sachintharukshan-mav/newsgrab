import { NextRequest, NextResponse } from 'next/server';
import { getAggregatedArticles, CACHE_TTL_MS, getMemoryCacheStatus } from '@/lib/news-service';
import { Category, Language, DateRange } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'all') as Category;
  const rawLang = searchParams.get('lang') || 'en';
  const lang: Language = (['en', 'si', 'ta'].includes(rawLang) ? rawLang : 'en') as Language;
  const search = searchParams.get('q')?.toLowerCase() || '';
  const publisher = searchParams.get('publisher')?.toLowerCase() || '';
  const timeRange = (searchParams.get('timeRange') || 'all') as DateRange;

  // Pagination support: default to 80 articles (approx 150-180KB payload vs 3.8MB for all 1,500)
  // Drastically cuts JSON serialization CPU time below Cloudflare Worker Free plan 10ms limit.
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawLimit = searchParams.get('limit');
  let limit = 80;
  if (rawLimit === 'all') {
    limit = 200; // Hard clamp to protect worker CPU
  } else if (rawLimit) {
    const parsed = parseInt(rawLimit, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      limit = Math.min(Math.max(1, parsed), 200);
    }
  }

  // Never allow unauthenticated external callers to trigger full RSS scraping on user requests.
  // Feed scraping is strictly managed by cron via /api/cron/scrape.
  const allArticles = await getAggregatedArticles(lang, false);
  let articles = [...allArticles];

  // Filter by Category or Region
  if (category === 'breaking') {
    articles = articles.filter((a) => a.isBreaking || a.category === 'breaking');
  } else if (category === 'local') {
    articles = articles.filter((a) => (a.region || 'local') === 'local');
  } else if (category === 'world') {
    articles = articles.filter((a) => a.region === 'world');
  } else if (category !== 'all') {
    articles = articles.filter((a) => a.category === category);
  }

  // Filter by Publisher
  if (publisher && publisher !== 'all') {
    articles = articles.filter((a) => a.publisherName.toLowerCase().includes(publisher));
  }

  // Filter by Historical Date-Range Scope
  if (timeRange && timeRange !== 'all') {
    const nowMs = Date.now();
    let cutoffMs = nowMs - 7 * 24 * 60 * 60 * 1000;
    if (timeRange === '24h') cutoffMs = nowMs - 24 * 60 * 60 * 1000;
    else if (timeRange === '7d') cutoffMs = nowMs - 7 * 24 * 60 * 60 * 1000;
    else if (timeRange === '30d') cutoffMs = nowMs - 30 * 24 * 60 * 60 * 1000;
    else if (timeRange === '1y') cutoffMs = nowMs - 365 * 24 * 60 * 60 * 1000;

    articles = articles.filter((a) => {
      const pubTime = new Date(a.publishedAt).getTime();
      return isNaN(pubTime) || pubTime >= cutoffMs;
    });
  }

  // Filter by Search (supports multilingual unicode matching)
  if (search) {
    articles = articles.filter((a) => {
      const titleMatch = (a.title[lang] || a.title.en || '').toLowerCase().includes(search);
      const summaryMatch = (a.summary[lang] || a.summary.en || '').toLowerCase().includes(search);
      const pubMatch = a.publisherName.toLowerCase().includes(search);
      return titleMatch || summaryMatch || pubMatch;
    });
  }

  const total = articles.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pagedArticles = articles.slice(startIndex, endIndex);
  const hasMore = endIndex < total;
  const totalPages = Math.ceil(total / limit);

  const cache = getMemoryCacheStatus(lang);
  const lastUpdated = new Date(cache?.timestamp || Date.now()).toISOString();
  const nextUpdateInSeconds = Math.max(0, Math.round((CACHE_TTL_MS - (Date.now() - (cache?.timestamp || 0))) / 1000));

  return NextResponse.json(
    {
      success: true,
      language: lang,
      total,
      page,
      limit,
      totalPages,
      hasMore,
      lastUpdated,
      nextUpdateInSeconds,
      articles: pagedArticles
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    }
  );
}
