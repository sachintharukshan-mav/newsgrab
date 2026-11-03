'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingDown,
  Wallet,
  Building2,
  Share2,
  CheckCircle2,
  ArrowRight,
  Info,
  DollarSign,
  Copy,
  Check,
  Sparkles,
  PieChart,
  Percent,
  Coins,
} from 'lucide-react';
import {
  calculateSriLankaSalaryTax,
  formatLkr,
  TaxCalculationResult,
} from '@/lib/tax-calculator';
import { Window, Badge, Chip, Row } from '@/components/stageshow';

const PRESET_SALARIES = [
  { label: 'Rs. 100k', value: 100000 },
  { label: 'Rs. 150k (Relief)', value: 150000 },
  { label: 'Rs. 200k', value: 200000 },
  { label: 'Rs. 250k', value: 250000 },
  { label: 'Rs. 350k', value: 350000 },
  { label: 'Rs. 500k', value: 500000 },
  { label: 'Rs. 750k', value: 750000 },
  { label: 'Rs. 1.0M', value: 1000000 },
];

export function SalaryTaxCalculatorStageshow() {
  const [grossInput, setGrossInput] = useState<number>(250000);
  const [basicRatio, setBasicRatio] = useState<number>(1.0); // 1.0 = 100% basic
  const [showAnnual, setShowAnnual] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [splitSalary, setSplitSalary] = useState<boolean>(false);

  // Compute 100% accurate IRD Sri Lanka tax results
  const result: TaxCalculationResult = useMemo(() => {
    return calculateSriLankaSalaryTax(grossInput, splitSalary ? basicRatio : 1.0);
  }, [grossInput, splitSalary, basicRatio]);

  // Handle WhatsApp 1-Click Share
  const handleShareWhatsApp = () => {
    const text = `🇱🇰 Sri Lanka Salary & APIT Tax Breakdown (2025/2026 IRD Act)
💵 Gross Salary: ${formatLkr(result.grossSalary)}
🛡️ Employee EPF (8%): ${formatLkr(result.employeeEpfAmount)}
🏛️ APIT Tax: ${formatLkr(result.monthlyApitTax)} (${result.effectiveTaxRatePercent}%)
✅ Net Take-Home Pay: ${formatLkr(result.netMonthlySalary)}
🎉 Savings vs 2024 Law: ${formatLkr(result.monthlySavingsUnderNewAct)}/month!

Calculate your salary tax on Lanka Dispatch:
https://lankadispatch.com/calculators/sri-lanka-salary-tax-calculator`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handle Copy Breakdown
  const handleCopySummary = () => {
    const text = `Gross Salary: ${formatLkr(result.grossSalary)} | EPF (8%): ${formatLkr(result.employeeEpfAmount)} | APIT Tax: ${formatLkr(result.monthlyApitTax)} | Take-Home Pay: ${formatLkr(result.netMonthlySalary)} (Lanka Dispatch IRD Calculator)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Stageshow App Window Hero Stage */}
      <Window
        url="lankadispatch.com/salary-tax-calculator"
        urlShape="pill"
        chrome="native"
        lights="color"
        title="Sri Lanka Salary & APIT Tax Engine · Inland Revenue Act No. 2 of 2025"
        className="shadow-2xl border border-[var(--border-line)] overflow-hidden rounded-2xl bg-[var(--bg-card)] text-[var(--text-main)]"
        toolbar={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>100% IRD Legal Slabs</span>
            </span>
          </div>
        }
      >
        <div className="p-5 sm:p-8 space-y-8 bg-[var(--bg-card)]">
          {/* Header Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-line)] pb-5">
            <div>
              <div className="text-[11px] font-mono font-bold text-[#2962ff] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Personal Income Tax Terminal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-headline text-[var(--text-main)]">
                Calculate Take-Home Pay, APIT Tax &amp; EPF/ETF
              </h2>
            </div>

            {/* Time Horizon Switcher (Monthly vs Annual) */}
            <div className="inline-flex items-center rounded-lg bg-[var(--bg-subtle)] p-1 border border-[var(--border-line)] text-xs font-mono">
              <button
                onClick={() => setShowAnnual(false)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  !showAnnual
                    ? 'bg-[var(--bg-card)] text-[#2962ff] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setShowAnnual(true)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  showAnnual
                    ? 'bg-[var(--bg-card)] text-[#2962ff] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Annualized (12M)
              </button>
            </div>
          </div>

          {/* Primary Salary Input & Presets Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Monthly Gross Employment Income (LKR)
              </label>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span>Tax-Free Relief: First Rs. 150,000 / month (0% Tax)</span>
              </div>
            </div>

            {/* Big Interactive Input Display */}
            <div className="relative flex items-center">
              <div className="absolute left-4 font-mono font-bold text-lg sm:text-xl text-[var(--text-muted)] select-none">
                Rs.
              </div>
              <input
                type="number"
                min={0}
                max={5000000}
                step={5000}
                value={grossInput || ''}
                onChange={(e) => setGrossInput(Number(e.target.value))}
                placeholder="Enter gross salary..."
                className="w-full pl-14 pr-4 py-3 sm:py-4 rounded-xl bg-[var(--bg-subtle)] border-2 border-[var(--border-line)] focus:border-[#2962ff] text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-main)] focus:outline-none transition-all tabular-nums shadow-inner"
              />
              <div className="absolute right-4 text-xs font-mono text-[var(--text-muted)] hidden sm:block">
                / month
              </div>
            </div>

            {/* Tactile Range Slider */}
            <div className="pt-2">
              <input
                type="range"
                min={50000}
                max={1000000}
                step={5000}
                value={grossInput}
                onChange={(e) => setGrossInput(Number(e.target.value))}
                className="w-full h-2 bg-[var(--bg-subtle)] rounded-lg appearance-none cursor-pointer accent-[#2962ff]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1">
                <span>Rs. 50k</span>
                <span>Rs. 250k</span>
                <span>Rs. 500k</span>
                <span>Rs. 750k</span>
                <span>Rs. 1.0M+</span>
              </div>
            </div>

            {/* Quick Preset Salary Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">Presets:</span>
              {PRESET_SALARIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setGrossInput(p.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                    grossInput === p.value
                      ? 'bg-[#2962ff] text-white shadow-sm'
                      : 'bg-[var(--bg-subtle)] hover:bg-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Advanced Toggle: Basic Salary vs Fixed Allowances */}
            <div className="pt-2">
              <button
                onClick={() => setSplitSalary(!splitSalary)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2962ff] hover:underline cursor-pointer"
              >
                <span>{splitSalary ? '− Hide Basic Salary vs Allowance Split' : '+ Customise Basic Salary vs Allowances (For EPF calculation)'}</span>
              </button>

              {splitSalary && (
                <div className="mt-3 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)]">Basic Salary (Subject to EPF 8%):</span>
                    <span className="font-bold text-[var(--text-main)]">
                      {formatLkr(result.basicSalary)} ({Math.round(basicRatio * 100)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.3}
                    max={1.0}
                    step={0.05}
                    value={basicRatio}
                    onChange={(e) => setBasicRatio(Number(e.target.value))}
                    className="w-full h-1.5 bg-[var(--bg-card)] rounded-lg appearance-none cursor-pointer accent-[#2962ff]"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span>Non-EPF Fixed Allowances: {formatLkr(result.allowances)}</span>
                    <span>Basic Ratio: {Math.round(basicRatio * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Executive Results Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[var(--border-line)]">
            {/* Take-Home Net Salary Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 via-[var(--bg-subtle)] to-[var(--bg-card)] border-2 border-emerald-500/30 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" />
                  <span>Net Take-Home Pay</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">In-Hand</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatLkr(showAnnual ? result.netAnnualSalary : result.netMonthlySalary)}
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-line)]">
                <span>Retained:</span>
                <span className="font-bold text-[var(--text-main)]">
                  {result.grossSalary > 0
                    ? `${((result.netMonthlySalary / result.grossSalary) * 100).toFixed(1)}% of Gross`
                    : '100%'}
                </span>
              </div>
            </div>

            {/* APIT Income Tax Deducted Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                  <Percent className="w-4 h-4 text-[#2962ff]" />
                  <span>APIT Tax Deducted</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  result.monthlyApitTax > 0
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {result.monthlyApitTax > 0 ? `${result.effectiveTaxRatePercent}% Effective` : '0% Tax-Free'}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)] tabular-nums">
                {formatLkr(showAnnual ? result.annualApitTax : result.monthlyApitTax)}
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-line)]">
                <span>Taxable Amount:</span>
                <span className="font-bold text-[var(--text-main)]">
                  {formatLkr(showAnnual ? result.taxableEmploymentIncome * 12 : result.taxableEmploymentIncome)}
                </span>
              </div>
            </div>

            {/* Employee EPF 8% Deduction Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-line)] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-[var(--text-main)]">
                  <Building2 className="w-4 h-4 text-[#8c52ff]" />
                  <span>Employee EPF (8%)</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8c52ff]/10 text-[#8c52ff] font-bold">
                  Statutory
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)] tabular-nums">
                {formatLkr(showAnnual ? result.employeeEpfAmount * 12 : result.employeeEpfAmount)}
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-line)]">
                <span>Basic Calculated on:</span>
                <span className="font-bold text-[var(--text-main)]">
                  {formatLkr(showAnnual ? result.basicSalary * 12 : result.basicSalary)}
                </span>
              </div>
            </div>
          </div>

          {/* Social Share & Copy Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-line)] text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Breakdown on WhatsApp</span>
              </button>
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-line)] text-[var(--text-main)] border border-[var(--border-line)] font-bold transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>
            </div>

            {/* Savings Callout Pill */}
            {result.monthlySavingsUnderNewAct > 0 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2962ff]/10 text-[#2962ff] border border-[#2962ff]/30 font-bold">
                <span>🎉 2025 Tax Relief Saves You:</span>
                <span className="underline">{formatLkr(result.monthlySavingsUnderNewAct)}/month</span>
              </div>
            )}
          </div>
        </div>
      </Window>

      {/* Bento Grid: Granular Visualizers and Reference Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bento Tile 1: Progressive Tax Slabs Visual Meter */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#2962ff] uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5" />
                <span>Step-by-Step IRD Table 01 Breakdown</span>
              </div>
              <h3 className="text-lg font-bold font-headline text-[var(--text-main)]">
                How Your Salary is Taxed Across Progressive Slabs
              </h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Tax Slabs: 6% to 36%
            </span>
          </div>

          {/* Slabs Stacked Progress Bar */}
          <div className="space-y-3">
            {/* Tax-Free Base Bar */}
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  Tax-Free Threshold (0%)
                </span>
                <span className="text-[var(--text-muted)]">First Rs. 150,000 / mo</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">Tax: Rs. 0.00</span>
                <div className="text-[10px] text-[var(--text-muted)]">Personal Relief Allowance</div>
              </div>
            </div>

            {/* Individual Tax Slabs List */}
            {result.slabs.map((slab) => (
              <div
                key={slab.slabIndex}
                className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                  slab.isActive
                    ? 'bg-[var(--bg-subtle)] border-[#2962ff]/40 shadow-sm'
                    : 'bg-[var(--bg-subtle)]/40 border-[var(--border-line)] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        slab.isActive ? 'bg-[#2962ff]' : 'bg-zinc-500'
                      }`}
                    />
                    <span className="font-bold text-[var(--text-main)]">
                      Slab {slab.slabIndex} ({slab.ratePercent}%)
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {slab.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold font-mono ${slab.taxOnSlab > 0 ? 'text-[#2962ff]' : 'text-[var(--text-muted)]'}`}>
                      Tax: {formatLkr(slab.taxOnSlab)}
                    </span>
                  </div>
                </div>

                {/* Progress bar showing fill ratio of this slab */}
                <div className="w-full bg-[var(--border-line)] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2962ff] transition-all duration-300 rounded-full"
                    style={{
                      width: `${
                        slab.sliceAmount === Infinity
                          ? slab.taxableInSlab > 0 ? 100 : 0
                          : Math.min(100, (slab.taxableInSlab / slab.sliceAmount) * 100)
                      }%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  <span>
                    Taxable in this slab: {formatLkr(slab.taxableInSlab)}
                  </span>
                  <span>
                    {slab.sliceAmount !== Infinity ? `Max Slice: ${formatLkr(slab.sliceAmount)}` : 'On Balance'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Tile 2: Simulated Executive Digital Pay Slip */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1 border-b border-[var(--border-line)] pb-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>PAYSLIP PREVIEW</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">STATUS: APPROVED</span>
            </div>
            <h3 className="text-lg font-bold font-mono text-[var(--text-main)]">
              Monthly Remittance Voucher
            </h3>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              Private / Corporate Employment Sector
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Earnings Section */}
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Earnings:</div>
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span className="font-bold">{formatLkr(result.basicSalary)}</span>
              </div>
              {result.allowances > 0 && (
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Fixed Allowances:</span>
                  <span>+{formatLkr(result.allowances)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-[var(--border-line)] font-bold">
                <span>Total Gross:</span>
                <span>{formatLkr(result.grossSalary)}</span>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border-line)]">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Deductions:</div>
              <div className="flex justify-between text-[#8c52ff]">
                <span>Employee EPF (8%):</span>
                <span>-{formatLkr(result.employeeEpfAmount)}</span>
              </div>
              <div className="flex justify-between text-amber-500">
                <span>APIT Income Tax:</span>
                <span>-{formatLkr(result.monthlyApitTax)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[var(--border-line)] font-bold text-[var(--text-muted)]">
                <span>Total Deductions:</span>
                <span>-{formatLkr(result.employeeEpfAmount + result.monthlyApitTax)}</span>
              </div>
            </div>

            {/* In-Hand Transfer Total */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">Net Bank Transfer:</div>
                <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatLkr(result.netMonthlySalary)}
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-line)]">
            *Conforms with Inland Revenue Act No. 24 of 2017 &amp; Amendment Act No. 2 of 2025.
          </div>
        </div>
      </div>

      {/* Bento Grid Row 2: Employer CTC & Wealth Accumulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employer Cost to Company (CTC) Breakdown */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-4 shadow-sm">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold text-[#8c52ff] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Employer Total Cost Analysis</span>
            </div>
            <h3 className="text-lg font-bold font-headline text-[var(--text-main)]">
              Total Cost to Company (CTC)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              What your employer officially spends to employ you each month
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)]">
              <span>Gross Salary:</span>
              <span className="font-bold">{formatLkr(result.grossSalary)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)]">
              <span className="text-[var(--text-muted)]">+ Employer EPF (12%):</span>
              <span className="font-bold text-[#8c52ff]">+{formatLkr(result.employerEpfAmount)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-[var(--bg-subtle)]">
              <span className="text-[var(--text-muted)]">+ Employer ETF (3%):</span>
              <span className="font-bold text-[#00bcd4]">+{formatLkr(result.employerEtfAmount)}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-[#8c52ff]/10 border border-[#8c52ff]/30 text-sm font-bold text-[var(--text-main)]">
              <span>Total Monthly CTC:</span>
              <span>{formatLkr(result.totalCostToCompany)}</span>
            </div>
          </div>
        </div>

        {/* EPF & ETF Retirement Fund Growth Accumulator */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] space-y-4 shadow-sm">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              <span>Statutory Wealth Accumulator</span>
            </div>
            <h3 className="text-lg font-bold font-headline text-[var(--text-main)]">
              Monthly Retirement Fund Contributions (23%)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Combined mandatory savings deposited to CBSL EPF &amp; ETF Board
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3 font-mono text-xs">
            <div className="text-2xl font-extrabold text-amber-500">
              {formatLkr(result.totalMonthlyRetirementFund)} <span className="text-xs text-[var(--text-muted)] font-normal">/ month</span>
            </div>
            <div className="space-y-1 text-[11px] text-[var(--text-muted)] border-t border-amber-500/20 pt-2">
              <div className="flex justify-between">
                <span>Employee 8% Contribution:</span>
                <span className="font-bold text-[var(--text-main)]">{formatLkr(result.employeeEpfAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Employer 12% Contribution:</span>
                <span className="font-bold text-[var(--text-main)]">{formatLkr(result.employerEpfAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Employer 3% ETF Contribution:</span>
                <span className="font-bold text-[var(--text-main)]">{formatLkr(result.employerEtfAmount)}</span>
              </div>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] pt-1">
              Annual Wealth Deposited: <span className="font-bold text-[var(--text-main)]">{formatLkr(result.totalMonthlyRetirementFund * 12)} / year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official IRD Table 01 Reference Matrix */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold font-headline text-[var(--text-main)]">
            Official IRD APIT Table No. 01 Schedule (Inland Revenue Act No. 2 of 2025)
          </h3>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            Official monthly tax deduction schedule for resident and citizen primary employment income
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-line)] bg-[var(--bg-card)] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-line)] bg-[var(--bg-subtle)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3 px-4">Monthly Income Bracket (LKR)</th>
                <th className="py-3 px-4">Tax Rate</th>
                <th className="py-3 px-4">Tax on This Slab</th>
                <th className="py-3 px-4">Max Cumulative Tax</th>
                <th className="py-3 px-4">Legal Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-line)]">
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                  Up to Rs. 150,000.00
                </td>
                <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">0%</td>
                <td className="py-3 px-4">Rs. 0.00</td>
                <td className="py-3 px-4">Rs. 0.00</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">Personal Relief (Sec. 52)</td>
              </tr>
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--text-main)]">
                  Rs. 150,000.01 – Rs. 233,333.33
                </td>
                <td className="py-3 px-4 font-bold text-[#2962ff]">6%</td>
                <td className="py-3 px-4">Up to Rs. 5,000.00</td>
                <td className="py-3 px-4">Rs. 5,000.00</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">First Slab (Rs. 83,333)</td>
              </tr>
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--text-main)]">
                  Rs. 233,333.34 – Rs. 275,000.00
                </td>
                <td className="py-3 px-4 font-bold text-amber-500">18%</td>
                <td className="py-3 px-4">Up to Rs. 7,500.00</td>
                <td className="py-3 px-4">Rs. 12,500.00</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">Second Slab (Rs. 41,667)</td>
              </tr>
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--text-main)]">
                  Rs. 275,000.01 – Rs. 316,666.67
                </td>
                <td className="py-3 px-4 font-bold text-purple-500">24%</td>
                <td className="py-3 px-4">Up to Rs. 10,000.00</td>
                <td className="py-3 px-4">Rs. 22,500.00</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">Third Slab (Rs. 41,667)</td>
              </tr>
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--text-main)]">
                  Rs. 316,666.68 – Rs. 358,333.33
                </td>
                <td className="py-3 px-4 font-bold text-indigo-500">30%</td>
                <td className="py-3 px-4">Up to Rs. 12,500.00</td>
                <td className="py-3 px-4">Rs. 35,000.00</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">Fourth Slab (Rs. 41,667)</td>
              </tr>
              <tr className="hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="py-3 px-4 font-bold text-[var(--text-main)]">
                  Exceeding Rs. 358,333.33
                </td>
                <td className="py-3 px-4 font-bold text-rose-500">36%</td>
                <td className="py-3 px-4">36% on excess</td>
                <td className="py-3 px-4">Rs. 35,000 + 36%</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">Top Marginal Bracket</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
