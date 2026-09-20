'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, DateRange } from '@/lib/types';
import { Search, RefreshCw, X, Clock } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  onManualRefresh?: () => void;
  onLogoClick?: () => void;
}

const navbarTranslations = {
  edition: {
    en: 'Colombo & Diaspora Edition',
    si: 'කොළඹ සහ ඩයස්පෝරා සංස්කරණය',
    ta: 'கொழும்பு & புலம்பெயர் பதிப்பு'
  },
  tagline: {
    en: "Sri Lanka's Independent Intelligence & News Aggregator",
    si: "ශ්‍රී ලංකාවේ ස්වාධීන බුද්ධි සහ පුවත් සම්පිණ්ඩනය",
    ta: "இலங்கையின் சுதந்திரமான செய்தித் தொகுப்பு"
  },
  searchPlaceholder: {
    en: 'Search dispatches & coverage...',
    si: 'පුවත් සහ තොරතුරු සොයන්න...',
    ta: 'செய்திகளைத் தேடுங்கள்...'
  },
  liveFeed: {
    en: 'Live Feed',
    si: 'සජීවී පුවත්',
    ta: 'நேரலை'
  },
  refresh: {
    en: 'Refresh',
    si: 'යාවත්කාලීන',
    ta: 'புதுப்பி'
  },
  refreshing: {
    en: 'Syncing...',
    si: 'යාවත්කාලීන වෙමින්...',
    ta: 'புதுப்பிக்கப்படுகிறது...'
  },
  autoCadence: {
    en: 'Auto: 90s',
    si: 'ස්වයංක්‍රීය: තත් 90',
    ta: 'தானியங்கி: 90வி'
  },
  justNow: {
    en: 'Just now',
    si: 'දැන්',
    ta: 'இப்போது'
  },
  timeRangeAll: { en: 'All Time', si: 'සියල්ල', ta: 'அனைத்தும்' },
  timeRange24h: { en: 'Past 24h', si: 'පැය 24', ta: '24 மணி' },
  timeRange7d: { en: 'Past 7d', si: 'දින 7', ta: '7 நாட்கள்' },
  timeRange30d: { en: 'Past 30d', si: 'දින 30', ta: '30 நாட்கள்' },
  timeRange1y: { en: 'Past Year', si: 'වසරක්', ta: '1 வருடம்' }
};

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  dateRange = 'all',
  onDateRangeChange,
  lastUpdated = new Date(),
  isRefreshing = false,
  onManualRefresh,
  onLogoClick
}) => {
  const [timeAgoStr, setTimeAgoStr] = useState<string>('Just now');

  useEffect(() => {
    const updateRelativeTime = () => {
      const diffSecs = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (diffSecs < 15) {
        setTimeAgoStr(navbarTranslations.justNow[currentLang]);
      } else if (diffSecs < 60) {
        setTimeAgoStr(`${diffSecs}s ago`);
      } else {
        const mins = Math.floor(diffSecs / 60);
        setTimeAgoStr(`${mins}m ago`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 5000);
    return () => clearInterval(interval);
  }, [lastUpdated, currentLang]);

  const currentDate = new Date().toLocaleDateString(
    currentLang === 'si' ? 'si-LK' : (currentLang === 'ta' ? 'ta-LK' : 'en-GB'),
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  );

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#0b0c0e]">
      {/* Top Editorial Metadata & Live Feed Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="font-mono text-zinc-300" suppressHydrationWarning>{currentDate}</span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">{navbarTranslations.edition[currentLang]}</span>
        </div>

        {/* Live Status + Update Frequency + Language Selector */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Live Update Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold tracking-wide uppercase">{navbarTranslations.liveFeed[currentLang]}</span>
              <span className="text-emerald-700">·</span>
              <span className="text-emerald-300 font-sans" suppressHydrationWarning>{timeAgoStr}</span>
            </div>

            {/* Auto-Refresh Frequency Pill */}
            <span className="hidden md:inline-block text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              {navbarTranslations.autoCadence[currentLang]}
            </span>

            {/* Instant Manual Refresh Button */}
            {onManualRefresh && (
              <button
                onClick={onManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 text-[10px] font-mono cursor-pointer transition-colors disabled:opacity-50"
                title="Click to fetch live updates immediately"
                aria-label="Refresh news feed"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
                <span>{isRefreshing ? navbarTranslations.refreshing[currentLang] : navbarTranslations.refresh[currentLang]}</span>
              </button>
            )}
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono text-[10px] uppercase">Edition:</span>
            <div className="flex items-center divide-x divide-white/10 text-[11px] font-medium">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 transition-colors cursor-pointer ${
                  currentLang === 'en' ? 'text-white font-bold underline underline-offset-4 decoration-rose-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('si')}
                className={`px-2 py-0.5 font-sinhala transition-colors cursor-pointer ${
                  currentLang === 'si' ? 'text-white font-bold underline underline-offset-4 decoration-rose-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2 py-0.5 font-tamil transition-colors cursor-pointer ${
                  currentLang === 'ta' ? 'text-white font-bold underline underline-offset-4 decoration-rose-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Newspaper Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link
            href="/"
            onClick={() => {
              if (onLogoClick) onLogoClick();
            }}
            className="inline-block group cursor-pointer transition-opacity hover:opacity-90"
            title="NEWSGRAB Front Page"
            aria-label="NEWSGRAB Front Page"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-headline uppercase">
              NEWS<span className="text-rose-500">GRAB</span>
            </h1>
          </Link>
          <p className="text-[11px] text-zinc-400 tracking-widest uppercase mt-0.5 font-mono">
            {navbarTranslations.tagline[currentLang]}
          </p>
        </div>

        {/* Editorial Search with Historical Date-Range Scope */}
        <div className="w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={navbarTranslations.searchPlaceholder[currentLang]}
              className="w-full pl-9 pr-8 py-2 bg-white/[0.04] border border-white/10 rounded-md text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Historical Date Scope Dropdown */}
          {onDateRangeChange && (
            <div className="relative flex-shrink-0">
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-md text-[11px] font-mono text-zinc-300 py-2 pl-2.5 pr-6 focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                title="Filter dispatches by historical date range"
                aria-label="Historical Date Range Scope"
              >
                <option value="all" className="bg-[#111216] text-zinc-300">
                  {navbarTranslations.timeRangeAll[currentLang]}
                </option>
                <option value="24h" className="bg-[#111216] text-zinc-300">
                  {navbarTranslations.timeRange24h[currentLang]}
                </option>
                <option value="7d" className="bg-[#111216] text-zinc-300">
                  {navbarTranslations.timeRange7d[currentLang]}
                </option>
                <option value="30d" className="bg-[#111216] text-zinc-300">
                  {navbarTranslations.timeRange30d[currentLang]}
                </option>
                <option value="1y" className="bg-[#111216] text-rose-400 font-semibold">
                  {navbarTranslations.timeRange1y[currentLang]}
                </option>
              </select>
              <Clock className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
