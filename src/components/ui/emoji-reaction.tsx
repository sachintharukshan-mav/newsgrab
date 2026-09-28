'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  emoji: string;
  xOffset: number;
  yOffset: number;
  rotate: number;
}

interface EmojiReactionProps {
  id: string; // unique ID e.g. prediction ID or article ID
  className?: string;
}

const EMOJIS = [
  { char: '🔥', label: 'Hot' },
  { char: '🚀', label: 'Bullish' },
  { char: '📉', label: 'Bearish' },
  { char: '🇱🇰', label: 'Sri Lanka' },
  { char: '🤔', label: 'Skeptical' },
];

const getDefaultCounts = (id: string): Record<string, number> => ({
  '🔥': 14 + (id.charCodeAt(0) % 10),
  '🚀': 8 + (id.charCodeAt(1) % 7),
  '📉': 6 + (id.charCodeAt(2) % 5),
  '🇱🇰': 22 + (id.charCodeAt(3) % 15),
  '🤔': 11 + (id.charCodeAt(0) % 8),
});

export const EmojiReaction: React.FC<EmojiReactionProps> = ({ id, className }) => {
  const [counts, setCounts] = useState<Record<string, number>>(() => getDefaultCounts(id));
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      const saved = localStorage.getItem(`newsgrab_reaction_${id}`);
      if (saved) {
        setSelectedEmoji(saved);
      }
    } catch {
      // localStorage fallback
    }

    // Load persistent community tallies from Cloudflare D1
    fetch(`/api/reactions?targetId=${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.counts && Object.keys(data.counts).length > 0) {
          setCounts((prev) => ({
            ...prev,
            ...data.counts
          }));
        }
      })
      .catch((err) => {
        console.warn('Failed to load reactions from D1:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleReact = (emojiChar: string) => {
    setSelectedEmoji(emojiChar);
    try {
      localStorage.setItem(`newsgrab_reaction_${id}`, emojiChar);
    } catch {
      // localStorage fallback
    }

    setCounts((prev) => ({
      ...prev,
      [emojiChar]: (prev[emojiChar] || 0) + 1,
    }));

    // Persist to Cloudflare D1
    fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: id, emoji: emojiChar })
    }).catch((err) => {
      console.warn('Failed to save reaction to D1:', err);
    });

    // Spawn 3 floating particles with organic drift
    const newParticles: Particle[] = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      emoji: emojiChar,
      xOffset: (Math.random() - 0.5) * 40,
      yOffset: -70 - Math.random() * 30,
      rotate: (Math.random() - 0.5) * 30,
    }));

    setParticles((prev) => [...prev.slice(-15), ...newParticles]);

    // Clear particles after animation finishes
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1200);
  };

  return (
    <div className={cn('relative flex items-center gap-1', className)}>
      {/* Floating Particles Area */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-24 overflow-visible">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.8, rotate: 0 }}
              animate={{
                opacity: 0,
                y: p.yOffset,
                x: p.xOffset,
                scale: 1.3,
                rotate: p.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-1/2 text-2xl select-none"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {EMOJIS.map(({ char, label }) => {
        const count = counts[char] || 0;
        const isSelected = selectedEmoji === char;

        return (
          <button
            key={char}
            onClick={() => handleReact(char)}
            title={label}
            className={cn(
              'group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono transition-all active:scale-90 cursor-pointer',
              isSelected
                ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/50 shadow-sm shadow-rose-950/40'
                : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 border border-white/[0.06]'
            )}
          >
            <span className="text-sm transition-transform group-hover:scale-125 duration-200">
              {char}
            </span>
            <span className="text-[11px] font-semibold">{count}</span>
          </button>
        );
      })}
    </div>
  );
};
