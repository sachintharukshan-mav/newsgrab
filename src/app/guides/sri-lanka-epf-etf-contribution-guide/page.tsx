import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  Coins,
  Calculator,
  HelpCircle,
  Building2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'EPF & ETF in Sri Lanka: The Complete Employee and Employer Contribution Guide';
  const description =
    'Comprehensive legal and financial guide to Sri Lanka Employees Provident Fund (EPF) and Employees Trust Fund (ETF). 23% monthly contribution formula, Central Bank interest rates, withdrawal rules, and legal compliance.';
  const enUrl = `${SITE_URL}/guides/sri-lanka-epf-etf-contribution-guide`;

  return {
    title,
    description,
    keywords: [
      'epf and etf guide sri lanka',
      'how is epf calculated in sri lanka',
      'employee epf 8 percent employer 12 percent',
      'etf 3 percent rules sri lanka',
      'central bank epf interest rates history',
      'how to withdraw epf sri lanka',
      'epf act no 15 of 1958 summary',
      'etf act no 46 of 1980 rules',
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
      authors: ['Lanka Dispatch Labor & Financial Legal Desk'],
      section: 'Labor & Retirement Finance',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function EpfEtfPillarGuidePage() {
  const SITE_URL = getSiteUrl();
  const pageUrl = `${SITE_URL}/guides/sri-lanka-epf-etf-contribution-guide`;

  const faqItems = [
    {
      q: 'What is the statutory percentage breakdown for EPF and ETF contributions?',
      a: 'The mandatory monthly contribution is 23% of the employee’s total earnings (Basic Salary plus qualifying fixed allowances). The employee contributes 8% (deducted from gross pay), while the employer contributes 12% to EPF and 3% to ETF (paid directly by the company without reducing the employee’s contracted gross wage).',
    },
    {
      q: 'Which allowances count towards EPF/ETF calculations?',
      a: 'Under judicial precedents of the Supreme Court of Sri Lanka, any payment directly tied to the performance of ordinary contracted labor constitutes "total earnings". This includes Basic Salary, Cost of Living Allowances (COLA), and permanent fixed allowances. Variable travel reimbursements, discretionary annual bonuses, and medical reimbursements are typically exempt.',
    },
    {
      q: 'At what age can an employee withdraw their EPF fund balance in Sri Lanka?',
      a: 'Under the EPF Act No. 15 of 1958, male employees can withdraw their accumulated balances upon reaching age 55, and female employees at age 50, provided they have formally ceased employment. Special early withdrawal is permitted for females upon legal marriage, permanent migration abroad, or permanent medical disability.',
    },
    {
      q: 'What additional benefits does the Employees Trust Fund (ETF) provide?',
      a: 'Unlike EPF which is strictly a retirement fund, ETF provides active life benefits: automatic life insurance coverage, permanent total disability compensation, critical illness health insurance, financial grants for children who pass the Grade 5 scholarship examination, and death benefit compensation.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: 'EPF & ETF in Sri Lanka: The Complete Employee and Employer Contribution Guide',
        description:
          'Comprehensive legal analysis of the 23% EPF/ETF contribution formula, Central Bank fund management, withdrawal conditions, and employer compliance.',
        inLanguage: 'en-LK',
        datePublished: '2026-11-01T00:00:00Z',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Lanka Dispatch Labor & Financial Legal Desk',
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

      {/* Header */}
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
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            <Coins className="w-3.5 h-3.5" />
            <span>Lanka Dispatch Financial Literacy · Labor Economics Series</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] font-headline leading-tight">
            EPF &amp; ETF in Sri Lanka: The Complete Employee &amp; Employer Contribution Guide
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published: November 2026 Analysis</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>11 min comprehensive guide</span>
            </span>
            <span>•</span>
            <span className="text-[var(--text-main)] font-semibold">
              Authored by Lanka Dispatch Labor Law Desk
            </span>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border-l-4 border-amber-600 border-[var(--border-line)] space-y-3 shadow-sm">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Summary</span>
          </h2>
          <p className="text-sm text-[var(--text-body)] leading-relaxed">
            The Employees&apos; Provident Fund (EPF) and Employees&apos; Trust Fund (ETF) represent the twin pillars of Sri Lanka&apos;s formal social security framework. Managed by the Central Bank of Sri Lanka (CBSL) and the ETF Board, these sovereign funds safeguard the post-retirement livelihoods of over 2.8 million active private sector and state corporation employees. This guide provides an exhaustive legal analysis of statutory contribution calculations, investment yield mechanics, withdrawal criteria, and compliance duties.
          </p>
        </section>

        {/* Section 1: The 23% Formula */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            1. The 23% Statutory Contribution Formula Explained
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Every private employer in Sri Lanka (employing one or more permanent, temporary, casual, or contract workers) is legally obligated to contribute a combined <strong>23% of the employee&apos;s monthly total earnings</strong> into the sovereign retirement pools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2 text-xs font-mono">
              <div className="text-[11px] font-bold text-rose-500 uppercase">Employee Contribution</div>
              <div className="text-2xl font-bold text-[var(--text-main)]">8%</div>
              <p className="text-[var(--text-muted)]">
                Deducted directly from monthly basic salary and remitted to the Central Bank EPF Department.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2 text-xs font-mono">
              <div className="text-[11px] font-bold text-emerald-500 uppercase">Employer EPF Contribution</div>
              <div className="text-2xl font-bold text-[var(--text-main)]">12%</div>
              <p className="text-[var(--text-muted)]">
                Contributed entirely by the employer without reducing the employee&apos;s contracted salary.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-2 text-xs font-mono">
              <div className="text-[11px] font-bold text-blue-500 uppercase">Employer ETF Contribution</div>
              <div className="text-2xl font-bold text-[var(--text-main)]">3%</div>
              <p className="text-[var(--text-muted)]">
                Fully funded by the employer to provide active health, disability, and scholarship benefits.
              </p>
            </div>
          </div>
        </section>

        {/* Embedded Calculator Callout */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 uppercase">
              <Calculator className="w-4 h-4" />
              <span>Interactive Take-Home &amp; EPF Simulator</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] font-headline">
              Simulate Your Exact 8%, 12%, and 3% Fund Accumulation
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-xl">
              Use our verified IRD 2025/2026 calculator to inspect how your basic salary split dictates your monthly wealth accumulation and employer Cost to Company.
            </p>
          </div>
          <Link
            href="/calculators/sri-lanka-salary-tax-calculator"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-lg"
          >
            <span>Launch Engine</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Section 2: What Counts as Earnings */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            2. Definition of &quot;Total Earnings&quot; for EPF/ETF
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Under Section 47 of the EPF Act No. 15 of 1958, &quot;earnings&quot; is broadly defined to ensure employers cannot artificially deflate basic pay to avoid statutory payments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Included in EPF/ETF Computation
              </div>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-body)]">
                <li>Basic monthly contracted salary</li>
                <li>Cost of Living Allowance (COLA)</li>
                <li>Special budgetary living allowances</li>
                <li>Fixed performance or service allowances</li>
                <li>Holiday pay and paid leave payments</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="font-bold text-rose-600 dark:text-rose-400 uppercase">
                Exempt from EPF/ETF Computation
              </div>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-body)]">
                <li>Overtime (OT) hourly wages</li>
                <li>Discretionary annual performance bonuses</li>
                <li>Actual travelling reimbursements &amp; fuel bills</li>
                <li>Meal allowances &amp; medical expense claims</li>
                <li>Ex-gratia golden handshake severance payouts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Withdrawal Rules */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            3. Statutory Withdrawal Criteria
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            EPF funds remain legally locked in sovereign Central Bank debt securities until a member satisfies one of the statutory release grounds:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-[var(--text-body)] pl-2">
            <li><strong>Retirement Age:</strong> Reaching 55 years for male members and 50 years for female members (with formal cessation of employment).</li>
            <li><strong>Marriage of Female Members:</strong> Female members who legally marry and formally resign within the prescribed timeframe.</li>
            <li><strong>Permanent Migration:</strong> Emigrating permanently with valid foreign residency endorsement.</li>
            <li><strong>Permanent Incapacity:</strong> Certified medical unfitness to perform further employment.</li>
            <li><strong>Joining Government Service:</strong> Taking up a pensionable permanent post in the Sri Lankan public civil service.</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-4 border-t border-[var(--border-line)]">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Authoritative legal answers regarding provident fund compliance in Sri Lanka.
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
            <strong>Regulatory Sources:</strong> Grounded in the Employees&apos; Provident Fund Act No. 15 of 1958, the Employees&apos; Trust Fund Act No. 46 of 1980, and Central Bank of Sri Lanka (CBSL) Annual Reports.
          </p>
          <div className="flex items-center justify-between pt-4">
            <div>&copy; {new Date().getFullYear()} LANKA DISPATCH. Colombo, Sri Lanka.</div>
            <Link href="/calculators/sri-lanka-salary-tax-calculator" className="text-amber-500 hover:underline">
              Calculate Your Take-Home Salary &rarr;
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
