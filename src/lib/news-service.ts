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
  generateArticleId,
  getCategoryFallbackImage
} from '@/lib/rss-parser';
import { Article, Language } from '@/lib/types';
import { getCloudflareEnv } from '@/lib/cloudflare';

export const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes in memory

const langCaches: Record<Language, { articles: Article[]; timestamp: number }> = {
  en: { articles: [], timestamp: 0 },
  si: { articles: [], timestamp: 0 },
  ta: { articles: [], timestamp: 0 }
};

export function getMemoryCacheStatus(lang: Language) {
  return langCaches[lang];
}

export async function getAggregatedArticles(
  lang: Language = 'en',
  forceRefresh = false
): Promise<Article[]> {
  const now = Date.now();
  const cache = langCaches[lang];

  // 1. Return fresh in-memory cache if valid
  if (!forceRefresh && cache.articles.length > 0 && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.articles;
  }

  const env = await getCloudflareEnv();

  // 2. Check Cloudflare KV Cache
  if (!forceRefresh && env?.NEWS_CACHE) {
    try {
      const kvArticles = await env.NEWS_CACHE.get(`articles:${lang}`, 'json');
      if (Array.isArray(kvArticles) && kvArticles.length > 0) {
        langCaches[lang] = {
          articles: kvArticles,
          timestamp: now
        };
        return kvArticles;
      }
    } catch (kvErr) {
      console.warn('KV news cache read fallback:', kvErr);
    }
  }

  // 3. Aggregate live feeds
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
        imageUrl: item.imageUrl || getCategoryFallbackImage(item.category || 'politics', liveItems.length, headline, summaryText, item.region),
        imageCredit: item.imageCredit || (item.imageUrl && !item.imageUrl.includes('unsplash.com') ? pub : undefined),
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
      const sinhalaArticles = await fetchSinhalaNewsArticles();
      sinhalaArticles.forEach((item) => pushArticle(item, 'Ada Derana (සිංහල)'));
    } else if (lang === 'ta') {
      const tamilArticles = await fetchTamilNewsArticles();
      tamilArticles.forEach((item) => pushArticle(item, 'Virakesari (வீரகேசரி)'));
    } else {
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

    // Sync authentic photography from accredited peer articles covering the exact same event
    const authenticPhotos = liveItems.filter(
      (a) => a.imageUrl && !a.imageUrl.includes('unsplash.com')
    );

    if (authenticPhotos.length > 0) {
      const genericWords = new Set([
        'sri', 'lanka', 'colombo', 'news', 'breaking', 'report', 'government',
        'country', 'state', 'states', 'minister', 'police', 'after', 'about',
        'under', 'would', 'could', 'their', 'which', 'issued', 'warning',
        'chairman', 'million', 'women', 'change', 'first', 'people', 'three',
        'years', 'order', 'court', 'public', 'today', 'board', 'media', 'force',
        'authority', 'central'
      ]);

      for (const item of liveItems) {
        if (item.imageUrl && item.imageUrl.includes('unsplash.com')) {
          const itemTitle = (item.title[lang] || item.title.en || '').toLowerCase();

          const peer = authenticPhotos.find((auth) => {
            if (auth.region !== item.region) return false;
            if (auth.category !== item.category) return false;

            const authTitle = (auth.title[lang] || auth.title.en || '').toLowerCase();

            const distinctiveNames = [
              'merz', 'zelenskyy', 'netanyahu', 'putin', 'scholz', 'macron',
              'starmer', 'modi', 'amarasuriya', 'dissanayake', 'wickremesinghe'
            ];
            const nameMatch = distinctiveNames.some((n) => itemTitle.includes(n) && authTitle.includes(n));
            if (nameMatch) return true;

            const itemWords = itemTitle.split(/[^a-z0-9]+/).filter((w) => w.length >= 5 && !genericWords.has(w));
            const shared = itemWords.filter((w) => authTitle.includes(w));
            return shared.length >= 3;
          });

          if (peer && peer.imageUrl) {
            item.imageUrl = peer.imageUrl;
            item.imageCredit = peer.publisherName;
          }
        }
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

    const resultArticles = deduplicatedLiveItems.length > 0 ? deduplicatedLiveItems : mockArticles;
    
    // Save to memory cache
    langCaches[lang] = {
      articles: resultArticles,
      timestamp: now
    };

    // Save to Cloudflare KV Cache (valid for 24 hours at edge)
    if (env?.NEWS_CACHE && deduplicatedLiveItems.length > 0) {
      try {
        await env.NEWS_CACHE.put(`articles:${lang}`, JSON.stringify(resultArticles), {
          expirationTtl: 86400
        });
      } catch (kvWriteErr) {
        console.warn('KV news cache write fallback:', kvWriteErr);
      }
    }

    return resultArticles;
  } catch (error) {
    console.error(`Error aggregating articles for lang ${lang}:`, error);
    return mockArticles;
  }
}

/**
 * Runs a full background scrape for English, Sinhala, and Tamil feeds,
 * updating in-memory cache and Cloudflare KV storage.
 */
export async function refreshAllNewsFeeds(): Promise<Record<Language, number>> {
  const [enArticles, siArticles, taArticles] = await Promise.all([
    getAggregatedArticles('en', true),
    getAggregatedArticles('si', true),
    getAggregatedArticles('ta', true)
  ]);

  return {
    en: enArticles.length,
    si: siArticles.length,
    ta: taArticles.length
  };
}
