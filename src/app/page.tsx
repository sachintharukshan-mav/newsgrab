import React from 'react';
import type { Metadata } from 'next';
import { getAggregatedArticles } from '@/lib/news-service';
import { mockArticles } from '@/lib/mock-data';
import { Language } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-config';
import HomeClient from '@/components/news/HomeClient';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;
  const SITE_URL = getSiteUrl();

  const enUrl = `${SITE_URL}/`;
  const siUrl = `${SITE_URL}/si`;
  const taUrl = `${SITE_URL}/ta`;
  const canonicalUrl = currentLang === 'si' ? siUrl : currentLang === 'ta' ? taUrl : enUrl;

  const titles: Record<Language, string> = {
    en: 'LANKA DISPATCH — The Sri Lankan Digital Dispatch & Intelligence Desk',
    si: 'LANKA DISPATCH — ශ්‍රී ලංකාවේ ප්‍රමුඛතම ත්‍රෛභාෂා ඩිජිටල් පුවත් සහ බුද්ධි තොරතුරු මධ්‍යස්ථානය',
    ta: 'LANKA DISPATCH — இலங்கையின் முன்னணி மும்மொழி டிஜிட்டல் செய்தி மற்றும் தகவல் மையம்',
  };

  const descriptions: Record<Language, string> = {
    en: 'Sri Lanka’s authoritative trilingual digital dispatch. Real-time newsroom syndication across Ada Derana, Hiru, Daily Mirror, Virakesari, BBC, and CBSL verified financial indicators.',
    si: 'ශ්‍රී ලංකාවේ සත්‍යාපිත ත්‍රෛභාෂා ඩිජිටල් පුවත් සම්පිණ්ඩනය. අද දෙරණ, හිරු, බීබීසී සහ මහ බැංකු නිල ආර්ථික දත්ත සජීවීව.',
    ta: 'இலங்கையின் அதிகாரப்பூர்வ மும்மொழி டிஜிட்டல் செய்தித் தொகுப்பு. வீரகேசரி, ஹிரு, பிபிசி மற்றும் மத்திய வங்கி பொருளாதாரத் தகவல்கள் உடனுக்குடன்.',
  };

  const ogLocaleMap: Record<Language, string> = {
    en: 'en_LK',
    si: 'si_LK',
    ta: 'ta_LK',
  };
  const activeLocale = ogLocaleMap[currentLang];
  const alternateLocales = Object.values(ogLocaleMap).filter((loc) => loc !== activeLocale);

  return {
    title: {
      absolute: titles[currentLang],
    },
    description: descriptions[currentLang],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-LK': enUrl,
        'si-LK': siUrl,
        'ta-LK': taUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: titles[currentLang],
      description: descriptions[currentLang],
      url: canonicalUrl,
      siteName: 'LANKA DISPATCH',
      locale: activeLocale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: 'LANKA DISPATCH Digital Newsroom',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[currentLang],
      description: descriptions[currentLang],
      images: ['/api/og'],
      site: '@lankadispatch',
    },
    robots: {
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

export default async function HomePage({ searchParams }: HomePageProps) {
  const { lang = 'en' } = await searchParams;
  const currentLang = (lang === 'si' || lang === 'ta' ? lang : 'en') as Language;

  const liveArticles = await getAggregatedArticles(currentLang, false).catch(() => []);
  const initialArticles =
    liveArticles && liveArticles.length > 0 ? liveArticles.slice(0, 24) : mockArticles;

  return <HomeClient initialArticles={initialArticles} serverLang={currentLang} />;
}
