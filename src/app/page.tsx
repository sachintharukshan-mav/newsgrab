'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { mockArticles, mockMarketPulse } from '@/lib/mock-data';
import { Article, Category, Language, DateRange } from '@/lib/types';
import { MarketTicker } from '@/components/header/MarketTicker';
import { Navbar } from '@/components/header/Navbar';
import { CategoryNav } from '@/components/news/CategoryNav';
import { BentoGrid } from '@/components/news/BentoGrid';
import { PublisherBar } from '@/components/news/PublisherBar';
import { FullArticlePage } from '@/components/news/FullArticlePage';
import { AdBanner } from '@/components/ads/AdBanner';
import { StickyMobileAd } from '@/components/ads/StickyMobileAd';
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  NewsArticleJsonLd,
  ItemListJsonLd,
  BreadcrumbJsonLd
} from '@/components/seo/JsonLd';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'bento' | 'compact'>('bento');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to fetch articles for the active language
  const fetchNews = async (lang: Language, isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/news?lang=${lang}`);
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        if (data.lastUpdated) {
          setLastUpdated(new Date(data.lastUpdated));
        } else {
          setLastUpdated(new Date());
        }

        // Re-sync deep link if open
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const articleId = params.get('article');
          if (articleId) {
            const foundLive = data.articles.find((a: Article) => a.id === articleId);
            if (foundLive) {
              setSelectedArticle(foundLive);
            } else {
              const foundMock = mockArticles.find((a) => a.id === articleId);
              if (foundMock) setSelectedArticle(foundMock);
            }
          }
        }
      }
    } catch (err) {
      console.warn('News fetch error:', err);
    } finally {
      if (!isSilent) setIsRefreshing(false);
    }
  };

  // On mount: restore saved language preference & check initial deep link
  useEffect(() => {
    let initialLang: Language = 'en';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as Language;
      if (urlLang && ['en', 'si', 'ta'].includes(urlLang)) {
        initialLang = urlLang;
      } else {
        const savedLang = localStorage.getItem('newsgrab_lang') as Language;
        if (savedLang && ['en', 'si', 'ta'].includes(savedLang)) {
          initialLang = savedLang;
        }
      }
      const urlTimeRange = params.get('timeRange') as DateRange;
      React.startTransition(() => {
        if (urlTimeRange && ['all', '24h', '7d', '30d', '1y'].includes(urlTimeRange)) {
          setDateRange(urlTimeRange);
        }
        setCurrentLang(initialLang);
      });
    }

    const controller = new AbortController();
    fetch(`/api/news?lang=${initialLang}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());

          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const articleId = params.get('article');
            if (articleId) {
              const foundLive = data.articles.find((a: Article) => a.id === articleId);
              if (foundLive) {
                setSelectedArticle(foundLive);
              } else {
                const foundMock = mockArticles.find((a) => a.id === articleId);
                if (foundMock) setSelectedArticle(foundMock);
              }
            }
          }
        }
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Initial news fetch error:', err);
        }
      });

    return () => controller.abort();
  }, []);

  // When switching language, persist and load fresh dispatches
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    setSelectedPublisher('all');
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsgrab_lang', newLang);
    }
    fetchNews(newLang);
  };

  // Automated 90-second background polling cycle
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchNews(currentLang, true);
      }
    }, 90000); // 90s cadence

    return () => clearInterval(timer);
  }, [currentLang]);

  const handleManualRefresh = () => {
    fetchNews(currentLang, false);
  };

  // Filter articles strictly by the selected Category / Domain
  const categoryArticles = useMemo(() => {
    return articles.filter((article) => {
      if (currentCategory === 'breaking') {
        return article.isBreaking || article.category === 'breaking';
      } else if (currentCategory === 'local') {
        return (article.region || 'local') === 'local';
      } else if (currentCategory === 'world') {
        return article.region === 'world';
      } else if (currentCategory !== 'all') {
        return article.category === currentCategory;
      }
      return true;
    });
  }, [articles, currentCategory]);

  // Dynamically compute publisher counts strictly for the ACTIVE category's relevant news
  const publisherCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryArticles.forEach((a) => {
      counts[a.publisherName] = (counts[a.publisherName] || 0) + 1;
    });
    return counts;
  }, [categoryArticles]);

  const handleSelectCategory = (cat: Category) => {
    setCurrentCategory(cat);
    setSelectedPublisher('all');
  };

  // Handle opening an article fully across the page with browser history sync
  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    if (typeof window !== 'undefined') {
      window.history.pushState({ articleId: article.id }, '', `?article=${encodeURIComponent(article.id)}`);
    }
  };

  const handleBackToFrontPage = () => {
    setSelectedArticle(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (range === 'all') {
        url.searchParams.delete('timeRange');
      } else {
        url.searchParams.set('timeRange', range);
      }
      window.history.pushState(null, '', url.toString());
    }
  };

  const handleResetFilters = () => {
    setCurrentCategory('all');
    setSelectedPublisher('all');
    setSearchQuery('');
    handleDateRangeChange('all');
  };

  const handleLogoClick = () => {
    setSelectedArticle(null);
    setCurrentCategory('all');
    setSelectedPublisher('all');
    setSearchQuery('');
    handleDateRangeChange('all');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && selectedArticle) {
      setSelectedArticle(null);
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  // Sync with browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        const found = articles.find((a) => a.id === articleId);
        if (found) setSelectedArticle(found);
      } else {
        setSelectedArticle(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  const effectivePublisher = selectedPublisher === 'all' || publisherCounts[selectedPublisher] ? selectedPublisher : 'all';

  // Filter within the active category based on Publisher, Search query, and Language
  const filteredArticles = useMemo(() => {
    return categoryArticles.filter((article) => {
      // Publisher filter
      if (effectivePublisher !== 'all') {
        if (article.publisherName.toLowerCase() !== effectivePublisher.toLowerCase()) return false;
      }

      // Historical Date-Range Scope filter
      if (dateRange !== 'all') {
        const pubTime = new Date(article.publishedAt).getTime();
        if (!isNaN(pubTime)) {
          const nowMs = lastUpdated.getTime();
          const cutoffMs =
            dateRange === '24h' ? nowMs - 24 * 60 * 60 * 1000 :
            dateRange === '7d' ? nowMs - 7 * 24 * 60 * 60 * 1000 :
            dateRange === '30d' ? nowMs - 30 * 24 * 60 * 60 * 1000 :
            nowMs - 365 * 24 * 60 * 60 * 1000;
          if (pubTime < cutoffMs) return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleText = (article.title?.[currentLang] || article.title?.en || '').toLowerCase();
        const summaryText = (article.summary?.[currentLang] || article.summary?.en || '').toLowerCase();
        const publisher = (article.publisherName || '').toLowerCase();
        return titleText.includes(q) || summaryText.includes(q) || publisher.includes(q);
      }

      return true;
    });
  }, [categoryArticles, effectivePublisher, searchQuery, currentLang, dateRange, lastUpdated]);

  const categoryWireTitles: Record<Category, Record<Language, string>> = {
    all: { en: 'Front Page Dispatches', si: 'මුල් පිටුවේ පුවත්', ta: 'முகப்பு செய்திகள்' },
    local: { en: '🇱🇰 Sri Lanka National Wire', si: '🇱🇰 ශ්‍රී ලංකා ජාතික පුවත්', ta: '🇱🇰 இலங்கை தேசிய செய்திகள்' },
    world: { en: '🌐 World Intelligence Wire', si: '🌐 ලෝක පුවත් සේවය', ta: '🌐 சர்வதேச செய்திகள்' },
    economy: { en: '📊 Economy & Financial Markets', si: '📊 ආර්ථික හා මූල්‍ය වෙළඳපොළ', ta: '📊 பொருளாதாரம் & நிதிச் சந்தை' },
    politics: { en: '🏛️ National Politics & Governance', si: '🏛️ ජාතික දේශපාලනය සහ රාජ්‍ය පාලනය', ta: '🏛️ தேசிய அரசியல் & ஆட்சி' },
    sports: { en: '🏏 Cricket & Sports Desk', si: '🏏 ක්‍රිකට් සහ ක්‍රීඩා පුවත්', ta: '🏏 கிரிக்கெட் & விளையாட்டு' },
    tech: { en: '⚡ Technology & Digital Economy', si: '⚡ තාක්ෂණය සහ ඩිජිටල් ආර්ථිකය', ta: '⚡ தொழில்நுட்பம் & டிஜிட்டல்' },
    breaking: { en: '🚨 Urgent & Developing Alerts', si: '🚨 උණුසුම් පුවත් නිවේදන', ta: '🚨 முக்கிய செய்திகள்' }
  };

  const dateRangeLabels: Record<DateRange, Record<Language, string>> = {
    all: { en: 'All Time', si: 'සියලුම', ta: 'அனைத்தும்' },
    '24h': { en: 'Past 24 Hours', si: 'පසුගිය පැය 24', ta: 'கடந்த 24 மணி' },
    '7d': { en: 'Past 7 Days', si: 'පසුගිය දින 7', ta: 'கடந்த 7 நாட்கள்' },
    '30d': { en: 'Past 30 Days', si: 'පසුගිය දින 30', ta: 'கடந்த 30 நாட்கள்' },
    '1y': { en: 'Past Year Archive', si: 'පසුගිය වසරේ ලේඛනාගාරය', ta: 'கடந்த 1 வருட ஆவணம்' }
  };

  const uiText = {
    reset: { en: 'Reset to Front Page', si: 'මුල් පිටුවට', ta: 'முகப்பிற்குத் திரும்பு' },
    dispatches: { en: 'dispatches across', si: 'පුවත් · මාධ්‍ය ආයතන', ta: 'செய்திகள் · ஊடகங்கள்' },
    newsrooms: { en: 'newsrooms', si: 'මගින්', ta: 'மூலம்' }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0e] text-zinc-100 selection:bg-rose-900/40 selection:text-white">
      {/* Schema.org Rich Results Structured Data */}
      <OrganizationJsonLd currentLang={currentLang} />
      <WebSiteJsonLd />
      {selectedArticle ? (
        <>
          <NewsArticleJsonLd article={selectedArticle} currentLang={currentLang} />
          <BreadcrumbJsonLd
            category={selectedArticle.category}
            currentLang={currentLang}
            articleTitle={selectedArticle.title[currentLang] || selectedArticle.title.en}
          />
        </>
      ) : (
        <>
          <ItemListJsonLd articles={filteredArticles} currentLang={currentLang} />
          <BreadcrumbJsonLd category={currentCategory} currentLang={currentLang} />
        </>
      )}

      {/* 1. Bloomberg/FT Style Financial Ticker */}
      <MarketTicker pulse={mockMarketPulse} currentLang={currentLang} />

      {/* 2. Newspaper Broadsheet Masthead with Live Feed Status */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onManualRefresh={handleManualRefresh}
        onLogoClick={handleLogoClick}
      />

      {/* 3. Main Content: Full Article Page (Across Entire View) OR Front Page Broadsheet */}
      {selectedArticle ? (
        <FullArticlePage
          article={selectedArticle}
          currentLang={currentLang}
          onBack={handleBackToFrontPage}
          onSelectRelatedArticle={handleOpenArticle}
          allArticles={articles}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Leaderboard / Billboard Ad Slot (Google AdSense & Certified Ad Networks) */}
          <div className="pb-2">
            <AdBanner
              format="billboard"
              slotId="home-top-billboard"
              adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_LEADERBOARD}
              sponsorName="Commercial Bank of Ceylon"
            />
          </div>

          {/* Category Navigation Bar */}
          <CategoryNav
            currentCategory={currentCategory}
            onSelectCategory={handleSelectCategory}
            currentLang={currentLang}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            dateRange={dateRange}
            onSelectDateRange={handleDateRangeChange}
          />

          {/* Active Category Scope & Historical Filter Status Banner */}
          {(currentCategory !== 'all' || dateRange !== 'all') && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-xs font-mono text-zinc-400 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className={`text-zinc-200 font-bold uppercase tracking-wider ${currentLang === 'si' ? 'font-sinhala' : ''} ${currentLang === 'ta' ? 'font-tamil' : ''}`}>
                  {categoryWireTitles[currentCategory][currentLang]}
                </span>
                {dateRange !== 'all' && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-[11px] font-mono">
                    ⏱️ {dateRangeLabels[dateRange][currentLang]}
                  </span>
                )}
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">
                  {filteredArticles.length} {uiText.dispatches[currentLang]} {Object.keys(publisherCounts).length} {uiText.newsrooms[currentLang]}
                </span>
              </div>

              <button
                onClick={handleResetFilters}
                className="text-zinc-400 hover:text-zinc-200 text-[11px] underline underline-offset-2 cursor-pointer transition-colors self-start sm:self-auto"
              >
                {uiText.reset[currentLang]}
              </button>
            </div>
          )}

          {/* Newsroom Publisher Filter Strip (Dynamic to Active Category) */}
          <PublisherBar
            selectedPublisher={effectivePublisher}
            onSelectPublisher={setSelectedPublisher}
            publisherCounts={publisherCounts}
            totalCount={categoryArticles.length}
            currentLang={currentLang}
          />

          {/* Lead Story, Grid, and The Colombo Wire */}
          <BentoGrid
            articles={filteredArticles}
            currentLang={currentLang}
            onOpenQuickRead={handleOpenArticle}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />

          {/* Bottom Multiplex / Sponsored Stories Grid (High Engagement & RPM) */}
          <div className="pt-8 pb-2 border-t border-white/[0.06]">
            <AdBanner
              format="multiplex"
              slotId="home-bottom-multiplex"
              adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
              sponsorName="Sponsored Industry Intelligence"
            />
          </div>
        </main>
      )}

      {/* 4. Mobile Sticky Ad Unit */}
      <StickyMobileAd />

      {/* 5. Authoritative Newspaper Broadsheet Footer (Google News & Search Console Compliant) */}
      <footer className="w-full border-t border-white/[0.08] bg-[#07080a] py-14 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06]">
            {/* Column 1: Masthead & Mission */}
            <div className="space-y-3">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="inline-block group cursor-pointer transition-opacity hover:opacity-90"
                title="NEWSGRAB Front Page"
                aria-label="NEWSGRAB Front Page"
              >
                <div className="text-xl font-extrabold text-white font-headline uppercase tracking-tight">
                  NEWS<span className="text-rose-500">GRAB</span>
                </div>
              </Link>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Independent trilingual digital newsroom and editorial aggregator for Sri Lanka and the global diaspora. Syndicating national dispatches in English, Sinhala, and Tamil with verified Central Bank fixing indicators.
              </p>
              <div className="text-[11px] font-mono text-zinc-500">
                <span>Bureau: Colombo 01, Sri Lanka</span>
              </div>
            </div>

            {/* Column 2: Newsrooms & Syndication */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="font-bold text-zinc-200 uppercase tracking-wider text-xs font-sans">
                Syndicated Wire (15)
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-zinc-400">
                <li className="text-zinc-200 font-semibold">Reuters (World)</li>
                <li className="text-zinc-200 font-semibold">BBC World News</li>
                <li className="text-zinc-200 font-semibold">The Guardian (World)</li>
                <li>Ada Derana (EN/SI)</li>
                <li>Hiru News (EN/SI/TA)</li>
                <li>Daily Mirror</li>
                <li>Virakesari (TA)</li>
                <li>BBC Sinhala &amp; Tamil</li>
                <li>NewsFirst</li>
                <li>Daily FT</li>
                <li>NewsWire</li>
                <li>EconomyNext</li>
                <li>The Island</li>
                <li>Sri Lanka Mirror</li>
                <li>LBO</li>
              </ul>
            </div>

            {/* Column 3: Standards & Editorial Policies (Google News Trust Indicators) */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="font-bold text-zinc-200 uppercase tracking-wider text-xs font-sans">
                Editorial Transparency
              </div>
              <ul className="space-y-1.5 text-zinc-400">
                <li id="editorial-policy">
                  <span className="text-zinc-300 font-semibold">Editorial Policy:</span> Direct original attribution &amp; fair use wire reporting.
                </li>
                <li id="corrections-policy">
                  <span className="text-zinc-300 font-semibold">Corrections:</span> Updates reflect publisher modifications immediately.
                </li>
                <li id="ethics-policy">
                  <span className="text-zinc-300 font-semibold">Ethics:</span> Non-partisan, impartial multi-source perspective indexing.
                </li>
                <li id="diversity-policy">
                  <span className="text-zinc-300 font-semibold">Diversity:</span> Unbiased trilingual coverage (සිංහල · தமிழ் · English).
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Grievances */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="font-bold text-zinc-200 uppercase tracking-wider text-xs font-sans">
                Newsdesk &amp; Contact
              </div>
              <ul className="space-y-1.5 text-zinc-400">
                <li>Editorial Desk: <span className="text-zinc-200">desk@newsgrab.lk</span></li>
                <li>Advertising &amp; SSPs: <span className="text-zinc-200">advertising@newsgrab.lk</span></li>
                <li>Press Releases: <span className="text-zinc-200">wire@newsgrab.lk</span></li>
                <li>Corrections &amp; Legal: <span className="text-zinc-200">legal@newsgrab.lk</span></li>
                <li>Compliance: <Link href="/about" className="text-zinc-200 hover:text-white underline underline-offset-2">About Us</Link> · <Link href="/privacy" className="text-zinc-200 hover:text-white underline underline-offset-2">Privacy Policy</Link> · <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('newsgrab:open-cookie-consent'))} className="text-zinc-200 hover:text-white underline underline-offset-2 cursor-pointer">Cookie Preferences</button> · <Link href="/terms" className="text-zinc-200 hover:text-white underline underline-offset-2">Terms</Link> · <a href="/ads.txt" className="text-zinc-200 hover:text-white underline underline-offset-2">ads.txt</a></li>
                <li className="pt-1 text-[10px] text-emerald-400">● 24/7 Automated Ingestion Active</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-400">
            <div>
              &copy; {new Date().getFullYear()} NEWSGRAB Media Network. All wire stories and original reporting remain the copyright of their respective publishers.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about" className="hover:text-zinc-200 transition-colors">About</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-zinc-200 transition-colors">Privacy</Link>
              <span>•</span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('newsgrab:open-cookie-consent'))}
                className="hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Cookie Preferences
              </button>
              <span>•</span>
              <Link href="/terms" className="hover:text-zinc-200 transition-colors">Terms</Link>
              <span>•</span>
              <a href="/ads.txt" className="hover:text-zinc-200 transition-colors">ads.txt</a>
              <span>•</span>
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
