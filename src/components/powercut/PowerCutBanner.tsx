'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, X, Clock } from 'lucide-react';
import { getRealtimeCutStatus, RealtimeCutStatus, isPowercutScheduleExpired } from '@/data/powercut-schedule';

export const PowerCutBanner: React.FC = () => {
  const [status, setStatus] = useState<RealtimeCutStatus | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    setStatus(getRealtimeCutStatus());
    const interval = setInterval(() => {
      setStatus(getRealtimeCutStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed || status?.isExpired || isPowercutScheduleExpired()) return null;

  const activeGroup = status?.activeGroup;
  const nextGroup = status?.nextGroup;
  const nextSlot = status?.nextSlot;

  return (
    <aside
      aria-label="Power cut advisory"
      className="w-full bg-amber-500/10 dark:bg-amber-950/30 border-y border-amber-500/30 text-[var(--text-main)] py-2 px-3 sm:px-6 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-xs shrink-0 uppercase tracking-wider text-[11px]">
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            Grid Alert
          </span>

          <span className="font-sans font-medium text-[var(--text-main)] truncate">
            {activeGroup ? (
              <span className="text-red-600 dark:text-red-400 font-bold">
                🔴 Group 0{activeGroup.id} power cut in progress until {status?.activeSlot?.end}
              </span>
            ) : nextGroup && nextSlot ? (
              <span>
                CEB 1-Hour Rotational Cuts: Today next is <strong>Group 0{nextGroup.id} ({nextSlot.displayTime})</strong>
              </span>
            ) : (
              <span>
                PUCSL Approved 1-Hour Rotational Load Management (Oct 19–21)
              </span>
            )}
          </span>

          <span className="hidden md:inline text-[var(--text-muted)]">
            • Lakvijaya Unit 1 Outage Recovery
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/powercut"
            className="inline-flex items-center gap-1 font-bold text-[var(--text-main)] hover:text-[var(--accent-crimson)] underline underline-offset-4 decoration-[var(--border-line)] hover:decoration-current transition-colors text-[11px] sm:text-xs"
          >
            <span>Interactive Map & Times</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 -mr-1 transition-colors"
            title="Dismiss alert"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
