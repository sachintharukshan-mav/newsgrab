'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article, Language } from '@/lib/types';
import { Play, Pause, Square, SkipForward, SkipBack } from 'lucide-react';

interface AudioFlashBarProps {
  articles: Article[];
  currentLang: Language;
  onOpenArticle?: (article: Article) => void;
}

const flashLabels = {
  title: {
    en: '60-Second Audio Flash',
    si: 'මිනිත්තු 1 පුවත් හඬ විකාශය',
    ta: '60 வினாடி ஆடியோ சுருக்கம்'
  },
  subtitle: {
    en: 'Today’s top intelligence in 60 seconds',
    si: 'අද දවසේ ප්‍රමුඛ පුවත් ක්ෂණිකව ශ්‍රවණය කරන්න',
    ta: 'இன்றைய முக்கிய செய்திகளை உடனே கேளுங்கள்'
  },
  nowPlaying: {
    en: 'Now Broadcasting',
    si: 'දැන් විකාශය වේ',
    ta: 'தற்போது ஒலிபரப்பாகிறது'
  },
  story: {
    en: 'Story',
    si: 'පුවත',
    ta: 'செய்தි'
  },
  speed: {
    en: 'Speed',
    si: 'වේගය',
    ta: 'வேகம்'
  },
  unsupported: {
    en: 'Audio synthesis is not supported on this browser.',
    si: 'මෙම බ්‍රවුසරයේ ශ්‍රව්‍ය වාදනය සහාය නොදක්වයි.',
    ta: 'இந்த உலாவியில் ஆடியோ ஆதரவு இல்லை.'
  }
};

export const AudioFlashBar: React.FC<AudioFlashBarProps> = ({
  articles,
  currentLang,
  onOpenArticle
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playStoryRef = useRef<(index: number) => void>(() => {});

  // Top 3 stories for the brief
  const briefStories = articles.slice(0, 3);

  const handleStop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsClient(true);
      if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
        setIsSupported(false);
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop playback when language changes
  useEffect(() => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const frameId = requestAnimationFrame(() => {
        setIsPlaying(false);
        setIsPaused(false);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [currentLang, isPlaying]);

  // Generate clean broadcast spoken text for a story
  const getStorySpokenText = useCallback((story: Article, index: number, total: number, lang: Language) => {
    const title = story.title[lang] || story.title.en || '';
    const summary = story.summary[lang] || story.summary.en || '';

    if (lang === 'si') {
      const prefix = index === 0 ? 'ප්‍රධාන පුවත: ' : `මීළඟ පුවත: `;
      const source = story.publisherName ? ` මූලාශ්‍රය ${story.publisherName}.` : '';
      return `${prefix}${title}. ${summary}.${source}`;
    }

    if (lang === 'ta') {
      const prefix = index === 0 ? 'முக்கிய செய்தி: ' : `அடுத்த செய்தி: `;
      const source = story.publisherName ? ` ஆதாரம் ${story.publisherName}.` : '';
      return `${prefix}${title}. ${summary}.${source}`;
    }

    // English
    const prefix = index === 0 ? 'Top headline: ' : `In other news: `;
    const source = story.publisherName ? ` Reported by ${story.publisherName}.` : '';
    return `${prefix}${title}. ${summary}.${source}`;
  }, []);

  // Play a specific story index
  const playStory = useCallback((index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (briefStories.length === 0) return;

    const safeIndex = Math.max(0, Math.min(index, briefStories.length - 1));
    setActiveStoryIdx(safeIndex);

    window.speechSynthesis.cancel();

    const story = briefStories[safeIndex];
    const spokenText = getStorySpokenText(story, safeIndex, briefStories.length, currentLang);

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = speed;
    utterance.pitch = 1.0;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (currentLang === 'si') {
        const siVoice = voices.find(v => v.lang.startsWith('si'));
        if (siVoice) utterance.voice = siVoice;
      } else if (currentLang === 'ta') {
        const taVoice = voices.find(v => v.lang.startsWith('ta'));
        if (taVoice) utterance.voice = taVoice;
      } else {
        const enVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en-GB') && (v.name.includes('Natural') || v.name.includes('Google')));
        if (enVoice) utterance.voice = enVoice;
      }
    }

    utterance.onend = () => {
      if (safeIndex < briefStories.length - 1) {
        // Transition to next story smoothly
        setTimeout(() => {
          playStoryRef.current(safeIndex + 1);
        }, 600);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveStoryIdx(0);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis notice:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [briefStories, currentLang, speed, getStorySpokenText]);

  useEffect(() => {
    playStoryRef.current = playStory;
  }, [playStory]);

  const handlePlayToggle = () => {
    if (!isSupported) return;

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      playStory(activeStoryIdx);
    }
  };

  const handleNext = () => {
    if (activeStoryIdx < briefStories.length - 1) {
      playStory(activeStoryIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx > 0) {
      playStory(activeStoryIdx - 1);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1;
    setSpeed(nextSpeed);
    if (isPlaying && !isPaused) {
      playStory(activeStoryIdx);
    }
  };

  if (!isClient || briefStories.length === 0) return null;

  const currentStory = briefStories[activeStoryIdx] || briefStories[0];
  const activeTitle = currentStory.title[currentLang] || currentStory.title.en || '';

  return (
    <div className="relative mb-5 overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-r from-[#12141c] via-[#101217] to-[#151722] p-3 sm:p-4 shadow-xl transition-all">
      {/* Glow decorative accent */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Broadcast Header & Title */}
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={handlePlayToggle}
            aria-label={isPlaying && !isPaused ? 'Pause 60s brief' : 'Play 60s brief'}
            className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlaying && !isPaused ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white ml-0.5" />
            )}
            {isPlaying && !isPaused && (
              <span className="absolute inset-0 rounded-full border border-rose-400 animate-ping opacity-75" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-rose-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                {flashLabels.title[currentLang]}
              </span>

              {isPlaying && !isPaused && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-rose-400 h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 h-1/2 animate-[pulse_0.5s_ease-in-out_infinite]" />
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
                {isPlaying ? (
                  <span className="text-rose-200">
                    [{flashLabels.story[currentLang]} {activeStoryIdx + 1}/{briefStories.length}] {activeTitle}
                  </span>
                ) : (
                  flashLabels.subtitle[currentLang]
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls & Story Selector */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-white/[0.06]">
          {/* Story dots */}
          <div className="flex items-center gap-1.5">
            {briefStories.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => playStory(idx)}
                title={`Play story ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeStoryIdx === idx
                    ? 'w-6 bg-rose-500'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={activeStoryIdx === 0}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Story"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Stop Audio"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={activeStoryIdx === briefStories.length - 1}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next Story"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Pill */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Change Playback Speed"
          >
            {speed}x
          </button>

          {/* Open current story link if playing */}
          {isPlaying && onOpenArticle && (
            <button
              onClick={() => onOpenArticle(currentStory)}
              className="text-[11px] font-mono text-zinc-400 hover:text-rose-300 underline underline-offset-2 transition-colors cursor-pointer hidden sm:inline"
            >
              View Dispatch &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
