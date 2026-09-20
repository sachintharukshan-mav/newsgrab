import React from 'react';
import Link from 'next/link';
import { Newspaper, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 flex flex-col justify-between selection:bg-rose-900/40 selection:text-white">
      {/* Top Broadsheet Masthead Header */}
      <header className="border-b border-white/[0.08] bg-[#07080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded bg-rose-600 group-hover:bg-rose-500 transition-colors">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                NEWSGRAB<span className="text-rose-500">.LK</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                National News Wire Desk
              </span>
            </div>
          </Link>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>404 · Unresolved Wire Dispatch</span>
          </div>
        </div>
      </header>

      {/* Main Error Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          404 ERROR · DISPATCH NOT FOUND
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight mb-4 leading-tight">
          The requested wire story does not exist or has expired.
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 font-sans max-w-xl mb-3 leading-relaxed">
          The dispatch identifier may have been archived, re-clustered into a developing breaking alert, or mistyped.
        </p>

        <div className="text-xs font-mono text-zinc-500 space-y-1 mb-10">
          <p>සිංහල: ඔබ සොයන පුවත සොයාගත නොහැකි විය. කරුණාකර මුල් පිටුවට යන්න.</p>
          <p>தமிழ்: நீங்கள் தேடும் செய்தி காணப்படவில்லை. தயவுசெய்து முகப்பிற்குச் செல்லவும்.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Front Page</span>
          </Link>

          <Link
            href="/?timeRange=24h"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white font-medium text-sm transition-colors border border-white/[0.08]"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            <span>Search Past 24h Alerts</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#07080a] py-6 text-center text-xs font-mono text-zinc-500">
        <p>© {new Date().getFullYear()} NewsGrab Colombo Bureau. Multi-Source Verified Reporting.</p>
      </footer>
    </div>
  );
}
