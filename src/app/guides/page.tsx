import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Fuel,
  Coins,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'In-Depth Economic & Legal Guides | LANKA DISPATCH';
  const description =
    'Exhaustive investigative guides, statutory tax breakdowns, energy pricing analyses, and macroeconomic research for Sri Lanka by the Lanka Dispatch Intelligence Desk.';
  const enUrl = `${SITE_URL}/guides`;

  return {
    title,
    description,
    keywords: [
      'sri lanka economic guides',
      'lanka dispatch special reports',
      'sri lanka tax guides',
      'fuel pricing formula explained',
      'epf etf sri lanka guide',
    ],
    alternates: {
      canonical: enUrl,
    },
    openGraph: {
      title,
      description,
      url: enUrl,
      siteName: 'LANKA DISPATCH',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function GuidesIndexPage() {
  const SITE_URL = getSiteUrl();

  const guides = [
    {
      slug: 'sri-lanka-personal-income-tax-guide-2025',
      title: 'Sri Lanka Personal Income Tax & APIT Slabs 2025/2026: The Complete Taxpayer Guide',
      description:
        'Comprehensive legal analysis of Inland Revenue (Amendment) Act No. 2 of 2025. Covers the Rs. 150,000 monthly tax-free relief, progressive slab math, EPF/ETF interaction, and practical salary case studies.',
      readTime: '12 min read',
      category: 'Taxation & Legal',
      icon: Calculator,
      color: 'blue',
      badge: 'IRD 2025/2026 Act',
    },
    {
      slug: 'sri-lanka-fuel-pricing-formula-explained',
      title: "How Sri Lanka's Fuel Pricing Formula Works: From Singapore Platts to the Pump",
      description:
        'Detailed economic breakdown of retail fuel pricing. Analysis of Singapore Platts benchmarks, ocean freight, customs import duties, dealer commissions, and CPC vs. Lanka IOC margins.',
      readTime: '10 min read',
      category: 'Energy & Commodities',
      icon: Fuel,
      color: 'emerald',
      badge: 'Pricing Formula',
    },
    {
      slug: 'sri-lanka-epf-etf-contribution-guide',
      title: 'EPF & ETF in Sri Lanka: The Complete Employee and Employer Contribution Guide',
      description:
        'Exhaustive guide to statutory social security in Sri Lanka. Explains the 23% monthly contribution formula (8% employee + 12% employer EPF + 3% ETF), Central Bank fund management, and withdrawal eligibility.',
      readTime: '11 min read',
      category: 'Labor & Retirement',
      icon: Coins,
      color: 'amber',
      badge: 'Labor Law',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      {/* Header */}
      <header className="border-b border-[var(--border-line)] bg-[var(--bg-card)]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Front Page</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-extrabold text-[var(--text-main)] font-headline uppercase tracking-tight"
          >
            LANKA<span className="text-rose-500">DISPATCH</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Original Investigative Journalism &amp; Research</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] font-headline leading-tight">
            Special Reports &amp; In-Depth Economic Guides
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Exhaustive, independently researched guides on taxation, energy regulation, monetary policy, and civic affairs in Sri Lanka. Grounded in primary parliamentary gazettes, Central Bank statistical bulletins, and verified legal frameworks.
          </p>
        </section>

        {/* Guides List */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] hover:border-[var(--text-main)] transition-all shadow-xs hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] text-[var(--text-main)] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-rose-500" />
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-line)]">
                      {guide.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      {guide.category}
                    </div>
                    <h2 className="text-lg font-bold text-[var(--text-main)] font-serif leading-snug group-hover:text-rose-500 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {guide.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-[var(--border-line)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readTime}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[var(--text-main)] group-hover:translate-x-1 transition-transform">
                    <span>Read Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Footer Note */}
        <section className="p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Original Editorial Research · Fact-Checked by Lanka Dispatch Desks</span>
          </div>
          <Link href="/about" className="hover:text-[var(--text-main)] underline">
            Review Our Editorial Standards
          </Link>
        </section>
      </main>
    </div>
  );
}
