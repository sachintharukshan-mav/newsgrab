'use client';

import React, { useState } from 'react';
import { Article, Language, SourcePerspective } from '@/lib/types';
import { ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Scale, Radio, Newspaper, Globe } from 'lucide-react';

interface CoverageDistributionBarProps {
  article: Article;
  currentLang: Language;
  variant?: 'compact' | 'full';
}

export type PublisherCategory = 'broadcast' | 'print' | 'wire';

export interface PublisherMetadata {
  category: PublisherCategory;
  label: Record<Language, string>;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Radio;
}

export const publisherCategories: Record<PublisherCategory, PublisherMetadata> = {
  broadcast: {
    category: 'broadcast',
    label: {
      en: 'Major Broadcaster',
      si: 'ප්‍රධාන විකාශක',
      ta: 'பிரதான ஊடகம்'
    },
    color: 'text-sky-400',
    bgColor: 'bg-sky-500',
    borderColor: 'border-sky-500/30',
    icon: Radio
  },
  print: {
    category: 'print',
    label: {
      en: 'Independent Broadsheet',
      si: 'ස්වාධීන පුවත්පත්',
      ta: 'சுயாதீன பத்திரிகை'
    },
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    icon: Newspaper
  },
  wire: {
    category: 'wire',
    label: {
      en: 'International / Financial Wire',
      si: 'ජාත්‍යන්තර / ආර්ථික පුවත්',
      ta: 'சர்வதேச / பொருளாதார செய்தி'
    },
    color: 'text-amber-400',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
    icon: Globe
  }
};

export function classifyPublisher(publisherName: string): PublisherCategory {
  const name = publisherName.toLowerCase();
  if (name.includes('derana') || name.includes('hiru') || name.includes('itn') || name.includes('slrc') || name.includes('sirasa') || name.includes('swarnavahini')) {
    return 'broadcast';
  }
  if (name.includes('mirror') || name.includes('times') || name.includes('virakesari') || name.includes('mawbima') || name.includes('island') || name.includes('dinamina') || name.includes('ceylon today')) {
    return 'print';
  }
  if (name.includes('bbc') || name.includes('economynext') || name.includes('reuters') || name.includes('ft') || name.includes('afp') || name.includes('bloomberg')) {
    return 'wire';
  }
  return 'print';
}

const translations = {
  coverageSpectrum: {
    en: 'Newsroom Coverage Spectrum',
    si: 'පුවත්පත් ආවරණ විෂය පථය',
    ta: 'செய்தியறை கவரேஜ் ஸ்பெக்ட்ரம்'
  },
  verifiedBy: {
    en: 'Verified Across',
    si: 'තහවුරු කර ඇති මාධ්‍ය ගණන:',
    ta: 'சரிபார்க்கப்பட்டவை:'
  },
  newsrooms: {
    en: 'Independent Newsrooms',
    si: 'ස්වාධීන පුවත්පත් කාමර',
    ta: 'சுயாதீன செய்தியறைகள்'
  },
  singleSource: {
    en: 'Exclusive Dispatch · Single Source',
    si: 'තනි මාධ්‍ය වාර්තාවක්',
    ta: 'தனிப்பட்ட செய்தி அறிக்கை'
  },
  compareHeadlines: {
    en: 'Compare Newsroom Headlines',
    si: 'ශීර්ෂ පාඨ සංසන්දනය කරන්න',
    ta: 'தலைப்புகளை ஒப்பிடுங்கள்'
  },
  hideHeadlines: {
    en: 'Hide Comparison',
    si: 'සංසන්දනය සඟවන්න',
    ta: 'ஒப்பீட்டை மறைக்கவும்'
  },
  blindspotNotice: {
    en: 'Balanced Multi-Source Coverage',
    si: 'සමබර බහු-මාධ්‍ය ආවරණයක්',
    ta: 'சமநிலையான பல ஊடக கவரேஜ்'
  },
  coverageBias: {
    en: 'Publisher Diversity Index',
    si: 'මාධ්‍ය විවිධත්ව දර්ශකය',
    ta: 'ஊடக பன்முகத்தன்மை குறியீடு'
  }
};

