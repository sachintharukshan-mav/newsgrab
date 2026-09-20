'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export type AdFormat = 'billboard' | 'leaderboard' | 'mrec' | 'halfpage' | 'infeed' | 'multiplex' | 'mobile_banner';

interface AdBannerProps {
  format: AdFormat;
  slotId: string;
  adSlot?: string;
  sponsorName?: string;
  className?: string;
  customHtml?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format,
  slotId,
  adSlot,
  sponsorName,
  className = '',
  customHtml
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const hasPushed = useRef<boolean>(false);
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Strict dimensions to guarantee 0.00 Cumulative Layout Shift (CLS)
  const formatStyles: Record<AdFormat, string> = {
    billboard: 'w-full max-w-[970px] min-h-[120px] sm:min-h-[250px] mx-auto',
    leaderboard: 'w-full max-w-[728px] min-h-[90px] mx-auto',
    mrec: 'w-[300px] min-h-[250px] mx-auto',
    halfpage: 'w-[300px] min-h-[600px] mx-auto',
    infeed: 'w-full min-h-[130px]',
    multiplex: 'w-full min-h-[200px]',
    mobile_banner: 'w-full max-w-[320px] min-h-[50px] mx-auto',
  };

  const widthConstraints: Record<AdFormat, string> = {
    billboard: 'max-w-[970px]',
    leaderboard: 'max-w-[728px]',
    mrec: 'max-w-[300px]',
    halfpage: 'max-w-[300px]',
    infeed: 'w-full',
    multiplex: 'w-full',
    mobile_banner: 'max-w-[320px]',
  };

  const effectiveAdSlot =
    adSlot ||
    (format === 'billboard' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_BILLBOARD : undefined) ||
    (format === 'leaderboard' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_LEADERBOARD || process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD : undefined) ||
    (format === 'mrec' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_MREC : undefined) ||
    (format === 'halfpage' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HALFPAGE : undefined) ||
    (format === 'infeed' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED : undefined) ||
    (format === 'multiplex' ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX : undefined) ||
    process.env.NEXT_PUBLIC_ADSENSE_DEFAULT_SLOT;

  useEffect(() => {
    if (adClient && typeof window !== 'undefined' && !hasPushed.current) {
      hasPushed.current = true;
      try {
        // @ts-expect-error - adsbygoogle is injected by Google AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.debug('AdSense push notice:', err);
      }
    }
  }, [adClient]);

  return (
    <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
      {/* Editorial Ad Label conforming strictly to Better Ads Standards & Google AdSense Policies */}
      <div className={`w-full ${widthConstraints[format]} flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase tracking-widest px-1 mb-1.5`}>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          {sponsorName ? `Sponsorship · ${sponsorName}` : 'Advertisement'}
        </span>
        <span className="flex items-center gap-1 text-[8px] text-zinc-500">
          <ShieldCheck className="w-2.5 h-2.5 text-zinc-400" />
          <span>Google AdSense / Certified Ad Exchange</span>
        </span>
      </div>

      {/* Reserved Slot Container (Guarantees Zero CLS) */}
      <div
        id={slotId}
        ref={adRef}
        className={`rounded-lg border border-white/[0.08] bg-[#0e0f13] overflow-hidden flex items-center justify-center ${formatStyles[format]}`}
      >
        {customHtml ? (
          /* Multi-Platform Custom SSP / Prebid / GAM HTML */
          <div dangerouslySetInnerHTML={{ __html: customHtml }} className="w-full h-full flex items-center justify-center" />
        ) : adClient && effectiveAdSlot ? (
          /* Live Google AdSense Tag */
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center', width: '100%', height: '100%' }}
            data-ad-client={adClient}
            data-ad-slot={effectiveAdSlot}
            data-ad-format={
              format === 'leaderboard' || format === 'billboard'
                ? 'horizontal'
                : format === 'mrec' || format === 'halfpage'
                  ? 'rectangle'
                  : format === 'multiplex'
                    ? 'autorelaxed'
                    : 'auto'
            }
            data-full-width-responsive="true"
          />
        ) : format === 'multiplex' ? (
          /* Multiplex / Sponsored Recommendation Grid Fallback */
          <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {[
              {
                brand: 'Commercial Bank',
                title: 'High-yield foreign currency fixed deposits with CBSL rate parity',
                tag: 'Finance'
              },
              {
                brand: 'SLT Mobitel Enterprise',
                title: 'Dedicated Tier III Colombo cloud hosting for digital enterprises',
                tag: 'Cloud & Tech'
              },
              {
                brand: 'Ceylon Tea Board',
                title: 'Global export quality standards and origin verification',
                tag: 'Agri Export'
              },
              {
                brand: 'Colombo Stock Exchange',
                title: 'Digital CDS account opening and ASPI real-time trading access',
                tag: 'Investments'
              }
            ].map((card, i) => (
              <div key={i} className="p-3 rounded bg-white/[0.02] border border-white/[0.04] flex flex-col justify-between hover:bg-white/[0.04] transition-colors">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-1">
                    <span>{card.brand}</span>
                    <span className="text-zinc-400 font-semibold">{card.tag}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium line-clamp-2 leading-snug">
                    {card.title}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="text-[9px] uppercase tracking-wider text-rose-400">Promoted</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Certified Publisher House Placement / Direct Sponsor Banner */
          <div className="p-4 w-full h-full flex flex-col items-center justify-center text-center space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{sponsorName || 'Commercial Bank of Ceylon PLC'}</span>
            </span>
            <p className="text-xs text-zinc-300 font-medium max-w-lg leading-relaxed">
              {format === 'mrec'
                ? 'Premier inward remittance and foreign currency fixed deposits.'
                : format === 'halfpage'
                  ? 'Institutional Grade Global Wealth Management and Treasury Securities.'
                  : 'Direct Inward Remittances to Sri Lanka · Official CBSL Exchange Rates · 0% Processing Fees.'}
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white font-mono transition-colors pt-0.5">
              <span>Verified Commercial Partner</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

