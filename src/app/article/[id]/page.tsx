import React from 'react';
import type { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { getArticleById } from '@/lib/news-service';
import { Language } from '@/lib/types';
import { NewsArticleJsonLd } from '@/components/seo/JsonLd';
import { ArticleViewContainer } from '@/components/news/ArticleViewContainer';
import { getSiteUrl } from '@/lib/site-config';
import { getCachedBrief as getGeminiCachedBrief } from '@/lib/gemini-synthesizer';
import { getCachedBrief as getWorkersAiCachedBrief } from '@/lib/workers-ai-synthesizer';
import { buildOptimisticBrief } from '@/lib/brief-utils';

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Pre-attach Smart Brevity executive brief for SSR metadata if missing
  if (!article.brief?.[currentLang]) {
    const cachedBrief = (await getWorkersAiCachedBrief(article.sourceUrl, currentLang)) || getGeminiCachedBrief(article.sourceUrl, currentLang);
    article.brief = {
      ...article.brief,
      [currentLang]: cachedBrief || buildOptimisticBrief(article, currentLang),
    };
  }

  const title = article.title[currentLang] || article.title.en || 'Sri Lanka News Dispatch';
  const activeBrief = article.brief[currentLang];
  const summary = activeBrief?.whatHappened || article.summary[currentLang] || article.summary.en || 'Latest breaking reporting from Colombo and international wire desks.';

  const baseUrl = `${SITE_URL}/article/${encodeURIComponent(article.id)}`;
  const canonicalUrl = currentLang === 'en' ? baseUrl : `${baseUrl}?lang=${currentLang}`;
  const ogImageUrl = article.imageUrl
    ? article.imageUrl
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title.slice(0, 80))}&category=${encodeURIComponent(article.category)}&pub=${encodeURIComponent(article.publisherName)}`;

  const ogLocaleMap: Record<Language, string> = {
    en: 'en_LK',
    si: 'si_LK',
    ta: 'ta_LK',
  };
  const activeLocale = ogLocaleMap[currentLang];
  const alternateLocales = Object.values(ogLocaleMap).filter((loc) => loc !== activeLocale);

  return {
    title: title.slice(0, 110),
    description: summary.slice(0, 160),
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
      description: summary,
      url: canonicalUrl,
      siteName: 'LANKA DISPATCH',
      locale: activeLocale,
      alternateLocale: alternateLocales,
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
    robots: !article.brief?.[currentLang] && (summary.length < 80 || summary.trim().toLowerCase() === title.trim().toLowerCase())
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
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

  // Canonical redirect if requested id was an alias or sister-slug that resolved to an active article
  const decodedId = decodeURIComponent(id).trim();
  if (article.id !== id && article.id !== decodedId) {
    redirect(`/article/${encodeURIComponent(article.id)}${currentLang !== 'en' ? `?lang=${currentLang}` : ''}`, RedirectType.replace);
  }

  // Pre-attach Smart Brevity executive brief so Googlebot and search crawlers
  // receive the full, rich, structured editorial dispatch in initial SSR HTML.
  if (!article.brief?.[currentLang]) {
    const cachedBrief = (await getWorkersAiCachedBrief(article.sourceUrl, currentLang)) || getGeminiCachedBrief(article.sourceUrl, currentLang);
    article.brief = {
      ...article.brief,
      [currentLang]: cachedBrief || buildOptimisticBrief(article, currentLang),
    };
  }

  return (
    <>
      <NewsArticleJsonLd article={article} currentLang={currentLang} />
      <ArticleViewContainer initialArticle={article} initialLang={currentLang} />
    </>
  );
}
