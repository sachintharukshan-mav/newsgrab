'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article, Language } from '@/lib/types';
import { Play, Pause, Square, SkipForward, SkipBack, Radio, ChevronDown, Check, Loader2, Volume2 } from 'lucide-react';

interface AudioFlashBarProps {
  articles: Article[];
  currentLang: Language;
  onOpenArticle?: (article: Article) => void;
}

export type VoiceKey = 'en-us' | 'en-gb' | 'en-in' | 'si' | 'ta';

interface VoiceOption {
  id: VoiceKey;
  label: string;
  shortLabel: string;
  flag: string;
  langGroup: Language;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'en-us', label: 'US News Anchor', shortLabel: 'US Anchor', flag: '🇺🇸', langGroup: 'en' },
  { id: 'en-gb', label: 'BBC World Correspondent', shortLabel: 'BBC UK', flag: '🇬🇧', langGroup: 'en' },
  { id: 'en-in', label: 'South Asian Wire', shortLabel: 'South Asia', flag: '🌏', langGroup: 'en' },
  { id: 'si', label: 'Sinhala Broadcast', shortLabel: 'Sinhala', flag: '🇱🇰', langGroup: 'si' },
  { id: 'ta', label: 'Tamil Broadcast', shortLabel: 'Tamil', flag: '🇱🇰', langGroup: 'ta' }
];

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
  voice: {
    en: 'Voice Persona',
    si: 'හඬ විලාසය',
    ta: 'குரல் தெரிவு'
  },
  neural: {
    en: 'Neural HD',
    si: 'ස්වභාවික හඬ',
    ta: 'நரம்பியல் குரல்'
  }
};

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';
type PlaybackMode = 'audio' | 'speech' | null;

