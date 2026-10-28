'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Calculator, Check, Copy } from 'lucide-react';
import { CurrencyPair } from '@/lib/forex-data';

interface ForexConverterProps {
  currencies: CurrencyPair[];
  baseUsdLkr: number;
}

export const ForexConverter: React.FC<ForexConverterProps> = ({ currencies, baseUsdLkr }) => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('LKR');
  const [copied, setCopied] = useState(false);

  // Map of rates relative to LKR (1 Unit = X LKR)
  const rateMap = useMemo(() => {
    const map: Record<string, number> = { LKR: 1 };
    currencies.forEach((c) => {
      map[c.code] = c.midRate;
    });
    return map;
  }, [currencies]);

  const convertedValue = useMemo(() => {
    const fromLkrRate = rateMap[fromCode] || 1;
    const toLkrRate = rateMap[toCode] || 1;
    const valueInLkr = amount * fromLkrRate;
    return valueInLkr / toLkrRate;
  }, [amount, fromCode, toCode, rateMap]);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleCopyResult = async () => {
    try {
      const text = `${amount.toLocaleString()} ${fromCode} = ${convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCode} (via Lanka Dispatch Market Desk)`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const currencyOptions = useMemo(() => {
    return [
      { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰' },
      ...currencies.map((c) => ({ code: c.code, name: c.name, flag: c.flag })),
    ];
  }, [currencies]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-line)] shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-line)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Calculator className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] font-headline">
              Live Currency Converter Calculator
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Instant conversion grounded in CBSL indicative fixing
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyResult}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-line)] transition-colors cursor-pointer"
          title="Copy calculation"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        {/* From Amount & Currency */}
        <div className="md:col-span-3 space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Amount &amp; Source Currency
          </label>
          <div className="flex rounded-lg border border-[var(--border-line)] bg-[var(--bg-subtle)] focus-within:border-rose-500 transition-colors overflow-hidden">
            <input
              type="number"
              min="0"
              step="any"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-transparent text-[var(--text-main)] font-mono text-lg font-bold focus:outline-hidden"
              placeholder="100"
            />
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="px-3 py-3 bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-sm font-semibold border-l border-[var(--border-line)] focus:outline-hidden cursor-pointer"
            >
              {currencyOptions.map((c) => (
                <option key={`from-${c.code}`} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center pt-4 md:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 rounded-full bg-[var(--bg-subtle)] hover:bg-rose-500 hover:text-white text-[var(--text-muted)] border border-[var(--border-line)] hover:border-rose-500 transition-all shadow-sm cursor-pointer hover:rotate-180 duration-200"
            title="Swap Currencies"
            aria-label="Swap Currencies"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Amount & Currency */}
        <div className="md:col-span-3 space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Converted Result
          </label>
          <div className="flex rounded-lg border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
            <div className="w-full px-4 py-3 text-emerald-600 dark:text-emerald-400 font-mono text-lg sm:text-xl font-bold flex items-center truncate">
              {convertedValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="px-3 py-3 bg-[var(--bg-card)] text-[var(--text-main)] font-mono text-sm font-semibold border-l border-[var(--border-line)] focus:outline-hidden cursor-pointer"
            >
              {currencyOptions.map((c) => (
                <option key={`to-${c.code}`} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 flex-wrap pt-2">
        <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">Quick Presets:</span>
        {[50, 100, 500, 1000, 5000].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset)}
            className="px-2.5 py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-line)] text-xs font-mono text-[var(--text-body)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            {fromCode === 'LKR' ? `Rs. ${preset.toLocaleString()}` : `${fromCode} ${preset.toLocaleString()}`}
          </button>
        ))}
      </div>

      {/* Rate Attribution footer */}
      <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[var(--border-line)]">
        <span>
          Indicative Conversion: 1 {fromCode} = {(rateMap[fromCode] / rateMap[toCode]).toFixed(4)} {toCode}
        </span>
        <span className="text-emerald-500">Live CBSL Middle Rate Synced</span>
      </div>
    </div>
  );
};
