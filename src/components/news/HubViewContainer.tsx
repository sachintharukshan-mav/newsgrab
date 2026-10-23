'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article, Category, Language, DateRange, MarketPulse } from '@/lib/types';
import { mockArticles, mockMarketPulse } from '@/lib/mock-data';
import {
  SECTION_HUBS,
  TOPIC_HUBS,
  SectionHubConfig,
  TopicHubConfig,
} from '@/lib/topics';
import { MarketTicker } from '@/components/header/MarketTicker';
import { Navbar } from '@/components/header/Navbar';
import { CategoryNav } from '@/components/news/CategoryNav';
import { PublisherBar } from '@/components/news/PublisherBar';
import { BentoGrid } from '@/components/news/BentoGrid';
import { SavedArticlesDrawer } from '@/components/news/SavedArticlesDrawer';
import { AdBanner } from '@/components/ads/AdBanner';
import { PowerCutBanner } from '@/components/powercut/PowerCutBanner';
import { ChevronRight, Sparkles, HelpCircle, Compass, Layers } from 'lucide-react';

interface HubViewContainerProps {
  hubType: 'category' | 'topic';
  sectionHub?: SectionHubConfig;
  topicHub?: TopicHubConfig;
  initialArticles: Article[];
  initialLang: Language;
}