export const AudioFlashBar: React.FC<AudioFlashBarProps> = ({
  articles,
  currentLang,
  onOpenArticle
}) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState<boolean>(false);

  // Default voice based on current language
  const [selectedVoice, setSelectedVoice] = useState<VoiceKey>(() => {
    if (currentLang === 'si') return 'si';
    if (currentLang === 'ta') return 'ta';
    return 'en-us';
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playStoryRef = useRef<(index: number, voiceKey?: VoiceKey) => void>(() => {});
  const voiceMenuRef = useRef<HTMLDivElement | null>(null);

  // Top 3 stories for the brief
  const briefStories = articles.slice(0, 3);

  // Stop playback cleanly without triggering error events or speech cascades
  const stopAllPlayback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioRef.current) {
      const el = audioRef.current;
      el.oncanplay = null;
      el.onended = null;
      el.onerror = null;
      el.pause();
      el.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlaybackState('idle');
    setPlaybackMode(null);
  }, []);

  // Initialize client and handle outside clicks for voice dropdown
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsClient(true);
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(e.target as Node)) {
        setIsVoiceMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('mousedown', handleClickOutside);
      stopAllPlayback();
    };
  }, [stopAllPlayback]);

  // Synchronize voice and cleanly reset when user switches primary language tab
  useEffect(() => {
    let targetVoice: VoiceKey = 'en-us';
    if (currentLang === 'si') {
      targetVoice = 'si';
    } else if (currentLang === 'ta') {
      targetVoice = 'ta';
    } else {
      targetVoice = selectedVoice === 'si' || selectedVoice === 'ta' ? 'en-us' : selectedVoice;
    }
    setSelectedVoice(targetVoice);

    stopAllPlayback();
    setActiveStoryIdx(0);
  }, [currentLang, stopAllPlayback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate clean broadcast spoken text for a story
  const getStorySpokenText = useCallback((story: Article, index: number, total: number, lang: Language) => {
    const title = (story.title[lang] || story.title.en || '').trim();
    const summary = (story.summary[lang] || story.summary.en || '').trim();

    if (lang === 'si') {
      const prefix = index === 0 ? 'ප්‍රධාන පුවත: ' : 'මීළඟ පුවත: ';
      return `${prefix}${title}. ${summary}`.slice(0, 280);
    }

    if (lang === 'ta') {
      const prefix = index === 0 ? 'முக்கிய செய்தி: ' : 'அடுத்த செய்தி: ';
      return `${prefix}${title}. ${summary}`.slice(0, 280);
    }

    // English
    const prefix = index === 0 ? 'Top headline: ' : 'In other news: ';
    return `${prefix}${title}. ${summary}`.slice(0, 280);
  }, []);

  // Play a specific story index using Neural TTS endpoint
  const playStory = useCallback((index: number, voiceOverride?: VoiceKey) => {
    if (briefStories.length === 0) return;

    const safeIndex = Math.max(0, Math.min(index, briefStories.length - 1));
    setActiveStoryIdx(safeIndex);

    const voiceToUse = voiceOverride || selectedVoice;
    const story = briefStories[safeIndex];
    const spokenText = getStorySpokenText(story, safeIndex, briefStories.length, currentLang);

    // Stop current audio cleanly
    stopAllPlayback();

    setPlaybackState('loading');
    setPlaybackMode('audio');

    const audioUrl = `/api/tts?text=${encodeURIComponent(spokenText)}&voice=${encodeURIComponent(
      voiceToUse
    )}&lang=${encodeURIComponent(currentLang)}`;

    const audio = new Audio(audioUrl);
    audio.playbackRate = speed;
    audioRef.current = audio;

    audio.oncanplay = () => {
      setPlaybackState('playing');
    };

    audio.onended = () => {
      if (safeIndex < briefStories.length - 1) {
        setActiveStoryIdx(safeIndex + 1);
        timerRef.current = setTimeout(() => {
          playStoryRef.current(safeIndex + 1, voiceToUse);
        }, 400);
      } else {
        stopAllPlayback();
        setActiveStoryIdx(0);
      }
    };

    audio.onerror = () => {
      // Clean up audio element handlers
      if (audioRef.current === audio) {
        audio.oncanplay = null;
        audio.onended = null;
        audio.onerror = null;
        audioRef.current = null;
      }

      // Fallback to browser SpeechSynthesis if network or stream has issue
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setPlaybackMode('speech');
        setPlaybackState('playing');

        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.rate = speed;
        utterance.onend = () => {
          if (safeIndex < briefStories.length - 1) {
            setActiveStoryIdx(safeIndex + 1);
            timerRef.current = setTimeout(() => {
              playStoryRef.current(safeIndex + 1, voiceToUse);
            }, 400);
          } else {
            stopAllPlayback();
            setActiveStoryIdx(0);
          }
        };
        utterance.onerror = () => {
          stopAllPlayback();
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        stopAllPlayback();
      }
    };

    audio.play().catch((err) => {
      console.warn('Playback error (e.g. autoplay restriction):', err);
      // Trigger fallback safely
      audio.onerror?.(new Event('error'));
    });
  }, [briefStories, currentLang, speed, selectedVoice, getStorySpokenText, stopAllPlayback]);

  useEffect(() => {
    playStoryRef.current = playStory;
  }, [playStory]);

  const handlePlayToggle = () => {
    if (playbackState === 'playing') {
      // Pause active stream
      if (playbackMode === 'audio' && audioRef.current) {
        audioRef.current.pause();
      } else if (playbackMode === 'speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setPlaybackState('paused');
    } else if (playbackState === 'paused') {
      // Resume active stream
      if (playbackMode === 'audio' && audioRef.current) {
        audioRef.current.play().catch(() => playStory(activeStoryIdx));
      } else if (playbackMode === 'speech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      setPlaybackState('playing');
    } else {
      // Start playback from current active story
      playStory(activeStoryIdx);
    }
  };

  const handleNext = () => {
    if (activeStoryIdx < briefStories.length - 1) {
      const nextIdx = activeStoryIdx + 1;
      if (playbackState === 'playing' || playbackState === 'loading') {
        playStory(nextIdx);
      } else {
        stopAllPlayback();
        setActiveStoryIdx(nextIdx);
      }
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx > 0) {
      const prevIdx = activeStoryIdx - 1;
      if (playbackState === 'playing' || playbackState === 'loading') {
        playStory(prevIdx);
      } else {
        stopAllPlayback();
        setActiveStoryIdx(prevIdx);
      }
    }
  };

  const handleSelectStory = (idx: number) => {
    if (playbackState === 'playing' || playbackState === 'loading') {
      playStory(idx);
    } else {
      stopAllPlayback();
      setActiveStoryIdx(idx);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : 1;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleSelectVoice = (voiceKey: VoiceKey) => {
    setSelectedVoice(voiceKey);
    setIsVoiceMenuOpen(false);

    // If currently playing, restart active story with new voice persona
    if (playbackState === 'playing' || playbackState === 'loading') {
      playStory(activeStoryIdx, voiceKey);
    }
  };

  if (!isClient || briefStories.length === 0) return null;

  const currentStory = briefStories[activeStoryIdx] || briefStories[0];
  const activeTitle = currentStory.title[currentLang] || currentStory.title.en || '';
  const currentVoiceObj = VOICE_OPTIONS.find((v) => v.id === selectedVoice) || VOICE_OPTIONS[0];

  const isLoading = playbackState === 'loading';
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isActive = isPlaying || isPaused || isLoading;

  return (
    <div className="relative mb-5 rounded-xl border border-[var(--border-line)] bg-gradient-to-r dark:from-[#12141c] dark:via-[#101217] dark:to-[#151722] from-[#f7f5ed] via-[#f3eee4] to-[#f9f7f0] p-3 sm:p-4 shadow-xl transition-all z-20">
      {/* Glow decorative accent isolated so overflow-hidden doesn't clip dropdowns */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Broadcast Header & Title */}
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={handlePlayToggle}
            aria-label={isPlaying ? 'Pause 60s brief' : 'Play 60s brief'}
            className="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white ml-0.5" />
            )}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border border-rose-400 animate-ping opacity-75" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-rose-400 dark:text-rose-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                {flashLabels.title[currentLang]}
              </span>

              <span className="inline-flex items-center gap-1 rounded bg-white/[0.04] border border-[var(--border-line)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--text-muted)]">
                <Radio className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                {flashLabels.neural[currentLang]}
              </span>

              {isPlaying && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-rose-400 h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 h-2/3 animate-[pulse_0.4s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 h-1/2 animate-[pulse_0.5s_ease-in-out_infinite]" />
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate">
                {isActive ? (
                  <span className="text-[var(--accent-crimson)] font-medium">
                    [{flashLabels.story[currentLang]} {activeStoryIdx + 1}/{briefStories.length}] {activeTitle}
                  </span>
                ) : (
                  flashLabels.subtitle[currentLang]
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls, Voice Selector & Speed */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-2.5 border-t md:border-t-0 pt-2 md:pt-0 border-[var(--border-line)] flex-wrap sm:flex-nowrap">
          {/* Story dots */}
          <div className="flex items-center gap-1.5">
            {briefStories.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectStory(idx)}
                title={`Story ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeStoryIdx === idx ? 'w-6 bg-rose-500' : 'w-2 bg-white/20 hover:bg-white/40'
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

            {isActive && (
              <button
                onClick={stopAllPlayback}
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

          {/* Voice Persona Dropdown */}
          <div className="relative" ref={voiceMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVoiceMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.18] border border-white/[0.15] text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Select Voice Persona"
              aria-label="Select Voice Persona"
              aria-expanded={isVoiceMenuOpen}
            >
              <Volume2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono mr-0.5">Voice:</span>
              <span>{currentVoiceObj.flag}</span>
              <span className="font-sans font-medium text-xs text-zinc-200">
                {currentVoiceObj.shortLabel}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                  isVoiceMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isVoiceMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/20 bg-[#161824] shadow-2xl p-2 z-50 backdrop-blur-2xl ring-1 ring-black/70 animate-in fade-in slide-in-from-top-1"
                style={{ minWidth: '240px' }}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-white/[0.08] mb-1.5 flex items-center justify-between">
                  <span>{flashLabels.voice[currentLang]}</span>
                  <span className="text-[9px] text-rose-400 font-mono">Neural HD</span>
                </div>
                <div className="flex flex-col gap-1">
                  {VOICE_OPTIONS.map((v) => {
                    const isSelected = selectedVoice === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectVoice(v.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-rose-500/25 border border-rose-500/40 text-rose-200 font-semibold shadow-inner'
                            : 'text-zinc-200 hover:bg-white/[0.08] hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{v.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs leading-tight text-zinc-100">{v.label}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {v.langGroup === 'en' ? 'English' : v.langGroup === 'si' ? 'Sinhala' : 'Tamil'}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-400 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Speed Pill */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Change Playback Speed"
          >
            {speed}x
          </button>

          {/* Open current story link if active */}
          {isActive && onOpenArticle && (
            <button
              onClick={() => {
                stopAllPlayback();
                onOpenArticle(currentStory);
              }}
              className="text-[11px] font-mono text-zinc-400 hover:text-rose-300 underline underline-offset-2 transition-colors cursor-pointer hidden lg:inline"
            >
              View Dispatch &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
