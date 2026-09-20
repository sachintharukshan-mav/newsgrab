'use client';

import React, { useSyncExternalStore, useState } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'newsgrab_cookie_consent_v2';

let listeners: Array<() => void> = [];
let forceShow = false;

const notify = () => {
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  const handleStorage = () => listener();
  const handleCustom = () => {
    forceShow = true;
    notify();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    window.addEventListener('newsgrab:open-cookie-consent', handleCustom);
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('newsgrab:open-cookie-consent', handleCustom);
    }
  };
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  if (forceShow) return true;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cookie_consent') === '1' || params.get('reset_cookies') === '1') {
      return true;
    }
    return !localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return true;
  }
};

const getServerSnapshot = () => false;

export const CookieConsent: React.FC = () => {
  const needsConsent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissedLocally, setDismissedLocally] = useState(false);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    } catch {}
    forceShow = false;
    setDismissedLocally(true);
    notify();
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'essential');
    } catch {}
    forceShow = false;
    setDismissedLocally(true);
    notify();
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'essential');
    } catch {}
    forceShow = false;
    setDismissedLocally(true);
    notify();
  };

  if (!needsConsent || dismissedLocally) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and Advertising Preferences"
      className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-xl bg-[#111318]/95 backdrop-blur-md border border-white/[0.12] shadow-2xl space-y-3.5 transition-all duration-300 ease-out"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
          <Cookie className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>Privacy &amp; Cookie Consent</span>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss cookie notice"
          className="text-zinc-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">
        NewsGrab uses essential cookies to remember your trilingual preferences, and Google AdSense cookies to support free, independent news syndication. Learn more in our{' '}
        <Link href="/privacy" className="text-rose-400 underline hover:text-rose-300">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="flex items-center justify-between gap-2.5 pt-1">
        <button
          onClick={handleEssentialOnly}
          className="flex-1 py-1.5 px-3 rounded text-[11px] font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer text-center"
        >
          Essential Only
        </button>
        <button
          onClick={handleAcceptAll}
          className="flex-1 py-1.5 px-3 rounded text-[11px] font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm shadow-rose-950 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Accept All</span>
        </button>
      </div>
    </div>
  );
};