export const HubViewContainer: React.FC<HubViewContainerProps> = ({
  hubType,
  sectionHub,
  topicHub,
  initialArticles,
  initialLang,
}) => {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'bento' | 'compact'>('bento');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [marketPulse, setMarketPulse] = useState<MarketPulse>(mockMarketPulse);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  const activeCategory: Category =
    hubType === 'category' && sectionHub
      ? sectionHub.slug
      : topicHub
      ? topicHub.category
      : 'all';

  const basePath =
    hubType === 'category' && sectionHub
      ? `/category/${sectionHub.slug}`
      : topicHub
      ? `/topic/${topicHub.slug}`
      : '/';

  const langSuffix = currentLang !== 'en' ? `?lang=${currentLang}` : '';
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  useEffect(() => {
    setCurrentLang(initialLang);
  }, [initialLang]);

  // Restore saved bookmarks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('newsgrab_saved_articles');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedArticleIds(parsed);
        }
      }
    } catch {}
  }, []);

  // Fetch market pulse on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.cbslRates) {
          setMarketPulse(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLanguageChange = useCallback(
    (newLang: Language) => {
      setCurrentLang(newLang);
      try {
        localStorage.setItem('newsgrab_lang', newLang);
      } catch {}
      router.push(`${basePath}${newLang !== 'en' ? `?lang=${newLang}` : ''}`);
    },
    [router, basePath]
  );

  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 600);
  }, [router]);

  const handleToggleSaveArticle = useCallback((article: Article) => {
    setSavedArticleIds((prev) => {
      const exists = prev.includes(article.id);
      const updated = exists ? prev.filter((id) => id !== article.id) : [...prev, article.id];
      try {
        localStorage.setItem('newsgrab_saved_articles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const handleRemoveSavedArticle = useCallback((id: string) => {
    setSavedArticleIds((prev) => {
      const updated = prev.filter((item) => item !== id);
      try {
        localStorage.setItem('newsgrab_saved_articles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const handleClearAllSaved = useCallback(() => {
    setSavedArticleIds([]);
    try {
      localStorage.removeItem('newsgrab_saved_articles');
    } catch {}
  }, []);

  const handleOpenArticle = useCallback(
    (article: Article) => {
      router.push(`/article/${encodeURIComponent(article.id)}${langSuffix}`);
    },
    [router, langSuffix]
  );

  const publisherCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      counts[a.publisherName] = (counts[a.publisherName] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const effectivePublisher =
    selectedPublisher === 'all' || publisherCounts[selectedPublisher]
      ? selectedPublisher
      : 'all';

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (effectivePublisher !== 'all') {
        if (article.publisherName.toLowerCase() !== effectivePublisher.toLowerCase()) {
          return false;
        }
      }

      if (dateRange !== 'all') {
        const pubTime = new Date(article.publishedAt).getTime();
        if (!isNaN(pubTime)) {
          const nowMs = lastUpdated.getTime();
          const cutoffMs =
            dateRange === '24h'
              ? nowMs - 24 * 60 * 60 * 1000
              : dateRange === '7d'
              ? nowMs - 7 * 24 * 60 * 60 * 1000
              : dateRange === '30d'
              ? nowMs - 30 * 24 * 60 * 60 * 1000
              : nowMs - 365 * 24 * 60 * 60 * 1000;
          if (pubTime < cutoffMs) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleText = (article.title?.[currentLang] || article.title?.en || '').toLowerCase();
        const summaryText = (article.summary?.[currentLang] || article.summary?.en || '').toLowerCase();
        const publisher = (article.publisherName || '').toLowerCase();
        return titleText.includes(q) || summaryText.includes(q) || publisher.includes(q);
      }

      return true;
    });
  }, [articles, effectivePublisher, dateRange, searchQuery, currentLang, lastUpdated]);

  const savedArticles = useMemo(() => {
    return savedArticleIds
      .map((id) => articles.find((a) => a.id === id) || mockArticles.find((a) => a.id === id))
      .filter((a): a is Article => Boolean(a));
  }, [articles, savedArticleIds]);

  const headingTitle =
    hubType === 'category' && sectionHub
      ? sectionHub.title[currentLang]
      : topicHub
      ? topicHub.title[currentLang]
      : '';

  const aeoText =
    hubType === 'category' && sectionHub
      ? sectionHub.aeoSummary[currentLang]
      : topicHub
      ? topicHub.aeoAnswer[currentLang]
      : '';

  const parentSection =
    hubType === 'topic' && topicHub ? SECTION_HUBS[topicHub.category] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
      {/* 1. Financial Ticker */}
      <MarketTicker pulse={marketPulse} currentLang={currentLang} />

      {/* 2. Masthead Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onManualRefresh={handleManualRefresh}
        onLogoClick={() => router.push(`/${langSuffix}`)}
        savedCount={savedArticleIds.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      {/* Power Cut Utility Alert Banner */}
      <PowerCutBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Billboard Ad */}
        <div className="pb-2">
          <AdBanner
            format="billboard"
            slotId="hub-top-billboard"
            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_LEADERBOARD}
          />
        </div>

        {/* Section & Topic Navigation */}
        <CategoryNav
          currentCategory={activeCategory}
          currentLang={currentLang}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          dateRange={dateRange}
          onSelectDateRange={setDateRange}
          activeTopicSlug={topicHub?.slug}
          preferRouteNavigation={true}
        />

        {/* Hub Masthead & AEO Intelligence Brief Box */}
        <section
          aria-label="Topic Intelligence Brief"
          className="mb-8 p-5 sm:p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] shadow-sm space-y-4"
        >
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] flex-wrap">
            <Link href={`/${langSuffix}`} className="hover:text-[var(--text-main)] transition-colors">
              {currentLang === 'si' ? 'මුල් පිටුව' : currentLang === 'ta' ? 'முகப்பு' : 'Front Page'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
            {parentSection && (
              <>
                <Link
                  href={`/category/${parentSection.slug}${langSuffix}`}
                  className="hover:text-[var(--text-main)] transition-colors"
                >
                  {parentSection.title[currentLang]}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              </>
            )}
            <span className="text-[var(--text-main)] font-semibold">
              {headingTitle}
            </span>
          </nav>

          {/* Main Hub H1 Headline & Live Counter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-line)] pb-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-mono uppercase tracking-wider font-bold">
                <Sparkles className="w-3 h-3" />
                <span>
                  {hubType === 'topic'
                    ? currentLang === 'si'
                      ? 'විශේෂ විමර්ශන අංශය'
                      : currentLang === 'ta'
                      ? 'சிறப்பு செய்தித் தொகுப்பு'
                      : 'Topic Intelligence Hub'
                    : currentLang === 'si'
                    ? 'පුවත් අංශය'
                    : currentLang === 'ta'
                    ? 'செய்திப் பிரிவு'
                    : 'Editorial Section Desk'}
                </span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-[var(--text-main)] tracking-tight ${
                  isSinhala ? 'font-sinhala leading-[1.3]' : ''
                } ${isTamil ? 'font-tamil leading-[1.3]' : ''}`}
              >
                {headingTitle}
              </h1>
            </div>

            <div className="text-xs font-mono text-[var(--text-muted)] shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-subtle)] border border-[var(--border-line)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {filteredArticles.length} Dispatches • {Object.keys(publisherCounts).length} Newsrooms
                </span>
              </span>
            </div>
          </div>

          {/* Direct AEO Summary Paragraph (Structured for Featured Snippets & AI Overviews) */}
          <p
            className={`text-sm sm:text-base text-[var(--text-body)] leading-relaxed ${
              isSinhala ? 'font-sinhala leading-loose' : ''
            } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
          >
            {aeoText}
          </p>

          {/* Key Facts Grid for Topic Hubs */}
          {topicHub && topicHub.keyFacts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {topicHub.keyFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-[var(--bg-page)] border border-[var(--border-line)] space-y-0.5"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {fact.label[currentLang]}
                  </div>
                  <div className="text-xs sm:text-sm font-bold font-mono text-[var(--text-main)]">
                    {fact.value[currentLang]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Publisher Filter Strip */}
        <PublisherBar
          selectedPublisher={effectivePublisher}
          onSelectPublisher={setSelectedPublisher}
          publisherCounts={publisherCounts}
          totalCount={articles.length}
          currentLang={currentLang}
        />

        {/* Main News Grid */}
        <BentoGrid
          articles={filteredArticles}
          currentLang={currentLang}
          onOpenQuickRead={handleOpenArticle}
          viewMode={viewMode}
          onResetFilters={() => {
            setSelectedPublisher('all');
            setSearchQuery('');
            setDateRange('all');
          }}
          savedArticleIds={savedArticleIds}
          onToggleSave={handleToggleSaveArticle}
        />

        {/* Topic Hub FAQ Section (AEO / Google Rich Results FAQ Block) */}
        {topicHub && topicHub.faqs.length > 0 && (
          <section
            aria-label="Frequently Asked Questions"
            className="mt-12 p-5 sm:p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[var(--border-line)] pb-3">
              <HelpCircle className="w-4 h-4 text-[var(--accent-crimson)]" />
              <h2 className="text-base sm:text-lg font-bold font-headline text-[var(--text-main)]">
                {currentLang === 'si'
                  ? 'නිතර අසන ප්‍රශ්න සහ මූලික කරුණු'
                  : currentLang === 'ta'
                  ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்'
                  : `Key Questions: ${topicHub.shortLabel.en}`}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicHub.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded bg-[var(--bg-page)] border border-[var(--border-line)] space-y-2"
                >
                  <h3
                    className={`text-sm font-bold text-[var(--text-main)] ${
                      isSinhala ? 'font-sinhala' : ''
                    } ${isTamil ? 'font-tamil' : ''}`}
                  >
                    {faq.question[currentLang]}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm text-[var(--text-body)] leading-relaxed ${
                      isSinhala ? 'font-sinhala leading-loose' : ''
                    } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
                  >
                    {faq.answer[currentLang]}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Internal Link Matrix: Explore All Sections & Topic Hubs */}
        <section
          aria-label="Explore Sections and Topics"
          className="mt-10 p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] space-y-5"
        >
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              <Layers className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
              <span>
                {currentLang === 'si'
                  ? 'සියලුම පුවත් අංශ'
                  : currentLang === 'ta'
                  ? 'அனைத்து செய்திப் பிரிவுகள்'
                  : 'All Editorial Section Desks'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.values(SECTION_HUBS).map((sec) => (
                <Link
                  key={sec.slug}
                  href={`/category/${sec.slug}${langSuffix}`}
                  className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                    hubType === 'category' && sectionHub?.slug === sec.slug
                      ? 'bg-[var(--text-main)] text-[var(--bg-page)] border-[var(--text-main)] font-bold'
                      : 'bg-[var(--bg-page)] text-[var(--text-body)] border-[var(--border-line)] hover:border-[var(--text-main)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {sec.title[currentLang]}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[var(--border-line)]">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              <Compass className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
              <span>
                {currentLang === 'si'
                  ? 'විශේෂ මාතෘකා එකතුව'
                  : currentLang === 'ta'
                  ? 'சிறப்புத் தலைப்புகள்'
                  : 'Sri Lanka Topic Intelligence Hubs'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.values(TOPIC_HUBS).map((top) => (
                <Link
                  key={top.slug}
                  href={`/topic/${top.slug}${langSuffix}`}
                  className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                    hubType === 'topic' && topicHub?.slug === top.slug
                      ? 'bg-[var(--text-main)] text-[var(--bg-page)] border-[var(--text-main)] font-bold'
                      : 'bg-[var(--bg-page)] text-[var(--text-body)] border-[var(--border-line)] hover:border-[var(--text-main)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {top.title[currentLang]}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Multiplex Ad */}
        <div className="pt-8 pb-2">
          <AdBanner
            format="multiplex"
            slotId="hub-bottom-multiplex"
            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
          />
        </div>
      </main>

      {/* Saved Dispatches Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticles}
        onRemoveArticle={handleRemoveSavedArticle}
        onClearAll={handleClearAllSaved}
        onSelectArticle={handleOpenArticle}
        currentLang={currentLang}
      />

      {/* Broadsheet Footer */}
      <footer className="w-full border-t border-[var(--border-line)] bg-[var(--footer-bg)] py-10 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} LANKA DISPATCH Media Network. All wire stories remain the copyright of their respective publishers.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href={`/${langSuffix}`} className="hover:text-[var(--text-main)] transition-colors">
              Front Page
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-[var(--text-main)] transition-colors">
              About &amp; Editorial Policy
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[var(--text-main)] transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[var(--text-main)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
