import React from 'react';
import { getAggregatedArticles } from '@/lib/news-service';
import { mockArticles } from '@/lib/mock-data';
import { Language } from '@/lib/types';
import HomeClient from '@/components/news/HomeClient';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;

  const liveArticles = await getAggregatedArticles(currentLang, false).catch(() => []);
  const initialArticles =
    liveArticles && liveArticles.length > 0 ? liveArticles.slice(0, 24) : mockArticles;

  return <HomeClient initialArticles={initialArticles} serverLang={currentLang} />;
}
