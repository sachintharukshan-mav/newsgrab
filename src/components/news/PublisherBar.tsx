'use client';

import React from 'react';
import { Newspaper } from 'lucide-react';

interface PublisherBarProps {
  selectedPublisher: string;
  onSelectPublisher: (publisher: string) => void;
  publisherCounts: Record<string, number>;
  totalCount: number;
  currentLang?: 'en' | 'si' | 'ta';
}

const pubLabels = {
  newsrooms: {
    en: 'Newsrooms:',
    si: 'ප්‍රවෘත්ති කාමර:',
    ta: 'செய்தியறைகள்:'
  },
  allOutlets: {
    en: 'All Outlets',
    si: 'සියලු මාධ්‍ය',
    ta: 'அனைத்து ஊடகங்கள்'
  }
};

export const PublisherBar: React.FC<PublisherBarProps> = ({
  selectedPublisher,
  onSelectPublisher,
  publisherCounts,
  totalCount,
  currentLang = 'en'
}) => {
  const publishers = Object.keys(publisherCounts).sort((a, b) => (publisherCounts[b] || 0) - (publisherCounts[a] || 0));

  return (
    <div className="w-full pb-3 mb-6 border-b border-[var(--border-line)]">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mr-2 flex-shrink-0">
          <Newspaper className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="uppercase tracking-wider font-semibold text-[11px]">{pubLabels.newsrooms[currentLang]}</span>
        </div>

        {/* All Newsrooms Pill */}
        <button
          onClick={() => onSelectPublisher('all')}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 cursor-pointer flex items-center gap-1.5 ${
            selectedPublisher === 'all'
              ? 'bg-[var(--accent-crimson)] text-white font-bold shadow-sm'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)]'
          }`}
        >
          <span>{pubLabels.allOutlets[currentLang]}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            selectedPublisher === 'all' ? 'bg-black/30 text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
          }`}>
            {totalCount}
          </span>
        </button>

        {/* Individual Publishers */}
        {publishers.map((pub) => {
          const count = publisherCounts[pub] || 0;
          const isSelected = selectedPublisher.toLowerCase() === pub.toLowerCase();

          return (
            <button
              key={pub}
              onClick={() => onSelectPublisher(pub)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[var(--accent-crimson)] text-white font-bold shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)]'
              }`}
            >
              <span>{pub}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-black/30 text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
