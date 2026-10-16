import { NextResponse } from 'next/server';
import { getAggregatedArticles } from '@/lib/news-service';
import { mockArticles } from '@/lib/mock-data';
import { getSiteUrl } from '@/lib/site-config';
import { Article, Language, Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang');
  const catParam = searchParams.get('category');

  const lang: Language = (langParam === 'si' || langParam === 'ta' ? langParam : 'en') as Language;
  const SITE_URL = getSiteUrl();

  const articles = await getAggregatedArticles(lang).catch(() => []);
  let pool: Article[] = articles.length > 0 ? articles : mockArticles;

  if (catParam && catParam !== 'all') {
    pool = pool.filter((a) => a.category === catParam);
  }

  const channelTitle = lang === 'si'
    ? 'ලංකා ඩිස්පැච් - නවතම පුවත් සංග්‍රහය'
    : (lang === 'ta'
      ? 'லங்கா டிஸ்பாட்ச் - நேரலை செய்திகள்'
      : 'Lanka Dispatch — Sri Lanka Digital Wire & Intelligence Feed');

  const channelDesc = lang === 'si'
    ? 'ශ්‍රී ලංකාවේ ස්වාධීන බුද්ධි සහ පුවත් සම්පිණ්ඩනය'
    : (lang === 'ta'
      ? 'இலங்கையின் சுதந்திரமான செய்தித் தொகுப்பு'
      : "Sri Lanka's Independent Intelligence & Multi-Source News Discovery Desk");

  const selfUrl = `${SITE_URL}/api/rss?lang=${lang}${catParam ? `&category=${catParam}` : ''}`;
  const now = new Date().toUTCString();

  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">\n`;
  rss += `  <channel>\n`;
  rss += `    <title>${escapeXml(channelTitle)}</title>\n`;
  rss += `    <link>${escapeXml(SITE_URL)}</link>\n`;
  rss += `    <description>${escapeXml(channelDesc)}</description>\n`;
  rss += `    <language>${lang === 'si' ? 'si-LK' : lang === 'ta' ? 'ta-LK' : 'en-LK'}</language>\n`;
  rss += `    <lastBuildDate>${now}</lastBuildDate>\n`;
  rss += `    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />\n`;
  rss += `    <image>\n`;
  rss += `      <url>${escapeXml(`${SITE_URL}/logo.png`)}</url>\n`;
  rss += `      <title>${escapeXml(channelTitle)}</title>\n`;
  rss += `      <link>${escapeXml(SITE_URL)}</link>\n`;
  rss += `    </image>\n`;

  for (const article of pool.slice(0, 50)) {
    const title = article.title[lang] || article.title.en || article.title.si || article.title.ta || '';
    const summary = article.summary[lang] || article.summary.en || article.summary.si || article.summary.ta || '';
    const pubDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
    const formattedPubDate = isNaN(pubDate.getTime()) ? now : pubDate.toUTCString();
    const articleLink = `${SITE_URL}/article/${encodeURIComponent(article.id)}?lang=${lang}`;

    rss += `    <item>\n`;
    rss += `      <title>${escapeXml(title)}</title>\n`;
    rss += `      <link>${escapeXml(articleLink)}</link>\n`;
    rss += `      <guid isPermaLink="true">${escapeXml(`${SITE_URL}/article/${encodeURIComponent(article.id)}`)}</guid>\n`;
    rss += `      <pubDate>${formattedPubDate}</pubDate>\n`;
    rss += `      <description><![CDATA[${summary}]]></description>\n`;
    rss += `      <category>${escapeXml(article.category || 'news')}</category>\n`;
    rss += `      <dc:creator>${escapeXml(article.publisherName || 'Lanka Dispatch')}</dc:creator>\n`;

    if (article.imageUrl) {
      rss += `      <media:content url="${escapeXml(article.imageUrl)}" medium="image" />\n`;
      rss += `      <enclosure url="${escapeXml(article.imageUrl)}" length="0" type="image/jpeg" />\n`;
    }

    rss += `    </item>\n`;
  }

  rss += `  </channel>\n`;
  rss += `</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
