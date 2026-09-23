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
  id: string; // unique ID e.g. prediction ID
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
    const frameId = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(`newsgrab_reaction_${id}`);
        if (saved) {
          setSelectedEmoji(saved);
        }
      } catch {
        // localStorage fallback
      }
      setCounts(getDefaultCounts(id));
    });

    return () => cancelAnimationFrame(frameId);
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
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 -ml-3 text-lg"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Emoji Buttons Strip */}
      <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1 border border-white/[0.06]">
        {EMOJIS.map((e) => {
          const isSelected = selectedEmoji === e.char;
          const count = counts[e.char] || 0;

          return (
            <button
              key={e.char}
              onClick={() => handleReact(e.char)}
              title={e.label}
              className={cn(
                'group relative flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all duration-200 cursor-pointer active:scale-90',
                isSelected
                  ? 'bg-rose-500/25 border border-rose-500/40 text-rose-200 font-semibold'
                  : 'hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200'
              )}
            >
              <span className="text-sm transition-transform duration-200 group-hover:scale-125">
                {e.char}
              </span>
              <span className="text-[10px] font-mono tabular-nums opacity-80">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
