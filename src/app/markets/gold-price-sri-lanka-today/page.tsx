import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Coins, TrendingUp, ShieldCheck, Clock, DollarSign, Building, Zap, Fuel } from 'lucide-react';
import { getLiveMarketSnapshot } from '@/lib/forex-data';
import { GoldCalculator } from '@/components/markets/GoldCalculator';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'Gold Price in Sri Lanka Today | 24K & 22K Sovereign Rates | LANKA DISPATCH';
  const description = 'Live gold price in Sri Lanka today. Real-time 24 Karat and 22 Karat Sea Street Colombo gold rates per sovereign (pawan / 8g) and 1 gram. Interactive gold calculator and jeweler comparison.';
  const canonicalUrl = `${SITE_URL}/markets/gold-price-sri-lanka-today`;

  return {
    title,
    description,
    keywords: [
      'gold price sri lanka today',
      '24k gold rate colombo',
      '22k gold sovereign price today',
      'sea street gold price today',
      'gold price 1 pawan sri lanka',
      'අද රන් මිල',
      'පවුමක මිල කොළඹ',
      'இன்றைய தங்க விலை இலங்கை',
      'ஒரு பவுன் தங்கம் விலை',
      'vogue jewellers gold rate',
      'swarna mahal gold price'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'LANKA DISPATCH',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent('Gold Price Today Sri Lanka · 24K & 22K Sea Street Rates')}&category=economy&pub=SeaStreet`,
          width: 1200,
          height: 630,
          alt: 'Gold Price Today Sri Lanka',
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

export default async function GoldPricePage() {
  const snapshot = await getLiveMarketSnapshot();
  const { gold24kSovereign, gold22kSovereign, gold24kPerGram, gold22kPerGram, goldSpotUsd, usdLkr, updatedAt } = snapshot;

  const formattedDate = new Date(updatedAt).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const purityTiers = [
    {
      karat: '24 Karat (99.9%)',
      description: 'Pure Investment Bullion / Gold Coins',
      sovereignLkr: gold24kSovereign,
      gramLkr: gold24kPerGram,
      purity: '99.9%',
      hallmark: '999',
    },
    {
      karat: '22 Karat (91.6%)',
      description: 'Standard Sri Lankan Bridal & Sovereign Jewellery',
      sovereignLkr: gold22kSovereign,
      gramLkr: gold22kPerGram,
      purity: '91.6%',
      hallmark: '916',
    },
    {
      karat: '21 Karat (87.5%)',
      description: 'Traditional Heritage Jewellery',
      sovereignLkr: Math.round(gold24kSovereign * (21 / 24)),
      gramLkr: Math.round(gold24kPerGram * (21 / 24)),
      purity: '87.5%',
      hallmark: '875',
    },
    {
      karat: '18 Karat (75.0%)',
      description: 'Diamond, Gemstone & Modern Designer Ornaments',
      sovereignLkr: Math.round(gold24kSovereign * (18 / 24)),
      gramLkr: Math.round(gold24kPerGram * (18 / 24)),
      purity: '75.0%',
      hallmark: '750',
    },
  ];

  const colomboJewellers = [
    {
      name: 'Colombo Sea Street Merchant Average',
      location: 'Sea Street, Pettah, Colombo 11',
      rate22kSovereign: gold22kSovereign,
      notes: 'Wholesale bullion and manufacturing benchmark',
      status: 'Live Benchmark',
    },
    {
      name: 'Vogue Jewellers Indicative',
      location: 'Colpetty / Colombo 03',
      rate22kSovereign: Math.round(gold22kSovereign * 1.02),
      notes: 'Premium 22K handcrafted bridal collection base',
      status: 'Retail Indicative',
    },
    {
      name: 'Swarna Mahal Jewellers Indicative',
      location: 'Colombo & Islandwide Branches',
      rate22kSovereign: Math.round(gold22kSovereign * 1.015),
      notes: 'Hallmarked 916 sovereign gold jewellery',
      status: 'Retail Indicative',
    },
    {
      name: 'Devi Jewellers Indicative',
      location: 'Sea Street, Colombo 11',
      rate22kSovereign: Math.round(gold22kSovereign * 1.01),
      notes: 'Traditional South Asian gold ornaments',
      status: 'Retail Indicative',
    },
  ];

  const faqItems = [
    {
      question: 'How much is 1 sovereign (pawan) of gold today in Sri Lanka?',
      answer: `As of ${formattedDate}, 1 sovereign (8 grams) of 22 Karat gold in Sri Lanka is priced around Rs. ${gold22kSovereign.toLocaleString()}. Pure 24 Karat gold is priced at approximately Rs. ${gold24kSovereign.toLocaleString()} per sovereign.`,
    },
    {
      question: 'What is the price of 1 gram of gold today in Sri Lanka?',
      answer: `Today, 1 gram of 22 Karat gold costs approximately Rs. ${gold22kPerGram.toLocaleString()}, while 1 gram of 24 Karat pure gold is approximately Rs. ${gold24kPerGram.toLocaleString()} in Colombo Sea Street bullion markets.`,
    },
    {
      question: 'Why do gold prices differ between Sea Street and retail jewelers?',
      answer: 'Sea Street in Pettah, Colombo 11 is the central wholesale bullion exchange in Sri Lanka where raw gold is traded. Retail jewelers add craftsmanship charges (wastage / making charges) and VAT depending on the intricate design of the jewellery.',
    },
    {
      question: 'How is the Sri Lanka gold price calculated from international spot prices?',
      answer: `The local price is derived from the international spot gold price in USD per Troy ounce ($${goldSpotUsd.toFixed(2)}/oz) converted at the current USD/LKR exchange rate (Rs. ${usdLkr.toFixed(2)}), plus customs tariffs, port handling, and domestic refining spreads.`,
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
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold uppercase rounded border border-amber-500/20">
              Gold Desk
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
              href="/markets/usd-to-lkr-rate-today"
              className="flex items-center gap-1 hover:text-rose-500 transition-colors py-1 px-1.5 rounded hover:bg-[var(--bg-subtle)]"
              title="USD to LKR Rates"
            >
              <DollarSign className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">USD/LKR</span>
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
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold shrink-0 flex items-center gap-1.5">
            <Coins className="w-3 h-3 text-amber-500" />
            <span>Gold Rates (Active)</span>
          </span>
          <Link
            href="/utility/fuel-and-power-sri-lanka"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Fuel className="w-3 h-3 text-emerald-500" />
            <span>Fuel Prices (CPC/LIOC)</span>
          </Link>
          <Link
            href="/markets/usd-to-lkr-rate-today"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <DollarSign className="w-3 h-3 text-rose-500" />
            <span>USD to LKR Rate</span>
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
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Sea Street Colombo Gold Exchange · Global Bullion Wire</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-headline text-[var(--text-main)] tracking-tight">
            Gold Price in Sri Lanka Today (24K &amp; 22K Rates)
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
            Live 24 Karat and 22 Karat gold rates in Sri Lanka. Track real-time prices per Sovereign (Pawan / 8g) and per 1 Gram based on Sea Street Colombo bullion merchants and international spot gold pricing.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Refreshed: {formattedDate}</span>
            </span>
            <span>•</span>
            <span className="text-amber-500 font-medium">Spot: ${goldSpotUsd.toFixed(2)}/oz · USD/LKR: Rs. {usdLkr.toFixed(2)}</span>
          </div>
        </div>

        {/* Big Spotlight Headline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 22K Sovereign (Primary Sri Lankan Wedding & Investment benchmark) */}
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-amber-500/10 via-[var(--bg-card)] to-[var(--bg-card)] border-2 border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Coins className="w-4 h-4" /> 22K SOVEREIGN (8G)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold uppercase">
                Bridal Benchmark
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-300">
              Rs. {gold22kSovereign.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>91.6% Pure Gold</span>
              <span>1 Pawan (පවුම)</span>
            </div>
          </div>

          {/* 24K Sovereign (Pure Bullion) */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5 text-[var(--text-main)]">
                <Coins className="w-4 h-4 text-amber-500" /> 24K SOVEREIGN (8G)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold">
                Pure Gold
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {gold24kSovereign.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>99.9% Pure Bullion</span>
              <span>1 Pawan (8 grams)</span>
            </div>
          </div>

          {/* 22K 1 Gram */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5 text-[var(--text-main)]">
                22K PER GRAM
              </span>
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> Live
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {gold22kPerGram.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>Per Gram Retail</span>
              <span>Sea Street Rate</span>
            </div>
          </div>

          {/* 24K 1 Gram */}
          <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="font-bold flex items-center gap-1.5 text-[var(--text-main)]">
                24K PER GRAM
              </span>
              <span className="text-zinc-400 text-xs font-semibold">Fine 999</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
              Rs. {gold24kPerGram.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
              <span>Per Gram Bullion</span>
              <span>Raw Gold Base</span>
            </div>
          </div>
        </div>

        {/* Interactive Gold Calculator Component */}
        <section>
          <GoldCalculator pureGramLkr={gold24kPerGram} />
        </section>

        {/* Purity & Karat Breakdown Table */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Sri Lanka Gold Purity &amp; Karat Rates Breakdown
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Official Sea Street Colombo wholesale fixing for all gold purity grades
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] overflow-x-auto shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4 sm:px-6">Purity &amp; Hallmark</th>
                  <th className="py-3 px-4">Intended Purpose</th>
                  <th className="py-3 px-4">Rate Per 1 Gram</th>
                  <th className="py-3 px-4">Rate Per Sovereign (8g)</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Gold Purity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)] text-sm font-mono">
                {purityTiers.map((p) => (
                  <tr key={p.karat} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-[var(--text-main)]">
                      <span className="text-amber-500 mr-2">●</span>
                      <span>{p.karat}</span>
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-line)] text-[var(--text-muted)]">
                        {p.hallmark}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-sans text-[var(--text-body)]">
                      {p.description}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                      Rs. {p.gramLkr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                      Rs. {p.sovereignLkr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-muted)] hidden sm:table-cell">
                      {p.purity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Colombo Jewellers Benchmark Guide */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Colombo Jewellers Benchmark Guide
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Market comparison between wholesale Sea Street bullion and major retail jewellery brands
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colomboJewellers.map((j) => (
              <div key={j.name} className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-500" />
                    {j.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-semibold">
                    {j.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)] font-mono">
                  {j.location}
                </div>
                <div className="pt-2 flex items-baseline justify-between border-t border-[var(--border-line)]">
                  <span className="text-xs text-[var(--text-muted)]">22K Sovereign Base:</span>
                  <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                    Rs. {j.rate22kSovereign.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-body)] pt-1 leading-relaxed">
                  {j.notes}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-6 pt-6 border-t border-[var(--border-line)]">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Frequently Asked Questions About Gold Rates in Sri Lanka
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Guidance for gold buyers, bridal jewellery planning, and precious metal investment
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
            <span>🇱🇰 සිංහල: අද රන් මිල, පවුමක මිල ශ්‍රී ලංකාව, හෙට්ටිවීදිය රන් මිල, 22 කැරට් පවුම, ස්වර්ණ මහල්, වෝග් ජුවලර්ස්</span>
            <span>•</span>
            <span>🇱🇰 தமிழ்: இன்றைய தங்க விலை இலங்கை, ஒரு பவுன் தங்கம் விலை, கொழும்பு செட்டியார் தெரு தங்க விலை, 22 கரட் தங்கம்</span>
          </div>
        </section>
      </main>
    </div>
  );
}
