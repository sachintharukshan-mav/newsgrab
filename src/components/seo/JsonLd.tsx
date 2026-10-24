'use client';

import React from 'react';
import { Article, Category, Language } from '@/lib/types';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

interface OrganizationJsonLdProps {
  currentLang?: Language;
}

export const OrganizationJsonLd: React.FC<OrganizationJsonLdProps> = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'LANKA DISPATCH',
    alternateName: ['Lanka Dispatch', 'Lanka Dispatch Digital Wire', 'LankaDispatch.com'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      'Independent digital news aggregator and wire desk for Sri Lanka and the global diaspora. Real-time multi-newsroom syndication across 11 national newsdesks with CBSL verified macroeconomic indicators.',
    foundingDate: '2024-01-01',
    areaServed: {
      '@type': 'Country',
      name: 'Sri Lanka',
    },
    knowsLanguage: ['en', 'si', 'ta'],
    publishingPrinciples: `${SITE_URL}/about#editorial-policy`,
    correctionsPolicy: `${SITE_URL}/about#corrections-policy`,
    diversityPolicy: `${SITE_URL}/about#diversity-policy`,
    ethicsPolicy: `${SITE_URL}/about#ethics-policy`,
    masthead: `${SITE_URL}/about#masthead`,
    unnamedSourcesPolicy: `${SITE_URL}/about#editorial-policy`,
    actionableFeedbackPolicy: `${SITE_URL}/about#corrections-policy`,
    sameAs: [
      'https://twitter.com/lankadispatch',
      'https://facebook.com/lankadispatch',
      'https://linkedin.com/company/lankadispatch',
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
    name: 'LANKA DISPATCH — The Sri Lankan Digital Dispatch & Intelligence Desk',
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
  const pageCanonicalUrl = currentLang === 'en'
    ? `${SITE_URL}/article/${encodeURIComponent(article.id)}`
    : `${SITE_URL}/article/${encodeURIComponent(article.id)}?lang=${currentLang}`;

  const brief = article.brief?.[currentLang];
  const fullArticleBody = brief
    ? [
        brief.whatHappened,
        ...(brief.keyDetails || []),
        brief.whyItMatters ? `Why It Matters: ${brief.whyItMatters}` : '',
        brief.whatsNext ? `What's Next: ${brief.whatsNext}` : '',
      ]
        .filter(Boolean)
        .join('\n\n')
    : summary;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageCanonicalUrl,
    },
    headline: title.slice(0, 110),
    description: summary,
    abstract: brief?.whatHappened || summary,
    articleBody: fullArticleBody,
    image: article.imageUrl ? [article.imageUrl] : [`${SITE_URL}/api/og`],
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
      {
        '@type': 'NewsMediaOrganization',
        name: 'Lanka Dispatch Wire Desk',
        url: `${SITE_URL}/about#masthead`,
      },
    ],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'LANKA DISPATCH',
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
  const langQuery = currentLang !== 'en' ? `?lang=${currentLang}` : '';

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
        url: `${SITE_URL}/article/${encodeURIComponent(article.id)}${langQuery}`,
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
  topicSlug?: string;
  topicTitle?: string;
}

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({
  category = 'all',
  currentLang,
  articleTitle,
  topicSlug,
  topicTitle,
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

  const langQuery = currentLang !== 'en' ? `?lang=${currentLang}` : '';
  const breadcrumbs: Array<{ position: number; name: string; item: string }> = [
    {
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/${langQuery}`,
    },
  ];

  if (category !== 'all') {
    breadcrumbs.push({
      position: 2,
      name: categoryNames[category][currentLang],
      item: `${SITE_URL}/category/${category}${langQuery}`,
    });
  }

  if (topicSlug && topicTitle) {
    breadcrumbs.push({
      position: breadcrumbs.length + 1,
      name: topicTitle,
      item: `${SITE_URL}/topic/${topicSlug}${langQuery}`,
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

interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  path: string;
  articles: Article[];
  currentLang: Language;
}

export const CollectionPageJsonLd: React.FC<CollectionPageJsonLdProps> = ({
  name,
  description,
  path,
  articles,
  currentLang,
}) => {
  const langCode = currentLang === 'si' ? 'si-LK' : currentLang === 'ta' ? 'ta-LK' : 'en-LK';
  const topArticles = articles.slice(0, 15);
  const fullUrl = `${SITE_URL}${path}${currentLang !== 'en' ? `?lang=${currentLang}` : ''}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': fullUrl,
    name,
    description,
    url: fullUrl,
    inLanguage: langCode,
    isPartOf: {
      '@type': 'WebSite',
      name: 'LANKA DISPATCH',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'LANKA DISPATCH',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      name: `${name} — Dispatches`,
      numberOfItems: topArticles.length,
      itemListElement: topArticles.map((article, index) => {
        const title = article.title[currentLang] || article.title.en || '';
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: title,
          url: `${SITE_URL}/article/${encodeURIComponent(article.id)}${currentLang !== 'en' ? `?lang=${currentLang}` : ''}`,
          image: article.imageUrl || undefined,
        };
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface FAQPageJsonLdProps {
  faqs: Array<{
    question: Record<Language, string>;
    answer: Record<Language, string>;
  }>;
  currentLang: Language;
}

export const FAQPageJsonLd: React.FC<FAQPageJsonLdProps> = ({ faqs, currentLang }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[currentLang] || faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[currentLang] || faq.answer.en,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
