'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, Newspaper, MapPin, Globe, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-200">
      {/* Header Bar */}
      <header className="border-b border-white/[0.08] bg-[#07080a] sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Front Page</span>
          </Link>
          <Link
            href="/"
            className="inline-block cursor-pointer hover:opacity-90 transition-opacity"
            title="NEWSGRAB Front Page"
            aria-label="NEWSGRAB Front Page"
          >
            <div className="text-sm font-extrabold text-white font-headline uppercase tracking-tight">
              NEWS<span className="text-rose-500">GRAB</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Title Section */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Digital Newsroom &amp; Editorial Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
            About NEWSGRAB
          </h1>
          <p className="text-sm font-mono text-zinc-400">
            Colombo Bureau • Trilingual Syndication (English · සිංහල · தமிழ்) • Verified Digital Architecture
          </p>
        </div>

        {/* Mission Statement */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Globe className="w-5 h-5 text-rose-500" />
            <span>1. Our Editorial Mission</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <strong>NEWSGRAB</strong> is an authoritative, independent digital news aggregation platform and editorial intelligence service headquartered in Colombo, Sri Lanka. We provide 24/7 real-time journalism, multi-source perspective indexing, and macroeconomic data indicators for the Sri Lankan public and the global diaspora.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            By bridging verified national broadsheets (Ada Derana, Hiru News, Daily Mirror, Daily FT, Virakesari, NewsWire, EconomyNext) with accredited global wire services (Reuters, BBC World News, The Guardian), NewsGrab delivers comprehensive, non-partisan, and transparent news coverage.
          </p>
        </section>

        {/* Multi-Source Perspective Engine */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>2. Verification &amp; Editorial Standards</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Original Source Attribution</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Every story syndicates canonical metadata, direct links, and clear attribution to the original reporting newsroom, honoring intellectual property rights.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Trilingual Accessibility</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Full parity across English, Sinhala (සිංහල), and Tamil (தமிழ்), ensuring equal news accessibility across all linguistic communities.
              </p>
            </div>
          </div>
        </section>

        {/* Advertising & Commercial Guidelines */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-400" />
            <span>3. Advertising &amp; Commercial Partnerships</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            To maintain our free, uninterrupted newsroom operations, NewsGrab partners with certified programmatic advertising networks, including <strong>Google AdSense</strong>, <strong>Google Ad Manager</strong>, and accredited supply-side platforms (SSPs).
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-300 pl-2">
            <li>
              <strong>Coalition for Better Ads Compliance:</strong> We strictly avoid deceptive ads, popups, intrusive auto-audio units, or layouts causing layout shifts (CLS).
            </li>
            <li>
              <strong>Editorial Separation:</strong> Advertising units are clearly designated with &quot;Advertisement&quot; or &quot;Sponsored&quot; badges and never compromise journalistic independence.
            </li>
            <li>
              <strong>Direct Brand Sponsorships:</strong> Corporate partners can run certified wire campaigns adhering to IAB standards. For media kits and CPM rates, contact <span className="text-zinc-200 font-mono">advertising@newsgrab.lk</span>.
            </li>
          </ul>
        </section>

        {/* Newsroom Bureau & Contact */}
        <section className="space-y-4 pt-4 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span>4. Newsdesk Bureau &amp; Contacts</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-1.5">
              <div className="text-zinc-400 uppercase tracking-wider font-bold">Editorial Bureau</div>
              <div className="text-zinc-200">NEWSGRAB Media Network</div>
              <div className="text-zinc-400">Level 12, World Trade Center</div>
              <div className="text-zinc-400">Colombo 00100, Sri Lanka</div>
            </div>

            <div className="p-4 rounded-lg bg-[#111216] border border-white/[0.06] space-y-1.5">
              <div className="text-zinc-400 uppercase tracking-wider font-bold">Contact Inquiries</div>
              <div>Editorial Desk: <span className="text-zinc-200">desk@newsgrab.lk</span></div>
              <div>Advertising &amp; SSPs: <span className="text-zinc-200">advertising@newsgrab.lk</span></div>
              <div>Legal &amp; Grievances: <span className="text-zinc-200">legal@newsgrab.lk</span></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
