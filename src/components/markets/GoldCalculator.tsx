'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Check, Copy, Sparkles } from 'lucide-react';

interface GoldCalculatorProps {
  pureGramLkr: number; // 24K per gram in LKR
}

export const GoldCalculator: React.FC<GoldCalculatorProps> = ({ pureGramLkr }) => {
  const [weight, setWeight] = useState<number>(8); // default 1 sovereign (8g)
  const [unit, setUnit] = useState<'grams' | 'sovereigns'>('grams');
  const [karat, setKarat] = useState<number>(22); // default 22K for jewellery
  const [copied, setCopied] = useState(false);

  const totalGrams = useMemo(() => {
    return unit === 'sovereigns' ? weight * 8 : weight;
  }, [weight, unit]);

  const purityRatio = useMemo(() => {
    return karat / 24;
  }, [karat]);

  const totalValueLkr = useMemo(() => {
    return Math.round(totalGrams * pureGramLkr * purityRatio);
  }, [totalGrams, pureGramLkr, purityRatio]);

  const pricePerGramThisKarat = useMemo(() => {
    return Math.round(pureGramLkr * purityRatio);
  }, [pureGramLkr, purityRatio]);

  const handleCopy = async () => {
    try {
      const text = `${weight} ${unit === 'sovereigns' ? 'Sovereign(s)' : 'Gram(s)'} of ${karat}K Gold = Rs. ${totalValueLkr.toLocaleString()} (Sea Street Colombo rate via Lanka Dispatch)`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-line)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Calculator className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] font-headline">
              Interactive Gold Value Calculator
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Calculate exact value for any weight and purity in Sri Lankan Rupees
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors cursor-pointer"
          title="Copy calculation"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weight Input */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Weight
          </label>
          <div className="flex rounded-lg border border-[var(--border-line)] bg-[var(--bg-subtle)] overflow-hidden focus-within:border-amber-500 transition-colors">
            <input
              type="number"
              min="0.1"
              step="any"
              value={weight || ''}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-transparent text-[var(--text-main)] font-mono text-lg font-bold focus:outline-hidden"
              placeholder="8"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'grams' | 'sovereigns')}
              className="px-3 py-3 bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-xs font-semibold border-l border-[var(--border-line)] focus:outline-hidden cursor-pointer"
            >
              <option value="grams">Grams (g)</option>
              <option value="sovereigns">Sovereigns / Pawans (8g)</option>
            </select>
          </div>
        </div>

        {/* Karat / Purity Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Purity / Karat
          </label>
          <select
            value={karat}
            onChange={(e) => setKarat(parseInt(e.target.value, 10))}
            className="w-full px-4 py-3.5 rounded-lg border border-[var(--border-line)] bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-sm font-semibold focus:border-amber-500 focus:outline-hidden cursor-pointer"
          >
            <option value={24}>24 Karat (99.9% Pure Bullion)</option>
            <option value={22}>22 Karat (91.6% Sovereign Jewellery)</option>
            <option value={21}>21 Karat (87.5% Traditional Gold)</option>
            <option value={18}>18 Karat (75.0% Diamond Setting)</option>
          </select>
        </div>

        {/* Total Calculated Output */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Estimated Market Value
          </label>
          <div className="px-4 py-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xl sm:text-2xl font-black flex items-center justify-between">
            <span>Rs. {totalValueLkr.toLocaleString()}</span>
            <span className="text-xs font-normal text-[var(--text-muted)]">LKR</span>
          </div>
        </div>
      </div>

      {/* Quick Weight Presets */}
      <div className="flex items-center gap-2 flex-wrap pt-2">
        <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">Common Sizes:</span>
        <button
          type="button"
          onClick={() => { setWeight(1); setUnit('grams'); }}
          className="px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-xs font-mono transition-colors cursor-pointer"
        >
          1 Gram
        </button>
        <button
          type="button"
          onClick={() => { setWeight(1); setUnit('sovereigns'); }}
          className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-semibold transition-colors cursor-pointer"
        >
          1 Sovereign (8g / පවුම)
        </button>
        <button
          type="button"
          onClick={() => { setWeight(2); setUnit('sovereigns'); }}
          className="px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-xs font-mono transition-colors cursor-pointer"
        >
          2 Sovereigns (16g)
        </button>
        <button
          type="button"
          onClick={() => { setWeight(10); setUnit('grams'); }}
          className="px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-xs font-mono transition-colors cursor-pointer"
        >
          10 Grams
        </button>
        <button
          type="button"
          onClick={() => { setWeight(100); setUnit('grams'); }}
          className="px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-xs font-mono transition-colors cursor-pointer"
        >
          100g Bar
        </button>
      </div>

      {/* Detail calculation explanation */}
      <div className="pt-3 border-t border-[var(--border-line)] text-[11px] font-mono text-[var(--text-muted)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {karat}K Unit Rate: Rs. {pricePerGramThisKarat.toLocaleString()} / gram (Rs. {(pricePerGramThisKarat * 8).toLocaleString()} / sovereign)
          </span>
        </div>
        <span className="text-zinc-400">Sea Street Colombo Merchant Average</span>
      </div>
    </div>
  );
};
