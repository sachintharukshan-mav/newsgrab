'use client';

import { Category, Language, DateRange } from '@/lib/types';
import { LayoutGrid, List, Clock } from 'lucide-react';

interface CategoryNavProps {
  currentCategory: Category;
  onSelectCategory: (category: Category) => void;
  currentLang: Language;
  viewMode: 'bento' | 'compact';
  onToggleViewMode: (mode: 'bento' | 'compact') => void;
  dateRange?: DateRange;
  onSelectDateRange?: (range: DateRange) => void;
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

export const CategoryNav: React.FC<CategoryNavProps> = ({
  currentCategory,
  onSelectCategory,
  currentLang,
  viewMode,
  onToggleViewMode,
  dateRange = 'all',
  onSelectDateRange
}) => {
  const categories: Category[] = ['all', 'local', 'world', 'breaking', 'economy', 'politics', 'tech', 'sports'];

  return (
    <div className="w-full border-b border-white/[0.08] mb-8">
      <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-1">
        {/* Category Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {categories.map((cat) => {
            const isActive = currentCategory === cat;
            const label = categoryLabels[cat][currentLang];
            const isSinhala = currentLang === 'si';
            const isTamil = currentLang === 'ta';

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`py-2 text-xs uppercase tracking-wider font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                } ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Historical Date Range Scope & View Toggle */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08] flex-shrink-0">
          {/* Historical Date Range Filter Pills */}
          {onSelectDateRange && (
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] p-0.5 rounded border border-white/[0.08] text-[11px] font-mono">
              <Clock className="w-3 h-3 text-zinc-500 ml-1.5 mr-0.5" />
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
                          ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                          : 'bg-white/15 text-white font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
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
                viewMode === 'bento' ? 'text-white font-medium bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">Broadsheet</span>
            </button>
            <button
              onClick={() => onToggleViewMode('compact')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'compact' ? 'text-white font-medium bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs">The Wire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
