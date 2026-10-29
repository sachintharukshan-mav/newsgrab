import { mockArticles } from '@/lib/mock-data';
import { getAggregatedArticles } from '@/lib/news-service';
import { SECTION_SLUGS, TOPIC_SLUGS } from '@/lib/topics';
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

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // 1. Homepage & Trilingual Alternates
  xml += `  <url>\n`;
  xml += `    <loc>${escapeXml(`${SITE_URL}/`)}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(`${SITE_URL}/`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(`${SITE_URL}/si`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(`${SITE_URL}/ta`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${SITE_URL}/`)}" />\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>always</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // 1.1 Dedicated Sinhala & Tamil Homepage loc nodes
  xml += `  <url>\n`;
  xml += `    <loc>${escapeXml(`${SITE_URL}/si`)}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(`${SITE_URL}/`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(`${SITE_URL}/si`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(`${SITE_URL}/ta`)}" />\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>always</changefreq>\n`;
  xml += `    <priority>0.98</priority>\n`;
  xml += `  </url>\n`;

  xml += `  <url>\n`;
  xml += `    <loc>${escapeXml(`${SITE_URL}/ta`)}</loc>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(`${SITE_URL}/`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(`${SITE_URL}/si`)}" />\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(`${SITE_URL}/ta`)}" />\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>always</changefreq>\n`;
  xml += `    <priority>0.98</priority>\n`;
  xml += `  </url>\n`;

  // 2. Section Desk Hubs (/category/[slug] with trilingual alternates)
  for (const cat of SECTION_SLUGS) {
    const catUrl = `${SITE_URL}/category/${cat}`;
    const siCatUrl = `${SITE_URL}/si/category/${cat}`;
    const taCatUrl = `${SITE_URL}/ta/category/${cat}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(catUrl)}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(catUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(siCatUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(taCatUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(catUrl)}" />\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>hourly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  }

  // 3. Evergreen Topic Intelligence Hubs (/topic/[slug] with trilingual alternates)
  for (const topicSlug of TOPIC_SLUGS) {
    const topicUrl = `${SITE_URL}/topic/${topicSlug}`;
    const siTopicUrl = `${SITE_URL}/si/topic/${topicSlug}`;
    const taTopicUrl = `${SITE_URL}/ta/topic/${topicSlug}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(topicUrl)}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(topicUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(siTopicUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(taTopicUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(topicUrl)}" />\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>hourly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  }

  // 3.1 Daily Evergreen Utility Hubs (High Organic Search Volume)
  const utilityPages = [
    { path: '/markets/usd-to-lkr-rate-today', priority: '0.95', changefreq: 'hourly' },
    { path: '/markets/gold-price-sri-lanka-today', priority: '0.95', changefreq: 'hourly' },
    { path: '/utility/fuel-and-power-sri-lanka', priority: '0.95', changefreq: 'daily' },
    { path: '/powercut', priority: '0.90', changefreq: 'hourly' },
  ];
  for (const util of utilityPages) {
    const utilUrl = `${SITE_URL}${util.path}`;
    const siUtilUrl = `${SITE_URL}/si${util.path}`;
    const taUtilUrl = `${SITE_URL}/ta${util.path}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(utilUrl)}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(utilUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(siUtilUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(taUtilUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(utilUrl)}" />\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += `    <changefreq>${util.changefreq}</changefreq>\n`;
    xml += `    <priority>${util.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 4. Editorial & Wire Dispatches (Up to 150 items with fully escaped image tags and alternates)
  for (const a of articlesPool.slice(0, 150)) {
    const pubDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
    const isoDate = isNaN(pubDate.getTime()) ? now : pubDate.toISOString();
    const articlePath = `/article/${encodeURIComponent(a.id)}`;
    const fullUrl = `${SITE_URL}${articlePath}`;
    const siUrl = `${SITE_URL}/si${articlePath}`;
    const taUrl = `${SITE_URL}/ta${articlePath}`;

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en-LK" href="${escapeXml(fullUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="si-LK" href="${escapeXml(siUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ta-LK" href="${escapeXml(taUrl)}" />\n`;
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

  // 5. Institutional & Compliance Pages
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
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
}
