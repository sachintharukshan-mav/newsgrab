import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAggregatedArticles } from '@/lib/news-service';
import { mockArticles } from '@/lib/mock-data';
import { Language } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-config';
import {
  getTopicHub,
  filterArticlesForTopic,
} from '@/lib/topics';
import {
  OrganizationJsonLd,
  CollectionPageJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from '@/components/seo/JsonLd';
import { HubViewContainer } from '@/components/news/HubViewContainer';

interface TopicPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
  searchParams,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;
  const SITE_URL = getSiteUrl();

  const topic = getTopicHub(slug);
  if (!topic) {
    return {
      title: 'Topic Hub Not Found | LANKA DISPATCH',
    };
  }

  const baseUrl = `${SITE_URL}/topic/${topic.slug}`;
  const canonicalUrl = currentLang !== 'en' ? `${baseUrl}?lang=${currentLang}` : baseUrl;
  const title = topic.seoTitle[currentLang] || topic.seoTitle.en;
  const description = topic.description[currentLang] || topic.description.en;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(topic.title.en)}&category=${encodeURIComponent(topic.category)}&pub=Lanka+Dispatch`;

  return {
    title,
    description,
    keywords: topic.keywords,
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

export default async function TopicPage({
  params,
  searchParams,
}: TopicPageProps) {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;

  const topic = getTopicHub(slug);
  if (!topic) {
    notFound();
  }

  const liveArticles = await getAggregatedArticles(currentLang).catch(() => []);
  const pool = liveArticles.length > 0 ? liveArticles : mockArticles;
  const filtered = filterArticlesForTopic(pool, topic.slug);
  const initialArticles = filtered.length > 0 ? filtered : pool.slice(0, 12);

  return (
    <>
      <OrganizationJsonLd currentLang={currentLang} />
      <CollectionPageJsonLd
        name={topic.seoTitle[currentLang] || topic.seoTitle.en}
        description={topic.description[currentLang] || topic.description.en}
        path={`/topic/${topic.slug}`}
        articles={initialArticles}
        currentLang={currentLang}
      />
      <FAQPageJsonLd faqs={topic.faqs} currentLang={currentLang} />
      <BreadcrumbJsonLd
        category={topic.category}
        topicSlug={topic.slug}
        topicTitle={topic.title[currentLang] || topic.title.en}
        currentLang={currentLang}
      />
      <HubViewContainer
        hubType="topic"
        topicSlug={topic.slug}
        initialArticles={initialArticles}
        initialLang={currentLang}
      />
    </>
  );
}
