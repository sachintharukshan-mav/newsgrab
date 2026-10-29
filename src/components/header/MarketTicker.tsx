'use client';

import React from 'react';
import Link from 'next/link';
import { MarketPulse, Language } from '@/lib/types';

interface MarketTickerProps {
  pulse: MarketPulse;
  currentLang?: Language;
}

const tickerLabels = {
  cbsl: {
    en: 'CBSL DAILY FIXING:',
    si: 'ශ්‍රී.ල.ම.බැ. විනිමය:',
    ta: 'மத்திய வங்கி மாற்று விகிதம்:'
  },
  gold: {
    en: 'GOLD 24K (SOV):',
    si: 'රන් පවුම 24K:',
    ta: 'தங்கம் 24K (பவுன்):'
  },
  fuel: {
    en: 'FUEL (CPC/LIOC):',
    si: 'ඉන්ධන මිල (සීපීසී):',
    ta: 'எரிபொருள் விலை:'
  },
  cse: {
    en: 'CSE ASPI:',
    si: 'කොළඹ කොටස් මිල දර්ශකය:',
    ta: 'கொழும்பு பங்குச்சந்தை:'
  },
  colombo: {
    en: 'COLOMBO',
    si: 'කොළඹ',
    ta: 'கொழும்பு'
  }
};

export const MarketTicker: React.FC<MarketTickerProps> = ({ pulse, currentLang = 'en' }) => {
  const { cbslRates, goldPrice24kPerSovereign, cseIndex, colomboWeather } = pulse;

  return (
    <div className="w-full bg-[var(--ticker-bg)] border-b border-[var(--border-line)] text-[11px] py-1.5 overflow-hidden select-none transition-colors duration-200">
      <div className="flex financial-ticker-marquee items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-8">
            <Link
              href="/markets/usd-to-lkr-rate-today"
              className="inline-flex items-center gap-1.5 font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold uppercase tracking-wider text-[10px] transition-colors"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              {tickerLabels.cbsl[currentLang]}
            </Link>

            {cbslRates.map((rate) => {
              const isPositive = rate.change24h >= 0;
              return (
                <Link
                  key={`${copyIndex}-${rate.code}`}
                  href="/markets/usd-to-lkr-rate-today"
                  className="flex items-center gap-1.5 font-mono hover:text-rose-500 transition-colors"
                >
                  <span className="text-[var(--text-muted)] font-semibold">{rate.code}/LKR</span>
                  <span className="text-[var(--text-main)] font-medium">{rate.sellRate.toFixed(2)}</span>
                  <span className={`text-[10px] ${isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(rate.change24h)}%
                  </span>
                </Link>
              );
            })}

            <Link
              href="/markets/gold-price-sri-lanka-today"
              className="flex items-center gap-1.5 font-mono hover:text-amber-500 transition-colors"
            >
              <span className="text-[var(--text-muted)]">{tickerLabels.gold[currentLang]}</span>
              <span className="text-amber-600 dark:text-amber-200 font-medium">Rs. {goldPrice24kPerSovereign.lkr.toLocaleString()}</span>
            </Link>

            <Link
              href="/utility/fuel-and-power-sri-lanka"
              className="flex items-center gap-1.5 font-mono hover:text-emerald-500 transition-colors"
            >
              <span className="text-[var(--text-muted)]">{tickerLabels.fuel[currentLang]}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">PETROL 92: Rs. 414</span>
              <span className="text-[var(--text-faint)]">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">DIESEL: Rs. 392</span>
            </Link>

            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[var(--text-muted)]">{tickerLabels.cse[currentLang]}</span>
              <span className="text-[var(--text-main)] font-medium">{cseIndex.aspi.toFixed(2)}</span>
              <span className="text-emerald-500 dark:text-emerald-400 text-[10px]">▲ {cseIndex.changePercent}%</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[var(--text-muted)]">
              <span>{tickerLabels.colombo[currentLang]}: {colomboWeather.tempC}°C ({colomboWeather.condition})</span>
            </div>

            <span className="text-[var(--text-faint)]">{"///"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
