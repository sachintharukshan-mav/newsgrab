'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article, Language } from '@/lib/types';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowUpRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/time-utils';

interface HeadlineSliderProps {
  articles: Article[];
  currentLang: Language;
  onOpenQuickRead: (article: Article) => void;
}

const sliderLabels = {
  topHeadline: { en: 'Top Headline', si: 'ප්‍රධාන පුවත', ta: 'முக்கிய தலைப்பு' },
  urgent: { en: 'Breaking Alert', si: 'උණුසුම් පුවත්', ta: 'முக்கிய செய்தி' },
  readBriefing: { en: 'Read Full Report', si: 'සම්පූර්ණ වාර්තාව', ta: 'முழு அறிக்கை' },
  independent: { en: 'Verified Wire Report', si: 'තහවුරු කළ පුවත', ta: 'சரிபார்க்கப்பட்ட செய்தி' },
  coveredBy: { en: 'Covered by', si: 'ආවරණය කළ මාධ්‍ය:', ta: 'செய்தியளித்தவை:' },
  compare: { en: 'Compare perspectives', si: 'මත සංසන්දනය', ta: 'பார்வைகளை ஒப்பிடு' },
  previous: { en: 'Previous story', si: 'පෙර පුවත', ta: 'முந்தைய செய்தி' },
  next: { en: 'Next story', si: 'මීළඟ පුවත', ta: 'அடுத்த செய்தி' },
  pause: { en: 'Pause slideshow', si: 'නවත්වන්න', ta: 'இடைநிறுத்து' },
  play: { en: 'Play slideshow', si: 'ධාවනය කරන්න', ta: 'இயக்கு' },
  leadDispatches: { en: 'Lead Dispatches', si: 'ප්‍රමුඛ පුවත් පෙළ', ta: 'முக்கிய செய்திகள்' },
};

