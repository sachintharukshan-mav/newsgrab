import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Calculator,
  HelpCircle,
  FileText,
  Building,
  TrendingDown,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Scale,
  Coins,
  Fuel,
  DollarSign,
} from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';
import { SalaryTaxCalculatorStageshow } from '@/components/salary-tax-calculator-stageshow';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = getSiteUrl();
  const title = 'Sri Lanka Salary & APIT Tax Calculator (2025/2026 IRD Slabs) | LANKA DISPATCH';
  const description =
    '100% accurate Sri Lanka Salary, APIT & Income Tax Calculator verified against Inland Revenue (Amendment) Act No. 2 of 2025. Calculate your net take-home salary, Employee EPF (8%), Employer ETF (3%), 2025 tax relief (Rs. 150k), tax savings, and employer Cost to Company (CTC).';
  const enUrl = `${SITE_URL}/calculators/sri-lanka-salary-tax-calculator`;
  const siUrl = `${SITE_URL}/si/calculators/sri-lanka-salary-tax-calculator`;
  const taUrl = `${SITE_URL}/ta/calculators/sri-lanka-salary-tax-calculator`;

  return {
    title,
    description,
    keywords: [
      'sri lanka salary tax calculator 2025',
      'apit tax calculator sri lanka',
      'inland revenue act no 2 of 2025 tax slabs',
      'sri lanka income tax calculator',
      'epf etf calculator sri lanka',
      'take home pay calculator sri lanka',
      'paye tax table 01 inland revenue',
      '150000 tax relief sri lanka',
      'effective tax rate sri lanka',
      'cost to company ctc calculator lkr',
      'ශ්‍රී ලංකා වැටුප් බදු කැල්කියුලේටරය',
      'ආදායම් බදු ගණනය කිරීම 2025',
      'இலங்கை சம்பள வரி கால்குலேட்டர்',
      'வருமான வரி விகிதங்கள் 2025',
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
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(
            'Sri Lanka Salary & APIT Tax Calculator (2025/2026 IRD Legal Slabs)'
          )}&category=economy&pub=InlandRevenueDepartment`,
          width: 1200,
          height: 630,
          alt: 'Sri Lanka Salary & APIT Tax Calculator',
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

export default function SriLankaSalaryTaxCalculatorPage() {
  const SITE_URL = getSiteUrl();
  const pageUrl = `${SITE_URL}/calculators/sri-lanka-salary-tax-calculator`;

  const faqItems = [
    {
      q: 'What is the tax-free personal relief threshold for salary income in Sri Lanka?',
      a: 'Under the Inland Revenue (Amendment) Act No. 2 of 2025 (effective April 1, 2025 for Years of Assessment 2025/2026 and 2026/2027), the tax-free personal relief for employment income is Rs. 1,800,000 per annum, which equals Rs. 150,000 per month. Any individual earning up to Rs. 150,000 in monthly gross regular employment profits pays zero (0%) Advance Personal Income Tax (APIT).',
    },
    {
      q: 'What are the official APIT tax slabs and rates under the 2025 Amendment Act?',
      a: 'After deducting the monthly relief of Rs. 150,000, taxable monthly profits from employment are taxed as follows: First Rs. 83,333.33 (Gross Rs. 150,000 to Rs. 233,333.33) at 6%; Next Rs. 41,666.67 (Gross Rs. 233,333.34 to Rs. 275,000.00) at 18% (the former 12% slab was repealed); Next Rs. 41,666.67 (Gross Rs. 275,000.01 to Rs. 316,666.67) at 24%; Next Rs. 41,666.67 (Gross Rs. 316,666.68 to Rs. 358,333.33) at 30%; and any balance exceeding Rs. 358,333.33 per month at the maximum marginal rate of 36%.',
    },
    {
      q: 'How does the 2025/2026 tax regime compare with the previous 2023/2024 regime?',
      a: 'Under the previous 2023/2024 law, the tax-free threshold was only Rs. 100,000 per month with 6 equal slabs of Rs. 41,666.67 at 6%, 12%, 18%, 24%, 30%, and 36%. The 2025 Amendment raised the tax-free threshold by 50% to Rs. 150,000 and widened the 6% bracket to Rs. 83,333.33 while abolishing the 12% bracket. As a result, middle and upper-income professionals save between Rs. 1,500 and Rs. 18,000+ every single month in APIT deductions.',
    },
    {
      q: 'How are EPF and ETF calculated on my salary in Sri Lanka?',
      a: 'Statutory retirement funds are governed by the Employees\' Provident Fund (EPF) Act No. 15 of 1958 and Employees\' Trust Fund (ETF) Act No. 46 of 1980. The employee contributes 8% of Basic Salary (deducted from gross pay). The employer contributes an additional 12% of Basic Salary to EPF and 3% to ETF. Together, 23% of your basic salary is deposited every month into your retirement security portfolio, with 15% fully funded by your employer.',
    },
    {
      q: 'Is EPF deducted before or after APIT tax is calculated?',
      a: 'In Sri Lanka, APIT tax is calculated on your total Gross Regular Profits from employment (inclusive of basic and allowances, excluding specific statutory exempt items). Employee EPF (8%) is deducted from your gross pay to determine your Net In-Hand Take-Home Salary: Net Salary = Gross Salary - Employee EPF (8%) - Monthly APIT Tax.',
    },
    {
      q: 'What is Cost to Company (CTC) and how is it calculated?',
      a: 'Cost to Company (CTC) is the total financial expenditure an employer incurs to retain an employee. It includes Gross Salary plus Employer EPF (12%) and Employer ETF (3%). If your basic salary equals gross salary, your employer pays an extra 15% above your gross earnings into your sovereign retirement funds.',
    },
    {
      q: 'Who is legally responsible for deducting and remitting APIT?',
      a: 'Under Chapter VIII of the Inland Revenue Act No. 24 of 2017, the primary employer is legally mandated to withhold APIT from qualifying employees each month using the official IRD withholding tax tables (Table 01 for primary employment) and remit it directly to the Commissioner General of Inland Revenue by the 15th of the following month.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Sri Lanka Salary & APIT Tax Calculator (2025/2026 IRD Slabs)',
        description:
          '100% accurate Sri Lanka Salary, APIT & Income Tax Calculator verified against Inland Revenue (Amendment) Act No. 2 of 2025. Calculate your net take-home salary, Employee EPF (8%), Employer ETF (3%), 2025 tax relief (Rs. 150k), and employer CTC.',
        inLanguage: 'en-LK',
        datePublished: '2026-11-03T00:00:00Z',
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}#app`,
        name: 'Sri Lanka Salary & APIT Tax Calculator Engine',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All Modern Web Browsers',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'LKR',
        },
        featureList: [
          '100% verified Inland Revenue (Amendment) Act No. 2 of 2025 Table 01 tax slabs',
          'Rs. 150,000 monthly personal relief calculation',
          'Employee EPF (8%), Employer EPF (12%), and Employer ETF (3%) breakdown',
          'Net In-Hand take-home salary computation',
          'Comparison engine against 2023/2024 tax regime with exact monthly rupee savings',
          'Employer Cost to Company (CTC) audit',
          'Interactive Stageshow faux-UI terminal interface with instant WhatsApp sharing',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumbs`,
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
            name: 'Calculators',
            item: `${SITE_URL}/calculators`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Sri Lanka Salary & APIT Tax Calculator',
            item: pageUrl,
          },
        ],
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
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header & Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-line)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1.5 -ml-1.5 rounded-md hover:bg-[var(--bg-subtle)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dispatch Desk</span>
            </Link>
            <span className="text-[var(--border-line)]">|</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-main)]">
              <Calculator className="w-4 h-4 text-[#2962ff]" />
              <span className="hidden sm:inline">Lanka Dispatch</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                IRD 2025/2026 Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <Link
              href="/utility/fuel-and-power-sri-lanka"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-[var(--text-body)] transition-colors"
            >
              <Fuel className="w-3 h-3 text-emerald-500" />
              <span>Fuel Prices</span>
            </Link>
            <Link
              href="/markets/usd-to-lkr-rate-today"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-[var(--text-body)] transition-colors"
            >
              <DollarSign className="w-3 h-3 text-rose-500" />
              <span>USD/LKR</span>
            </Link>
            <Link
              href="/markets/gold-price-sri-lanka-today"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-[var(--text-body)] transition-colors"
            >
              <Coins className="w-3 h-3 text-amber-500" />
              <span>Gold</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Title Hero */}
        <section className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2962ff]/10 text-[#2962ff] text-xs font-mono font-bold border border-[#2962ff]/20">
            <Scale className="w-3.5 h-3.5" />
            <span>Official Legal Source: Inland Revenue (Amendment) Act No. 2 of 2025</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] font-serif leading-tight">
            Sri Lanka Salary & APIT Tax Calculator
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Calculate your exact monthly take-home salary, Advance Personal Income Tax (APIT),
            statutory Employee EPF (8%), Employer EPF (12%), and Employer ETF (3%) under the newly
            enacted <strong className="text-[var(--text-main)]">Rs. 150,000 monthly tax-free relief threshold</strong> and official IRD Table 01 progressive tax slabs.
          </p>
        </section>

        {/* Stageshow Interactive Calculator Component */}
        <section>
          <SalaryTaxCalculatorStageshow />
        </section>

        {/* Legal IRD Table 01 Reference Matrix */}
        <section className="rounded-2xl border border-[var(--border-line)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-line)] pb-5">
            <div>
              <div className="text-[11px] font-mono font-bold text-[#2962ff] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Statutory Reference Matrix</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text-main)] mt-1">
                Official IRD APIT Table No. 01 Schedule
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inland Revenue Act No. 2 of 2025</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-line)] text-[var(--text-muted)] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Bracket / Slab</th>
                  <th className="py-3 px-3">Monthly Gross Range</th>
                  <th className="py-3 px-3">Slab Slice</th>
                  <th className="py-3 px-3 text-center">Tax Rate</th>
                  <th className="py-3 px-3 text-right">Max Slab Tax</th>
                  <th className="py-3 px-3 text-right">Cumulative APIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-line)] text-[var(--text-body)]">
                <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                  <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Personal Relief</td>
                  <td className="py-3 px-3">Up to Rs. 150,000.00</td>
                  <td className="py-3 px-3">Rs. 150,000.00</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">0%</td>
                  <td className="py-3 px-3 text-right">Rs. 0</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">Rs. 0</td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 01</td>
                  <td className="py-3 px-3">Rs. 150,000.01 – 233,333.33</td>
                  <td className="py-3 px-3">Rs. 83,333.33</td>
                  <td className="py-3 px-3 text-center font-bold text-blue-500">6%</td>
                  <td className="py-3 px-3 text-right font-mono">Rs. 5,000.00</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">Rs. 5,000.00</td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 02</td>
                  <td className="py-3 px-3">Rs. 233,333.34 – 275,000.00</td>
                  <td className="py-3 px-3">Rs. 41,666.67</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-500">18%</td>
                  <td className="py-3 px-3 text-right font-mono">Rs. 7,500.00</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">Rs. 12,500.00</td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 03</td>
                  <td className="py-3 px-3">Rs. 275,000.01 – 316,666.67</td>
                  <td className="py-3 px-3">Rs. 41,666.67</td>
                  <td className="py-3 px-3 text-center font-bold text-orange-500">24%</td>
                  <td className="py-3 px-3 text-right font-mono">Rs. 10,000.00</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">Rs. 22,500.00</td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 04</td>
                  <td className="py-3 px-3">Rs. 316,666.68 – 358,333.33</td>
                  <td className="py-3 px-3">Rs. 41,666.67</td>
                  <td className="py-3 px-3 text-center font-bold text-rose-500">30%</td>
                  <td className="py-3 px-3 text-right font-mono">Rs. 12,500.00</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">Rs. 35,000.00</td>
                </tr>
                <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[var(--text-main)]">Slab 05</td>
                  <td className="py-3 px-3">Above Rs. 358,333.33</td>
                  <td className="py-3 px-3">Remaining Balance</td>
                  <td className="py-3 px-3 text-center font-bold text-purple-500">36%</td>
                  <td className="py-3 px-3 text-right font-mono">36% on excess</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-purple-600 dark:text-purple-400">Rs. 35,000 + 36%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-[var(--text-muted)] space-y-2 pt-2 border-t border-[var(--border-line)] leading-relaxed">
            <p>
              <strong>Note on 12% Slab Repeal:</strong> Under the Inland Revenue (Amendment) Act No. 2 of 2025, the previous 12% slab was formally repealed. The 6% slab was widened to cover the first Rs. 83,333.33 of taxable earnings (equal to the previous 6% and 12% slices combined), after which the rate transitions directly to 18%.
            </p>
            <p>
              <strong>EPF & ETF Rules:</strong> Employee EPF (8%) is deducted exclusively from Basic Salary. The employer makes a non-deducted statutory contribution of 12% to the Employees&apos; Provident Fund (EPF) and 3% to the Employees&apos; Trust Fund (ETF), totaling 23% in monthly sovereign retirement fund deposits.
            </p>
          </div>
        </section>

        {/* Frequently Asked Questions (SEO FAQ Accordion) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold text-[#2962ff] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tax Knowledge Base & Legal Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[var(--text-main)]">
              Frequently Asked Questions on Sri Lanka Salary Tax
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] p-5 space-y-3 hover:border-[#2962ff]/40 transition-colors"
              >
                <h3 className="text-base font-bold text-[var(--text-main)] leading-snug flex items-start gap-2">
                  <span className="text-[#2962ff] font-mono text-sm shrink-0 mt-0.5">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* External Links & Verified Government References */}
        <section className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-subtle)]/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Official Sri Lanka Government Gazette & IRD Portal
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Cross-verify your personal income tax status directly with the Inland Revenue Department of Sri Lanka.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.ird.gov.lk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-xs font-mono font-semibold text-[var(--text-main)] transition-colors"
            >
              <span>IRD Portal (ird.gov.lk)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer Note */}
      <footer className="border-t border-[var(--border-line)] py-8 mt-12 bg-[var(--bg-card)] text-center text-xs text-[var(--text-muted)] font-mono">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} LANKA DISPATCH. Personal Income Tax Engine verified against Sri Lanka Inland Revenue (Amendment) Act No. 2 of 2025.</p>
          <p className="text-[11px] text-[var(--text-muted)]/70">
            For informational purposes only. Consult a registered Sri Lankan chartered accountant (CA Sri Lanka) or IRD tax officer for formal tax declarations.
          </p>
        </div>
      </footer>
    </div>
  );
}
