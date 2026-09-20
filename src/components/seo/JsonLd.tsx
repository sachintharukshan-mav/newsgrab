'use client';

import React from 'react';
import { Article, Category, Language } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsgrab.lk';

interface OrganizationJsonLdProps {
  currentLang?: Language;
}

export const OrganizationJsonLd: React.FC<OrganizationJsonLdProps> = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'NEWSGRAB',
    alternateName: ['NewsGrab Sri Lanka', 'NewsGrab Digital Dispatch', 'NewsGrab Newsroom'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      'Independent digital news aggregator for Sri Lanka and the global diaspora. Real-time multi-newsroom syndication across 11 national newsdesks with CBSL verified macroeconomic indicators.',
    foundingDate: '2024-01-01',
    areaServed: {
      '@type': 'Country',
      name: 'Sri Lanka',
    },
    knowsLanguage: ['en', 'si', 'ta'],
    publishingPrinciples: `${SITE_URL}/#editorial-policy`,
    correctionsPolicy: `${SITE_URL}/#corrections-policy`,
    diversityPolicy: `${SITE_URL}/#diversity-policy`,
    ethicsPolicy: `${SITE_URL}/#ethics-policy`,
    sameAs: [
      'https://twitter.com/newsgrab_lk',
      'https://facebook.com/newsgrab.lk',
      'https://linkedin.com/company/newsgrab-lk',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const WebSiteJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NEWSGRAB — The Sri Lankan Dispatch & Intelligence Desk',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface NewsArticleJsonLdProps {
  article: Article;
  currentLang: Language;
}

export const NewsArticleJsonLd: React.FC<NewsArticleJsonLdProps> = ({ article, currentLang }) => {
  const title = article.title[currentLang] || article.title.en || article.title.si || article.title.ta || '';
  const summary = article.summary[currentLang] || article.summary.en || article.summary.si || article.summary.ta || '';
  const langCode = currentLang === 'si' ? 'si-LK' : currentLang === 'ta' ? 'ta-LK' : 'en-LK';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/?article=${encodeURIComponent(article.id)}`,
    },
    headline: title.slice(0, 110),
    description: summary,
    image: article.imageUrl ? [article.imageUrl] : [`${SITE_URL}/og-default.jpg`],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: article.category,
    inLanguage: langCode,
    isAccessibleForFree: true,
    author: [
      {
        '@type': 'Organization',
        name: article.publisherName,
        url: article.sourceUrl || SITE_URL,
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'NEWSGRAB',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ItemListJsonLdProps {
  articles: Article[];
  currentLang: Language;
}

export const ItemListJsonLd: React.FC<ItemListJsonLdProps> = ({ articles, currentLang }) => {
  const topArticles = articles.slice(0, 10);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Sri Lanka News Dispatches',
    itemListElement: topArticles.map((article, index) => {
      const title = article.title[currentLang] || article.title.en || '';
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: title,
        url: `${SITE_URL}/?article=${encodeURIComponent(article.id)}`,
        image: article.imageUrl || undefined,
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbJsonLdProps {
  category?: Category;
  currentLang: Language;
  articleTitle?: string;
}

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({
  category = 'all',
  currentLang,
  articleTitle,
}) => {
  const categoryNames: Record<Category, Record<Language, string>> = {
    all: { en: 'Front Page', si: 'මුල් පිටුව', ta: 'முகப்பு' },
    local: { en: 'Sri Lanka', si: 'ශ්‍රී ලංකාව', ta: 'இலங்கை' },
    world: { en: 'World', si: 'ලෝකය', ta: 'உலகம்' },
    breaking: { en: 'Breaking', si: 'උණුසුම් පුවත්', ta: 'முக்கிய செய்திகள்' },
    economy: { en: 'Economy', si: 'ආර්ථිකය', ta: 'பொருளாதாரம்' },
    politics: { en: 'Politics', si: 'දේශපාලනය', ta: 'அரசியல்' },
    sports: { en: 'Sports', si: 'ක්‍රීඩා', ta: 'விளையாட்டு' },
    tech: { en: 'Technology', si: 'තාක්ෂණය', ta: 'தொழில்நுட்பம்' },
  };

  const breadcrumbs: Array<{ position: number; name: string; item: string }> = [
    {
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];

  if (category !== 'all') {
    breadcrumbs.push({
      position: 2,
      name: categoryNames[category][currentLang],
      item: `${SITE_URL}/?category=${category}`,
    });
  }

  if (articleTitle) {
    breadcrumbs.push({
      position: breadcrumbs.length + 1,
      name: articleTitle,
      item: `${SITE_URL}/#`,
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b) => ({
      '@type': 'ListItem',
      position: b.position,
      name: b.name,
      item: b.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
