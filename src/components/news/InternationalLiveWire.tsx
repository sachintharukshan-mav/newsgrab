'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/types';

export interface InternationalChannel {
  id: string;
  name: string;
  videoId: string;
  origin: string;
  region: string;
  accentColor: string;
  badge: string;
  description: {
    en: string;
    si: string;
    ta: string;
  };
}

export const INTERNATIONAL_CHANNELS: InternationalChannel[] = [
  {
    id: 'dw-news',
    name: 'DW News',
    videoId: 'LuKwFajn37U',
    origin: 'Berlin, Germany',
    region: 'Europe · Global',
    accentColor: 'from-blue-600 to-cyan-500',
    badge: 'DW',
    description: {
      en: 'German international public broadcaster providing world news, in-depth analysis, and international affairs.',
      si: 'ජර්මනියේ ඩොයිචේ වෙලේ ජාත්‍යන්තර 24/7 සජීවී පුවත් විකාශය.',
      ta: 'ஜெர்மனியின் சர்வதேச 24/7 நேரலை செய்தி சேவை.'
    }
  },
  {
    id: 'al-jazeera',
    name: 'Al Jazeera English',
    videoId: 'gCNeDWCI0vo',
    origin: 'Doha, Qatar',
    region: 'Middle East · Global',
    accentColor: 'from-amber-600 to-orange-500',
    badge: 'AJ',
    description: {
      en: 'Global news network delivering 24/7 real-time breaking dispatches, investigative journalism, and world coverage.',
      si: 'අල් ජසීරා ඉංග්‍රීසි ජාත්‍යන්තර 24/7 සජීවී පුවත් විකාශය.',
      ta: 'அல் ஜசீரா சர்வதேச 24/7 நேரலை செய்தி சேவை.'
    }
  },
  {
    id: 'france-24',
    name: 'FRANCE 24 English',
    videoId: 'HvZt-nh9sGg',
    origin: 'Paris, France',
    region: 'Europe · World',
    accentColor: 'from-sky-600 to-blue-700',
    badge: 'F24',
    description: {
      en: 'French international continuous news channel delivering breaking global stories from Paris.',
      si: 'ප්‍රංශයේ ෆ්‍රාන්ස් 24 ජාත්‍යන්තර ඉංග්‍රීසි සජීවී පුවත් සේවය.',
      ta: 'பிரான்ஸ் 24 சர்வதேச ஆங்கில நேரலை செய்தி சேவை.'
    }
  },
  {
    id: 'abc-news',
    name: 'ABC News Live',
    videoId: 'iipR5yUp36o',
    origin: 'New York, USA',
    region: 'Americas · Global',
    accentColor: 'from-red-600 to-rose-700',
    badge: 'ABC',
    description: {
      en: '24/7 American live streaming news network featuring live breaking events, political context, and world reports.',
      si: 'ඇමරිකා එක්සත් ජනපදයේ ABC News 24/7 සජීවී ප්‍රවෘත්ති සේවය.',
      ta: 'அமெரிக்காவின் ஏபிசி நியூஸ் 24/7 நேரலை செய்தி சேவை.'
    }
  },
  {
    id: 'cna',
    name: 'CNA (Channel NewsAsia)',
    videoId: 'XWq5kBlakcQ',
    origin: 'Singapore',
    region: 'Asia-Pacific · Global',
    accentColor: 'from-emerald-600 to-teal-700',
    badge: 'CNA',
    description: {
      en: 'Pan-Asian 24-hour news network reporting on Asian perspectives, global markets, and geopolitical developments.',
      si: 'සිංගප්පූරුවේ CNA ආසියා-පැසිෆික් සහ ගෝලීය 24/7 සජීවී පුවත්.',
      ta: 'சிங்கப்பூரின் சிஎன்ஏ ஆசிய-பசிபிக் 24/7 நேரலை செய்தி.'
    }
  },
  {
    id: 'sky-news',
    name: 'Sky News Live',
    videoId: '-1JvSY1EywQ',
    origin: 'London, United Kingdom',
    region: 'UK · International',
    accentColor: 'from-rose-600 to-purple-700',
    badge: 'SKY',
    description: {
      en: 'British 24-hour live television news channel reporting world events and breaking headlines as they unfold.',
      si: 'බ්‍රිතාන්‍යයේ ස්කයි නිවුස් 24/7 ජාත්‍යන්තර සජීවී ප්‍රවෘත්ති සේවය.',
      ta: 'பிரிட்டனின் ஸ்கை நியூஸ் 24/7 சர்வதேச நேரலை செய்தி.'
    }
  }
];

