'use client';

import React, { useEffect, useState } from 'react';
import { Article, ExecutiveBrief, Language } from '@/lib/types';
import { X, Share2, Check, ArrowLeft, Clock, ExternalLink, Sparkles, Zap, Quote, ShieldCheck, Loader2 } from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';

interface QuickReadDrawerProps {
  article: Article | null;
  currentLang: Language;
  onClose: () => void;
}

export const QuickReadDrawer: React.FC<QuickReadDrawerProps> = ({
  article,
  currentLang,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [fetchedBrief, setFetchedBrief] = useState<ExecutiveBrief | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState<boolean>(false);
  const [synthesisProvider, setSynthesisProvider] = useState<'gemini' | 'algorithmic'>('gemini');

  // Track authentic newsroom photography with React state synchronization
  const [overridePhoto, setOverridePhoto] = useState<string | null>(null);
  const [prevArticleId, setPrevArticleId] = useState(article?.id);

  if (article?.id !== prevArticleId) {
    setPrevArticleId(article?.id);
    setOverridePhoto(null);
  }

  const photoToDisplay = overridePhoto === 'none' ? null : (overridePhoto || article?.imageUrl || null);
  const isAuthenticWirePhoto = Boolean(photoToDisplay && !photoToDisplay.includes('unsplash.com'));

  // Derive active brief from article prop or fetched state
  const brief = article?.brief?.[currentLang] || fetchedBrief;

  useEffect(() => {
    if (!article || (article.brief?.[currentLang] && photoToDisplay)) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchBrief = async () => {
      try {
        setIsLoadingBrief(true);
        const headline = article.title[currentLang] || article.title.en || '';
        const fallbackSummary = article.summary[currentLang] || article.summary.en || '';
        const params = new URLSearchParams({
          url: article.sourceUrl,
          headline,
          publisher: article.publisherName,
          lang: currentLang,
          fallback: fallbackSummary
        });

        const res = await fetch(`/api/synthesize?${params.toString()}`, {
          signal: controller.signal
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            React.startTransition(() => {
              if (data.brief) setFetchedBrief(data.brief);
              if (data.provider) setSynthesisProvider(data.provider);
              // Update with authentic publisher photo if extracted by backend
              if (data.source?.image && !data.source.image.includes('unsplash.com')) {
                setOverridePhoto(data.source.image);
              }
            });
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('QuickReadDrawer synthesis notice:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoadingBrief(false);
        }
      }
    };

    fetchBrief();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [article, currentLang, photoToDisplay]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const drawerLabels = {
    backToFront: { en: 'Back to Front Page', si: 'මුල් පිටුවට', ta: 'முகப்பிற்குத் திரும்பு' },
    originalWire: { en: 'Original Wire', si: 'මූලික පුවත', ta: 'அசல் செய்தி' },
    takeaways: { en: 'Essential Takeaways', si: 'ප්‍රධාන කරුණු සංක්ෂිප්තය', ta: 'முக்கிய சாராம்சம்' },
    reportedBy: { en: 'Reported by ', si: 'වාර්තාකරණය: ', ta: 'செய்தியாளர்: ' },
    minRead: { en: 'min read', si: 'මිනිත්තු කියවීමක්', ta: 'நிமிட வாசிப்பு' },
    wireLead: { en: 'Verified Wire Lead', si: 'සත්‍යාපිත මූලික වාර්තාව', ta: 'சரிபார்க்கப்பட்ட செய்தி முன்னுரை' },
    readOnPublisher: { en: 'Read Full Report on', si: 'හි සම්පූර්ණ පුවත කියවන්න', ta: 'இல் முழுமையான செய்தியை வாசிக்க' },
    publisherNotice: {
      en: 'Read the complete unabridged report directly on the publisher’s official platform.',
      si: 'ප්‍රකාශකයාගේ නිල වෙබ් අඩවියෙන් සම්පූර්ණ පුවත් වාර්තාව කියවන්න.',
      ta: 'வெளியீட்டாளரின் தளத்தில் முழுமையான செய்தியை வாசியுங்கள்.'
    },
    fairPracticeNotice: {
      en: 'Curated under Fair Dealing & Public Syndication Standards',
      si: 'සාධාරණ භාවිත මාර්ගෝපදේශ යටතේ සාරාංශගත කර ඇත',
      ta: 'நியாயமான பயன்பாட்டு விதிகளின் கீழ் தொகுக்கப்பட்டது'
    },
    smartBrevityTitle: { en: 'Executive Intelligence Brief', si: 'විධායක බුද්ධි තොරතුරු වාර්තාව', ta: 'நிர்வாக புலனாய்வு சுருக்கம்' },
    whatHappened: { en: 'The Scoop', si: 'මූලික සිදුවීම', ta: 'முக்கிய நிகழ்வு' },
    keyFacts: { en: 'Key Facts', si: 'මූලික කරුණු', ta: 'முக்கிய உண்மைகள்' },
    onRecord: { en: 'On Record', si: 'වාර්තාගත ප්‍රකාශ', ta: 'பதிவான அறிக்கைகள்' },
    whyItMatters: { en: 'Why It Matters', si: 'මෙය වැදගත් වන්නේ ඇයි?', ta: 'இது ஏன் முக்கியமானது?' },
    whatsNext: { en: 'What to Watch For', si: 'ඉදිරි අපේක්ෂාවන්', ta: 'அடுத்து கவனிக்க வேண்டியவை' },
    synthesizedByGemini: { en: 'Gemini 2.0 Flash Synthesis', si: 'Gemini Flash මගින් සම්පාදිතයි', ta: 'Gemini Flash மூலம் தொகுக்கப்பட்டது' },
    synthesizedByDesk: { en: 'Newsroom Desk Synthesis', si: 'ප්‍රවෘත්ති කාමර සංස්කරණය', ta: 'செய்திப்பிரிவு தொகுப்பு' },
    synthesizing: { en: 'Synthesizing verified executive brief...', si: 'සත්‍යාපිත වාර්තාව සකස් වෙමින් පවතී...', ta: 'சுருக்கம் தயாராகிறது...' }
  };

  const title = article.title[currentLang] || article.title.en || article.title.si || article.title.ta || '';
  const bullets = article.aiBullets[currentLang] || article.aiBullets.en || article.aiBullets.si || article.aiBullets.ta || [];
  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        isSinhala ? 'si-LK' : (isTamil ? 'ta-LK' : 'en-GB'),
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Slide-out Full Article Reading Room */}
      <div className="relative w-full max-w-3xl h-full bg-[#0d0e12] border-l border-white/10 shadow-2xl z-10 flex flex-col overflow-y-auto">
        {/* Sticky Top Reader Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-[#0d0e12]/95 backdrop-blur-md border-b border-white/[0.08]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className={`${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
              {drawerLabels.backToFront[currentLang]}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              title="Share dispatch"
              className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Content Body */}
        <div className="p-6 sm:p-10 space-y-8 flex-1 max-w-2xl mx-auto w-full">
          {/* Article Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <span className="text-rose-500 font-bold">{article.category}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300 font-medium">{article.publisherName}</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 font-sans">
                <Clock className="w-3 h-3 text-zinc-500" />
                {article.readTimeMinutes} {drawerLabels.minRead[currentLang]}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-headline leading-[1.2] ${
                isSinhala ? 'font-sinhala leading-[1.3]' : ''
              } ${isTamil ? 'font-tamil leading-[1.28]' : ''}`}
            >
              {title}
            </h1>

            {/* Byline & Date */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 pb-4 border-b border-divider">
              <div>
                <span>{drawerLabels.reportedBy[currentLang]}</span>
                <span className="text-zinc-200 font-semibold">{article.publisherName}</span>
              </div>
              <span suppressHydrationWarning>{formattedDate}</span>
            </div>
          </div>

          {/* Featured Editorial Visual / Authentic Wire Photography */}
          {photoToDisplay ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-zinc-900 border border-white/[0.08] shadow-lg">
              <img
                src={photoToDisplay}
                alt={title}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
                  } else {
                    setOverridePhoto('none');
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-mono pointer-events-none">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isAuthenticWirePhoto ? 'Verified Wire Photo' : `${article?.category?.toUpperCase()} Editorial Wire`}
                </span>
                <span className="text-[10px] text-zinc-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                  {article.publisherName}
                </span>
              </div>
            </div>
          ) : (
            /* Institutional Editorial Wire Masthead (when no authentic photo exists) */
            <div className="relative w-full rounded-lg bg-gradient-to-br from-[#161822] via-[#0f1016] to-[#12141c] border border-white/[0.08] p-5 sm:p-6 overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                    Verified Newsroom Dispatch
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-mono font-semibold uppercase border border-rose-500/20">
                  {article.category}
                </span>
              </div>
              <div className="relative z-10 space-y-1.5">
                <Quote className="w-5 h-5 text-rose-400/30" />
                <p className={`text-sm text-zinc-200 font-serif italic leading-relaxed ${isSinhala ? 'font-sinhala not-italic leading-relaxed' : ''} ${isTamil ? 'font-tamil not-italic leading-relaxed' : ''}`}>
                  &ldquo;{article.summary[currentLang] || article.summary.en || title}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Axios Smart Brevity Executive Dossier */}
          <div className="p-5 rounded-lg bg-gradient-to-b from-[#14161f] to-[#0f1016] border border-white/[0.08] shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className={`text-xs font-mono font-bold uppercase tracking-wider text-white ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                  {drawerLabels.smartBrevityTitle[currentLang]}
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {synthesisProvider === 'gemini' ? drawerLabels.synthesizedByGemini[currentLang] : drawerLabels.synthesizedByDesk[currentLang]}
              </span>
            </div>

            {isLoadingBrief ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
                <p className={`text-[11px] font-mono text-zinc-400 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                  {drawerLabels.synthesizing[currentLang]}
                </p>
              </div>
            ) : (
              <>
                {/* 1. What Happened */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
                    <Zap className="w-3 h-3 text-rose-400" />
                    <span>{drawerLabels.whatHappened[currentLang]}</span>
                  </div>
                  <p className={`text-sm sm:text-base text-zinc-100 font-serif leading-relaxed ${isSinhala ? 'font-sinhala leading-loose' : ''} ${isTamil ? 'font-tamil leading-relaxed' : ''}`}>
                    {brief ? brief.whatHappened : (article.summary[currentLang] || article.summary.en || '')}
                  </p>
                </div>

                {/* 2. Key Facts */}
                <div className="p-4 rounded-md bg-[#181a24] border-l-2 border-rose-500 space-y-2">
                  <h4 className={`text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                    {drawerLabels.keyFacts[currentLang]}
                  </h4>
                  <ul className="space-y-2">
                    {(brief?.keyDetails && brief.keyDetails.length > 0 ? brief.keyDetails : bullets).map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200">
                        <span className="text-rose-400 font-mono select-none">—</span>
                        <span className={`leading-relaxed ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Quotes on Record */}
                {brief?.quotes && brief.quotes.length > 0 && (
                  <div className="p-4 rounded-md bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      <Quote className="w-3 h-3 text-amber-400" />
                      <span>{drawerLabels.onRecord[currentLang]}</span>
                    </div>
                    {brief.quotes.map((q, idx) => (
                      <blockquote key={idx} className="pl-3 border-l-2 border-amber-500/60 text-xs sm:text-sm italic text-zinc-300 font-serif">
                        &ldquo;{q}&rdquo;
                      </blockquote>
                    ))}
                  </div>
                )}

                {/* 4. Why It Matters */}
                <div className="p-3.5 rounded-md bg-blue-950/30 border border-blue-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    <span>{drawerLabels.whyItMatters[currentLang]}</span>
                  </div>
                  <p className={`text-xs sm:text-sm text-zinc-200 leading-relaxed ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                    {brief ? brief.whyItMatters : 'This development carries direct implications for Sri Lanka.'}
                  </p>
                </div>

                {/* 5. What to Watch For */}
                <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                      {drawerLabels.whatsNext[currentLang]}
                    </div>
                    <p className={`text-xs text-zinc-300 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                      {brief ? brief.whatsNext : 'Monitoring further official statements.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Outbound Canonical Publisher Action Card (Direct Traffic Driver) */}
          <div className="p-5 sm:p-6 rounded-lg bg-gradient-to-br from-[#181a22] to-[#121319] border border-white/[0.1] shadow-xl space-y-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
                {drawerLabels.originalWire[currentLang]}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white font-headline">
                {article.publisherName}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {drawerLabels.publisherNotice[currentLang]}
              </p>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-rose-600/30 cursor-pointer"
            >
              <span>{drawerLabels.readOnPublisher[currentLang]} {article.publisherName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>{drawerLabels.fairPracticeNotice[currentLang]}</span>
              <span className="truncate max-w-[180px]">
                {(() => {
                  try {
                    return new URL(article.sourceUrl.startsWith('http') ? article.sourceUrl : 'https://newsgrab.lk').hostname;
                  } catch {
                    return article.publisherName;
                  }
                })()}
              </span>
            </div>
          </div>

          {/* In-Article Monetization Slot #1 */}
          <div className="py-2">
            <AdBanner
              format="mrec"
              slotId="in-article-ad-1"
              sponsorName="Sampath Bank Vishwa"
            />
          </div>

          {/* In-Article Monetization Slot #2 */}
          <div className="py-4 border-t border-divider">
            <AdBanner
              format="leaderboard"
              slotId="in-article-ad-2"
              sponsorName="Commercial Bank of Ceylon"
            />
          </div>

          {/* Cross-Publisher Perspectives (Deduplication) */}
          {article.perspectives && article.perspectives.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-divider">
              <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Cross-Publisher Verification ({article.perspectives.length})
              </h4>
              <div className="space-y-2">
                {article.perspectives.map((p, idx) => (
                  <div
                    key={idx}
                    className="block p-3 rounded bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                      <span className="text-zinc-300 font-semibold">{p.publisherName}</span>
                      <span>{p.publishedAt}</span>
                    </div>
                    <p className="text-xs text-zinc-200">
                      {p.headline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution & Close Action */}
          <div className="pt-6 border-t border-divider text-center space-y-3">
            <p className="text-[11px] font-mono text-zinc-400">
              Original reporting by <span className="text-zinc-300 font-semibold">{article.publisherName}</span>. Indexed and synthesized for digital discovery on NewsGrab LK.
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{drawerLabels.backToFront[currentLang]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
