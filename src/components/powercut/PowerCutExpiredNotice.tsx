'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, PhoneCall, ZapOff, ArrowLeft } from 'lucide-react';

export const PowerCutExpiredNotice: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto my-8 border border-[var(--border-line)] bg-[var(--bg-card)] p-6 sm:p-10 rounded-sm shadow-md space-y-6">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-line)] pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Grid Operational · Schedule Concluded
          </span>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">
          Concluded: 00:00:00 · 22 Oct 2026
        </span>
      </div>

      {/* Main Headline */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[var(--text-main)]">
          PUCSL 1-Hour Power Management Period Has Concluded
        </h1>
        <p className="text-sm font-sans text-[var(--text-muted)] leading-relaxed">
          The temporary rotational power interruption schedule approved by the Public Utilities Commission of Sri Lanka (PUCSL) for October 19, 20, and 21, 2026 officially expired at <strong>00:00:00 on Thursday, 22 October 2026</strong>.
        </p>
      </div>

      {/* Grid Status Details Card */}
      <div className="p-4 bg-[var(--bg-page)] border border-[var(--border-line)] rounded-xs space-y-3 font-sans text-xs sm:text-sm text-[var(--text-main)]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Generation Normalization:</strong>
            <span className="text-[var(--text-muted)]">
              Following the restoration and synchronization of Unit 1 at the Lakvijaya (Norochcholai) Coal Power Station, national generation capacity has stabilized.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ZapOff className="w-5 h-5 text-[#276ef1] shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">All CEB Groups Normalized:</strong>
            <span className="text-[var(--text-muted)]">
              Rotational load shedding across Groups 01, 02, 03, and 04 (all 25 administrative districts) is no longer active. The power grid has returned to continuous operation.
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--text-main)] text-[var(--bg-page)] font-sans font-bold text-sm rounded-xs shadow-sm hover:opacity-90 transition-opacity"
        >
          <span>Return to Front Page & Live News</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Emergency Breakdown Reporting Footer */}
      <div className="pt-4 border-t border-[var(--border-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)]">
        <div>
          <span>Local unscheduled fault or breakdown?</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-[var(--text-main)]">
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            CEB: 1987
          </span>
          <span className="flex items-center gap-1 font-semibold text-[var(--text-main)]">
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            LECO: 1901
          </span>
        </div>
      </div>
    </div>
  );
};
