import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleById } from '@/lib/news-service';
import { Language } from '@/lib/types';
import { NewsArticleJsonLd } from '@/components/seo/JsonLd';
import { ArticleViewContainer } from '@/components/news/ArticleViewContainer';
import { getSiteUrl } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;
  const SITE_URL = getSiteUrl();

  const article = await getArticleById(id, currentLang);
  if (!article) {
    return {
      title: 'Dispatch Not Found | LANKA DISPATCH',
      description: 'The requested news wire dispatch could not be found or has expired from the live index.',
    };
  }

  const title = article.title[currentLang] || article.title.en || 'Sri Lanka News Dispatch';
  const summary = article.summary[currentLang] || article.summary.en || 'Latest breaking reporting from Colombo and international wire desks.';
  const canonicalUrl = `${SITE_URL}/article/${encodeURIComponent(article.id)}`;
  const ogImageUrl = article.imageUrl
    ? article.imageUrl
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title.slice(0, 80))}&category=${encodeURIComponent(article.category)}&pub=${encodeURIComponent(article.publisherName)}`;

  return {
    title: title.slice(0, 110),
    description: summary.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-LK': `${canonicalUrl}?lang=en`,
        'si-LK': `${canonicalUrl}?lang=si`,
        'ta-LK': `${canonicalUrl}?lang=ta`,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description: summary,
      url: canonicalUrl,
      siteName: 'LANKA DISPATCH',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.publisherName],
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
      images: [ogImageUrl],
      site: '@lankadispatch',
    },
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;

  const article = await getArticleById(id, currentLang);

  if (!article) {
    notFound();
  }

  return (
    <>
      <NewsArticleJsonLd article={article} currentLang={currentLang} />
      <ArticleViewContainer initialArticle={article} initialLang={currentLang} />
    </>
  );
}
