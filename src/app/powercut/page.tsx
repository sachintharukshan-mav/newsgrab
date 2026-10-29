import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Zap, ShieldCheck, Fuel, DollarSign, Coins } from 'lucide-react';
import { PowerCutTracker } from '@/components/powercut/PowerCutTracker';
import { PowerCutExpiredNotice } from '@/components/powercut/PowerCutExpiredNotice';
import { isPowercutScheduleExpired } from '@/data/powercut-schedule';

export const metadata: Metadata = {
  title: 'Sri Lanka Power Cut Schedule & Interactive Area Map | Lanka Dispatch',
  description: 'Official 1-hour rotational CEB power cut schedule approved by PUCSL for October 19, 20, 21, 2026. Interactive 25-district map, group times (Groups 1–4), sub-stations, and area finder.',
  keywords: [
    'Sri Lanka power cut schedule',
    'CEB power cut times today',
    'PUCSL power cut schedule',
    'Sri Lanka power cut map',
    'CEB group 1 2 3 4 times',
    'power cut areas Colombo Kandy Galle',
    'Lakvijaya power plant Norochcholai'
  ],
  openGraph: {
    title: 'Sri Lanka Power Cut Schedule & Interactive Area Map | Lanka Dispatch',
    description: 'Find your area and exact 1-hour power interruption time slot on an interactive Sri Lanka map. Covering all 25 districts and 4 CEB groups.',
    url: 'https://lankadispatch.com/powercut',
    siteName: 'Lanka Dispatch',
    type: 'website'
  },
  alternates: {
    canonical: 'https://lankadispatch.com/powercut'
  }
};

export default function PowerCutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is today\'s power cut schedule in Sri Lanka?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The Public Utilities Commission of Sri Lanka (PUCSL) approved 1-hour daily power cuts for October 19, 20, and 21 across four groups (Groups 1, 2, 3, and 4) between 4:30 PM and 8:30 PM.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Why are power cuts being implemented in Sri Lanka?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The temporary power interruptions are due to an unscheduled generation shortfall following an outage at Unit 1 of the Lakvijaya (Norochcholai) Coal Power Station.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I find which group my area belongs to?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Use Lanka Dispatch\'s interactive Sri Lanka map or search bar by typing your town or CEB grid sub-station to instantly see your group and today\'s exact time slot.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Utility Header */}
      <header className="border-b border-[var(--border-line)] bg-[var(--bg-card)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Front Page</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[var(--text-main)]">
              LANKA<span className="text-rose-500">DISPATCH</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold uppercase rounded border border-amber-500/20">
              Utility Desk
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
              href="/markets/gold-price-sri-lanka-today"
              className="flex items-center gap-1 hover:text-amber-500 transition-colors py-1 px-1.5 rounded hover:bg-[var(--bg-subtle)]"
              title="Gold Sovereign Rates"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Gold Rates</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Island Trackers Quick Switcher Strip */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-b border-[var(--border-line)] text-xs font-mono">
          <span className="text-[var(--text-muted)] uppercase tracking-wider shrink-0 text-[11px] font-bold">
            Island Trackers:
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold shrink-0 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>CEB Power Cuts (Active)</span>
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
            href="/markets/gold-price-sri-lanka-today"
            className="px-3 py-1 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Coins className="w-3 h-3 text-amber-500" />
            <span>Gold Price (24K/22K)</span>
          </Link>
        </div>

        {isPowercutScheduleExpired() ? (
          <PowerCutExpiredNotice />
        ) : (
          <PowerCutTracker />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-line)] bg-[var(--bg-card)] py-6 mt-12 text-center text-xs font-mono text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Lanka Dispatch. Published in the public interest under Section 12 of Sri Lanka Intellectual Property Act No. 36 of 2003.</p>
        </div>
      </footer>
    </div>
  );
}