interface InternationalLiveWireProps {
  currentLang: Language;
}

export function InternationalLiveWire({ currentLang }: InternationalLiveWireProps) {
  const [activeChannelId, setActiveChannelId] = useState<string>(INTERNATIONAL_CHANNELS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const activeChannel =
    INTERNATIONAL_CHANNELS.find((c) => c.id === activeChannelId) || INTERNATIONAL_CHANNELS[0];

  const currentIndex = INTERNATIONAL_CHANNELS.findIndex((c) => c.id === activeChannel.id);

  const handleNextChannel = () => {
    const nextIdx = (currentIndex + 1) % INTERNATIONAL_CHANNELS.length;
    setActiveChannelId(INTERNATIONAL_CHANNELS[nextIdx].id);
    setIsPlaying(true);
  };

  const handlePrevChannel = () => {
    const prevIdx = (currentIndex - 1 + INTERNATIONAL_CHANNELS.length) % INTERNATIONAL_CHANNELS.length;
    setActiveChannelId(INTERNATIONAL_CHANNELS[prevIdx].id);
    setIsPlaying(true);
  };

  const labels = {
    title: {
      en: 'International 24/7 Newsroom Live Streams',
      si: 'ජාත්‍යන්තර 24/7 සජීවී ප්‍රවෘත්ති විකාශන',
      ta: 'சர்வதேச 24/7 நேரலை செய்தி ஒளிபரப்பு'
    },
    subtitle: {
      en: 'Continuous 24-hour live satellite feeds verified from world news agencies.',
      si: 'ගෝලීය ප්‍රවෘත්ති ආයතන වෙතින් සත්‍යාපනය කළ නොනවතින 24/7 සජීවී විකාශන.',
      ta: 'உலகளாவிய செய்தி நிறுவனங்களின் தொடர்ச்சியான 24/7 நேரலை ஒளிபரப்பு.'
    },
    liveBadge: {
      en: '24/7 LIVE',
      si: '24/7 සජීවී',
      ta: '24/7 நேரலை'
    },
    selectFeed: {
      en: 'Select Channel Feed',
      si: 'නාලිකාව තෝරන්න',
      ta: 'சேனலைத் தேர்ந்தெடுக்கவும்'
    },
    clickToWatch: {
      en: 'Click any network below to tune in live',
      si: 'සජීවීව නැරඹීමට පහත නාලිකාවක් මත ක්ලික් කරන්න',
      ta: 'நேரலையாகப் பார்க்க கீழே உள்ள சேனலைக் கிளிக் செய்யவும்'
    },
    tuneIn: {
      en: 'Tune In Live',
      si: 'සජීවීව නරඹන්න',
      ta: 'நேரலையில் இணைவீர்'
    },
    collapse: {
      en: 'Collapse',
      si: 'සඟවන්න',
      ta: 'சுருக்குக'
    },
    expand: {
      en: 'Expand Live Deck',
      si: 'සජීවී කවුළුව පෙන්වන්න',
      ta: 'நேரலை சாளரத்தைக் காட்டு'
    },
    stop: {
      en: 'Close Player',
      si: 'වසා දමන්න',
      ta: 'மூடுக'
    }
  };

  return (
    <section
      aria-label="International 24/7 Live News Streams"
      className="w-full mb-8 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0e1117] to-[#07090e] p-4 sm:p-5 shadow-2xl relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-bold tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            {labels.liveBadge[currentLang]}
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{labels.title[currentLang]}</span>
            </h2>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {labels.subtitle[currentLang]}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isPlaying && (
            <button
              onClick={() => setIsPlaying(false)}
              className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Close active video stream"
            >
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{labels.stop[currentLang]}</span>
            </button>
          )}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition-colors cursor-pointer flex items-center gap-1.5"
            aria-expanded={!isMinimized}
          >
            <span>{isMinimized ? labels.expand[currentLang] : labels.collapse[currentLang]}</span>
            <svg
              className={`w-3.5 h-3.5 transform transition-transform ${isMinimized ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="mt-4 space-y-4 relative z-10">
          {/* Main Video Theater Deck (shown when user tunes in) */}
          {isPlaying ? (
            <div className="rounded-xl overflow-hidden border border-white/[0.1] bg-black shadow-2xl">
              {/* Theater Control Bar */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-zinc-900/90 border-b border-white/[0.08] backdrop-blur-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black text-white bg-gradient-to-br ${activeChannel.accentColor}`}
                  >
                    {activeChannel.badge}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white truncate">
                        {activeChannel.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">
                        {activeChannel.origin}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handlePrevChannel}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Previous live stream"
                    aria-label="Previous channel"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextChannel}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Next live stream"
                    aria-label="Next channel"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeChannel.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Open on YouTube"
                    aria-label="Open on YouTube in new tab"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* YouTube 16:9 Iframe */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeChannel.videoId}?autoplay=1&modestbranding=1&rel=0&playsinline=1`}
                  title={`${activeChannel.name} 24/7 Live Stream`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Caption Bar */}
              <div className="px-3 sm:px-4 py-2 bg-zinc-950/90 text-xs text-zinc-400 border-t border-white/[0.04] flex items-center justify-between">
                <p className="truncate mr-2">
                  {activeChannel.description[currentLang]}
                </p>
                <span className="text-[10px] font-mono text-emerald-400 shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Verified 24/7 Signal
                </span>
              </div>
            </div>
          ) : (
            /* Standby Hero Card with Quick Tune-In */
            <div className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black text-white bg-gradient-to-br ${activeChannel.accentColor} shadow-lg shrink-0`}
                >
                  {activeChannel.badge}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {activeChannel.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-mono text-[10px] font-semibold">
                      {activeChannel.region}
                    </span>
                    <span className="text-zinc-500 text-xs">· {activeChannel.origin}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                    {activeChannel.description[currentLang]}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPlaying(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 hover:shadow-rose-600/35 transition-all cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{labels.tuneIn[currentLang]}</span>
              </button>
            </div>
          )}

          {/* Channel Selector Grid / Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-0.5">
              <span>{labels.selectFeed[currentLang]}</span>
              <span className="text-zinc-500">{labels.clickToWatch[currentLang]}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {INTERNATIONAL_CHANNELS.map((ch) => {
                const isCurrent = ch.id === activeChannel.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChannelId(ch.id);
                      setIsPlaying(true);
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isCurrent && isPlaying
                        ? 'bg-zinc-800/90 border-rose-500/60 shadow-lg shadow-rose-950/20'
                        : isCurrent
                        ? 'bg-zinc-800/60 border-white/[0.2]'
                        : 'bg-zinc-900/40 hover:bg-zinc-800/40 border-white/[0.05] hover:border-white/[0.12]'
                    }`}
                  >
                    {isCurrent && isPlaying && (
                      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black text-white bg-gradient-to-br ${ch.accentColor} shrink-0`}
                      >
                        {ch.badge}
                      </span>
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                        {ch.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full mt-auto text-[10px] font-mono text-zinc-400">
                      <span className="truncate">{ch.origin.split(',')[0]}</span>
                      <span className="text-rose-400 font-semibold shrink-0">24/7</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