export const CoverageDistributionBar: React.FC<CoverageDistributionBarProps> = ({
  article,
  currentLang,
  variant = 'compact'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Collate all participating publishers
  const participatingPublishers: { name: string; category: PublisherCategory; headline?: string; url?: string }[] = [];
  
  // Primary publisher
  participatingPublishers.push({
    name: article.publisherName,
    category: classifyPublisher(article.publisherName),
    headline: article.title[currentLang] || article.title.en,
    url: article.sourceUrl
  });

  // Clustered perspectives if available
  if (article.perspectives && article.perspectives.length > 0) {
    article.perspectives.forEach((p: SourcePerspective) => {
      if (!participatingPublishers.some((item) => item.name.toLowerCase() === p.publisherName.toLowerCase())) {
        participatingPublishers.push({
          name: p.publisherName,
          category: classifyPublisher(p.publisherName),
          headline: p.headline,
          url: p.sourceUrl
        });
      }
    });
  }

  const totalSources = Math.max(participatingPublishers.length, article.clusterCount || 1);

  // Calculate category counts
  const categoryCounts: Record<PublisherCategory, number> = {
    broadcast: 0,
    print: 0,
    wire: 0
  };

  participatingPublishers.forEach((p) => {
    categoryCounts[p.category]++;
  });

  // Calculate percentage splits
  const broadcastPct = Math.round((categoryCounts.broadcast / participatingPublishers.length) * 100);
  const printPct = Math.round((categoryCounts.print / participatingPublishers.length) * 100);
  const wirePct = 100 - broadcastPct - printPct;

  const isMultiSource = totalSources > 1;

  // COMPACT VARIANT (Used on News Cards & Hero Story)
  if (variant === 'compact') {
    return (
      <div className="w-full mt-2.5 pt-2.5 border-t border-[var(--border-line)] text-[11px] font-mono">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-[var(--text-body)]">
            <Scale className="w-3 h-3 text-emerald-500" />
            <span className="font-semibold text-[10px] uppercase tracking-wider">
              {isMultiSource
                ? `${translations.verifiedBy[currentLang]} ${totalSources} ${translations.newsrooms[currentLang]}`
                : translations.singleSource[currentLang]}
            </span>
          </div>
          {isMultiSource && (
            <span className="text-[9px] text-[var(--text-muted)] font-semibold">
              Ground News™ Matrix
            </span>
          )}
        </div>

        {/* Segmented Distribution Spectrum Bar */}
        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/[0.06] overflow-hidden flex">
          {broadcastPct > 0 && (
            <div
              style={{ width: `${broadcastPct}%` }}
              className="h-full bg-sky-500 transition-all duration-500"
              title={`Major Broadcasters: ${broadcastPct}%`}
            />
          )}
          {printPct > 0 && (
            <div
              style={{ width: `${printPct}%` }}
              className="h-full bg-emerald-500 transition-all duration-500"
              title={`Independent Print: ${printPct}%`}
            />
          )}
          {wirePct > 0 && (
            <div
              style={{ width: `${wirePct}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`International/Financial Wires: ${wirePct}%`}
            />
          )}
        </div>

        {/* Legend Pills */}
        {isMultiSource && (
          <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[var(--text-muted)]">
            {categoryCounts.broadcast > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Broadcaster ({categoryCounts.broadcast})</span>
              </span>
            )}
            {categoryCounts.print > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Print ({categoryCounts.print})</span>
              </span>
            )}
            {categoryCounts.wire > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Wire ({categoryCounts.wire})</span>
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // FULL VARIANT (Used on FullArticlePage)
  return (
    <div className="my-8 p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-line)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
              <Scale className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider font-mono">
              {translations.coverageSpectrum[currentLang]}
            </h4>
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-line)] text-[9px] font-mono text-[var(--text-muted)] uppercase">
              Ground News Style
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-sans">
            {isMultiSource
              ? `${translations.verifiedBy[currentLang]} ${totalSources} ${translations.newsrooms[currentLang]} across print, broadcast, and international agencies.`
              : translations.singleSource[currentLang]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{totalSources >= 3 ? 'High Corroboration' : 'Standard Corroboration'}</span>
          </span>
        </div>
      </div>

      {/* Visual Spectrum Bar */}
      <div className="py-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>{translations.coverageBias[currentLang]}</span>
          <span className="text-[var(--text-main)] font-semibold">{totalSources} Outlets Tracking</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/[0.06] overflow-hidden flex shadow-inner">
          {broadcastPct > 0 && (
            <div
              style={{ width: `${broadcastPct}%` }}
              className="h-full bg-sky-500 transition-all duration-500"
              title={`Major Broadcasters: ${broadcastPct}%`}
            />
          )}
          {printPct > 0 && (
            <div
              style={{ width: `${printPct}%` }}
              className="h-full bg-emerald-500 transition-all duration-500"
              title={`Independent Print: ${printPct}%`}
            />
          )}
          {wirePct > 0 && (
            <div
              style={{ width: `${wirePct}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`International/Financial Wires: ${wirePct}%`}
            />
          )}
        </div>

        {/* Detailed Legend Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <div className="p-2.5 rounded-lg bg-sky-500/[0.04] border border-sky-500/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="text-[var(--text-body)]">National Broadcasters</span>
            </div>
            <span className="font-bold text-sky-500 dark:text-sky-400">{categoryCounts.broadcast}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[var(--text-body)]">Independent Print</span>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{categoryCounts.print}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[var(--text-body)]">Wires & Financial</span>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">{categoryCounts.wire}</span>
          </div>
        </div>
      </div>

      {/* Head-to-Head Headline Perspectives Accordion */}
      {participatingPublishers.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2.5 px-3 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] flex items-center justify-between text-xs font-mono text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{isExpanded ? translations.hideHeadlines[currentLang] : translations.compareHeadlines[currentLang]}</span>
              <span className="px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] border border-[var(--border-line)] text-[10px] text-[var(--text-main)]">
                {participatingPublishers.length} perspectives
              </span>
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2.5">
              {participatingPublishers.map((pub, idx) => {
                const meta = publisherCategories[pub.category];
                const Icon = meta.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className={`inline-flex items-center gap-1 font-semibold ${meta.color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{pub.name}</span>
                        </span>
                        <span className="text-[var(--text-faint)]">·</span>
                        <span className="text-[var(--text-muted)]">{meta.label[currentLang]}</span>
                      </div>
                      <p className="text-xs text-[var(--text-main)] font-medium leading-snug">
                        {pub.headline || article.title[currentLang] || article.title.en}
                      </p>
                    </div>

                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex-shrink-0 transition-colors"
                      >
                        <span>Original Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
