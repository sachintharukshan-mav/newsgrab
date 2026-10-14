import { mockArticles } from '@/lib/mock-data';
import { getAggregatedArticles } from '@/lib/news-service';
import { Category } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const SITE_URL = getSiteUrl();
  const now = new Date().toISOString();

  const liveArticles = await getAggregatedArticles('en').catch(() => []);
  const articlesPool = liveArticles.length > 0 ? liveArticles : mockArticles;

  const categories: Category[] = [
    'local',
    'world',
    'breaking',
    'economy',
    'politics',
    'sports',
    'tech',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // 1. Homepage & Trilingual Alternates
  xml += `  <url>\n`;
  xml += `    <loc>${escapeXml(`${SITE_URL}/`)}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(`${SITE_URL}/?lang=en`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(`${SITE_URL}/?lang=si`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(`${SITE_URL}/?lang=ta`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${SITE_URL}/`)}" />\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>always</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // 2. Category Hubs (Clean query URLs with valid XML escaping)
  for (const cat of categories) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(`${SITE_URL}/?category=${cat}`)}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>hourly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // 3. Editorial & Wire Dispatches (Up to 150 items with fully escaped image tags and alternates)
  for (const a of articlesPool.slice(0, 150)) {
    const pubDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
    const isoDate = isNaN(pubDate.getTime()) ? now : pubDate.toISOString();
    const articlePath = `/article/${encodeURIComponent(a.id)}`;
    const fullUrl = `${SITE_URL}${articlePath}`;

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(`${fullUrl}?lang=en`)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(`${fullUrl}?lang=si`)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(`${fullUrl}?lang=ta`)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(fullUrl)}" />\n`;
    if (a.imageUrl) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(a.imageUrl)}</image:loc>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `    <lastmod>${isoDate}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // 4. Institutional & Compliance Pages
  const institutional = [
    { path: '/about', priority: '0.7' },
    { path: '/privacy', priority: '0.6' },
    { path: '/terms', priority: '0.6' },
  ];
  for (const item of institutional) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(`${SITE_URL}${item.path}`)}</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
