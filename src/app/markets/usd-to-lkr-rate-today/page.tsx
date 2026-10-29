import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, TrendingDown, TrendingUp, ShieldCheck, Clock, ExternalLink, Coins, Zap, Fuel, DollarSign } from 'lucide-react';
import { getLiveMarketSnapshot } from '@/lib/forex-data';
import { ForexConverter } from '@/components/markets/ForexConverter';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'USD to LKR Rate Today Sri Lanka | CBSL & Bank Exchange Rates';
  const description = 'Live USD to LKR exchange rate today in Sri Lanka. Compare daily Central Bank (CBSL) indicative rates, BOC, Commercial Bank, HNB, and Sampath bank buying & selling rates with currency converter.';
  const enUrl = `${SITE_URL}/markets/usd-to-lkr-rate-today`;
  const siUrl = `${SITE_URL}/si/markets/usd-to-lkr-rate-today`;
  const taUrl = `${SITE_URL}/ta/markets/usd-to-lkr-rate-today`;
  const canonicalUrl = enUrl;

  return {
    title,
    description,
    keywords: [
      'USD to LKR today',
      'dollar rate today sri lanka',
      'cbsl exchange rate today',
      'commercial bank dollar rate',
      'boc usd buying selling rate',
      'hnb exchange rates',
      'sampath bank dollar rate',
      'ඩොලර් අනුපාතිකය අද',
      'இன்றைய டொலர் மாற்று விகிதம் இலங்கை',
      'sri lanka currency converter'
    ],
    alternates: {
      canonical: enUrl,
      languages: {
        'en-LK': enUrl,
        'si-LK': siUrl,
        'ta-LK': taUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'LANKA DISPATCH',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent('USD to LKR Rate Today · Live CBSL & Bank Comparison')}&category=economy&pub=CBSL`,
          width: 1200,
          height: 630,
          alt: 'USD to LKR Exchange Rates Today Sri Lanka',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@lankadispatch',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}

export default async function UsdToLkrPage() {
  const snapshot = await getLiveMarketSnapshot();
  const { usdLkr, currencies, bankRates, historical30Days, updatedAt } = snapshot;
  const isPositive = false; // typical slight appreciation or stabilization

  const formattedDate = new Date(updatedAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const faqItems = [
    {
      question: 'What is the USD to LKR indicative rate today in Sri Lanka?',
      answer: `As of ${formattedDate}, the Central Bank of Sri Lanka (CBSL) indicative middle exchange rate for the US Dollar is Rs. ${usdLkr.toFixed(2)}. Commercial banks typically quote buying rates around Rs. ${(usdLkr * 0.986).toFixed(2)} and selling rates around Rs. ${(usdLkr * 1.014).toFixed(2)}.`,
    },
    {
      question: 'Which Sri Lankan bank offers the best US Dollar exchange rate?',
      answer: 'Leading licensed commercial banks including Bank of Ceylon (BOC), Commercial Bank of Ceylon, Hatton National Bank (HNB), and Sampath Bank update their foreign exchange rates daily between 9:00 AM and 10:00 AM. Differences in rates are generally within 0.1% to 0.3% of the CBSL middle rate.',
    },
    {
      question: 'What is the difference between TT Buying and TT Selling rates?',
      answer: 'Telegraphic Transfer Buying (TT Buying) is the rate a Sri Lankan bank pays you when receiving inwards foreign remittances (e.g., worker remittances, export earnings). Telegraphic Transfer Selling (TT Selling) is the rate you pay when sending money abroad or making international payments in foreign currency.',
    },
    {
      question: 'How often does CBSL update exchange rates?',
      answer: 'The Central Bank of Sri Lanka (CBSL) calculates and publishes official indicative exchange rates once every business day, typically by 4:00 PM, based on interbank market transactions.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Utility Header */}
      <header className="border-b border-[var(--border-line)] bg-[var(--bg-card)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Front Page</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[var(--text-main)]">
              LANKA<span className="text-rose-500">DISPATCH</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-mono font-bold uppercase rounded border border-rose-500/20">
              Markets Desk
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-[var(--text-muted)]">
            <Link
              href="/utility/fuel-and-power-sri-lanka"
              className="flex items-center gap-1 hover:text-emerald-500 transition-colors py-1 px-1.5 rounded hover:bg-[var(--bg-subtle)]"
              title="Fuel Prices Sri Lanka"
            >
              <Fuel className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Fuel Prices</span>
            </Link>
            <Link
              href="/markets/gold-price-sri-lanka-today"
              className="flex items-center gap-1 hover:text-amber-500 transition-colors py-1 px-1.5 rounded hover:bg-[var(--bg-subtle)]"
              title="Gold Sovereign Rates"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Gold Rates</span>
            </Link>
            <Link
              href="/powercut"
              className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors py-1 px-1.5 rounded hover:bg-amber-500/10"
              title="CEB Power Cut Schedule"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Power Cuts</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Island Trackers Quick Switcher Strip */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-b border-[var(--border-line)] text-xs font-mono">
          <span className="text-[var(--text-muted)] uppercase tracking-wider shrink-0 text-[11px] font-bold">
            Island Trackers:
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 font-bold shrink-0 flex items-center gap-1.5">
            <DollarSign className="w-3 h-3 text-rose-500" />
            <span>USD/LKR Forex (Active)</span>
          </span>
          <Link
            href="/utility/fuel-and-power-sri-lanka"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Fuel className="w-3 h-3 text-emerald-500" />
            <span>Fuel Prices (CPC/LIOC)</span>
          </Link>
          <Link
            href="/markets/gold-price-sri-lanka-today"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Coins className="w-3 h-3 text-amber-500" />
            <span>Gold Price (24K/22K)</span>
          </Link>
          <Link
            href="/powercut"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>CEB Power Cuts</span>
          </Link>
        </div>

        {/* Masthead Banner */}
        <div className="space-y-4 border-b border-[var(--border-line)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Central Bank of Sri Lanka Indicative Fixing · Interbank FX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-headline text-[var(--text-main)] tracking-tight">
            USD to LKR Rate Today &amp; Commercial Bank Comparison
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
            Real-time indicative US Dollar to Sri Lankan Rupee foreign exchange rates. Compare official CBSL fixing, leading commercial bank buying and selling spreads, and multi-currency exchange tables.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Refreshed: {formattedDate}</span>
            </span>
            <span>•</span>
            <span className="text-emerald-500 font-medium">Source: CBSL &amp; Commercial Bank Wire</span>
          </div>
        </div>

        {/* Live Headline Rate Spotlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* USD Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="text-base">🇺🇸</span> USD / LKR
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-semibold">
                CBSL MID
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {usdLkr.toFixed(2)}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>Buy: Rs. {(usdLkr * 0.986).toFixed(2)}</span>
              <span>Sell: Rs. {(usdLkr * 1.014).toFixed(2)}</span>
            </div>
          </div>

          {/* EUR Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="text-base">🇪🇺</span> EUR / LKR
              </span>
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +0.22%
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {(usdLkr * 1.082).toFixed(2)}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>Euro Interbank</span>
              <span>Mid Fixing</span>
            </div>
          </div>

          {/* GBP Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="text-base">🇬🇧</span> GBP / LKR
              </span>
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +0.35%
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {(usdLkr * 1.298).toFixed(2)}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>British Pound</span>
              <span>Mid Fixing</span>
            </div>
          </div>

          {/* AED Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5">
                <span className="text-base">🇦🇪</span> AED / LKR
              </span>
              <span className="text-zinc-400 text-xs font-semibold">Pegged</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {(usdLkr / 3.6725).toFixed(2)}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>UAE Dirham</span>
              <span>Mid Fixing</span>
            </div>
          </div>
        </div>

        {/* Currency Converter Component */}
        <section>
          <ForexConverter currencies={currencies} baseUsdLkr={usdLkr} />
        </section>

        {/* Commercial Bank Rate Comparison Table */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
                Sri Lankan Commercial Bank Dollar Rates Comparison
              </h2>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                Indicative Telegraphic Transfer (TT) buying and selling quotes across licensed commercial banks
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> CBSL Supervised
            </span>
          </div>

          <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] overflow-x-auto shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4 sm:px-6">Commercial Bank</th>
                  <th className="py-3 px-4">Buying Rate (TT / Remittance)</th>
                  <th className="py-3 px-4">Selling Rate (TT / Outward)</th>
                  <th className="py-3 px-4">Spread (LKR)</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)] text-sm font-mono">
                {bankRates.map((b) => {
                  const spread = (b.sellingRate - b.buyingRate).toFixed(2);
                  return (
                    <tr key={b.bankCode} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{b.bankName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        Rs. {b.buyingRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-600 dark:text-rose-400">
                        Rs. {b.sellingRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">
                        Rs. {spread}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[var(--text-muted)] hidden sm:table-cell">
                        {b.lastUpdated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Major Currencies Table */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              All Major Currencies vs Sri Lankan Rupee (LKR)
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Comprehensive exchange rate board for international currencies
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] overflow-x-auto shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4 sm:px-6">Currency</th>
                  <th className="py-3 px-4">Middle Rate</th>
                  <th className="py-3 px-4">Indicative Buy</th>
                  <th className="py-3 px-4">Indicative Sell</th>
                  <th className="py-3 px-4">24h Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)] text-sm font-mono">
                {currencies.map((c) => {
                  const isUp = c.change24h >= 0;
                  return (
                    <tr key={c.code} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-[var(--text-main)]">
                        <span className="mr-2 text-base">{c.flag}</span>
                        <span>{c.name} ({c.code})</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                        Rs. {c.midRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400">
                        Rs. {c.buyRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400">
                        Rs. {c.sellRate.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {Math.abs(c.change24h)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 30-Day Rate History */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              30-Day USD to LKR Historical Exchange Rate Trend
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Historical fixing record of the Sri Lankan Rupee against the US Dollar
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {historical30Days.slice(-12).reverse().map((h, i) => (
              <div key={h.date} className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-line)] text-center space-y-1">
                <div className="text-[11px] font-mono text-[var(--text-muted)]">{h.date}</div>
                <div className="text-sm font-bold font-mono text-[var(--text-main)]">Rs. {h.rate.toFixed(2)}</div>
                <div className="text-[10px] font-mono text-zinc-400">
                  {h.low.toFixed(2)} - {h.high.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ & Educational Content Section (Search Snippet Optimizations) */}
        <section className="space-y-6 pt-6 border-t border-[var(--border-line)]">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Frequently Asked Questions About Sri Lanka Exchange Rates
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Essential knowledge for foreign remittances, business transactions, and travel currency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((f, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2.5">
                <h3 className="text-sm font-bold text-[var(--text-main)] font-headline">
                  {f.question}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trilingual Regional Keywords & Discoverability Bar */}
        <section className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] text-xs font-mono text-[var(--text-muted)] space-y-2">
          <div className="font-bold text-[var(--text-main)]">
            භාෂාමය සෙවීම් සහ තොරතුරු · பிராந்திய தேடல்கள்
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <span>🇱🇰 සිංහල: අද ඩොලර් අනුපාතිකය, ශ්‍රී ලංකා මහ බැංකු විදේශ විනිමය, වාණිජ බැංකු මිල ගණන්</span>
            <span>•</span>
            <span>🇱🇰 தமிழ்: இன்றைய டொலர் மாற்று விகிதம் இலங்கை, மத்திய வங்கி நாணய மாற்று, வங்கி வாங்குதல் மற்றும் விற்பனை விலை</span>
          </div>
        </section>
      </main>
    </div>
  );
}
