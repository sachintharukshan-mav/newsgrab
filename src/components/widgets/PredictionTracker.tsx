'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/lib/types';
import { Clock, Check, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { EmojiReaction } from '@/components/ui/emoji-reaction';

interface PredictionOption {
  id: string;
  label: Record<Language, string>;
  initialVotes: number;
}

interface PredictionItem {
  id: string;
  category: 'economy' | 'politics' | 'costOfLiving' | 'sports';
  categoryLabel: Record<Language, string>;
  question: Record<Language, string>;
  resolutionDate: Record<Language, string>;
  options: PredictionOption[];
}

const PREDICTIONS: PredictionItem[] = [
  {
    id: 'pred-cbsl-rates',
    category: 'economy',
    categoryLabel: {
      en: 'Central Bank / Economy',
      si: 'මහ බැංකුව / ආර්ථිකය',
      ta: 'மத்திய வங்கி / பொருளாதாரம்'
    },
    question: {
      en: 'Will the Central Bank ease policy rates at the upcoming monetary policy review?',
      si: 'මීළඟ මුදල් ප්‍රතිපත්ති සමාලෝචනයේදී මහ බැංකුව ප්‍රතිපත්ති පොලී අනුපාත පහත හෙලයිද?',
      ta: 'எதிர்வரும் நாணயக் கொள்கை மீளாய்வில் மத்திய வங்கி கொள்கை வட்டி விகிதங்களைக் குறைக்குமா?'
    },
    resolutionDate: {
      en: 'Resolves next review',
      si: 'මීළඟ සමාලෝචනයේදී',
      ta: 'அடுத்த மீளாய்வில்'
    },
    options: [
      {
        id: 'opt-cut',
        label: { en: 'Rate Cut (Ease)', si: 'පොලී අනුපාත අඩු කිරීම', ta: 'வட்டி குறைப்பு' },
        initialVotes: 842
      },
      {
        id: 'opt-hold',
        label: { en: 'Hold / Unchanged', si: 'වෙනසක් නැත (ස්ථාවර)', ta: 'மாற்றமில்லை' },
        initialVotes: 389
      }
    ]
  },
  {
    id: 'pred-fuel-prices',
    category: 'costOfLiving',
    categoryLabel: {
      en: 'Cost of Living / Energy',
      si: 'ජීවන වියදම / බලශක්තිය',
      ta: 'வாழ்க்கைச் செலவு / எரிசக்தி'
    },
    question: {
      en: 'Will national fuel prices be reduced at the next monthly CPC price revision?',
      si: 'මීළඟ මාසික ඉන්ධන මිල සංශෝධනයේදී පෙට්‍රල් සහ ඩීසල් මිල අඩු කෙරේද?',
      ta: 'அடுத்த மாதாந்த எரிபொருள் விலை திருத்தத்தில் எரிபொருள் விலைகள் குறைக்கப்படுமா?'
    },
    resolutionDate: {
      en: 'Monthly formula review',
      si: 'මාසික මිල සූත්‍රය අනුව',
      ta: 'மாதாந்த விலை சூத்திரம்'
    },
    options: [
      {
        id: 'opt-fuel-cut',
        label: { en: 'Price Cut', si: 'මිල අඩු වීමක්', ta: 'விலை குறைப்பு' },
        initialVotes: 1204
      },
      {
        id: 'opt-fuel-hold',
        label: { en: 'No Change', si: 'ස්ථාවරව පැවතීම', ta: 'மாற்றமில்லை' },
        initialVotes: 512
      },
      {
        id: 'opt-fuel-hike',
        label: { en: 'Price Hike', si: 'මිල වැඩි වීමක්', ta: 'விலை அதிகரிப்பு' },
        initialVotes: 231
      }
    ]
  },
  {
    id: 'pred-digital-act',
    category: 'politics',
    categoryLabel: {
      en: 'Parliament / Reform',
      si: 'පාර්ලිමේන්තුව / ප්‍රතිසංස්කරණ',
      ta: 'பாராளுமன்றம் / சீர்திருத்தம்'
    },
    question: {
      en: 'Will the proposed Public Governance & Digital ID reforms pass before mid-year?',
      si: 'යෝජිත මහජන පාලන සහ ඩිජිටල් හැඳුනුම්පත් ප්‍රතිසංස්කරණ වසර මැදට පෙර සම්මත වේද?',
      ta: 'முன்மொழியப்பட்ட டிஜிட்டல் அடையாள சீர்திருத்தங்கள் ஆண்டின் நடுப்பகுதிக்குள் நிறைவேற்றப்படுமா?'
    },
    resolutionDate: {
      en: 'Current legislative session',
      si: 'වත්මන් වාරය තුළ',
      ta: 'தற்போதைய அமர்வில்'
    },
    options: [
      {
        id: 'opt-pass-yes',
        label: { en: 'Yes, Enacted', si: 'ඔව්, සම්මත වේ', ta: 'ஆம், நிறைவேறும்' },
        initialVotes: 735
      },
      {
        id: 'opt-pass-no',
        label: { en: 'Delayed / Opposed', si: 'නැත, ප්‍රමාද වේ', ta: 'இல்லை, தாமதமாகும்' },
        initialVotes: 420
      }
    ]
  }
];

const trackerUi = {
  title: {
    en: 'Colombo Prediction Radar',
    si: 'කොළඹ ජනමත අනාවැකි',
    ta: 'கொழும்பு கணிப்பு அரங்கு'
  },
  tagline: {
    en: 'Real-time crowd sentiment on national outcomes',
    si: 'ජාතික කරුණු පිළිබඳ ජනතාවගේ සජීවී මතය',
    ta: 'முக்கிய விடயங்கள் மீதான மக்களின் நேரலை கருத்து'
  },
  voted: {
    en: 'Your Vote',
    si: 'ඔබගේ ඡන්දය',
    ta: 'உங்கள் வாக்கு'
  },
  totalVotes: {
    en: 'votes cast',
    si: 'ප්‍රකාශිත ඡන්ද',
    ta: 'வாக்குகள்'
  },
  consensus: {
    en: 'Crowd Consensus',
    si: 'බහුතර ජනමතය',
    ta: 'பெரும்பான்மை கருத்து'
  },
  share: {
    en: 'Share to WhatsApp',
    si: 'වට්ස්ඇප් වෙත යවන්න',
    ta: 'வாட்ஸ்அப்பில் பகிரவும்'
  },
  copied: {
    en: 'Link Copied!',
    si: 'ලින්ක් එක පිටපත් විය!',
    ta: 'இணைப்பு நகலெடுக்கப்பட்டது!'
  }
};

interface PredictionTrackerProps {
  currentLang: Language;
}

export const PredictionTracker: React.FC<PredictionTrackerProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [extraVotes, setExtraVotes] = useState<Record<string, Record<string, number>>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem('newsgrab_prediction_votes');
        if (saved) {
          setUserVotes(JSON.parse(saved));
        }
      } catch {
        // LocalStorage access fallback
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleVote = (predId: string, optionId: string) => {
    if (userVotes[predId]) return; // Already voted

    const updatedVotes = { ...userVotes, [predId]: optionId };
    setUserVotes(updatedVotes);

    try {
      localStorage.setItem('newsgrab_prediction_votes', JSON.stringify(updatedVotes));
    } catch {
      // LocalStorage access fallback
    }

    setExtraVotes((prev) => {
      const currentPredExtras = prev[predId] || {};
      return {
        ...prev,
        [predId]: {
          ...currentPredExtras,
          [optionId]: (currentPredExtras[optionId] || 0) + 1
        }
      };
    });
  };

  const handleShare = (pred: PredictionItem) => {
    const qText = pred.question[currentLang] || pred.question.en;
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://newsgrab.lk';
    const message = `🎯 NewsGrab Prediction Radar: "${qText}" — Cast your vote and see live crowd sentiment: ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setCopiedId(pred.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const filteredPredictions = PREDICTIONS.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f1117] p-4 shadow-lg relative overflow-hidden">
      {/* Rare UI Subtle Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-white/[0.06] relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-1.5">
              <span>🎯</span>
              {trackerUi.title[currentLang]}
            </h3>
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-400">
            {trackerUi.tagline[currentLang]}
          </p>
        </div>
      </div>

      {/* Filter Tabs with Rare UI-style spring sliding pill */}
      <div className="relative flex items-center gap-1 py-2.5 overflow-x-auto no-scrollbar border-b border-white/[0.04] z-10">
        {[
          { id: 'all', label: 'All' },
          { id: 'economy', label: '📊 Economy' },
          { id: 'costOfLiving', label: '⛽ Living' },
          { id: 'politics', label: '🏛️ Politics' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-2.5 py-1 text-[10px] font-mono whitespace-nowrap transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200"
            >
              {isActive && (
                <motion.span
                  layoutId="activePredTabPill"
                  className="absolute inset-0 rounded-md bg-rose-500/20 border border-rose-500/30 -z-10"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className={isActive ? 'text-rose-300 font-semibold' : ''}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Prediction Cards */}
      <div className="divide-y divide-white/[0.06] space-y-4 pt-3 relative z-10">
        {filteredPredictions.map((pred) => {
          const userChoiceId = userVotes[pred.id];
          const hasVoted = Boolean(userChoiceId);

          // Calculate totals
          const optionVoteCounts = pred.options.map((opt) => {
            const extra = extraVotes[pred.id]?.[opt.id] || 0;
            return {
              ...opt,
              totalVotes: opt.initialVotes + extra
            };
          });

          const totalVotesCount = optionVoteCounts.reduce((acc, curr) => acc + curr.totalVotes, 0);

          // Find leader
          const leader = [...optionVoteCounts].sort((a, b) => b.totalVotes - a.totalVotes)[0];
          const leaderPercent = totalVotesCount > 0 ? Math.round((leader.totalVotes / totalVotesCount) * 100) : 0;

          return (
            <div key={pred.id} className="pt-3 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-300">
                  {pred.categoryLabel[currentLang] || pred.categoryLabel.en}
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {pred.resolutionDate[currentLang] || pred.resolutionDate.en}
                </span>
              </div>

              {/* Question */}
              <h4 className="text-xs font-semibold text-zinc-200 leading-snug">
                {pred.question[currentLang] || pred.question.en}
              </h4>

              {/* Options & Votes */}
              <div className="space-y-1.5">
                {optionVoteCounts.map((opt) => {
                  const percent = totalVotesCount > 0 ? Math.round((opt.totalVotes / totalVotesCount) * 100) : 0;
                  const isUserSelection = userChoiceId === opt.id;

                  return (
                    <div key={opt.id} className="relative">
                      {hasVoted ? (
                        /* Voted State: Progress bar display with Rare UI AnimatedCounter & spring stretch */
                        <div className="relative overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                          {/* Rare UI Elastic Spring Fill Bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            className={`absolute top-0 bottom-0 left-0 ${
                              isUserSelection
                                ? 'bg-rose-500/25 border-r border-rose-500/40'
                                : 'bg-white/[0.06]'
                            }`}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs">
                            <span className="font-medium text-zinc-200 flex items-center gap-1.5 truncate">
                              {isUserSelection && (
                                <Check className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                              )}
                              <span className={isUserSelection ? 'text-rose-200 font-semibold' : ''}>
                                {opt.label[currentLang] || opt.label.en}
                              </span>
                            </span>

                            <div className="flex items-center gap-2 font-mono text-[11px] flex-shrink-0 ml-2">
                              {/* Rare UI Odometer Animated Counter */}
                              <span className="text-zinc-400">
                                <AnimatedCounter value={opt.totalVotes} />
                              </span>
                              <span className={`font-bold ${isUserSelection ? 'text-rose-300' : 'text-zinc-200'}`}>
                                <AnimatedCounter value={percent} suffix="%" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Not Voted State: Interactive Clickable Button */
                        <button
                          onClick={() => handleVote(pred.id, opt.id)}
                          className="w-full text-left p-2 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-rose-500/40 text-xs font-medium text-zinc-200 transition-all group flex items-center justify-between cursor-pointer active:scale-[0.99]"
                        >
                          <span className="group-hover:text-white transition-colors">
                            {opt.label[currentLang] || opt.label.en}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 group-hover:text-rose-300 transition-colors">
                            Vote &rarr;
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Rare UI Tapback Floating Emoji Reaction Strip */}
              <div className="pt-0.5">
                <EmojiReaction id={pred.id} />
              </div>

              {/* Footer Meta & Viral WhatsApp Share */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <AnimatedCounter value={totalVotesCount} /> {trackerUi.totalVotes[currentLang]}
                </span>

                <div className="flex items-center gap-2">
                  {hasVoted && leader && (
                    <span className="text-rose-300/90 font-semibold flex items-center gap-1">
                      <AnimatedCounter value={leaderPercent} suffix="%" /> {leader.label[currentLang] || leader.label.en}
                    </span>
                  )}

                  <button
                    onClick={() => handleShare(pred)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Share to WhatsApp"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>{copiedId === pred.id ? trackerUi.copied[currentLang] : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
