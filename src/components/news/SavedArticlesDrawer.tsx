'use client';

import React, { useEffect } from 'react';
import { Article, Language } from '@/lib/types';
import { Bookmark, X, Trash2, ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import { formatRelativeTime } from '@/lib/time-utils';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onRemoveArticle: (articleId: string) => void;
  onClearAll: () => void;
  onSelectArticle: (article: Article) => void;
  currentLang: Language;
}

const drawerLabels = {
  savedDispatches: {
    en: 'Saved Dispatches',
    si: 'සුරැකි පුවත්',
    ta: 'சேமிக்கப்பட்ட செய்திகள்'
  },
  readingList: {
    en: 'Personal Reading Queue',
    si: 'ඔබේ පෞද්ගලික කියවීම් ලැයිස්තුව',
    ta: 'தனிப்பட்ட வாசிப்பு வரிசை'
  },
  storiesCount: {
    en: 'stories saved locally',
    si: 'පුවත් සුරැකිව ඇත',
    ta: 'செய்திகள் சேமிக்கப்பட்டுள்ளன'
  },
  emptyTitle: {
    en: 'Your Reading Queue is Empty',
    si: 'සුරැකි පුවත් කිසිවක් නැත',
    ta: 'சேமிக்கப்பட்ட செய்திகள் எதுவும் இல்லை'
  },
  emptyDesc: {
    en: 'Tap the bookmark icon on any headline or briefing to save it here for offline or later reading.',
    si: 'පසුව කියවීම සඳහා ඕනෑම පුවතක ඇති Bookmark සලකුණ ඔබන්න.',
    ta: 'பின்னர் வாசிக்க எந்தவொரு செய்தியிலும் உள்ள புக்மார்க் ஐகானைத் தட்டவும்.'
  },
  readNow: {
    en: 'Read Dispatch',
    si: 'කියවන්න',
    ta: 'வாசிக்க'
  },
  clearAll: {
    en: 'Clear All',
    si: 'සියල්ල ඉවත් කරන්න',
    ta: 'அனைத்தையும் நீக்கு'
  },
  remove: {
    en: 'Remove',
    si: 'ඉවත් කරන්න',
    ta: 'நீக்கு'
  }
};

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onRemoveArticle,
  onClearAll,
  onSelectArticle,
  currentLang
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--bg-page)] border-l border-[var(--border-line)] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-line)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                <Bookmark className="w-4 h-4 fill-current" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] font-mono uppercase tracking-wider">
                  {drawerLabels.savedDispatches[currentLang]}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  {savedArticles.length} {drawerLabels.storiesCount[currentLang]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedArticles.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="px-2 py-1 rounded bg-[var(--bg-subtle)] hover:bg-rose-500/10 border border-[var(--border-line)] hover:border-rose-500/20 text-[10px] font-mono text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
                  title="Clear all saved articles"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{drawerLabels.clearAll[currentLang]}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-card)] border border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[var(--border-line)] space-y-4">
            {savedArticles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-line)] flex items-center justify-center text-[var(--text-muted)]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-main)] font-mono">
                  {drawerLabels.emptyTitle[currentLang]}
                </h4>
                <p className="text-xs text-[var(--text-muted)] max-w-xs leading-relaxed">
                  {drawerLabels.emptyDesc[currentLang]}
                </p>
              </div>
            ) : (
              savedArticles.map((article) => {
                const title = article.title[currentLang] || article.title.en;
                const relativeTime = formatRelativeTime(article.publishedAt, currentLang);
                const displayImage = article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={article.id}
                    className="pt-4 first:pt-0 group flex items-start gap-3 hover:bg-[var(--bg-card-hover)] p-2 rounded-lg transition-colors"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="relative w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-[var(--bg-card)] border border-[var(--border-line)] cursor-pointer"
                    >
                      <img
                        src={displayImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Meta & Headline */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] mb-1">
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">{article.category}</span>
                          <span className="text-[var(--text-faint)]">·</span>
                          <span className="truncate">{article.publisherName}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-[var(--text-main)] line-clamp-2 group-hover:text-black dark:group-hover:text-white group-hover:underline underline-offset-2 transition-colors leading-snug">
                          {title}
                        </h4>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between mt-2 pt-1 text-[10px] font-mono text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span suppressHydrationWarning>{relativeTime}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRemoveArticle(article.id)}
                            className="text-[var(--text-muted)] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title={drawerLabels.remove[currentLang]}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              onSelectArticle(article);
                              onClose();
                            }}
                            className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-0.5 font-medium transition-colors cursor-pointer"
                          >
                            <span>{drawerLabels.readNow[currentLang]}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
            <span>Lanka Dispatch Offline Dispatch Queue</span>
            <span>Local Cache · 0 Cloud Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};
