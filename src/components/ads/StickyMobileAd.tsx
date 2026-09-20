'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem('newsgrab_sticky_ad_dismissed') === 'true';
  } catch {
    return false;
  }
};

const getServerSnapshot = () => false;

export const StickyMobileAd: React.FC = () => {
  const isSessionDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  if (isSessionDismissed || manuallyDismissed) return null;

  const handleDismiss = () => {
    setManuallyDismissed(true);
    try {
      sessionStorage.setItem('newsgrab_sticky_ad_dismissed', 'true');
    } catch {}
  };

  return (
    <aside
      role="complementary"
      aria-label="Sponsored Mobile Advertisement"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0d0e12]/98 backdrop-blur-md border-t border-white/10 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 max-h-[60px]"
    >
      <a
        href="https://www.combank.lk"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center gap-2.5"
      >
        <div className="w-7 h-7 rounded bg-zinc-800 border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-zinc-300 flex-shrink-0">
          CBC
        </div>
        <div className="truncate">
          <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
            Sponsored · Commercial Bank
          </div>
          <div className="text-xs text-zinc-200 font-medium truncate flex items-center gap-1">
            <span>Remit to Sri Lanka with 0% Processing Fees</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
          </div>
        </div>
      </a>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss advertisement"
        className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
