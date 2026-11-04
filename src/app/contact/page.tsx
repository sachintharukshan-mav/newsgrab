import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Send,
  MessageSquare,
  AlertCircle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'Contact the Newsroom & Editorial Bureau | LANKA DISPATCH';
  const description =
    'Direct contact channels, Colombo World Trade Center bureau address, editorial desk phone numbers, and corrections submission portal for Lanka Dispatch.';
  const enUrl = `${SITE_URL}/contact`;
  const siUrl = `${SITE_URL}/si/contact`;
  const taUrl = `${SITE_URL}/ta/contact`;

  return {
    title,
    description,
    keywords: [
      'lanka dispatch contact',
      'colombo newsroom contact',
      'sri lanka news bureau address',
      'editorial desk email',
      'report news tip sri lanka',
      'corrections and retractions lanka dispatch',
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

export default function ContactPage() {
  const SITE_URL = getSiteUrl();
  const pageUrl = `${SITE_URL}/contact`;

  const departments = [
    {
      name: 'Editorial & News Desk',
      email: 'desk@lankadispatch.com',
      purpose: 'Breaking wire stories, press releases, parliamentary coverage, and tip submissions.',
      hours: '24/7/365 Continuous Wire',
    },
    {
      name: 'Corrections & Corrigenda',
      email: 'corrections@lankadispatch.com',
      purpose: 'Factual corrections, attribution requests, and right-of-reply declarations.',
      hours: 'Reviewed within 12 hours',
    },
    {
      name: 'Commercial & Advertising',
      email: 'advertising@lankadispatch.com',
      purpose: 'Programmatic display partnerships, direct sponsorship, and brand integrations.',
      hours: 'Mon – Fri: 8:30 AM – 5:30 PM (IST)',
    },
    {
      name: 'Legal & Intellectual Property',
      email: 'legal@lankadispatch.com',
      purpose: 'Compliance under Sri Lanka IP Act No. 36 of 2003, privacy, and regulatory inquiries.',
      hours: 'Mon – Fri: 9:00 AM – 5:00 PM (IST)',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Contact the Newsroom & Editorial Bureau | LANKA DISPATCH',
        description:
          'Direct contact channels, Colombo World Trade Center bureau address, and editorial desk contacts for Lanka Dispatch.',
        inLanguage: 'en-LK',
      },
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${SITE_URL}/#organization`,
        name: 'LANKA DISPATCH',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        email: 'desk@lankadispatch.com',
        telephone: '+94-11-234-5678',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Level 12, West Tower, World Trade Center, Echelon Square',
          addressLocality: 'Colombo',
          postalCode: '00100',
          addressRegion: 'Western Province',
          addressCountry: 'LK',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+94-11-234-5678',
            contactType: 'editorial newsdesk',
            email: 'desk@lankadispatch.com',
            availableLanguage: ['English', 'Sinhala', 'Tamil'],
          },
          {
            '@type': 'ContactPoint',
            telephone: '+94-11-234-5679',
            contactType: 'corrections desk',
            email: 'corrections@lankadispatch.com',
            availableLanguage: ['English', 'Sinhala', 'Tamil'],
          },
        ],
        publishingPrinciples: `${SITE_URL}/about#editorial-policy`,
        correctionsPolicy: `${SITE_URL}/about#corrections-policy`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header */}
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
        {/* Title Header */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-mono font-bold border border-rose-500/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional Newsroom Bureau &amp; Transparency Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] font-headline leading-tight">
            Contact Lanka Dispatch
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Headquartered in the heart of Colombo, Lanka Dispatch maintains an active 24/7/365 newsroom wire desk. Whether you have a verified news tip, a factual correction inquiry, or an institutional press release, our editors are reachable through the designated channels below.
          </p>
        </section>

        {/* Bureau Physical Address & Key Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--text-main)] font-headline">Colombo Bureau Address</h2>
            <div className="text-xs font-mono text-[var(--text-body)] leading-relaxed space-y-1">
              <p className="font-semibold text-[var(--text-main)]">LANKA DISPATCH Media Network</p>
              <p>Level 12, West Tower, World Trade Center</p>
              <p>Echelon Square, Colombo 00100</p>
              <p className="text-[var(--text-muted)]">Western Province, Sri Lanka</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--text-main)] font-headline">Newsroom Telephone Hotlines</h2>
            <div className="text-xs font-mono text-[var(--text-body)] leading-relaxed space-y-1.5">
              <p>
                <span className="text-[var(--text-muted)]">Main Newsdesk: </span>
                <span className="font-semibold text-[var(--text-main)]">+94 11 234 5678</span>
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Corrections &amp; Legal: </span>
                <span className="font-semibold text-[var(--text-main)]">+94 11 234 5679</span>
              </p>
              <p>
                <span className="text-[var(--text-muted)]">WhatsApp Tip Hotline: </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">+94 77 123 4567</span>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--text-main)] font-headline">Newsroom Operating Cadence</h2>
            <div className="text-xs font-mono text-[var(--text-body)] leading-relaxed space-y-1.5">
              <p>
                <span className="text-[var(--text-muted)]">Live Wire Desk: </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">24/7/365 Continuous</span>
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Editorial Office: </span>
                <span>Mon – Fri: 8:00 AM – 7:00 PM (IST)</span>
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Weekend Desk: </span>
                <span>Sat – Sun: 9:00 AM – 5:00 PM (IST)</span>
              </p>
            </div>
          </div>
        </section>

        {/* Department Directory */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text-main)]">
              Departmental Contact Directory
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Route your inquiry directly to the specialized desk to ensure rapid investigation and response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3 hover:border-rose-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[var(--text-main)] font-headline flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-500" />
                    <span>{dept.name}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded border border-[var(--border-line)]">
                    {dept.hours}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-body)] leading-relaxed">
                  {dept.purpose}
                </p>
                <div className="pt-2 border-t border-[var(--border-line)]">
                  <a
                    href={`mailto:${dept.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>{dept.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tip Submission & Verification Standards */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-subtle)]/70 border border-[var(--border-line)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Whistleblower &amp; Newsroom Tip Confidentiality</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] font-headline">
            Guidelines for Submitting Confidential News Tips
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
            Lanka Dispatch welcomes confidential news tips, verified documents, public interest data leaks, and eyewitness accounts. We strictly adhere to journalistic shield conventions protecting confidential sources. When submitting sensitive documents, please specify if you require non-attribution or anonymity. All submitted evidence is cross-corroborated against secondary records before publication.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-line)]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Strict Whistleblower Anonymity</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Independent Corroboration Standard</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Partisan Affiliation</span>
            </span>
          </div>
        </section>

        {/* Institutional Links Bar */}
        <section className="pt-6 border-t border-[var(--border-line)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-[var(--text-main)] hover:underline">
              Editorial Standards &amp; Masthead
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[var(--text-main)] hover:underline">
              Privacy Policy &amp; Cookie Disclosures
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[var(--text-main)] hover:underline">
              Terms of Service
            </Link>
          </div>
          <div>&copy; {new Date().getFullYear()} LANKA DISPATCH Media Network. Colombo, Sri Lanka.</div>
        </section>
      </main>
    </div>
  );
}
