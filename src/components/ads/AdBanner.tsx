'use client';

import React, { useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';

export type AdFormat = 'billboard' | 'leaderboard' | 'mrec' | 'halfpage' | 'infeed' | 'multiplex' | 'mobile_banner';

interface AdBannerProps {
  format: AdFormat;
  slotId: string;
  adSlot?: string;
  className?: string;
  customHtml?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format,
  slotId,
  adSlot,
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
    if (adClient && effectiveAdSlot && typeof window !== 'undefined' && !hasPushed.current) {
      hasPushed.current = true;
      try {
        // @ts-expect-error - adsbygoogle is injected by Google AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.debug('AdSense push notice:', err);
      }
    }
  }, [adClient, effectiveAdSlot]);

  return (
    <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
      {/* Editorial Ad Label conforming strictly to Better Ads Standards & Google AdSense Policies */}
      <div className={`w-full ${widthConstraints[format]} flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest px-1 mb-1.5`}>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span>Advertisement</span>
        </span>
        <span className="text-[8px] text-zinc-600">
          Reserved Inventory
        </span>
      </div>

      {/* Reserved Slot Container (Guarantees Zero CLS) */}
      <div
        id={slotId}
        ref={adRef}
        className={`rounded-lg border border-white/[0.06] bg-[#0c0d11] overflow-hidden flex items-center justify-center ${formatStyles[format]}`}
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
        ) : (
          /* Legitimate House Inventory Placeholder */
          <div className="p-4 w-full h-full flex flex-col items-center justify-center text-center space-y-1 text-zinc-500">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              NEWSGRAB Digital Network
            </div>
            <p className="text-[11px] font-mono text-zinc-500 max-w-md">
              Ad Space Reserved ({format.toUpperCase()})
            </p>
            <a
              href="mailto:advertising@newsgrab.lk"
              className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors pt-1"
            >
              <Mail className="w-3 h-3" />
              <span>Partner Inquiries: advertising@newsgrab.lk</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
