import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Calculator,
  Scale,
  TrendingDown,
  Building,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'Sri Lanka Personal Income Tax & APIT Slabs 2025/2026: The Complete Taxpayer Guide';
  const description =
    'Comprehensive 2025/2026 Sri Lanka Personal Income Tax and APIT guide. Detailed legal analysis of Inland Revenue (Amendment) Act No. 2 of 2025, Rs. 150,000 monthly tax-free relief, progressive tax slabs, EPF/ETF interaction, and practical salary case studies.';
  const enUrl = `${SITE_URL}/guides/sri-lanka-personal-income-tax-guide-2025`;

  return {
    title,
    description,
    keywords: [
      'sri lanka personal income tax guide 2025',
      'apit tax slabs sri lanka 2025 2026',
      'inland revenue act no 2 of 2025 summary',
      'tax free salary threshold sri lanka',
      'how to calculate apit tax sri lanka',
      'sri lanka salary tax savings 2025',
      'epf tax calculation sri lanka',
      'ird table 01 schedule explanation',
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
      authors: ['Lanka Dispatch Macroeconomic & Legal Desk'],
      section: 'Economy & Taxation',
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

export default function TaxPillarGuidePage() {
  const SITE_URL = getSiteUrl();
  const pageUrl = `${SITE_URL}/guides/sri-lanka-personal-income-tax-guide-2025`;

  const faqItems = [
    {
      q: 'What is the tax-free personal relief under the 2025 Amendment Act?',
      a: 'Under the Inland Revenue (Amendment) Act No. 2 of 2025, the tax-free personal relief for employment income is Rs. 1,800,000 per Year of Assessment, which translates to exactly Rs. 150,000 per calendar month. Individuals earning up to Rs. 150,000 monthly from regular employment pay zero (0%) Advance Personal Income Tax (APIT).',
    },
    {
      q: 'Why was the 12% intermediate tax slab repealed in 2025?',
      a: 'The government restructured the tax slabs to provide immediate relief to middle-income earners while simplifying the withholding structure. The 6% introductory tax slab was widened from Rs. 41,666.67 to Rs. 83,333.33 (combining the previous first two slices), after which taxable income directly enters the 18% slab, effectively eliminating the former 12% intermediate bracket.',
    },
    {
      q: 'How does Employee EPF (8%) affect my APIT calculation?',
      a: 'In Sri Lanka, APIT withholding is calculated on total gross employment remuneration (basic salary plus eligible allowances). Employee EPF (8%) is deducted from basic pay to arrive at Net Take-Home Salary: Net Salary = Gross Salary - Employee EPF (8%) - APIT Tax. EPF is not an upfront deduction against taxable gross income for monthly APIT withholding.',
    },
    {
      q: 'When must employers remit APIT deductions to the Inland Revenue Department?',
      a: 'Employers are required under Chapter VIII of the Inland Revenue Act No. 24 of 2017 to deduct APIT from qualifying employees monthly and remit the withheld taxes to the Commissioner General of Inland Revenue on or before the 15th day of the month immediately following the deduction.',
    },
    {
      q: 'Are non-cash benefits such as company vehicles or housing taxable?',
      a: 'Yes. Non-cash perquisites, including company-provided motor vehicles, fuel allocations, residential housing, and private utility allowances, have specific imputed valuation rates prescribed by the Inland Revenue Department and must be included in gross employment profits for APIT computation.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        isPartOf: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        headline: 'Sri Lanka Personal Income Tax & APIT Slabs 2025/2026: The Complete Taxpayer Guide',
        description:
          'Comprehensive legal and financial analysis of the Inland Revenue (Amendment) Act No. 2 of 2025, Rs. 150,000 monthly tax-free relief, progressive tax slabs, and real-world salary case studies.',
        inLanguage: 'en-LK',
        datePublished: '2026-11-01T00:00:00Z',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Lanka Dispatch Macroeconomic & Legal Desk',
          url: `${SITE_URL}/about#masthead`,
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'LANKA DISPATCH',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/icon.svg`,
          },
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
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Special Guides',
            item: `${SITE_URL}/guides`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Sri Lanka Salary Tax & APIT Guide 2025/2026',
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)]">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Bar */}
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

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Masthead Header */}
        <header className="space-y-4 border-b border-[var(--border-line)] pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lanka Dispatch Intelligence Special Report · Taxation Series</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] font-headline leading-tight">
            Sri Lanka Personal Income Tax &amp; APIT Slabs 2025/2026: The Complete Taxpayer Guide
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Effective: April 1, 2025 – Y/A 2025/2026 &amp; 2026/2027</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>12 min in-depth read</span>
            </span>
            <span>•</span>
            <span className="text-[var(--text-main)] font-semibold">
              Authored by Lanka Dispatch Macroeconomic &amp; Legal Desk
            </span>
          </div>
        </header>

        {/* Executive Summary Box */}
        <section className="p-6 rounded-2xl bg-[var(--bg-card)] border-l-4 border-blue-600 border-[var(--border-line)] space-y-3 shadow-sm">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Summary</span>
          </h2>
          <p className="text-sm text-[var(--text-body)] leading-relaxed">
            The enactment of the <strong>Inland Revenue (Amendment) Act No. 2 of 2025</strong> represents the most substantive recalibration of Sri Lanka&apos;s personal income tax architecture since the post-crisis stabilization measures of 2022. By raising the personal relief threshold from Rs. 100,000 to <strong>Rs. 150,000 per month</strong>, widening the initial 6% bracket, and abolishing the 12% intermediate band, the law directly reduces the tax burden for over 450,000 formally employed professionals across the island.
          </p>
        </section>

        {/* Section 1: The Legislative Mandate */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            1. Legislative Background &amp; Constitutional Framework
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Following Sri Lanka&apos;s macroeconomic debt restructuring program under the International Monetary Fund (IMF) Extended Fund Facility (EFF), the Inland Revenue Department (IRD) sought to balance revenue generation targets with the imperative of protecting real disposable incomes against cumulative inflation. 
          </p>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Under the former 2023/2024 regime, personal relief stood at a stringent Rs. 1,200,000 per annum (Rs. 100,000/month), with six equal slabs of Rs. 500,000 per annum (Rs. 41,666.67/month) taxed at escalating rates of 6%, 12%, 18%, 24%, 30%, and 36%. In response to widespread professional brain drain and cost-of-living petitions, the Parliament of Sri Lanka passed Amendment Act No. 2 of 2025 to re-anchor the tax threshold to contemporary living costs.
          </p>
        </section>

        {/* Section 2: Detailed Breakdown of Table 01 Slabs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            2. The 2025/2026 APIT Table 01 Progressive Slabs
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Advance Personal Income Tax (APIT) is calculated on regular monthly employment profits using the official IRD Table 01 schedule. The table below illustrates the exact legal progression under the new statute:
          </p>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-left text-xs font-mono border-collapse border border-[var(--border-line)] rounded-lg">
              <thead>
                <tr className="bg-[var(--bg-subtle)] text-[var(--text-muted)] uppercase text-[10px] tracking-wider border-b border-[var(--border-line)]">
                  <th className="py-3 px-3">Tax Tier</th>
                  <th className="py-3 px-3">Monthly Gross Range (LKR)</th>
                  <th className="py-3 px-3">Slice Volume</th>
                  <th className="py-3 px-3 text-center">Rate</th>
                  <th className="py-3 px-3 text-right">Max Monthly Tax</th>
                  <th className="py-3 px-3 text-right">Cumulative Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)] text-[var(--text-body)]">
                <tr className="bg-emerald-500/5">
                  <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Personal Relief</td>
                  <td className="py-3 px-3">Up to Rs. 150,000.00</td>
                  <td className="py-3 px-3">Rs. 150,000.00</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">0%</td>
                  <td className="py-3 px-3 text-right">Rs. 0</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">Rs. 0</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 01</td>
                  <td className="py-3 px-3">Rs. 150,000.01 – 233,333.33</td>
                  <td className="py-3 px-3">Rs. 83,333.33</td>
                  <td className="py-3 px-3 text-center font-bold text-blue-500">6%</td>
                  <td className="py-3 px-3 text-right">Rs. 5,000.00</td>
                  <td className="py-3 px-3 text-right font-semibold">Rs. 5,000.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 02</td>
                  <td className="py-3 px-3">Rs. 233,333.34 – 275,000.00</td>
                  <td className="py-3 px-3">Rs. 41,666.67</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-500">18%</td>
                  <td className="py-3 px-3 text-right">Rs. 7,500.00</td>
                  <td className="py-3 px-3 text-right font-semibold">Rs. 12,500.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 03</td>
                  <td className="py-3 px-3">Rs. 275,000.01 – 316,666.67</td>
                  <td className="py-3 px-3">Rs. 41,666.67</td>
                  <td className="py-3 px-3 text-center font-bold text-orange-500">24%</td>
                  <td className="py-3 px-3 text-right">Rs. 10,000.00</td>
                  <td className="py-3 px-3 text-right font-semibold">Rs. 22,500.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 04</td>
                  <td className="py-3 px-3">Rs. 316,666.68 – 358,333.33</td>
                  <td className="py-3 px-3">Rs. 41,666.67</td>
                  <td className="py-3 px-3 text-center font-bold text-rose-500">30%</td>
                  <td className="py-3 px-3 text-right">Rs. 12,500.00</td>
                  <td className="py-3 px-3 text-right font-semibold">Rs. 35,000.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 05</td>
                  <td className="py-3 px-3">Above Rs. 358,333.33</td>
                  <td className="py-3 px-3">Excess Balance</td>
                  <td className="py-3 px-3 text-center font-bold text-purple-500">36%</td>
                  <td className="py-3 px-3 text-right">36% on excess</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-600 dark:text-purple-400">Rs. 35,000 + 36%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Embedded Interactive Tool Callout */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-transparent border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-500 uppercase">
              <Calculator className="w-4 h-4" />
              <span>Try the Live Terminal Engine</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] font-headline">
              Interactive Sri Lanka Salary &amp; APIT Tax Calculator
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-xl">
              Calculate your take-home pay, compare savings versus the 2024 law, and simulate custom Basic vs. Allowance ratios with live slider feedback.
            </p>
          </div>
          <Link
            href="/calculators/sri-lanka-salary-tax-calculator"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-lg"
          >
            <span>Open Calculator</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Section 3: Practical Real-World Case Studies */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            3. Real-World Case Studies: 2024 vs. 2025 Comparison
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Case 1 */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3">
              <div className="text-[11px] font-bold text-blue-500 uppercase">Case Study A: Rs. 200,000 / mo</div>
              <div className="space-y-1.5 text-[var(--text-body)]">
                <p>Taxable Income: Rs. 50,000</p>
                <p>2024 Tax: Rs. 8,500 / mo</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">2025 Tax: Rs. 3,000 / mo</p>
              </div>
              <div className="pt-2 border-t border-[var(--border-line)] text-emerald-600 dark:text-emerald-400 font-semibold">
                Monthly Savings: Rs. 5,500 (Rs. 66,000 / yr)
              </div>
            </div>

            {/* Case 2 */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3">
              <div className="text-[11px] font-bold text-blue-500 uppercase">Case Study B: Rs. 300,000 / mo</div>
              <div className="space-y-1.5 text-[var(--text-body)]">
                <p>Taxable Income: Rs. 150,000</p>
                <p>2024 Tax: Rs. 32,500 / mo</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">2025 Tax: Rs. 18,500 / mo</p>
              </div>
              <div className="pt-2 border-t border-[var(--border-line)] text-emerald-600 dark:text-emerald-400 font-semibold">
                Monthly Savings: Rs. 14,000 (Rs. 168,000 / yr)
              </div>
            </div>

            {/* Case 3 */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-3">
              <div className="text-[11px] font-bold text-blue-500 uppercase">Case Study C: Rs. 500,000 / mo</div>
              <div className="space-y-1.5 text-[var(--text-body)]">
                <p>Taxable Income: Rs. 350,000</p>
                <p>2024 Tax: Rs. 104,500 / mo</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold">2025 Tax: Rs. 86,000 / mo</p>
              </div>
              <div className="pt-2 border-t border-[var(--border-line)] text-emerald-600 dark:text-emerald-400 font-semibold">
                Monthly Savings: Rs. 18,500 (Rs. 222,000 / yr)
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: EPF and ETF Interaction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            4. Statutory EPF &amp; ETF Deductions vs. APIT
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            A common point of confusion among salaried employees is whether EPF is deducted before or after income tax is assessed.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-[var(--text-body)] pl-2">
            <li>
              <strong>Taxable Base:</strong> APIT is computed on your gross monthly employment earnings before EPF is subtracted.
            </li>
            <li>
              <strong>Employee EPF (8%):</strong> Deducted strictly from Basic Salary (and qualifying budgetary allowances).
            </li>
            <li>
              <strong>Employer Contribution (15%):</strong> The employer contributes 12% to EPF and 3% to ETF without reducing the employee&apos;s contracted gross wage.
            </li>
            <li>
              <strong>Net In-Hand Equation:</strong> <code>Net Pay = Gross Earnings - Employee EPF (8%) - Monthly APIT Withholding</code>.
            </li>
          </ul>
        </section>

        {/* Section 5: Employer Compliance & Legal Deadlines */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            5. Employer Compliance &amp; Mandatory Remittance Calendars
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
            Every employer employing persons liable to APIT must hold an active Taxpayer Identification Number (TIN) and submit monthly schedules via the IRD RAMIS (Revenue Administration Management Information System) portal.
          </p>
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-2 text-xs font-mono">
            <p><strong>Monthly Remittance Deadline:</strong> On or before the 15th of the following month.</p>
            <p><strong>Annual Statement of Withholding:</strong> Filed by April 30th following the end of each Year of Assessment.</p>
            <p><strong>Penalties for Default:</strong> Up to 10% statutory surcharge plus 1.5% compounding monthly interest on overdue withholdings.</p>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-6 pt-4 border-t border-[var(--border-line)]">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Expert answers to top taxpayer queries grounded in Inland Revenue regulations.
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

        {/* Legal Disclaimer */}
        <footer className="pt-8 border-t border-[var(--border-line)] text-xs font-mono text-[var(--text-muted)] space-y-2">
          <p>
            <strong>Disclaimer:</strong> This guide is published by Lanka Dispatch for informational and educational purposes. While cross-referenced against the Inland Revenue (Amendment) Act No. 2 of 2025 and official IRD gazettes, readers are advised to consult a certified tax professional or the Department of Inland Revenue for individual tax declarations.
          </p>
          <div className="flex items-center justify-between pt-4">
            <div>&copy; {new Date().getFullYear()} LANKA DISPATCH. Colombo, Sri Lanka.</div>
            <Link href="/calculators/sri-lanka-salary-tax-calculator" className="text-blue-500 hover:underline">
              Launch Tax Calculator &rarr;
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
