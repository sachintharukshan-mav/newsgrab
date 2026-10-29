import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Fuel, Zap, ShieldCheck, Clock, PhoneCall, AlertTriangle, ExternalLink, MapPin, DollarSign, Coins } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';
import { getFuelSnapshot } from '@/lib/fuel-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'Sri Lanka Fuel Prices Today & CEB Power Alerts | LANKA DISPATCH';
  const description = 'Latest CPC, Lanka IOC, and Sinopec fuel prices in Sri Lanka. Petrol 92, Petrol 95, Auto Diesel, Super Diesel, and CEB rotational power cut schedule status.';
  const enUrl = `${SITE_URL}/utility/fuel-and-power-sri-lanka`;
  const siUrl = `${SITE_URL}/si/utility/fuel-and-power-sri-lanka`;
  const taUrl = `${SITE_URL}/ta/utility/fuel-and-power-sri-lanka`;
  const canonicalUrl = enUrl;

  return {
    title,
    description,
    keywords: [
      'fuel price sri lanka today',
      'cpc petrol 92 price',
      'petrol price today colombo',
      'auto diesel price sri lanka',
      'lioc fuel prices',
      'sinopec petrol 92 diesel',
      'ceb power cut schedule today',
      'ඉන්ධන මිල අද',
      'ලංකා අයිඕසී ඉන්ධන මිල',
      'இலங்கை எரிபொருள் விலை',
      'இன்றைய பெட்ரோல் டீசல் விலை'
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
          url: `${SITE_URL}/api/og?title=${encodeURIComponent('Sri Lanka Fuel Prices Today & CEB Grid Status')}&category=economy&pub=MinistryOfPower`,
          width: 1200,
          height: 630,
          alt: 'Sri Lanka Fuel Prices Today',
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

export default async function FuelAndPowerPage() {
  const { fuelTypes, lastRevisionDate, nextFormulaRevision } = await getFuelSnapshot();

  const pet92 = fuelTypes.find((f) => f.shortName === 'Petrol 92')?.cpcPrice ?? 414;
  const pet95 = fuelTypes.find((f) => f.shortName === 'Petrol 95')?.cpcPrice ?? 475;
  const diesel = fuelTypes.find((f) => f.shortName === 'Auto Diesel')?.cpcPrice ?? 392;
  const superDiesel = fuelTypes.find((f) => f.shortName === 'Super Diesel')?.cpcPrice ?? 528;
  const kerosene = fuelTypes.find((f) => f.shortName === 'Kerosene')?.cpcPrice ?? 285;

  const emergencyHotlines = [
    { name: 'Ceylon Petroleum Corporation (CPC)', hotline: '1944', desc: 'Fuel availability, delivery complaints, bowser tracking' },
    { name: 'Lanka IOC Customer Helpline', hotline: '011 247 5720', desc: 'Lanka IOC filling station issues & fuel cards' },
    { name: 'Ceylon Electricity Board (CEB)', hotline: '1987', desc: 'Fault reporting, line breakdowns, emergency outages' },
    { name: 'Lanka Electricity Company (LECO)', hotline: '1910', desc: 'Coastal belt electricity supply issues & metering' },
  ];

  const faqItems = [
    {
      question: 'What is the price of Petrol 92 in Sri Lanka today?',
      answer: `Petrol 92 Octane is officially retail priced at Rs. ${pet92} per litre across Ceylon Petroleum Corporation (CPC), Lanka IOC (LIOC), and Sinopec fuel stations islandwide.`,
    },
    {
      question: 'What is the price of Auto Diesel in Sri Lanka today?',
      answer: `Auto Diesel is priced at Rs. ${diesel} per litre, while Super Diesel is priced at Rs. ${superDiesel} per litre at all licensed filling stations in Sri Lanka.`,
    },
    {
      question: 'What is the price of Petrol 95 in Sri Lanka today?',
      answer: `Petrol 95 Octane is priced at Rs. ${pet95} per litre at CPC and Sinopec filling stations, and Rs. 495 per litre at Lanka IOC stations.`,
    },
    {
      question: 'How often are fuel prices revised in Sri Lanka?',
      answer: 'Fuel prices in Sri Lanka are revised periodically by the Ministry of Power and Energy in accordance with the automated cost-reflective pricing formula grounded on global Platts Singapore refined oil benchmarks.',
    },
    {
      question: 'Where can I check today\'s CEB power cut schedule?',
      answer: 'You can inspect the full 25-district interactive map and CEB time slots by visiting the Lanka Dispatch Interactive Power Cut Area Tracker at lankadispatch.com/powercut.',
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
              Utility Desk
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-[var(--text-muted)]">
            <Link
              href="/markets/usd-to-lkr-rate-today"
              className="flex items-center gap-1 hover:text-rose-500 transition-colors py-1 px-1.5 rounded hover:bg-[var(--bg-subtle)]"
              title="USD to LKR Exchange Rates"
            >
              <DollarSign className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">USD/LKR</span>
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
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold shrink-0 flex items-center gap-1.5">
            <Fuel className="w-3 h-3 text-emerald-500" />
            <span>Fuel Prices (Active)</span>
          </span>
          <Link
            href="/markets/usd-to-lkr-rate-today"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <DollarSign className="w-3 h-3 text-rose-500" />
            <span>USD to LKR Rate</span>
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
            <span>Ministry of Power and Energy Automated Pricing Formula · Active Cycle</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-headline text-[var(--text-main)] tracking-tight">
            Sri Lanka Fuel Prices Today (CPC, LIOC &amp; Sinopec)
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
            Official retail pump rates for Petrol, Auto Diesel, Super Diesel, and Kerosene in Sri Lanka. Grounded in the Ministry of Power and Energy monthly pricing revision cycle.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Monthly Revision: {lastRevisionDate}</span>
            </span>
            <span>•</span>
            <span className="text-rose-500 font-medium">Next Revision Due: {nextFormulaRevision}</span>
            <span>•</span>
            <a
              href="https://ceypetco.gov.lk/marketing-sales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent-emerald)] hover:underline font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Official CEYPETCO Portal Live Sync</span>
            </a>
          </div>
        </div>

        {/* Primary Pump Rate Spotlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {fuelTypes.slice(0, 4).map((f) => (
            <div
              key={f.shortName}
              className={`p-5 sm:p-6 rounded-xl bg-[var(--bg-card)] border ${
                f.popular ? 'border-rose-500/30 shadow-xl' : 'border-[var(--border-line)] shadow-lg'
              } space-y-3`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span className="font-bold flex items-center gap-1.5 text-[var(--text-main)]">
                  <Fuel className="w-4 h-4 text-rose-500" /> {f.shortName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold">
                  Per Litre
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)]">
                Rs. {f.cpcPrice}
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-line)]">
                <span>CPC / LIOC / Sinopec</span>
                {f.change !== 0 ? (
                  <span className={f.change < 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                    {f.change < 0 ? `▼ Rs. ${Math.abs(f.change)}` : `▲ Rs. ${f.change}`}
                  </span>
                ) : (
                  <span className="text-zinc-400">Unchanged</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comprehensive Retail Fuel Price Board */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Official Sri Lanka Pump Prices by Fuel Category
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Fixed islandwide parity across Ceylon Petroleum Corporation (CPC), Lanka IOC, and Sinopec
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] overflow-x-auto shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4 sm:px-6">Fuel Product</th>
                  <th className="py-3 px-4">CPC Price / Litre</th>
                  <th className="py-3 px-4">Lanka IOC Price</th>
                  <th className="py-3 px-4">Sinopec Price</th>
                  <th className="py-3 px-4">Last Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)] text-sm font-mono">
                {fuelTypes.map((f) => (
                  <tr key={f.name} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-[var(--text-main)]">
                      <div>{f.name}</div>
                      <div className="text-[11px] font-normal text-[var(--text-muted)]">{f.fuelBadge}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                      Rs. {f.cpcPrice}.00
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                      Rs. {f.liocPrice}.00
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                      Rs. {f.sinopecPrice}.00
                    </td>
                    <td className="py-3.5 px-4">
                      {f.change !== 0 ? (
                        <span className={`inline-flex items-center text-xs font-semibold ${f.change < 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {f.change < 0 ? `▼ Reduced by Rs. ${Math.abs(f.change)}` : `▲ Increased by Rs. ${f.change}`}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">No Change</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CEB Power Alerts Callout Banner */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[var(--bg-card)] to-amber-500/5 border border-amber-500/30 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Ceylon Electricity Board (CEB) Grid Management</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
                Interactive Power Cut Schedule &amp; Sub-station Map
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
                Find your exact area, CEB Group (Groups 1–4), and 1-hour rotational time slot on our interactive 25-district map.
              </p>
            </div>
            <Link
              href="/powercut"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>Open Powercut Map</span>
              <MapPin className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Emergency Fuel & Utility Hotlines */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Emergency Utility &amp; Breakdown Hotlines
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Direct telephone contact numbers for public interest reporting and assistance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyHotlines.map((h) => (
              <div key={h.name} className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--text-main)]">{h.name}</span>
                  <a
                    href={`tel:${h.hotline.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{h.hotline}</span>
                  </a>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-6 pt-6 border-t border-[var(--border-line)]">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
              Frequently Asked Questions About Sri Lanka Fuel Prices
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Essential facts about the monthly fuel formula and electricity distribution
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
            <span>🇱🇰 සිංහල: ඉන්ධන මිල අද, පෙට්‍රල් 92 මිල, ඔටෝ ඩීසල් මිල, සුපර් ඩීසල්, භූමිතෙල් මිල, සීපීසී ඉන්ධන සංශෝධනය</span>
            <span>•</span>
            <span>🇱🇰 தமிழ்: இலங்கை எரிபொருள் விலை, இன்றைய பெட்ரோல் 92 விலை, டீசல் விலை, மண்ணெண்ணெய் விலை, சிபிசி எரிபொருள்</span>
          </div>
        </section>
      </main>
    </div>
  );
}
