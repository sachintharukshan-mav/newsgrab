import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Wire Syndication Guidelines',
  description:
    'NewsGrab Terms of Service, wire syndication guidelines, publisher copyright notices, and financial indicator disclaimers.',
};

export default function TermsOfServicePage() {
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
        {/* Title */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Editorial Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
            Terms of Service &amp; Syndication Policies
          </h1>
          <p className="text-sm font-mono text-zinc-400">
            Last Updated: September 18, 2026 • Effective Date: January 1, 2026 • Version 1.8
          </p>
        </div>

        {/* Overview */}
        <div className="p-5 rounded-lg bg-[#121318] border border-white/[0.08] space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Agreement to Terms</span>
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            By accessing or using NewsGrab (&quot;newsgrab.lk&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue your use of the service.
          </p>
        </div>

        {/* Section 1: Wire Syndication & Fair Use */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <span>1. Syndication Disclaimer, Fair Practice &amp; Statutory Compliance</span>
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              NewsGrab functions as an independent trilingual news discovery and analysis platform indexing public feeds across verified Sri Lankan and international newsrooms (including Ada Derana, Hiru News, Daily Mirror, Virakesari, and BBC).
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-300">
              <li>
                <strong>Statutory Compliance (Sri Lanka IP Act No. 36 of 2003):</strong> All indexing and quotation on NewsGrab are conducted strictly under the &quot;Fair Practice&quot; provisions of Section 12(1)(a) of the Intellectual Property Act No. 36 of 2003 of Sri Lanka and international Fair Use doctrines. NewsGrab does not serve as a market substitute for original reporting.
              </li>
              <li>
                <strong>Executive Synthesis Model:</strong> NewsGrab displays original transformative synthesis—specifically concise editorial lead summaries, AI-generated key takeaways, and cross-publisher perspective comparisons. We do not reproduce unabridged article bodies.
              </li>
              <li>
                <strong>Direct Publisher Referral:</strong> Every story presented on NewsGrab includes clear publisher attribution, timestamping, and a prominent outbound link directing readers directly to the original publisher&apos;s website.
              </li>
              <li>
                <strong>Intellectual Property &amp; Trademarks:</strong> All headlines, original photography, and reporting remain the intellectual property and copyright of their respective originating news organizations.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Financial Market Data Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline">
            2. Central Bank (CBSL) &amp; Financial Market Indicators
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              Financial indicators, exchange rates (USD/LKR, GBP/LKR, EUR/LKR), and Colombo Stock Exchange (CSE) data displayed on NewsGrab are provided for informational and editorial awareness only.
            </p>
            <p className="text-zinc-400 text-xs">
              NewsGrab is not an investment adviser, broker, or financial institution. Exchange rate fixing data is aggregated from official Central Bank of Sri Lanka daily releases. We recommend consulting licensed financial advisers or commercial banking partners before executing commercial currency or equity transactions.
            </p>
          </div>
        </section>

        {/* Section 3: Advertising & Commercial Partnerships */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline">
            3. Advertising &amp; Commercial Disclosures
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              NewsGrab displays advertisements served by Google AdSense, Google Ad Manager, and vetted direct corporate sponsors. All commercial placements are explicitly demarcated with &quot;ADVERTISEMENT&quot; or &quot;SPONSORED&quot; labels in accordance with Google Publisher Policies and IAB standards.
            </p>
            <p>
              Advertisements are served on our original index views, analytical dashboards, and aggregated comparison layouts—never on scraped full-text articles. Advertisers are solely responsible for the contents and claims in their promotional materials. Commercial sponsorship does not influence our unbiased algorithmic news curation.
            </p>
          </div>
        </section>

        {/* Section 4: Publisher Opt-Out & DMCA Policy */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline">
            4. Publisher Opt-Out &amp; Copyright Notice-and-Takedown (DMCA)
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              NewsGrab deeply values the work of newsrooms and investigative journalists. If you are a copyright holder, editorial representative, or publisher and wish to adjust how your public feed is indexed, or request immediate exclusion of your content from our discovery index, we honor all verified requests within 24 hours:
            </p>
            <div className="p-4 rounded bg-[#121319] border border-white/[0.08] text-xs font-mono space-y-1 text-zinc-300">
              <div>Publisher Opt-Out Desk: <span className="text-rose-400">publishers@newsgrab.lk</span></div>
              <div>DMCA &amp; Copyright Agent: <span className="text-rose-400">legal@newsgrab.lk</span></div>
              <div>Response Timeframe: <span className="text-emerald-400 font-bold">&lt; 24 Business Hours</span></div>
            </div>
            <p className="text-xs text-zinc-400">
              Please provide the URL of the affected content, proof of ownership or agency, and specify the desired action (e.g. index exclusion, attribution adjustment, or feed removal).
            </p>
          </div>
        </section>

        {/* Section 5: Contact & Newsroom Bureau */}
        <section className="space-y-4 border-t border-white/[0.08] pt-8">
          <h2 className="text-xl font-bold text-white font-headline">
            5. Newsroom Bureau &amp; General Inquiries
          </h2>
          <div className="p-4 rounded bg-[#101216] border border-white/[0.06] text-xs font-mono space-y-1 text-zinc-300">
            <div>Operating Network: <span className="text-white">NEWSGRAB Media Network</span></div>
            <div>Editorial Corrections: <span className="text-zinc-300">desk@newsgrab.lk</span></div>
            <div>Technical Desk: <span className="text-zinc-300">sysadmin@newsgrab.lk</span></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080a] py-8 text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>&copy; {new Date().getFullYear()} NEWSGRAB. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-zinc-300 hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-zinc-300 transition-colors">Front Page</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
