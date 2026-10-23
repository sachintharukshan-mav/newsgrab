import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAggregatedArticles } from '@/lib/news-service';
import { mockArticles } from '@/lib/mock-data';
import { Language } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-config';
import {
  getSectionHub,
  filterArticlesForSection,
} from '@/lib/topics';
import {
  OrganizationJsonLd,
  CollectionPageJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/JsonLd';
import { HubViewContainer } from '@/components/news/HubViewContainer';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;
  const SITE_URL = getSiteUrl();

  const section = getSectionHub(slug);
  if (!section) {
    return {
      title: 'Section Not Found | LANKA DISPATCH',
    };
  }

  const baseUrl = `${SITE_URL}/category/${section.slug}`;
  const canonicalUrl = currentLang !== 'en' ? `${baseUrl}?lang=${currentLang}` : baseUrl;
  const title = section.seoTitle[currentLang] || section.seoTitle.en;
  const description = section.description[currentLang] || section.description.en;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(section.title.en)}&category=${encodeURIComponent(section.slug)}&pub=Lanka+Dispatch`;

  return {
    title,
    description,
    keywords: section.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-LK': baseUrl,
        'si-LK': `${baseUrl}?lang=si`,
        'ta-LK': `${baseUrl}?lang=ta`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'LANKA DISPATCH',
      locale: currentLang === 'si' ? 'si_LK' : currentLang === 'ta' ? 'ta_LK' : 'en_LK',
      alternateLocale: ['en_LK', 'si_LK', 'ta_LK'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      site: '@lankadispatch',
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;

  const section = getSectionHub(slug);
  if (!section) {
    notFound();
  }

  const liveArticles = await getAggregatedArticles(currentLang).catch(() => []);
  const pool = liveArticles.length > 0 ? liveArticles : mockArticles;
  const filtered = filterArticlesForSection(pool, section.slug);
  const initialArticles = filtered.length > 0 ? filtered : pool.slice(0, 12);

  return (
    <>
      <OrganizationJsonLd currentLang={currentLang} />
      <CollectionPageJsonLd
        name={section.seoTitle[currentLang] || section.seoTitle.en}
        description={section.description[currentLang] || section.description.en}
        path={`/category/${section.slug}`}
        articles={initialArticles}
        currentLang={currentLang}
      />
      <BreadcrumbJsonLd
        category={section.slug}
        currentLang={currentLang}
      />
      <HubViewContainer
        hubType="category"
        sectionHub={section}
        initialArticles={initialArticles}
        initialLang={currentLang}
      />
    </>
  );
}
