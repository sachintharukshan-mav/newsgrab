'use client';

import React from 'react';
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
    <div className="w-full bg-[#08090b] border-b border-white/[0.08] text-[11px] py-1.5 overflow-hidden select-none">
      <div className="flex financial-ticker-marquee items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-8">
            <span className="inline-flex items-center gap-1.5 font-mono text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              {tickerLabels.cbsl[currentLang]}
            </span>

            {cbslRates.map((rate) => {
              const isPositive = rate.change24h >= 0;
              return (
                <div key={`${copyIndex}-${rate.code}`} className="flex items-center gap-1.5 font-mono">
                  <span className="text-zinc-400 font-semibold">{rate.code}/LKR</span>
                  <span className="text-zinc-100 font-medium">{rate.sellRate.toFixed(2)}</span>
                  <span className={`text-[10px] ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(rate.change24h)}%
                  </span>
                </div>
              );
            })}

            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-zinc-400">{tickerLabels.gold[currentLang]}</span>
              <span className="text-amber-200/90 font-medium">Rs. {goldPrice24kPerSovereign.lkr.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-zinc-400">{tickerLabels.cse[currentLang]}</span>
              <span className="text-zinc-200 font-medium">{cseIndex.aspi.toFixed(2)}</span>
              <span className="text-emerald-400 text-[10px]">▲ {cseIndex.changePercent}%</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-zinc-400">
              <span>{tickerLabels.colombo[currentLang]}: {colomboWeather.tempC}°C ({colomboWeather.condition})</span>
            </div>

            <span className="text-zinc-700">{"///"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
