import { NextRequest, NextResponse } from 'next/server';
import { mockArticles } from '@/lib/mock-data';
import { 
  fetchRSSFeed, 
  fetchHiruNewsArticles, 
  fetchGoogleNewsFeed, 
  fetchSinhalaNewsArticles, 
  fetchTamilNewsArticles,
  fetchReutersWorldNews,
  fetchBBCWorldNews,
  fetchGuardianWorldNews,
  generateArticleId
} from '@/lib/rss-parser';
import { Article, Category, Language, DateRange } from '@/lib/types';

export const dynamic = 'force-dynamic';

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

const langCaches: Record<Language, { articles: Article[]; timestamp: number }> = {
  en: { articles: [], timestamp: 0 },
  si: { articles: [], timestamp: 0 },
  ta: { articles: [], timestamp: 0 }
};

async function getAggregatedArticles(lang: Language = 'en'): Promise<Article[]> {
  const now = Date.now();
  const cache = langCaches[lang];

  // Return fresh cache if within 2 minutes
  if (cache.articles.length > 0 && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.articles;
  }

  try {
    const liveItems: Article[] = [];

    const pushArticle = (item: Partial<Article>, fallbackPublisher: string) => {
      const pub = item.publisherName || fallbackPublisher;
      const headline = item.title?.[lang] || item.title?.en || item.title?.si || item.title?.ta || 'dispatch';
      const fallbackId = item.id || generateArticleId(pub, headline);

      const titleObj = {
        en: item.title?.en || headline,
        ...(item.title?.si ? { si: item.title.si } : {}),
        ...(item.title?.ta ? { ta: item.title.ta } : {})
      };
      if (lang === 'si') titleObj.si = headline;
      if (lang === 'ta') titleObj.ta = headline;

      const summaryText = item.summary?.[lang] || item.summary?.en || headline;
      const summaryObj = {
        en: item.summary?.en || summaryText,
        ...(item.summary?.si ? { si: item.summary.si } : {}),
        ...(item.summary?.ta ? { ta: item.summary.ta } : {})
      };
      if (lang === 'si') summaryObj.si = summaryText;
      if (lang === 'ta') summaryObj.ta = summaryText;

      const bulletsList = item.aiBullets?.[lang] || item.aiBullets?.en || [
        headline,
        lang === 'si' ? `වාර්තාකරු: ${pub}.` : (lang === 'ta' ? `செய்தியாளர்: ${pub}.` : `Reported by ${pub} news desk.`),
        lang === 'si' ? 'අඛණ්ඩ සත්‍යාපනය සහ සජීවී ආවරණය.' : (lang === 'ta' ? 'தொடர்ச்சியான நேரடி கண்காணிப்பு.' : 'Continuous monitoring and multi-source verification.')
      ];

      const bulletsObj = {
        en: item.aiBullets?.en || bulletsList,
        ...(item.aiBullets?.si ? { si: item.aiBullets.si } : {}),
        ...(item.aiBullets?.ta ? { ta: item.aiBullets.ta } : {})
      };
      if (lang === 'si') bulletsObj.si = bulletsList;
      if (lang === 'ta') bulletsObj.ta = bulletsList;

      liveItems.push({
        id: item.id || fallbackId,
        title: titleObj,
        summary: summaryObj,
        aiBullets: bulletsObj,
        sentiment: item.sentiment || 'neutral',
        category: item.category || 'politics',
        region: item.region || 'local',
        imageUrl: item.imageUrl || '',
        publisherName: pub,
        sourceUrl: item.sourceUrl || '#',
        publishedAt: item.publishedAt || new Date().toISOString(),
        readTimeMinutes: item.readTimeMinutes || 3,
        isBreaking: item.isBreaking ?? false,
        clusterCount: item.clusterCount || 1,
        perspectives: [
          {
            publisherName: pub,
            publisherSlug: pub.toLowerCase().replace(/\s+/g, '-'),
            sourceUrl: item.sourceUrl || '#',
            headline: headline,
            publishedAt: 'Live Dispatch'
          }
        ]
      });
    };

    if (lang === 'si') {
      // Fetch Native Sinhala feeds: Ada Derana Sinhala, Hiru Sinhala, BBC Sinhala
      const sinhalaArticles = await fetchSinhalaNewsArticles();
      sinhalaArticles.forEach((item) => pushArticle(item, 'Ada Derana (සිංහල)'));
    } else if (lang === 'ta') {
      // Fetch Native Tamil feeds: Virakesari, BBC Tamil, Hiru Tamil
      const tamilArticles = await fetchTamilNewsArticles();
      tamilArticles.forEach((item) => pushArticle(item, 'Virakesari (வீரகேசரி)'));
    } else {
      // English pipeline
      const sources = [
        { url: 'https://www.adaderana.lk/rss.php', name: 'Ada Derana' },
        { url: 'https://www.newswire.lk/feed/', name: 'NewsWire' },
        { url: 'https://island.lk/feed/', name: 'The Island' },
        { url: 'https://srilankamirror.com/feed/', name: 'Sri Lanka Mirror' },
        { url: 'https://www.lankabusinessonline.com/feed/', name: 'Lanka Business Online' },
        { url: 'https://readme.lk/feed/', name: 'Readme.lk' }
      ];

      const [
        feedResults,
        hiruArticles,
        dailyMirrorArticles,
        newsFirstArticles,
        dailyFTArticles,
        economyNextArticles,
        reutersArticles,
        bbcWorldArticles,
        guardianArticles
      ] = await Promise.all([
        Promise.allSettled(sources.map((s) => fetchRSSFeed(s.url, s.name))),
        fetchHiruNewsArticles('en').catch(() => [] as Partial<Article>[]),
        fetchGoogleNewsFeed('when:7d+site:dailymirror.lk', 'Daily Mirror', 16).catch(() => [] as Partial<Article>[]),
        fetchGoogleNewsFeed('when:7d+site:newsfirst.lk', 'NewsFirst', 14).catch(() => [] as Partial<Article>[]),
        fetchGoogleNewsFeed('when:7d+site:ft.lk', 'Daily FT', 14).catch(() => [] as Partial<Article>[]),
        fetchGoogleNewsFeed('when:7d+site:economynext.com', 'EconomyNext', 14).catch(() => [] as Partial<Article>[]),
        fetchReutersWorldNews(24).catch(() => [] as Partial<Article>[]),
        fetchBBCWorldNews(20).catch(() => [] as Partial<Article>[]),
        fetchGuardianWorldNews(20).catch(() => [] as Partial<Article>[])
      ]);

      feedResults.forEach((result, idx) => {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          const publisher = sources[idx].name;
          result.value.forEach((item) => pushArticle(item, publisher));
        }
      });

      if (Array.isArray(hiruArticles)) {
        hiruArticles.forEach((item) => pushArticle(item, 'Hiru News'));
      }
      if (Array.isArray(dailyMirrorArticles)) {
        dailyMirrorArticles.forEach((item) => pushArticle(item, 'Daily Mirror'));
      }
      if (Array.isArray(newsFirstArticles)) {
        newsFirstArticles.forEach((item) => pushArticle(item, 'NewsFirst'));
      }
      if (Array.isArray(dailyFTArticles)) {
        dailyFTArticles.forEach((item) => pushArticle(item, 'Daily FT'));
      }
      if (Array.isArray(economyNextArticles)) {
        economyNextArticles.forEach((item) => pushArticle(item, 'EconomyNext'));
      }
      if (Array.isArray(reutersArticles)) {
        reutersArticles.forEach((item) => pushArticle(item, 'Reuters'));
      }
      if (Array.isArray(bbcWorldArticles)) {
        bbcWorldArticles.forEach((item) => pushArticle(item, 'BBC World News'));
      }
      if (Array.isArray(guardianArticles)) {
        guardianArticles.forEach((item) => pushArticle(item, 'The Guardian'));
      }
    }

    // Sort chronologically (newest first)
    liveItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Deduplicate by headline
    const seenTitles = new Set<string>();
    const deduplicatedLiveItems: Article[] = [];
    for (const art of liveItems) {
      const h = art.title[lang] || art.title.en || '';
      const normalized = h.toLowerCase().replace(/[^a-z0-9\u0D80-\u0DFF\u0B80-\u0BFF]/g, '').slice(0, 45);
      if (normalized && !seenTitles.has(normalized)) {
        seenTitles.add(normalized);
        deduplicatedLiveItems.push(art);
      }
    }

    // Combine with mock fallback only if no live items were fetched
    const resultArticles = deduplicatedLiveItems.length > 0 ? deduplicatedLiveItems : mockArticles;
    langCaches[lang] = {
      articles: resultArticles,
      timestamp: now
    };

    return resultArticles;
  } catch (error) {
    console.error(`Error aggregating articles for lang ${lang}:`, error);
    return mockArticles;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'all') as Category;
  const rawLang = searchParams.get('lang') || 'en';
  const lang: Language = (['en', 'si', 'ta'].includes(rawLang) ? rawLang : 'en') as Language;
  const search = searchParams.get('q')?.toLowerCase() || '';
  const publisher = searchParams.get('publisher')?.toLowerCase() || '';
  const timeRange = (searchParams.get('timeRange') || 'all') as DateRange;

  const allArticles = await getAggregatedArticles(lang);
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

  const cache = langCaches[lang];
  const lastUpdated = new Date(cache?.timestamp || Date.now()).toISOString();
  const nextUpdateInSeconds = Math.max(0, Math.round((CACHE_TTL_MS - (Date.now() - (cache?.timestamp || 0))) / 1000));

  return NextResponse.json({
    success: true,
    language: lang,
    total: articles.length,
    lastUpdated,
    nextUpdateInSeconds,
    articles
  });
}
