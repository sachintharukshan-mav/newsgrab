'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, RotateCcw, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lanka Dispatch client boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 flex flex-col justify-between selection:bg-rose-900/40 selection:text-white">
      {/* Top Masthead */}
      <header className="border-b border-white/[0.08] bg-[#07080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded bg-rose-600 group-hover:bg-rose-500 transition-colors">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                LANKA<span className="text-rose-500">DISPATCH</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                Digital Intelligence Desk
              </span>
            </div>
          </Link>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Wire Sync Notice</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          CONNECTION NOTICE · TEMPORARY DISPATCH INTERRUPTION
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight mb-4 leading-tight">
          Unable to synchronize dispatch
        </h1>

        <p className="text-base text-zinc-400 font-sans max-w-lg mb-8 leading-relaxed">
          The requested wire report could not be loaded due to a transient network sync or cache update.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Dispatch</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white font-medium text-sm transition-colors border border-white/[0.08]"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
            <span>Return to Front Page</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080a] py-6 text-center text-xs font-mono text-zinc-500">
        <p>© 2026 Lanka Dispatch Bureau. Multi-Source Verified Reporting.</p>
      </footer>
    </div>
  );
}
