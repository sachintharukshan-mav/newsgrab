'use client';

import React from 'react';
import { Article, Language } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/time-utils';

interface NewsCardProps {
  article: Article;
  currentLang: Language;
  onOpenQuickRead: (article: Article) => void;
  variant?: 'lead' | 'standard' | 'minimal';
}

const cardLabels = {
  urgent: { en: 'Urgent Dispatch', si: 'උණුසුම් පුවත්', ta: 'முக்கிய செய்தி' },
  readBriefing: { en: 'Read briefing', si: 'සම්පූර්ණ පුවත', ta: 'முழு விவரம்' },
  brief: { en: 'Brief', si: 'සාරාංශය', ta: 'சுருக்கம்' },
  independent: { en: 'Independent Reporting', si: 'ස්වාධීන වාර්තාකරණය', ta: 'சுயாதீன அறிக்கை' },
  coveredBy: { en: 'Covered by', si: 'ආවරණය කළ මාධ්‍ය:', ta: 'செய்தியளித்தவை:' },
  compare: { en: 'Compare perspectives', si: 'මත සංසන්දනය', ta: 'பார்வைகளை ஒப்பிடு' }
};

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  currentLang,
  onOpenQuickRead,
  variant = 'standard'
}) => {
  const title = article.title[currentLang] || article.title.en || article.title.si || article.title.ta || '';
  const summary = article.summary[currentLang] || article.summary.en || article.summary.si || article.summary.ta || '';
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';
  const relativeTime = formatRelativeTime(article.publishedAt, currentLang);
  const isAuthenticPhoto = Boolean(article.imageUrl && !article.imageUrl.includes('unsplash.com'));
  const displayImage = article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && article.sourceUrl && !article.sourceUrl.startsWith('#')) {
      const cacheKey = `ng_cached_${article.id}_${currentLang}`;
      if (!sessionStorage.getItem(cacheKey)) {
        sessionStorage.setItem(cacheKey, '1');
        const params = new URLSearchParams({
          url: article.sourceUrl,
          lang: currentLang,
          cachedOnly: 'true'
        });
        fetch(`/api/synthesize?${params.toString()}`).catch(() => {});
      }
    }
  };

  // Lead Front-Page Story (Broadsheet Hero)
  if (variant === 'lead') {
    return (
      <article
        onClick={() => onOpenQuickRead(article)}
        onMouseEnter={handleMouseEnter}
        className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-8 mb-8 border-b border-white/[0.08]"
      >
        {/* Left Headline & Analysis (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-mono">
              <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] font-mono text-zinc-300">
                {article.region === 'world' ? '🌐 World' : '🇱🇰 Sri Lanka'}
              </span>
              <span className="text-rose-500 font-bold">
                {article.isBreaking ? cardLabels.urgent[currentLang] : article.category}
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 font-medium">{article.publisherName}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-sans" suppressHydrationWarning>{relativeTime}</span>
            </div>

            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-headline leading-[1.2] group-hover:text-zinc-200 transition-colors ${
                isSinhala ? 'font-sinhala leading-[1.35]' : ''
              } ${isTamil ? 'font-tamil leading-[1.3]' : ''}`}
            >
              {title}
            </h2>

            <p
              className={`text-sm sm:text-base text-zinc-300 leading-relaxed ${
                isSinhala ? 'font-sinhala leading-loose' : ''
              } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
            >
              {summary}
            </p>
          </div>

          {/* Perspective & Byline Footer */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              {article.clusterCount && article.clusterCount > 1 ? (
                <span className="text-zinc-300 font-medium">
                  {cardLabels.coveredBy[currentLang]} {article.clusterCount} · {cardLabels.compare[currentLang]}
                </span>
              ) : (
                <span>{cardLabels.independent[currentLang]}</span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-white font-medium text-xs transition-colors">
              <span>{cardLabels.readBriefing[currentLang]}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Right Feature Visual (5 cols) */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-zinc-900 border border-white/[0.08]">
            <img
              src={displayImage}
              alt={title}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('unsplash.com')) {
                  target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/90 pointer-events-none">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {isAuthenticPhoto ? `Wire Photo · ${article.publisherName}` : `${article.category.toUpperCase()} Wire`}
              </span>
              <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 uppercase">
                {article.category}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Editorial Card (Magazine Grid)
  return (
    <article
      onClick={() => onOpenQuickRead(article)}
      onMouseEnter={handleMouseEnter}
      className="group cursor-pointer flex flex-col justify-between editorial-card p-4 rounded-lg bg-[#111216] border border-white/[0.06] hover:border-white/[0.16] hover:bg-[#13141a] transition-all duration-300"
    >
      <div className="space-y-3">
        {/* Editorial Photography */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-zinc-900 border border-white/[0.04]">
          <img
            src={displayImage}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash.com')) {
                target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-white/90 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 truncate max-w-[70%]">
              {isAuthenticPhoto ? article.publisherName : `${article.category} topic`}
            </span>
            <span className="uppercase text-rose-400 font-bold px-1.5 py-0.5 rounded bg-black/70 border border-white/10">
              {article.category}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-zinc-300">
              {article.region === 'world' ? '🌐 World' : '🇱🇰 Sri Lanka'}
            </span>
            <span className="text-zinc-300 font-medium">{article.publisherName}</span>
          </div>
          <span suppressHydrationWarning>{relativeTime}</span>
        </div>

        {/* Headline */}
        <h3
          className={`text-base sm:text-lg font-bold text-zinc-100 font-headline leading-snug group-hover:text-white transition-colors line-clamp-3 ${
            isSinhala ? 'font-sinhala leading-[1.3]' : ''
          } ${isTamil ? 'font-tamil leading-[1.28]' : ''}`}
        >
          {title}
        </h3>

        {/* Summary Snippet */}
        <p
          className={`text-xs text-zinc-400 line-clamp-2 leading-relaxed ${
            isSinhala ? 'font-sinhala leading-normal' : ''
          } ${isTamil ? 'font-tamil leading-normal' : ''}`}
        >
          {summary}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span className="capitalize">{article.category}</span>
        <span className="group-hover:text-white transition-colors flex items-center gap-0.5">
          <span>{cardLabels.brief[currentLang]}</span>
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </article>
  );
};
