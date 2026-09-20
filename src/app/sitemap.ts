import type { MetadataRoute } from 'next';
import { mockArticles } from '@/lib/mock-data';
import { Category } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsgrab.lk';

export const revalidate = 3600; // Refresh sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Root and Trilingual Homepages
  const rootEntry: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    lastModified: now,
    changeFrequency: 'always',
    priority: 1.0,
    alternates: {
      languages: {
        'en-LK': `${SITE_URL}/?lang=en`,
        'si-LK': `${SITE_URL}/?lang=si`,
        'ta-LK': `${SITE_URL}/?lang=ta`,
        'x-default': `${SITE_URL}/`,
      },
    },
  };

  // 2. Main Category Hubs
  const categories: Category[] = [
    'local',
    'world',
    'breaking',
    'economy',
    'politics',
    'sports',
    'tech',
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/?category=${cat}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: 0.9,
    alternates: {
      languages: {
        'en-LK': `${SITE_URL}/?category=${cat}&lang=en`,
        'si-LK': `${SITE_URL}/?category=${cat}&lang=si`,
        'ta-LK': `${SITE_URL}/?category=${cat}&lang=ta`,
        'x-default': `${SITE_URL}/?category=${cat}`,
      },
    },
  }));

  // 3. Current Major Editorial & Wire Dispatches
  const articleEntries: MetadataRoute.Sitemap = mockArticles.map((a) => {
    const pubDate = a.publishedAt ? new Date(a.publishedAt) : now;
    return {
      url: `${SITE_URL}/?article=${encodeURIComponent(a.id)}`,
      lastModified: isNaN(pubDate.getTime()) ? now : pubDate,
      changeFrequency: 'daily',
      priority: 0.8,
      images: a.imageUrl ? [a.imageUrl] : undefined,
      alternates: {
        languages: {
          'en-LK': `${SITE_URL}/?article=${encodeURIComponent(a.id)}&lang=en`,
          'si-LK': `${SITE_URL}/?article=${encodeURIComponent(a.id)}&lang=si`,
          'ta-LK': `${SITE_URL}/?article=${encodeURIComponent(a.id)}&lang=ta`,
          'x-default': `${SITE_URL}/?article=${encodeURIComponent(a.id)}`,
        },
      },
    };
  });

  // 4. Institutional & Compliance Pages (Google AdSense & Search Console)
  const compliancePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [rootEntry, ...categoryEntries, ...articleEntries, ...compliancePages];
}
