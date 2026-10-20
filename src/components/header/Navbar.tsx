'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, DateRange } from '@/lib/types';
import { Search, RefreshCw, X, Clock, Bookmark, Sun, Moon, Zap } from 'lucide-react';
import { isPowercutScheduleExpired } from '@/data/powercut-schedule';

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
  savedCount?: number;
  onOpenSavedDrawer?: () => void;
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
  timeRange1y: { en: 'Past Year', si: 'වසරක්', ta: '1 வருடம்' },
  saved: { en: 'Saved', si: 'සුරැකි', ta: 'சேமிக்கப்பட்டவை' },
  savedQueue: { en: 'Reading Queue', si: 'කියවීම් ලැයිස්තුව', ta: 'வாசிப்பு வரிசை' },
  powerCuts: { en: 'Power Cuts', si: 'විදුලි කප්පාදුව', ta: 'மின்வெட்டு' }
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
  onLogoClick,
  savedCount = 0,
  onOpenSavedDrawer
}) => {
  const [timeAgoStr, setTimeAgoStr] = useState<string>('Just now');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('newsgrab_theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
      } else {
        const isLight = document.documentElement.classList.contains('light');
        setTheme(isLight ? 'light' : 'dark');
      }
    } catch (e) {
      console.warn('Failed to read theme:', e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('newsgrab_theme', nextTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  };

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
    <header className="w-full border-b border-[var(--border-line)] bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
      {/* Top Editorial Metadata & Live Feed Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-[var(--border-line)] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[var(--text-body)]" suppressHydrationWarning>{currentDate}</span>
          <span className="hidden sm:inline text-[var(--text-faint)]">|</span>
          <span className="hidden sm:inline text-[var(--text-muted)]">{navbarTranslations.edition[currentLang]}</span>
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
            {/* Auto-Refresh Frequency Pill */}
            <span className="hidden md:inline-block text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-line)]">
              {navbarTranslations.autoCadence[currentLang]}
            </span>

            {/* Instant Manual Refresh Button */}
            {onManualRefresh && (
              <button
                onClick={onManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-[var(--text-body)] hover:text-[var(--text-main)] text-[10px] font-mono cursor-pointer transition-colors disabled:opacity-50"
                title="Click to fetch live updates immediately"
                aria-label="Refresh news feed"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
                <span>{isRefreshing ? navbarTranslations.refreshing[currentLang] : navbarTranslations.refresh[currentLang]}</span>
              </button>
            )}

            {/* Saved Reading List Button */}
            {onOpenSavedDrawer && (
              <button
                onClick={onOpenSavedDrawer}
                className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors cursor-pointer text-[10px] font-mono ${
                  savedCount > 0
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-300 font-semibold'
                    : 'bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border-[var(--border-line)] text-[var(--text-body)] hover:text-[var(--text-main)]'
                }`}
                title={navbarTranslations.savedQueue[currentLang]}
                aria-label="Open saved reading list"
              >
                <Bookmark className={`w-2.5 h-2.5 ${savedCount > 0 ? 'fill-current text-rose-500' : 'text-[var(--text-muted)]'}`} />
                <span>{navbarTranslations.saved[currentLang]}</span>
                {savedCount > 0 && (
                  <span className="px-1 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            {/* Power Cuts Live Utility Button (auto-hides at 00:00:00 on 22 October 2026) */}
            {!isPowercutScheduleExpired() && (
              <Link
                href="/powercut"
                className="flex items-center gap-1 px-2 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-semibold cursor-pointer transition-colors"
                title="CEB Power Cut Schedule & Interactive Area Map"
                aria-label="CEB Power Cut Schedule"
              >
                <Zap className="w-2.5 h-2.5 text-amber-500 fill-current animate-pulse" />
                <span>{navbarTranslations.powerCuts[currentLang]}</span>
              </Link>
            )}
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--text-muted)] font-mono text-[10px] uppercase">Edition:</span>
            <div className="flex items-center divide-x divide-[var(--border-line)] text-[11px] font-medium">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 transition-colors cursor-pointer ${
                  currentLang === 'en' ? 'text-[var(--text-main)] font-bold underline underline-offset-4 decoration-[var(--accent-crimson)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('si')}
                className={`px-2 py-0.5 font-sinhala transition-colors cursor-pointer ${
                  currentLang === 'si' ? 'text-[var(--text-main)] font-bold underline underline-offset-4 decoration-[var(--accent-crimson)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2 py-0.5 font-tamil transition-colors cursor-pointer ${
                  currentLang === 'ta' ? 'text-[var(--text-main)] font-bold underline underline-offset-4 decoration-[var(--accent-crimson)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Visual Theme Toggle (Night vs Broadsheet Paper) */}
            <div className="flex items-center pl-2 border-l border-[var(--border-line)]">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border-line)] hover:border-[var(--border-strong)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-body)] hover:text-[var(--text-main)] text-[11px] font-mono cursor-pointer transition-all shadow-sm"
                title={theme === 'dark' ? 'Switch to Classic Broadsheet (Light Mode)' : 'Switch to Warm Obsidian (Night Mode)'}
                aria-label="Toggle visual theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline font-medium">Paper</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-stone-700" />
                    <span className="hidden sm:inline font-medium">Night</span>
                  </>
                )}
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
            title="LANKA DISPATCH Front Page"
            aria-label="LANKA DISPATCH Front Page"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] font-headline uppercase">
              LANKA<span className="text-[var(--accent-crimson)]">DISPATCH</span>
            </h1>
          </Link>
          <p className="text-[11px] text-[var(--text-muted)] tracking-widest uppercase mt-0.5 font-mono">
            {navbarTranslations.tagline[currentLang]}
          </p>
        </div>

        {/* Editorial Search with Historical Date-Range Scope */}
        <div className="w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={navbarTranslations.searchPlaceholder[currentLang]}
              className="w-full pl-9 pr-8 py-2 bg-[var(--bg-card)] border border-[var(--border-line)] rounded-md text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5 cursor-pointer"
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
                className="appearance-none bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] rounded-md text-[11px] font-mono text-[var(--text-body)] py-2 pl-2.5 pr-6 focus:outline-none focus:border-[var(--border-strong)] transition-colors cursor-pointer"
                title="Filter dispatches by historical date range"
                aria-label="Historical Date Range Scope"
              >
                <option value="all" className="bg-[var(--dropdown-bg)] text-[var(--text-main)]">
                  {navbarTranslations.timeRangeAll[currentLang]}
                </option>
                <option value="24h" className="bg-[var(--dropdown-bg)] text-[var(--text-main)]">
                  {navbarTranslations.timeRange24h[currentLang]}
                </option>
                <option value="7d" className="bg-[var(--dropdown-bg)] text-[var(--text-main)]">
                  {navbarTranslations.timeRange7d[currentLang]}
                </option>
                <option value="30d" className="bg-[var(--dropdown-bg)] text-[var(--text-main)]">
                  {navbarTranslations.timeRange30d[currentLang]}
                </option>
                <option value="1y" className="bg-[var(--dropdown-bg)] text-[var(--accent-crimson)] font-semibold">
                  {navbarTranslations.timeRange1y[currentLang]}
                </option>
              </select>
              <Clock className="w-3 h-3 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Saved Reading Queue Icon Button */}
          {onOpenSavedDrawer && (
            <button
              onClick={onOpenSavedDrawer}
              className="relative p-2 rounded-md bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-[var(--text-body)] hover:text-[var(--text-main)] transition-colors cursor-pointer flex-shrink-0"
              title={navbarTranslations.savedQueue[currentLang]}
              aria-label="Open saved articles drawer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? 'fill-current text-rose-500' : 'text-[var(--text-muted)]'}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono flex items-center justify-center shadow-md">
                  {savedCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
