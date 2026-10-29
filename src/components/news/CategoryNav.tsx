'use client';

import React from 'react';
import Link from 'next/link';
import { Category, Language, DateRange } from '@/lib/types';
import { TOPIC_HUBS } from '@/lib/topics';
import { LayoutGrid, List, Clock, Compass } from 'lucide-react';

interface CategoryNavProps {
  currentCategory: Category;
  onSelectCategory?: (category: Category) => void;
  currentLang: Language;
  viewMode: 'bento' | 'compact';
  onToggleViewMode: (mode: 'bento' | 'compact') => void;
  dateRange?: DateRange;
  onSelectDateRange?: (range: DateRange) => void;
  activeTopicSlug?: string;
  preferRouteNavigation?: boolean;
}

const categoryLabels: Record<Category, Record<Language, string>> = {
  all: { en: 'Front Page', si: 'මුල් පිටුව', ta: 'முகப்பு' },
  local: { en: '🇱🇰 Sri Lanka', si: '🇱🇰 ශ්‍රී ලංකාව', ta: '🇱🇰 இலங்கை' },
  world: { en: '🌐 World', si: '🌐 ලෝකය', ta: '🌐 உலகம்' },
  breaking: { en: 'Breaking Dispatches', si: 'උණුසුම් පුවත්', ta: 'முக்கிய செய்திகள்' },
  economy: { en: 'Economy & Markets', si: 'ආර්ථිකය & වෙළඳපොළ', ta: 'பொருளாதாரம் & சந்தை' },
  politics: { en: 'National Politics', si: 'දේශපාලනය', ta: 'அரசியல்' },
  tech: { en: 'Technology', si: 'තාක්ෂණය', ta: 'தொழில்நுட்பம்' },
  sports: { en: 'Cricket & Sports', si: 'ක්‍රීඩා', ta: 'விளையாட்டு' },
};

const topicHubHeaderLabel: Record<Language, string> = {
  en: 'Topic Hubs:',
  si: 'විශේෂ මාතෘකා:',
  ta: 'முக்கிய தலைப்புகள்:',
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  currentCategory,
  onSelectCategory,
  currentLang,
  viewMode,
  onToggleViewMode,
  dateRange = 'all',
  onSelectDateRange,
  activeTopicSlug,
  preferRouteNavigation = false,
}) => {
  const categories: Category[] = ['all', 'local', 'world', 'breaking', 'economy', 'politics', 'tech', 'sports'];
  const topicList = Object.values(TOPIC_HUBS);
  const langPrefix = currentLang === 'si' ? '/si' : currentLang === 'ta' ? '/ta' : '';
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  return (
    <div className="w-full mb-6 space-y-2">
      <div className="w-full border-b border-[var(--border-line)]">
        <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-1">
          {/* Category Navigation Links (Crawlable <Link> elements for SEO & Section Discovery) */}
          <nav aria-label="Section Navigation" className="flex items-center gap-6 sm:gap-8">
            {categories.map((cat) => {
              const isActive = !activeTopicSlug && currentCategory === cat;
              const label = categoryLabels[cat][currentLang];
              const href = cat === 'all' ? (langPrefix || '/') : `${langPrefix}/category/${cat}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  onClick={(e) => {
                    if (
                      onSelectCategory &&
                      !preferRouteNavigation &&
                      !e.metaKey &&
                      !e.ctrlKey &&
                      !e.shiftKey &&
                      e.button === 0
                    ) {
                      e.preventDefault();
                      onSelectCategory(cat);
                    }
                  }}
                  className={`py-2 text-xs uppercase tracking-wider font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[var(--text-main)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  } ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-crimson)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Historical Date Range Scope & View Toggle */}
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-line)] flex-shrink-0">
            {/* Historical Date Range Filter Pills */}
            {onSelectDateRange && (
              <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-subtle)] p-0.5 rounded border border-[var(--border-line)] text-[11px] font-mono">
                <Clock className="w-3 h-3 text-[var(--text-muted)] ml-1.5 mr-0.5" />
                {(['all', '24h', '7d', '30d', '1y'] as DateRange[]).map((range) => {
                  const isActive = dateRange === range;
                  const label =
                    range === 'all'
                      ? (currentLang === 'si' ? 'සියල්ල' : currentLang === 'ta' ? 'அனைத்தும்' : 'All')
                      : range;

                  return (
                    <button
                      key={range}
                      onClick={() => onSelectDateRange(range)}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        isActive
                          ? range === '1y'
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold border border-rose-500/30'
                            : 'bg-[var(--bg-card)] text-[var(--text-main)] font-bold shadow-sm border border-[var(--border-line)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                      title={`Filter by ${range === 'all' ? 'All Time' : range}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleViewMode('bento')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'bento' ? 'text-[var(--text-main)] font-medium bg-[var(--bg-card)] border border-[var(--border-line)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs">Broadsheet</span>
              </button>
              <button
                onClick={() => onToggleViewMode('compact')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                  viewMode === 'compact' ? 'text-[var(--text-main)] font-medium bg-[var(--bg-card)] border border-[var(--border-line)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-xs">The Wire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Intelligence Hubs Bar (Evergreen SEO & AEO Hub Links) */}
      <nav
        aria-label="Topic Intelligence Hubs"
        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 text-[11px] font-mono"
      >
        <span className={`inline-flex items-center gap-1 text-[var(--text-muted)] font-semibold uppercase tracking-wider shrink-0 mr-1 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
          <Compass className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
          {topicHubHeaderLabel[currentLang]}
        </span>
        {topicList.map((topic) => {
          const isTopicActive = activeTopicSlug === topic.slug;
          const href = `${langPrefix}/topic/${topic.slug}`;
          return (
            <Link
              key={topic.slug}
              href={href}
              className={`px-2.5 py-1 rounded border transition-all whitespace-nowrap shrink-0 ${
                isTopicActive
                  ? 'bg-[var(--text-main)] text-[var(--bg-page)] border-[var(--text-main)] font-bold shadow-xs'
                  : 'bg-[var(--bg-card)] text-[var(--text-body)] border-[var(--border-line)] hover:border-[var(--text-main)] hover:text-[var(--text-main)]'
              } ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}
            >
              {topic.shortLabel[currentLang]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
