'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Article, Language, MarketPulse } from '@/lib/types';
import { mockMarketPulse, mockArticles } from '@/lib/mock-data';
import { MarketTicker } from '@/components/header/MarketTicker';
import { Navbar } from '@/components/header/Navbar';
import { FullArticlePage } from '@/components/news/FullArticlePage';
import { SavedArticlesDrawer } from '@/components/news/SavedArticlesDrawer';

interface ArticleViewContainerProps {
  initialArticle: Article;
  initialLang: Language;
}

export const ArticleViewContainer: React.FC<ArticleViewContainerProps> = ({
  initialArticle,
  initialLang,
}) => {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);
  const [article, setArticle] = useState<Article>(initialArticle);
  const [allArticles, setAllArticles] = useState<Article[]>(mockArticles);
  const [marketPulse, setMarketPulse] = useState<MarketPulse>(mockMarketPulse);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize initial article if prop changes
  useEffect(() => {
    setArticle(initialArticle);
  }, [initialArticle]);

  // Load saved bookmarks from localStorage
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

  // Fetch contextual pool for related articles and market pulse
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/news?lang=${currentLang}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.articles && data.articles.length > 0) {
          setAllArticles(data.articles);
          const current = data.articles.find((a: Article) => a.id === article.id);
          if (current) setArticle(current);
        }
      })
      .catch(() => {});

    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.exchangeRates) {
          setMarketPulse(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [currentLang, article.id]);

  const handleToggleSaveArticle = useCallback((art: Article) => {
    setSavedArticleIds((prev) => {
      const exists = prev.includes(art.id);
      const updated = exists ? prev.filter((id) => id !== art.id) : [...prev, art.id];
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

  const handleLanguageChange = useCallback(
    (newLang: Language) => {
      setCurrentLang(newLang);
      router.replace(`/article/${encodeURIComponent(article.id)}?lang=${newLang}`);
    },
    [router, article.id]
  );

  const handleBackToFrontPage = useCallback(() => {
    router.push(`/?lang=${currentLang}`);
  }, [router, currentLang]);

  const handleSelectRelatedArticle = useCallback(
    (related: Article) => {
      router.push(`/article/${encodeURIComponent(related.id)}?lang=${currentLang}`);
    },
    [router, currentLang]
  );

  const savedArticles = allArticles.filter((a) => savedArticleIds.includes(a.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c0e] text-[#f1f2f4]">
      {/* 1. Live Market Ticker */}
      <MarketTicker
        pulse={marketPulse}
        currentLang={currentLang}
      />

      {/* 2. Institutional Masthead & Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={handleBackToFrontPage}
        savedCount={savedArticleIds.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      {/* 3. Main Full Article View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FullArticlePage
          article={article}
          currentLang={currentLang}
          onBack={handleBackToFrontPage}
          onSelectRelatedArticle={handleSelectRelatedArticle}
          allArticles={allArticles}
          isSaved={savedArticleIds.includes(article.id)}
          onToggleSave={handleToggleSaveArticle}
        />
      </main>

      {/* 4. Reading Queue & Saved Articles Slide-Over Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticles}
        onRemoveArticle={handleRemoveSavedArticle}
        onClearAll={handleClearAllSaved}
        onSelectArticle={handleSelectRelatedArticle}
        currentLang={currentLang}
      />

      {/* 5. Institutional Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080a] py-10 mt-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-zinc-300">NEWSGRAB</span> · Sri Lanka Digital Intelligence Desk
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-zinc-300 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
