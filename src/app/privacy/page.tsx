import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Cookie Disclosures',
  description:
    'NewsGrab Privacy Policy, Google AdSense & third-party advertising cookie disclosures, GDPR/CCPA rights, and user data protection commitments.',
};

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Compliance &amp; Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-headline">
            Privacy Policy &amp; Advertising Disclosures
          </h1>
          <p className="text-sm font-mono text-zinc-400">
            Last Updated: September 18, 2026 • Effective Date: January 1, 2026 • Version 2.4
          </p>
        </div>

        {/* Executive Summary Callout */}
        <div className="p-5 rounded-lg bg-[#121318] border border-white/[0.08] space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Our Privacy Commitment</span>
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            NewsGrab (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates newsgrab.lk as an independent trilingual news aggregator. We respect your personal privacy and are committed to full compliance with global privacy standards, including the <strong>Sri Lanka Personal Data Protection Act No. 9 of 2022</strong>, the European Union <strong>General Data Protection Regulation (GDPR)</strong>, the <strong>California Consumer Privacy Act (CCPA)</strong>, and the <strong>Google Publisher &amp; AdSense Policies</strong>.
          </p>
        </div>

        {/* Section 1: Google AdSense & Advertising Cookies (MANDATORY FOR ADSENSE) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Eye className="w-5 h-5 text-rose-400" />
            <span>1. Google AdSense &amp; Third-Party Advertising Disclosures</span>
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              We monetize our journalism and infrastructure through authorized digital advertising, including Google AdSense, Google Ad Manager, and certified programmatic supply-side platforms (SSPs).
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-300">
              <li>
                <strong>Third-Party Vendors &amp; Google Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to newsgrab.lk or other websites on the Internet.
              </li>
              <li>
                <strong>DoubleClick &amp; Advertising Cookies:</strong> Google&apos;s use of advertising cookies enables it and its certified partners to serve relevant advertisements to users based on their browsing history across participating web properties.
              </li>
              <li>
                <strong>Opt-Out of Personalized Advertising:</strong> Users may opt out of personalized Google advertising at any time by visiting the{' '}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 underline hover:text-rose-300"
                >
                  Google Ad Settings
                </a>
                . Alternatively, users may opt out of third-party vendor cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 underline hover:text-rose-300"
                >
                  www.aboutads.info/choices
                </a>{' '}
                or the{' '}
                <a
                  href="https://youronlinechoices.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 underline hover:text-rose-300"
                >
                  European Interactive Digital Advertising Alliance (EDAA)
                </a>
                .
              </li>
              <li>
                <strong>Better Ads Standards:</strong> NewsGrab strictly adheres to the Coalition for Better Ads standards. We do not employ deceptive ad labels, auto-playing audio ads, pop-unders, or sticky units covering more than 30% of mobile screens.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Cookies & Local Storage */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-400" />
            <span>2. Types of Cookies We Use</span>
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>We classify cookies and browser storage into three transparent categories:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded bg-[#101216] border border-white/[0.06] space-y-1.5">
                <div className="font-mono text-xs font-bold text-zinc-200 uppercase">Essential Cookies</div>
                <p className="text-xs text-zinc-400">
                  Strictly required for core website functionality, such as remembering your trilingual language choice (English, Sinhala, Tamil) and filter settings.
                </p>
              </div>
              <div className="p-4 rounded bg-[#101216] border border-white/[0.06] space-y-1.5">
                <div className="font-mono text-xs font-bold text-zinc-200 uppercase">Analytics Cookies</div>
                <p className="text-xs text-zinc-400">
                  Aggregated, anonymized performance metrics to measure article popularity and system uptime via privacy-friendly telemetry.
                </p>
              </div>
              <div className="p-4 rounded bg-[#101216] border border-white/[0.06] space-y-1.5">
                <div className="font-mono text-xs font-bold text-zinc-200 uppercase">Advertising Cookies</div>
                <p className="text-xs text-zinc-400">
                  Utilized by Google AdSense and programmatic partners to cap ad frequency and provide contextual advertising relevance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: User Rights (GDPR / CCPA / Sri Lanka PDPA) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white font-headline">
            3. Your Legal Privacy Rights
          </h2>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            <p>
              Depending on your location, you hold statutory privacy rights concerning your personal data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
              <li><strong>Right of Access &amp; Portability:</strong> Request confirmation of what personal data is processed.</li>
              <li><strong>Right to Rectification:</strong> Request prompt correction of inaccurate records.</li>
              <li><strong>Right to Erasure (&quot;Right to Be Forgotten&quot;):</strong> Request deletion of collected personal identifiers.</li>
              <li><strong>Right to Restrict or Object:</strong> Restrict processing or opt out of automated profiling and personalized advertising.</li>
              <li><strong>Non-Discrimination (CCPA):</strong> We never deny service or charge differing prices for exercising your statutory privacy rights.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Contact & Data Protection Officer */}
        <section className="space-y-4 border-t border-white/[0.08] pt-8">
          <h2 className="text-xl font-bold text-white font-headline">
            4. Newsdesk Privacy Bureau &amp; Contact
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            For questions regarding this policy, opting out of advertising identifiers, or submitting formal data subject access requests (DSAR):
          </p>
          <div className="p-4 rounded bg-[#101216] border border-white/[0.06] text-xs font-mono space-y-1 text-zinc-300">
            <div>Data Protection Officer: <span className="text-white">NEWSGRAB Media Network</span></div>
            <div>Official Email: <span className="text-rose-400">privacy@newsgrab.lk</span></div>
            <div>Newsdesk Bureau: <span className="text-zinc-300">Level 12, World Trade Center, Colombo 01, Sri Lanka</span></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080a] py-8 text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>&copy; {new Date().getFullYear()} NEWSGRAB. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="text-zinc-300 hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-zinc-300 transition-colors">Front Page</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