export const HeadlineSlider: React.FC<HeadlineSliderProps> = ({
  articles,
  currentLang,
  onOpenQuickRead,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const total = articles.length;
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  const safeIndex = total > 0 ? (currentIndex >= total ? 0 : currentIndex) : 0;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automated 6.5s carousel rotation
  useEffect(() => {
    if (total <= 1 || isPaused || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6500);

    return () => clearInterval(timer);
  }, [total, isPaused, isHovered, handleNext]);

  // Keyboard navigation when slider is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) return null;

  return (
    <section
      ref={sliderRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Headline Stories Carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full rounded-xl bg-[#0f1015] border border-white/[0.08] shadow-2xl overflow-hidden focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all duration-300 mb-8"
    >
      {/* Top Subtle Header Bar with Carousel Label & Controls */}
      <div className="px-5 py-3 border-b border-white/[0.06] bg-[#0b0c0f] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-zinc-200">
            {sliderLabels.leadDispatches[currentLang]}
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            {safeIndex + 1} of {total}
          </span>
        </div>

        {total > 1 && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Play/Pause Toggle */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? sliderLabels.play[currentLang] : sliderLabels.pause[currentLang]}
              className="p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              title={isPaused ? sliderLabels.play[currentLang] : sliderLabels.pause[currentLang]}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-rose-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Slide Index Pill */}
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-300 text-[11px] font-mono sm:hidden">
              {safeIndex + 1}/{total}
            </span>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              aria-label={sliderLabels.previous[currentLang]}
              className="p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label={sliderLabels.next[currentLang]}
              className="p-1.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Sliding Carousel Track */}
      <div className="relative overflow-hidden w-full">
        <div
          className="flex w-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {articles.map((article, idx) => {
            const title = article.title[currentLang] || article.title.en || article.title.si || article.title.ta || '';
            const summary = article.summary[currentLang] || article.summary.en || article.summary.si || article.summary.ta || '';
            const isCurrent = idx === safeIndex;

            return (
              <div
                key={article.id}
                className="w-full flex-shrink-0 p-5 sm:p-7 lg:p-8"
                aria-hidden={!isCurrent}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* Left Column: Headline Text, Metadata & CTA */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-4 order-2 lg:order-1">
                    <div className="space-y-3">
                      {/* Meta Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {article.isBreaking ? sliderLabels.urgent[currentLang] : sliderLabels.topHeadline[currentLang]}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-zinc-300">
                          {article.region === 'world' ? '🌐 World' : '🇱🇰 Sri Lanka'}
                        </span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-zinc-300 font-medium">{article.publisherName}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400 font-sans" suppressHydrationWarning>
                          {formatRelativeTime(article.publishedAt, currentLang)}
                        </span>
                      </div>

                      {/* Headline Title */}
                      <h2
                        onClick={() => onOpenQuickRead(article)}
                        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-headline leading-[1.2] hover:text-rose-300 transition-colors cursor-pointer ${
                          isSinhala ? 'font-sinhala leading-[1.4]' : ''
                        } ${isTamil ? 'font-tamil leading-[1.35]' : ''}`}
                      >
                        {title}
                      </h2>

                      {/* Summary Excerpt */}
                      <p
                        className={`text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3 ${
                          isSinhala ? 'font-sinhala leading-loose' : ''
                        } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
                      >
                        {summary}
                      </p>
                    </div>

                    {/* Footer Row: Cluster count & CTA button */}
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                      <div className="text-zinc-400 font-mono text-[11px]">
                        {article.clusterCount && article.clusterCount > 1 ? (
                          <span className="text-zinc-300 font-medium">
                            {sliderLabels.coveredBy[currentLang]} {article.clusterCount} · {sliderLabels.compare[currentLang]}
                          </span>
                        ) : (
                          <span>{sliderLabels.independent[currentLang]}</span>
                        )}
                      </div>

                      <button
                        onClick={() => onOpenQuickRead(article)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-all shadow-md shadow-rose-950/40 cursor-pointer flex-shrink-0"
                      >
                        <span>{sliderLabels.readBriefing[currentLang]}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Hero Visual */}
                  <div className="lg:col-span-5 order-1 lg:order-2">
                    {article.imageUrl && !article.imageUrl.includes('unsplash.com') ? (
                      <div
                        onClick={() => onOpenQuickRead(article)}
                        className="relative aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-900 border border-white/[0.08] cursor-pointer group/img shadow-lg"
                      >
                        <img
                          src={article.imageUrl}
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-full h-full object-cover grayscale-[10%] group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/90 pointer-events-none">
                          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 uppercase">
                            {article.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10">
                            {article.publisherName}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => onOpenQuickRead(article)}
                        className="relative aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#161822] via-[#0f1016] to-[#12141c] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between cursor-pointer shadow-lg group hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span className="uppercase text-rose-400 font-bold tracking-wider">{article.category}</span>
                          <span className="px-2.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">{article.publisherName}</span>
                        </div>
                        <div className="my-auto space-y-2">
                          <span className="text-rose-500 font-mono text-xs uppercase tracking-widest block font-semibold">Featured Wire Story</span>
                          <p className={`text-zinc-200 font-serif italic text-base sm:text-lg line-clamp-3 ${isSinhala ? 'font-sinhala not-italic leading-relaxed' : ''} ${isTamil ? 'font-tamil not-italic leading-relaxed' : ''}`}>
                            &ldquo;{summary}&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-3 border-t border-white/[0.06]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Verified Wire Dispatch
                          </span>
                          <span>{article.publisherName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Story Tabs / Indicator Pills */}
      {total > 1 && (
        <div className="px-5 py-3 border-t border-white/[0.06] bg-[#0b0c0f] flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 w-full">
            {articles.map((art, idx) => {
              const artTitle = art.title[currentLang] || art.title.en || '';
              const isActive = idx === safeIndex;

              return (
                <button
                  key={art.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-1 min-w-[50px] sm:min-w-[120px] text-left p-1.5 sm:p-2 rounded transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-white/[0.08] border-rose-500/50 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-white/[0.03] opacity-60 hover:opacity-90'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${artTitle}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-rose-500' : 'bg-zinc-600'
                      }`}
                    />
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold truncate">
                      {art.publisherName}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-medium truncate hidden sm:block">
                    {artTitle}
                  </p>
                  {/* Subtle active progress track */}
                  <div className="w-full h-0.5 bg-white/[0.06] rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isActive ? 'w-full bg-rose-500' : 'w-0'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
