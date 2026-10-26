import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
    host: SITE_URL,
  };
}
