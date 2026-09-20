import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsgrab.lk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/article', '/api/cron/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/article', '/api/cron/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/api/article', '/api/cron/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/article', '/api/cron/'],
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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
