import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/', '/api/metrics', '/api/comments', '/api/reactions'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/', '/api/metrics', '/api/comments', '/api/reactions'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/', '/api/metrics', '/api/comments', '/api/reactions'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/article', '/api/synthesize', '/api/cron/', '/api/metrics', '/api/comments', '/api/reactions'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        userAgent: ['ClaudeBot', 'anthropic-ai', 'KeenableBot', 'GPTBot', 'Reflectionbot', 'Bytespider', 'CCBot'],
        disallow: '/',
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
    host: SITE_URL,
  };
}
