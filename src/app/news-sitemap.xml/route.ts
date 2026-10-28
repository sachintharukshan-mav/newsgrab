import { NextResponse } from 'next/server';
import { getAggregatedArticles } from '@/lib/news-service';
import { mockArticles } from '@/lib/mock-data';
import { getSiteUrl } from '@/lib/site-config';
import { Article } from '@/lib/types';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Dedicated Google News XML Sitemap endpoint adhering strictly to
 * http://www.google.com/schemas/sitemap-news/0.9 specification.
 * Google News requires that only articles published in the last 48 hours are included.
 */
export async function GET() {
  const SITE_URL = getSiteUrl();
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago

  const [enArticles, siArticles, taArticles] = await Promise.all([
    getAggregatedArticles('en').catch(() => []),
    getAggregatedArticles('si').catch(() => []),
    getAggregatedArticles('ta').catch(() => []),
  ]);

  const combinedArticles: Array<{ article: Article; lang: 'en' | 'si' | 'ta' }> = [
    ...enArticles.map((a) => ({ article: a, lang: 'en' as const })),
    ...siArticles.map((a) => ({ article: a, lang: 'si' as const })),
    ...taArticles.map((a) => ({ article: a, lang: 'ta' as const })),
  ];

  const pool = combinedArticles.length > 0
    ? combinedArticles
    : mockArticles.map((a) => ({ article: a, lang: 'en' as const }));

  // Filter to items within the 48h Google News freshness requirement and filter out thin articles
  const recentItems = pool.filter(({ article, lang }) => {
    if (article.publishedAt) {
      const pubDate = new Date(article.publishedAt);
      if (!isNaN(pubDate.getTime()) && pubDate < cutoffTime) return false;
    }

    // Exclude thin articles (summary too short or identical to title, and no rich brief)
    const title = article.title[lang] || article.title.en || '';
    const summary = article.summary[lang] || article.summary.en || '';
    const hasBrief = Boolean(article.brief?.[lang]);
    if (!hasBrief && (summary.length < 80 || summary.trim().toLowerCase() === title.trim().toLowerCase())) {
      return false;
    }

    return true;
  });

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const uniqueItems = recentItems.filter(({ article, lang }) => {
    const urlKey = `${article.id}-${lang}`;
    if (seenUrls.has(urlKey)) return false;
    seenUrls.add(urlKey);
    return true;
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const { article, lang } of uniqueItems.slice(0, 1000)) {
    const pubDate = article.publishedAt ? new Date(article.publishedAt) : now;
    const isoDate = isNaN(pubDate.getTime()) ? now.toISOString() : pubDate.toISOString();
    const title = article.title[lang] || article.title.en || article.title.si || article.title.ta || '';
    const fullUrl = `${SITE_URL}/article/${encodeURIComponent(article.id)}${lang !== 'en' ? `?lang=${lang}` : ''}`;

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>Lanka Dispatch</news:name>\n`;
    xml += `        <news:language>${lang}</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${isoDate}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(title)}</news:title>\n`;
    xml += `    </news:news>\n`;

    if (article.imageUrl) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(article.imageUrl)}</image:loc>\n`;
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
