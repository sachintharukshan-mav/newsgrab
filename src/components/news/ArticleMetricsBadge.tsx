'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { calculateBaselineReads } from '@/lib/metrics-service';

/**
 * Ascending 3-bar signal / reader meter icon exactly matching the user's reference image
 */
export const SignalBarsIcon: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <svg
    viewBox="0 0 13 13"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <rect x="1" y="8" width="2.5" height="4.5" rx="0.6" />
    <rect x="5.25" y="4.5" width="2.5" height="8" rx="0.6" />
    <rect x="9.5" y="1" width="2.5" height="11.5" rx="0.6" />
  </svg>
);

interface ArticleMetricsBadgeProps {
  articleId: string;
  publishedAt?: string;
  isLead?: boolean;
  initialReads?: number;
  initialComments?: number;
  className?: string;
  showComments?: boolean;
}

// Client-side cache to share fetched counts across card re-renders
const metricsCache: Record<string, { reads: number; comments: number }> = {};
let pendingBatchIds: Set<string> = new Set();
let batchTimeout: NodeJS.Timeout | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/**
 * Enqueue an article ID to be fetched in a consolidated batch request
 */
function queueMetricFetch(articleId: string) {
  if (metricsCache[articleId] !== undefined) return;
  pendingBatchIds.add(articleId);

  if (!batchTimeout) {
    batchTimeout = setTimeout(async () => {
      const idsToFetch = Array.from(pendingBatchIds);
      pendingBatchIds = new Set();
      batchTimeout = null;

      if (idsToFetch.length === 0) return;

      try {
        const res = await fetch(`/api/metrics?ids=${encodeURIComponent(idsToFetch.join(','))}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.metrics) {
            Object.assign(metricsCache, data.metrics);
            notifyListeners();
          }
        }
      } catch (err) {
        // Silent catch for network hiccups; baseline continues to display
      }
    }, 80);
  }
}

/**
 * Records a unique read for the given article if not already opened within 24 hours
 */
export async function recordArticleRead(articleId: string, publishedAt?: string): Promise<number | null> {
  if (typeof window === 'undefined' || !articleId) return null;

  const storageKey = `ld_read_${articleId}`;
  const lastRead = localStorage.getItem(storageKey);
  const now = Date.now();

  // Deduplicate within 24 hours
  if (lastRead && now - parseInt(lastRead, 10) < 24 * 60 * 60 * 1000) {
    return metricsCache[articleId]?.reads || null;
  }

  localStorage.setItem(storageKey, String(now));

  // Optimistic increment in cache
  if (metricsCache[articleId]) {
    metricsCache[articleId].reads += 1;
    notifyListeners();
  }

  try {
    const res = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, publishedAt })
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.reads === 'number') {
        if (!metricsCache[articleId]) {
          metricsCache[articleId] = { reads: data.reads, comments: 0 };
        } else {
          metricsCache[articleId].reads = data.reads;
        }
        notifyListeners();
        return data.reads;
      }
    }
  } catch (err) {
    // Optimistic count remains visible
  }

  return metricsCache[articleId]?.reads || null;
}

export const ArticleMetricsBadge: React.FC<ArticleMetricsBadgeProps> = ({
  articleId,
  publishedAt,
  isLead = false,
  initialReads,
  initialComments = 0,
  className = '',
  showComments = true
}) => {
  // Deterministic initial baseline ensures immediate display with zero layout shift
  const defaultReads = initialReads ?? calculateBaselineReads(articleId, publishedAt, isLead);
  const [, setTick] = useState(0);

  useEffect(() => {
    queueMetricFetch(articleId);

    const onUpdate = () => setTick((prev) => prev + 1);
    listeners.add(onUpdate);
    return () => {
      listeners.delete(onUpdate);
    };
  }, [articleId]);

  const currentReads = metricsCache[articleId]?.reads ?? defaultReads;
  const currentComments = metricsCache[articleId]?.comments ?? initialComments;

  return (
    <div className={`inline-flex items-center gap-3 font-mono text-[11px] text-[var(--text-muted)] select-none ${className}`}>
      {/* Comments Count: Speech bubble icon + count (matches screenshot) */}
      {showComments && (
        <span
          className="inline-flex items-center gap-1 hover:text-[var(--text-main)] transition-colors cursor-pointer"
          title={`${currentComments} discussion comment${currentComments === 1 ? '' : 's'}`}
        >
          <MessageSquare className="w-3.5 h-3.5 opacity-80 shrink-0" />
          <span>{currentComments}</span>
        </span>
      )}

      {/* Reads Count: 3-bar signal icon + count (matches screenshot) */}
      <span
        className="inline-flex items-center gap-1 hover:text-[var(--text-main)] transition-colors"
        title={`${currentReads.toLocaleString()} reader${currentReads === 1 ? '' : 's'}`}
      >
        <SignalBarsIcon className="w-3 h-3 text-[var(--text-muted)] opacity-90 shrink-0" />
        <span className="font-semibold text-[var(--text-main)]">{currentReads.toLocaleString()}</span>
      </span>
    </div>
  );
};
