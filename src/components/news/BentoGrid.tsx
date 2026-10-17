'use client';

import React from 'react';
import { Article, Language } from '@/lib/types';
import { NewsCard } from './NewsCard';
import { HeadlineSlider } from './HeadlineSlider';
import { AdBanner } from '@/components/ads/AdBanner';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/time-utils';
import { PredictionTracker } from '@/components/widgets/PredictionTracker';

interface BentoGridProps {
  articles: Article[];
  currentLang: Language;
  onOpenQuickRead: (article: Article) => void;
  viewMode: 'bento' | 'compact';
  onResetFilters?: () => void;
  savedArticleIds?: string[];
  onToggleSave?: (article: Article) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  articles,
  currentLang,
  onOpenQuickRead,
  viewMode,
  onResetFilters,
  savedArticleIds = [],
  onToggleSave
}) => {
  const [visibleCount, setVisibleCount] = React.useState<number>(10);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const compactSentinelRef = React.useRef<HTMLDivElement>(null);

  // Reset pagination when articles list changes (e.g., category or search change)
  React.useEffect(() => {
    setVisibleCount(10);
  }, [articles, viewMode]);

  const headlineCount = Math.min(5, articles.length);
  const headlineStories = articles.slice(0, headlineCount);
  const otherStories = articles.slice(headlineCount);
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  const hasMoreBroadsheet = otherStories.length > visibleCount;
  const hasMoreCompact = articles.length > visibleCount * 3;

  // Infinite Scroll IntersectionObserver (Auto-loads next batch as reader nears bottom)
  React.useEffect(() => {
    const target = viewMode === 'compact' ? compactSentinelRef.current : sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setVisibleCount((prev) => {
            const max = viewMode === 'compact' ? Math.ceil(articles.length / 3) : otherStories.length;
            const step = viewMode === 'compact' ? 10 : 8;
            return Math.min(prev + step, max);
          });
        }
      },
      {
        root: null,
        rootMargin: '450px', // Begin auto-loading 450px before reader reaches sentinel
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [viewMode, otherStories.length, articles.length, visibleCount]);

  if (articles.length === 0) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-zinc-400 font-headline text-lg">No dispatches match your query.</p>
        <button
          onClick={() => (onResetFilters ? onResetFilters() : window.location.reload())}
          className="text-xs font-mono text-zinc-300 underline underline-offset-4 cursor-pointer hover:text-white transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  // Compact The Wire View (Full-width high density chronological stream)
  if (viewMode === 'compact') {
    const compactArticles = articles.slice(0, visibleCount * 3);

    return (
      <div className="space-y-4 my-6">
        <div className="space-y-1 divide-y divide-[var(--border-line)] border-y border-[var(--border-line)]">
          {compactArticles.map((article, index) => {
            const title = article.title[currentLang] || article.title.en;
            const timeAgo = formatRelativeTime(article.publishedAt, currentLang);

            return (
              <React.Fragment key={article.id}>
                <div
                  onClick={() => onOpenQuickRead(article)}
                  className="group py-3 px-2 flex items-baseline justify-between gap-4 cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors"
                >
                  <div className="flex items-baseline gap-4 flex-1">
                    <span className="font-mono text-xs text-[var(--text-muted)] flex-shrink-0" suppressHydrationWarning>{timeAgo}</span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase flex-shrink-0 w-28 truncate">
                      {article.publisherName}
                    </span>
                    <h4
                      className={`text-sm sm:text-base text-[var(--text-main)] group-hover:text-rose-600 font-medium transition-colors ${
                        isSinhala ? 'font-sinhala' : ''
                      } ${isTamil ? 'font-tamil' : ''}`}
                    >
                      {title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {onToggleSave && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(article);
                        }}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                        title={savedArticleIds.includes(article.id) ? 'Remove bookmark' : 'Bookmark for later'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedArticleIds.includes(article.id) ? 'text-rose-500 fill-current' : ''}`} />
                      </button>
                    )}
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                  </div>
                </div>

                {/* In-feed programmatic ad slot every 15 compact stories */}
                {(index + 1) % 15 === 0 && index < compactArticles.length - 1 && (
                  <div className="py-4">
                    <AdBanner
                      format="infeed"
                      slotId={`infeed-compact-ad-${Math.floor((index + 1) / 15)}`}
                      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Compact Auto-load Sentinel */}
        {hasMoreCompact && (
          <div ref={compactSentinelRef} className="pt-6 pb-2 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Auto-loading chronological stream...</span>
            </div>
            <div>
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline underline-offset-4 cursor-pointer"
              >
                Load immediately ({articles.length - compactArticles.length} remaining)
              </button>
            </div>
          </div>
        )}

        {!hasMoreCompact && articles.length > 15 && (
          <div className="pt-8 pb-4 text-center border-t border-white/[0.06] mt-4">
            <p className="text-xs font-mono text-zinc-500">
              ✓ All {articles.length} dispatches loaded · 24/7 Colombo Wire up to date
            </p>
          </div>
        )}
      </div>
    );
  }

  const gridStories = otherStories.slice(0, visibleCount);
  const wireStories = otherStories.slice(0, 16);

  return (
    <div className="space-y-8">
      {/* 1. Interactive Headline Story Slider */}
      {headlineStories.length > 0 && (
        <HeadlineSlider
          articles={headlineStories}
          currentLang={currentLang}
          onOpenQuickRead={onOpenQuickRead}
        />
      )}

      {/* 2. Leaderboard Ad Placement (Clean, Reserved) */}
      <AdBanner
        format="leaderboard"
        slotId="broadsheet-top-ad"
      />

      {/* 3. Main Broadsheet Split: Grid Stories (Left) & The Wire (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Primary Story Cards (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gridStories.map((article, index) => (
              <React.Fragment key={article.id}>
                <NewsCard
                  article={article}
                  currentLang={currentLang}
                  onOpenQuickRead={onOpenQuickRead}
                  variant="standard"
                  isSaved={savedArticleIds.includes(article.id)}
                  onToggleSave={onToggleSave}
                />

                {/* In-feed Ad Banner after every 8 articles (Spans both columns) */}
                {(index + 1) % 8 === 0 && index < gridStories.length - 1 && (
                  <div className="col-span-1 sm:col-span-2 my-2">
                    <AdBanner
                      format="infeed"
                      slotId={`infeed-grid-ad-${Math.floor((index + 1) / 8)}`}
                      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Broadsheet Infinite Scroll Auto-load Sentinel */}
          {hasMoreBroadsheet && (
            <div ref={sentinelRef} className="pt-6 pb-2 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Auto-loading next dispatches...</span>
              </div>
              <div>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline underline-offset-4 cursor-pointer"
                >
                  Load immediately ({otherStories.length - visibleCount} remaining)
                </button>
              </div>
            </div>
          )}

          {!hasMoreBroadsheet && otherStories.length > 8 && (
            <div className="pt-8 pb-4 text-center border-t border-white/[0.06] mt-4">
              <p className="text-xs font-mono text-zinc-500">
                ✓ All {articles.length} dispatches loaded · 24/7 Colombo Wire up to date
              </p>
            </div>
          )}
        </div>

        {/* Right Rail: Prediction Tracker & The Live Wire Column (4 Columns) */}
        <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[var(--border-line)] lg:pl-8 space-y-6">
          {/* Community Sentiment & Prediction Radar */}
          <PredictionTracker currentLang={currentLang} />

          {/* The Colombo Wire Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-line)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  The Colombo Wire
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Continuous Stream</span>
            </div>

            <div className="divide-y divide-[var(--border-line)] space-y-3">
              {wireStories.map((article) => {
                const title = article.title[currentLang] || article.title.en;
                const timeAgo = formatRelativeTime(article.publishedAt, currentLang);
                return (
                  <div
                    key={article.id}
                    onClick={() => onOpenQuickRead(article)}
                    className="pt-3 group cursor-pointer space-y-1.5 transition-transform duration-200 hover:translate-x-1"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[var(--text-body)]">{article.publisherName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-line)]">
                          {article.region === 'world' ? '🌐 World' : '🇱🇰 SL'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-sans" suppressHydrationWarning>
                        {timeAgo}
                      </span>
                    </div>
                    <h4
                      className={`text-sm font-semibold text-[var(--text-main)] group-hover:text-black dark:group-hover:text-white group-hover:underline underline-offset-2 transition-colors line-clamp-2 leading-snug ${
                        isSinhala ? 'font-sinhala' : ''
                      } ${isTamil ? 'font-tamil' : ''}`}
                    >
                      {title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar MREC Ad Unit */}
          <div className="pt-6">
            <AdBanner
              format="mrec"
              slotId="sidebar-mrec-ad"
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
