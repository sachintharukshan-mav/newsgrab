import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Fuel,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = "How Sri Lanka's Fuel Pricing Formula Works: Platts Singapore to Pump Parity";
  const description =
    'Comprehensive economic and regulatory guide explaining how Sri Lanka calculates retail fuel prices. Analysis of Platts Singapore benchmarks, freight, customs duties, distributor margins, and CPC vs. LIOC price differentials.';
  const enUrl = `${SITE_URL}/guides/sri-lanka-fuel-pricing-formula-explained`;

  return {
    title,
    description,
    keywords: [
      'sri lanka fuel pricing formula explained',
      'how cpc calculates fuel prices',
      'platts singapore benchmark sri lanka',
      'petrol diesel import cost sri lanka',
      'ceypetco vs lanka ioc price difference',
      'customs duty fuel sri lanka',
      'fuel price revision formula ministry of power and energy',
    ],
    alternates: {
      canonical: enUrl,
    },
    openGraph: {
      title,
      description,
      url: enUrl,
      siteName: 'LANKA DISPATCH',
      type: 'article',
      publishedTime: '2026-11-01T00:00:00Z',
      modifiedTime: new Date().toISOString(),
      authors: ['Lanka Dispatch Energy & Commodity Desk'],
      section: 'Energy & Commodities',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function FuelPricingPillarGuidePage() {
  const SITE_URL = getSiteUrl();
  const pageUrl = `${SITE_URL}/guides/sri-lanka-fuel-pricing-formula-explained`;

  const faqItems = [
    {
      q: 'Why does Sri Lanka use Platts Singapore rather than Brent Crude for fuel pricing?',
      a: 'Brent Crude reflects raw, unrefined oil traded on European exchanges. Sri Lanka primarily imports refined petroleum products (finished petrol, auto diesel, and aviation turbine fuel) because the Sapugaskanda refinery fulfills only a fraction of domestic demand. Platts Singapore is the official benchmark pricing index for refined distillates across the Asian trading basin.',
    },
    {
      q: 'What are the main cost components that determine 1 litre of petrol in Sri Lanka?',
      a: 'The price of one litre comprises five core layers: (1) Free On Board (FOB) Singapore Platts price, (2) Ocean freight, marine insurance, and oceanic losses (CIF), (3) Government import taxes including Customs Import Duty, Ports and Airports Development Levy (PAL), and Excise Duty, (4) Operational financing, demurrage, and terminal handling charges, and (5) Wholesaler/dealer retail commissions.',
    },
    {
      q: 'Why do Petrol 95 and Super Diesel prices differ between Ceypetco, Lanka IOC, and Sinopec?',
      a: 'While the Ministry of Power and Energy mandates uniform retail pricing for staple mass fuels (Petrol 92 and Auto Diesel), premium fuels (Petrol 95 Octane and Super Diesel) are subject to commercial brand differentiation. Lanka IOC and Sinopec incur private commercial financing and specialized additive formulation costs that result in modest price margins (Rs. 5 to Rs. 27 per litre) compared to state-subsidized Ceypetco benchmarks.',
    },
    {
      q: 'How does currency depreciation (USD/LKR) affect local fuel pump prices?',
      a: 'Because all refined fuel shipments are invoiced in United States Dollars (USD), any depreciation of the Sri Lankan Rupee against the dollar immediately inflates the landed cost per litre, even if global oil prices remain flat. Conversely, rupee appreciation creates domestic fiscal space for price reductions.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: "How Sri Lanka's Fuel Pricing Formula Works: From Singapore Platts to Local Pump Parity",
        description:
          'Comprehensive economic investigation into Sri Lanka retail fuel pricing, cost-reflective pricing formulas, Platts benchmarks, import duties, and distributor margins.',
        inLanguage: 'en-LK',
        datePublished: '2026-11-01T00:00:00Z',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Lanka Dispatch Energy & Commodity Desk',
          url: `${SITE_URL}/about#masthead`,
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'LANKA DISPATCH',
          url: SITE_URL,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header */}
      <header className="border-b border-[var(--border-line)] bg-[var(--bg-card)]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to In-Depth Guides</span>
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
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Masthead */}
        <header className="space-y-4 border-b border-[var(--border-line)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
            <Fuel className="w-3.5 h-3.5" />
            <span>Lanka Dispatch Commodity Intelligence · Energy Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] font-headline leading-tight">
            How Sri Lanka&apos;s Fuel Pricing Formula Works: From Singapore Platts to the Pump
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published: November 2026 Analysis</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>10 min comprehensive read</span>
            </span>
            <span>•</span>
            <span className="text-[var(--text-main)] font-semibold">
              Authored by Lanka Dispatch Energy Desk
            </span>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border-l-4 border-emerald-600 border-[var(--border-line)] space-y-3 shadow-sm">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Overview</span>
          </h2>
          <p className="text-sm text-[var(--text-body)] leading-relaxed">
            Few economic indicators affect Sri Lankan household inflation and commercial transportation more directly than retail fuel prices. Following the catastrophic 2022 balance-of-payments crisis, Sri Lanka formally eliminated ad-hoc political fuel subsidies and established an automated, cost-reflective pricing formula administered by the Ministry of Power and Energy. This investigation details the exact mechanical breakdown that converts international tanker cargo rates into local retail pump figures.
          </p>
        </section>

        {/* Section 1: The Platts Singapore Benchmark */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            1. Why Platts Singapore Dictates Sri Lankan Fuel Prices
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            While international business news predominantly cites Brent Crude or West Texas Intermediate (WTI), those figures represent unprocessed raw crude oil extracted from wellheads. Sri Lanka does not possess domestic refining capacity capable of supplying national demand; the state-owned Sapugaskanda refinery, built in 1969, satisfies less than 25% of national liquid fuel requirements.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Consequently, the Ceylon Petroleum Corporation (CPC), Lanka IOC (LIOC), and Sinopec must procure fully refined petroleum products directly from major regional export terminals in Singapore, India, and the Arabian Gulf. S&amp;P Global Platts Singapore is the universally accepted daily pricing mechanism for these refined fuels.
          </p>
        </section>

        {/* Section 2: Mathematical Breakdown of a Litre */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            2. The Anatomy of One Litre of Fuel: The 5 Core Layers
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Every litre pumped into a vehicle tank in Colombo, Kandy, or Jaffna represents the sum of five distinct statutory and commercial cost components:
          </p>

          <div className="space-y-3 my-4">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Layer 1: Free On Board (FOB) Landing Cost
              </div>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                The international purchase price of the refined distillate at the export terminal, indexed directly to Singapore Platts benchmarks over the preceding 20-day trading window.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-1">
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                Layer 2: Freight, War-Risk Insurance &amp; Oceanic Losses (CIF)
              </div>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                The cost of chartered marine oil tankers, voyage bunker fuel, maritime security (especially across Red Sea and Gulf transit lanes), and statutory evaporation/handling allowances during transit to the Port of Colombo or Trincomalee.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-1">
              <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                Layer 3: Statutory Government Customs &amp; Fiscal Levies
              </div>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Direct state revenue extraction, including Customs Import Duty, Ports and Airports Development Levy (PAL), and Excise Duty. These fiscal levies typically account for 20% to 35% of the pump price.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-1">
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
                Layer 4: Operating Costs, Financing &amp; Buffer Storage
              </div>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Financing costs associated with Letters of Credit (LCs), commercial interest charges from state banks, demurrage penalties paid to delayed tankers, and inland pipeline pipeline pumping to Kolonnawa and Muthurajawela terminals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-1">
              <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                Layer 5: Retail Dealer Commission &amp; Distributor Margin
              </div>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                The legally regulated sales commission paid to filling station franchise operators, currently fixed at approximately 2.5% to 3.5% of the retail pump price per litre to cover site operations, electricity, and forecourt staff wages.
              </p>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Tracker Callout */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-900/20 via-teal-900/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-500 uppercase">
              <BarChart3 className="w-4 h-4" />
              <span>Explore 36-Year Historical Archive</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] font-headline">
              Interactive Sri Lanka Fuel Price Tracker (1990–2026)
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-xl">
              Inspect historical inflation curves, export clean CSV datasets, and view official Ceypetco, Lanka IOC, and Sinopec retail price schedules.
            </p>
          </div>
          <Link
            href="/utility/fuel-and-power-sri-lanka"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-lg"
          >
            <span>Launch Tracker</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Section 3: CPC vs. Lanka IOC Discrepancy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            3. Why Do Retail Prices Vary Between Fuel Brands?
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Under the current Ministry regulations, state-mandated parity applies strictly to high-volume essential fuels: <strong>Petrol 92 Octane</strong> and <strong>Auto Diesel</strong>. Regardless of whether a motorist refuels at a Ceypetco, Lanka IOC, or Sinopec dealer, these two staples are priced identically to prevent economic distortion.
          </p>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            In contrast, for specialty and premium formulations:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-[var(--text-body)] pl-2">
            <li>
              <strong>Petrol 95 Octane:</strong> Ceypetco retails at Rs. 490 per litre, whereas Lanka IOC and Sinopec retail at Rs. 495 per litre (reflecting a Rs. 5 per litre commercial formulation spread).
            </li>
            <li>
              <strong>Super Diesel:</strong> Ceypetco and Sinopec retail at Rs. 543 per litre, while Lanka IOC officially prices its Euro 4/5 Super Diesel at Rs. 570 per litre (a Rs. 27 per litre differential due to imported proprietary combustion additives).
            </li>
            <li>
              <strong>Domestic Kerosene:</strong> Heavily subsidized and sold exclusively through state-owned CPC stations and cooperative MPCS societies at Rs. 285 per litre to safeguard low-income households and coastal fishing communities.
            </li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-4 border-t border-[var(--border-line)]">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Authoritative insights into energy regulation and fuel economics in Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2"
              >
                <h3 className="text-sm font-bold text-[var(--text-main)] leading-snug">
                  {faq.q}
                </h3>
                <p className="text-xs text-[var(--text-body)] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-[var(--border-line)] text-xs font-mono text-[var(--text-muted)] space-y-2">
          <p>
            <strong>Editorial Transparency:</strong> Researched and compiled independently by the Lanka Dispatch Energy &amp; Macroeconomic Desk using verified Central Bank of Sri Lanka (CBSL) statistical bulletins, CPC annual reports, and Platts Singapore market data.
          </p>
          <div className="flex items-center justify-between pt-4">
            <div>&copy; {new Date().getFullYear()} LANKA DISPATCH. Colombo, Sri Lanka.</div>
            <Link href="/utility/fuel-and-power-sri-lanka" className="text-emerald-500 hover:underline">
              View Today&apos;s Live Fuel Prices &rarr;
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
