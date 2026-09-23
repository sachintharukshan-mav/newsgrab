'use client';

import React from 'react';
import { Article, Language } from '@/lib/types';
import { NewsCard } from './NewsCard';
import { HeadlineSlider } from './HeadlineSlider';
import { AdBanner } from '@/components/ads/AdBanner';
import { ArrowUpRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/time-utils';
import { PredictionTracker } from '@/components/widgets/PredictionTracker';

interface BentoGridProps {
  articles: Article[];
  currentLang: Language;
  onOpenQuickRead: (article: Article) => void;
  viewMode: 'bento' | 'compact';
  onResetFilters?: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  articles,
  currentLang,
  onOpenQuickRead,
  viewMode,
  onResetFilters
}) => {
  const [visibleCount, setVisibleCount] = React.useState<number>(10);

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

  const headlineCount = Math.min(5, articles.length);
  const headlineStories = articles.slice(0, headlineCount);
  const otherStories = articles.slice(headlineCount);
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  // Compact The Wire View (Full-width high density chronological stream)
  if (viewMode === 'compact') {
    const compactArticles = articles.slice(0, visibleCount * 3);

    return (
      <div className="space-y-4 my-6">
        <div className="space-y-1 divide-y divide-white/[0.06] border-y border-white/[0.08]">
          {compactArticles.map((article) => {
            const title = article.title[currentLang] || article.title.en;
            const timeAgo = formatRelativeTime(article.publishedAt, currentLang);

            return (
              <div
                key={article.id}
                onClick={() => onOpenQuickRead(article)}
                className="group py-3 px-2 flex items-baseline justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-baseline gap-4 flex-1">
                  <span className="font-mono text-xs text-zinc-400 flex-shrink-0" suppressHydrationWarning>{timeAgo}</span>
                  <span className="font-mono text-[11px] text-zinc-400 uppercase flex-shrink-0 w-28 truncate">
                    {article.publisherName}
                  </span>
                  <h4
                    className={`text-sm sm:text-base text-zinc-200 group-hover:text-white font-medium transition-colors ${
                      isSinhala ? 'font-sinhala' : ''
                    } ${isTamil ? 'font-tamil' : ''}`}
                  >
                    {title}
                  </h4>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" />
              </div>
            );
          })}
        </div>

        {articles.length > compactArticles.length && (
          <div className="pt-4 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 15)}
              className="px-6 py-2.5 rounded bg-white/[0.05] hover:bg-white/10 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 hover:text-white transition-all border border-white/[0.08] cursor-pointer"
            >
              Load More Dispatches ({articles.length - compactArticles.length} remaining)
            </button>
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
        sponsorName="Commercial Bank of Ceylon"
      />

      {/* 3. Main Broadsheet Split: Grid Stories (Left) & The Wire (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Primary Story Cards (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gridStories.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                currentLang={currentLang}
                onOpenQuickRead={onOpenQuickRead}
                variant="standard"
              />
            ))}
          </div>

          {/* Load More Button for Broadsheet Grid */}
          {otherStories.length > visibleCount && (
            <div className="pt-6 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-8 py-3 rounded bg-[#15171e] hover:bg-white/10 text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 hover:text-white transition-all border border-white/[0.08] shadow-sm cursor-pointer"
              >
                Load 10 More Dispatches ({otherStories.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>

        {/* Right Rail: Prediction Tracker & The Live Wire Column (4 Columns) */}
        <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-8 space-y-6">
          {/* Community Sentiment & Prediction Radar */}
          <PredictionTracker currentLang={currentLang} />

          {/* The Colombo Wire Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
                  The Colombo Wire
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Continuous Stream</span>
            </div>

          <div className="divide-y divide-white/[0.06] space-y-3">
            {wireStories.map((article) => {
              const title = article.title[currentLang] || article.title.en;
              const timeAgo = formatRelativeTime(article.publishedAt, currentLang);
              return (
                <div
                  key={article.id}
                  onClick={() => onOpenQuickRead(article)}
                  className="pt-3 group cursor-pointer space-y-1.5 transition-transform duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-zinc-300">{article.publisherName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04]">
                        {article.region === 'world' ? '🌐 World' : '🇱🇰 SL'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-sans" suppressHydrationWarning>
                      {timeAgo}
                    </span>
                  </div>
                  <h4
                    className={`text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-2 leading-snug ${
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
              sponsorName="Sri Lanka Telecom"
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
