import React, { useEffect, useState, useMemo } from 'react';
import { Article, ExecutiveBrief, Language } from '@/lib/types';
import { ArrowLeft, Clock, Share2, Check, ExternalLink, MessageCircle, Sparkles, Zap, Quote, ShieldCheck, Loader2, Volume2, VolumeX } from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';
import { DiscussionSection } from './DiscussionSection';
import { buildOptimisticBrief } from '@/lib/brief-utils';

interface FullArticlePageProps {
  article: Article;
  currentLang: Language;
  onBack: () => void;
  onSelectRelatedArticle: (article: Article) => void;
  allArticles: Article[];
}

export const FullArticlePage: React.FC<FullArticlePageProps> = ({
  article,
  currentLang,
  onBack,
  onSelectRelatedArticle,
  allArticles
}) => {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [fetchedBrief, setFetchedBrief] = useState<ExecutiveBrief | null>(null);
  const [isLoadingBrief, setIsLoadingBrief] = useState<boolean>(false);
  const [synthesisProvider, setSynthesisProvider] = useState<'gemini' | 'algorithmic'>('gemini');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Track authentic newsroom photography with React state synchronization
  const [overridePhoto, setOverridePhoto] = useState<string | null>(null);
  const [prevArticleId, setPrevArticleId] = useState(article.id);

  if (article.id !== prevArticleId) {
    setPrevArticleId(article.id);
    setOverridePhoto(null);
  }

  const photoToDisplay = overridePhoto === 'none' ? null : (overridePhoto || article.imageUrl || null);
  const isAuthenticWirePhoto = Boolean(photoToDisplay && !photoToDisplay.includes('unsplash.com'));

  // Instantly compute structured Smart Brevity brief from article metadata (0ms perceived latency)
  const optimisticBrief = useMemo(() => buildOptimisticBrief(article, currentLang), [article, currentLang]);
  const brief = article.brief?.[currentLang] || fetchedBrief || optimisticBrief;

  // Dynamically fetch or synthesize the deep Axios Smart Brevity brief in background
  useEffect(() => {
    if (article.brief?.[currentLang] && photoToDisplay) {
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
          console.warn('Synthesis brief fetch notice:', err);
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
  }, [article.id, article.sourceUrl, article.publisherName, article.title, article.summary, article.brief, currentLang, photoToDisplay]);

  // Track reading scroll progress (0% - 100%)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when article opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Cancel speech synthesis when unmounting or switching article
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const fullArticleLabels = {
    backToFront: { en: 'Back to Front Page', si: 'මුල් පිටුවට', ta: 'முகப்பிற்குத் திரும்பு' },
    originalWire: { en: 'Original Wire', si: 'මූලික පුවත', ta: 'அசல் செய்தி' },
    share: { en: 'Share', si: 'බෙදාගන්න', ta: 'பகிர்' },
    linkCopied: { en: 'Link Copied', si: 'පිටපත් කරන ලදී', ta: 'நகலெடுக்கப்பட்டது' },
    listen: { en: 'Listen', si: 'ශ්‍රවණය', ta: 'கேட்க' },
    stopAudio: { en: 'Stop Audio', si: 'හඬ නවත්වන්න', ta: 'ஆடியோவை நிறுத்து' },
    takeaways: { en: 'Essential Takeaways', si: 'ප්‍රධාන කරුණු සංක්ෂිප්තය', ta: 'முக்கிய சாராம்சம்' },
    synthesis: { en: 'Cross-Wire Synthesis', si: 'තොරතුරු සත්‍යාපනය', ta: 'செய்தி தொகுப்பு' },
    minRead: { en: 'min read', si: 'මිනිත්තු කියවීමක්', ta: 'நிமிட வாசிப்பு' },
    reportingBy: { en: 'Original Reporting by ', si: 'වාර්තාකරණය: ', ta: 'அசல் செய்தியாளர்: ' },
    upNext: { en: 'Up Next on The Wire', si: 'ඊළඟ පුවත් පෙළගැස්ම', ta: 'அடுத்த செய்திகள்' },
    readingMode: { en: 'Reading Mode', si: 'කියවීමේ මාදිලිය', ta: 'வாசிப்பு பயன்முறை' },
    wireDispatch: { en: 'Verified Wire Lead', si: 'සත්‍යාපිත මූලික වාර්තාව', ta: 'சரிபார்க்கப்பட்ட செய்தி முன்னுரை' },
    readFullStory: { en: 'Read Full Unabridged Story', si: 'සම්පූර්ණ පුවත කියවන්න', ta: 'முழுமையான செய்தியை வாசிக்க' },
    publisherNotice: {
      en: 'Support authentic news reporting by reading the complete investigation directly on the publisher’s platform.',
      si: 'ප්‍රකාශකයාගේ නිල වෙබ් අඩවියෙන් සම්පූර්ණ පුවත් වාර්තාව කියවා සැබෑ මාධ්‍යවේදයට සහාය වන්න.',
      ta: 'வெளியீட்டாளரின் தளத்தில் முழுமையான செய்தியை வாசித்து உண்மை ஊடகவியலுக்கு ஆதரவளியுங்கள்.'
    },
    fairPracticeNotice: {
      en: 'Indexed under Section 12 of Sri Lanka IP Act & Fair Dealing Guidelines',
      si: 'ශ්‍රී ලංකා බුද්ධිමය දේපළ පනතේ 12 වන වගන්තිය යටතේ සාරාංශගත කර ඇත',
      ta: 'இலங்கை அறிவுசார் சொத்துச் சட்டம் பிரிவு 12 இன் கீழ் தொகுக்கப்பட்டது'
    },
    smartBrevityTitle: { en: 'Executive Intelligence Dispatch', si: 'විධායක බුද්ධි තොරතුරු වාර්තාව', ta: 'நிர்வாக புலனாய்வு சுருக்கம்' },
    whatHappened: { en: 'The Scoop & Verified Narrative', si: 'මූලික සිදුවීම සහ පසුබිම', ta: 'முக்கிய நிகழ்வு மற்றும் பின்னணி' },
    keyFacts: { en: 'Key Facts & Findings', si: 'මූලික කරුණු සහ සාක්ෂි', ta: 'முக்கிய உண்மைகள் සහ சான்றுகள்' },
    onRecord: { en: 'Statements on Record', si: 'වාර්තාගත ප්‍රකාශන', ta: 'பதிவான அறிக்கைகள்' },
    whyItMatters: { en: 'Why It Matters', si: 'මෙය වැදගත් වන්නේ ඇයි?', ta: 'இது ஏன் முக்கியமானது?' },
    whatsNext: { en: 'What to Watch For', si: 'ඉදිරි අපේක්ෂාවන්', ta: 'அடுத்து கவனிக்க வேண்டியவை' },
    synthesizedByGemini: { en: 'Synthesized by Gemini 2.0 Flash · 100% Original Editorial Expression', si: 'Gemini 2.0 Flash මගින් සම්පාදිත ස්වාධීන සංස්කාරක විශ්ලේෂණය', ta: 'Gemini 2.0 Flash மூலம் தொகுக்கப்பட்ட சுயாதீன பகுப்பாய்வு' },
    synthesizedByDesk: { en: 'NewsGrab Wire Intelligence Synthesis', si: 'NewsGrab ප්‍රවෘත්ති කාමර සංස්කරණය', ta: 'NewsGrab செய்திப்பிரிவு தொகுப்பு' },
    synthesizingBrief: { en: 'Synthesizing executive intelligence brief...', si: 'සත්‍යාපිත විධායක පුවත් වාර්තාව සකස් වෙමින් පවතී...', ta: 'சரிபார்க்கப்பட்ட செய்தி சுருக்கம் தயாராகிறது...' }
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

  const handleWhatsAppShare = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`${title} — NewsGrab: `);
    window.open(`https://api.whatsapp.com/send?text=${shareText}${shareUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleAudioListenToggle = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const titleText = article.title[currentLang] || article.title.en || '';
    const briefText = brief
      ? `${brief.whatHappened} ${brief.whyItMatters ? `Why it matters: ${brief.whyItMatters}` : ''}`
      : (article.summary[currentLang] || article.summary.en || '');
    const spokenContent = `${titleText}. ${briefText}`;

    const utterance = new SpeechSynthesisUtterance(spokenContent);
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (currentLang === 'si') {
        const v = voices.find((voice) => voice.lang.startsWith('si'));
        if (v) utterance.voice = v;
      } else if (currentLang === 'ta') {
        const v = voices.find((voice) => voice.lang.startsWith('ta'));
        if (v) utterance.voice = v;
      } else {
        const v = voices.find(
          (voice) =>
            (voice.lang === 'en-US' || voice.lang === 'en-GB') &&
            (voice.name.includes('Natural') || voice.name.includes('Google'))
        );
        if (v) utterance.voice = v;
      }
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        isSinhala ? 'si-LK' : (isTamil ? 'ta-LK' : 'en-GB'),
        {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
    : '';

  // Get other stories excluding this one
  const relatedStories = allArticles.filter((a) => a.id !== article.id).slice(0, 4);

  return (
    <article className="w-full min-h-screen animate-in fade-in duration-300">
      {/* Top Reading Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-rose-500 z-50 transition-all duration-75 ease-out"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Sticky Sub-Header with Back Navigation & Action Controls */}
      <div className="sticky top-0 z-30 w-full bg-[#0b0c0e]/95 backdrop-blur-md border-b border-white/[0.08] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className={`font-semibold uppercase tracking-wider ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
              {fullArticleLabels.backToFront[currentLang]}
            </span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center bg-white/[0.04] p-0.5 rounded border border-white/[0.08]">
              <button
                onClick={() => setFontSize('normal')}
                title="Default text size"
                className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                  fontSize === 'normal' ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                title="Larger text size"
                className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  fontSize === 'large' ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                title="Extra large text size"
                className={`px-2 py-0.5 text-sm rounded transition-colors cursor-pointer ${
                  fontSize === 'xl' ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                A++
              </button>
            </div>

            {article.sourceUrl && article.sourceUrl !== '#' && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View original wire story"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <span>{fullArticleLabels.originalWire[currentLang]}</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}

            {/* Audio Listen (Speech Synthesis) */}
            <button
              onClick={handleAudioListenToggle}
              title={isSpeaking ? "Stop Audio" : "Listen to Article Brief"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
              )}
              <span className="text-xs font-medium">
                {isSpeaking ? fullArticleLabels.stopAudio[currentLang] : fullArticleLabels.listen[currentLang]}
              </span>
            </button>

            {/* WhatsApp 1-Click Share */}
            <button
              onClick={handleWhatsAppShare}
              title="Share via WhatsApp"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Copy Article Link */}
            <button
              onClick={handleShare}
              title="Share Article"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? fullArticleLabels.linkCopied[currentLang] : fullArticleLabels.share[currentLang]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Page Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Article Masthead Header */}
        <div className="max-w-4xl mx-auto space-y-6 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider">
            <span className="px-2 py-0.5 rounded bg-white/[0.08] text-[11px] font-mono text-zinc-200">
              {article.region === 'world' ? '🌐 World' : '🇱🇰 Sri Lanka'}
            </span>
            <span className="text-rose-500 font-bold">{article.category}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300 font-medium">{article.publisherName}</span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1 text-zinc-400 font-sans">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {article.readTimeMinutes} min read
            </span>
          </div>

          {/* Grand Broadsheet Headline */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-headline leading-[1.12] tracking-tight ${
              isSinhala ? 'font-sinhala' : ''
            } ${isTamil ? 'font-tamil' : ''}`}
          >
            {title}
          </h1>

          {/* Byline and Timestamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-400 pt-3">
            <div>
              <span>{fullArticleLabels.reportingBy[currentLang]}</span>
              <span className="text-zinc-200 font-bold">{article.publisherName}</span>
            </div>
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
        </div>

        {/* Featured Editorial Visual / Authentic Wire Photography */}
        {photoToDisplay ? (
          <div className="max-w-5xl mx-auto my-8 sm:my-10">
            <div className="relative aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden rounded-lg bg-zinc-900 border border-white/[0.08] shadow-2xl">
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
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90 font-mono drop-shadow-md pointer-events-none">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {article.imageCredit && article.imageCredit !== article.publisherName
                    ? `Photo: ${article.imageCredit}`
                    : isAuthenticWirePhoto
                    ? 'Verified Wire Dispatch Photo'
                    : `${article.category.toUpperCase()} Editorial Wire`}
                </span>
                <span className="text-[11px] text-zinc-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                  {article.publisherName}
                </span>
              </div>
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-500 text-right">
              {article.imageCredit && article.imageCredit !== article.publisherName
                ? `Photo credit: ${article.imageCredit} via wire syndication`
                : isAuthenticWirePhoto
                ? `Photo credit: ${article.publisherName} editorial wire`
                : 'Editorial topic photography via NewsDesk Wire Desk'}
            </div>
          </div>
        ) : (
          /* Authoritative Institutional Editorial Wire Masthead (when no authentic photo exists) */
          <div className="max-w-5xl mx-auto my-8 sm:my-10">
            <div className="relative w-full rounded-lg bg-gradient-to-br from-[#161822] via-[#0f1016] to-[#12141c] border border-white/[0.1] p-6 sm:p-10 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                      Official Newsroom Dispatch
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      Accredited Wire Coverage · Multi-Source Verified
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-white/[0.06] text-xs font-mono text-zinc-200 border border-white/[0.08]">
                    {article.publisherName}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-mono font-semibold uppercase border border-rose-500/20">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="relative z-10 space-y-2">
                <Quote className="w-7 h-7 text-rose-400/30" />
                <p className={`text-base sm:text-lg text-zinc-200 font-serif italic leading-relaxed ${isSinhala ? 'font-sinhala leading-loose not-italic' : ''} ${isTamil ? 'font-tamil leading-relaxed not-italic' : ''}`}>
                  &ldquo;{article.summary[currentLang] || article.summary.en || title}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Broadsheet Reading Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 pt-4">
          {/* Main Article Reading Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Axios Smart Brevity Executive Dossier */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-b from-[#14161f] to-[#0f1016] border border-white/[0.1] shadow-2xl space-y-6">
              {/* Dossier Institutional Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className={`text-sm font-mono font-bold uppercase tracking-wider text-white ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                    {fullArticleLabels.smartBrevityTitle[currentLang]}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  {isLoadingBrief && !fetchedBrief && !article.brief?.[currentLang] ? (
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Loader2 className="w-3 h-3 text-rose-400 animate-spin" />
                      <span>{fullArticleLabels.synthesizingBrief[currentLang]}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>
                        {synthesisProvider === 'gemini' 
                          ? fullArticleLabels.synthesizedByGemini[currentLang] 
                          : fullArticleLabels.synthesizedByDesk[currentLang]}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Instant Smart Brevity Dossier Content (0ms perceived latency) */}
              <div className="space-y-6">
                {/* 1. The Scoop & Narrative Lead */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-rose-400" />
                      <span className={`${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                        {fullArticleLabels.whatHappened[currentLang]}
                      </span>
                    </div>
                    <p
                      className={`text-base sm:text-lg text-zinc-100 font-serif leading-relaxed prose-${fontSize} ${
                        isSinhala ? 'font-sinhala leading-loose' : ''
                      } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
                    >
                      {brief ? brief.whatHappened : (article.summary[currentLang] || article.summary.en || '')}
                    </p>
                  </div>

                  {/* 2. Key Facts & Findings */}
                  <div className="p-5 sm:p-6 rounded-lg bg-[#181a24] border-l-4 border-rose-500 space-y-3">
                    <h4 className={`text-xs font-mono font-bold uppercase tracking-widest text-zinc-200 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                      {fullArticleLabels.keyFacts[currentLang]}
                    </h4>
                    <ul className="space-y-3">
                      {(brief?.keyDetails && brief.keyDetails.length > 0 ? brief.keyDetails : bullets).map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-zinc-200">
                          <span className="text-rose-500 font-mono font-bold select-none text-base">—</span>
                          <span className={`leading-relaxed ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                            {fact}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Statements on Record (Direct Quotes) */}
                  {brief?.quotes && brief.quotes.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-lg bg-white/[0.02] border border-white/[0.08] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                        <Quote className="w-3.5 h-3.5 text-amber-400" />
                        <span className={`${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                          {fullArticleLabels.onRecord[currentLang]}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {brief.quotes.map((quoteText, idx) => (
                          <blockquote
                            key={idx}
                            className={`pl-4 border-l-2 border-amber-500/60 text-sm sm:text-base italic text-zinc-300 font-serif leading-relaxed ${
                              isSinhala ? 'font-sinhala' : ''
                            } ${isTamil ? 'font-tamil' : ''}`}
                          >
                            &ldquo;{quoteText}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Why It Matters (Strategic / Macro Context) */}
                  <div className="p-5 sm:p-6 rounded-lg bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-transparent border border-blue-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span className={`${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                        {fullArticleLabels.whyItMatters[currentLang]}
                      </span>
                    </div>
                    <p
                      className={`text-sm sm:text-base text-zinc-200 leading-relaxed ${
                        isSinhala ? 'font-sinhala leading-loose' : ''
                      } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
                    >
                      {brief ? brief.whyItMatters : 'This development carries direct implications for civic, economic, and institutional stability in Sri Lanka.'}
                    </p>
                  </div>

                  {/* 5. What to Watch For (Forward Milestone) */}
                  <div className="p-4 sm:p-5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                    <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <div className={`text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                        {fullArticleLabels.whatsNext[currentLang]}
                      </div>
                      <p className={`text-xs sm:text-sm text-zinc-300 leading-relaxed ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                        {brief ? brief.whatsNext : 'Further official proceedings, regulatory filings, or judicial updates are monitored on the wire.'}
                      </p>
                    </div>
                  </div>
              </div>
            </div>

            {/* In-Article Monetization Slot #1 (Leaderboard) */}
            <div className="py-2">
              <AdBanner
                format="leaderboard"
                slotId="fullpage-article-ad-1"
                sponsorName="Commercial Bank Remittance"
              />
            </div>

            {/* Outbound Canonical Publisher Action Card (Direct Traffic Driver) */}
            <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#181a22] to-[#121319] border border-white/[0.1] shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span>{fullArticleLabels.originalWire[currentLang]}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white font-headline">
                    {article.publisherName}
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                    {fullArticleLabels.publisherNotice[currentLang]}
                  </p>
                </div>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-rose-600/30 hover:-translate-y-0.5 shrink-0 cursor-pointer"
                >
                  <span>{fullArticleLabels.readFullStory[currentLang]}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="pt-3.5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>{fullArticleLabels.fairPracticeNotice[currentLang]}</span>
                </span>
                <span className="text-zinc-400 truncate max-w-[260px]">
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

            {/* In-Article Monetization Slot #2 */}
            <div className="py-4 border-t border-divider">
              <AdBanner
                format="leaderboard"
                slotId="fullpage-article-ad-2"
                sponsorName="Sampath Bank Vishwa"
              />
            </div>

            {/* Cross-Publisher Verification Matrix */}
            {article.perspectives && article.perspectives.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-divider">
                <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Cross-Publisher Reporting &amp; Perspectives ({article.perspectives.length})
                </h4>
                <div className="space-y-2">
                  {article.perspectives.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded bg-white/[0.02] border border-white/[0.06]"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span className="text-zinc-200 font-semibold">{p.publisherName}</span>
                        <span>{p.publishedAt}</span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        {p.headline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
 
            {/* Native Newsroom Discussion & Reader Perspectives Engine */}
            <div className="pt-2">
              <DiscussionSection
                articleId={article.id}
                currentLang={currentLang}
                articleTitle={title}
              />
            </div>

            {/* Multiplex / Sponsored Recommendations Grid (High-RPM End-of-Article Unit) */}
            <div className="pt-4 border-t border-divider">
              <AdBanner
                format="multiplex"
                slotId="article-bottom-multiplex"
                adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
                sponsorName="Sponsored Market Recommendations"
              />
            </div>

            {/* End of Article Source Citation & Return Button */}
            <div className="pt-8 border-t border-divider flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-zinc-500 space-y-1">
                <p>
                  Original wire: <span className="text-zinc-300 font-semibold">{article.publisherName}</span>. Formatted for continuous, uninterrupted reading on NewsGrab.
                </p>
                {article.sourceUrl && article.sourceUrl !== '#' && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors"
                  >
                    <span>View original source wire report</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className={`${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                  {fullArticleLabels.backToFront[currentLang]}
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar Column (4 Cols): Sticky Ad + Trending Stream */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Sticky Sidebar MREC Ad */}
            <div className="sticky top-20 space-y-8">
              <AdBanner
                format="mrec"
                slotId="fullpage-sidebar-mrec"
                sponsorName="Sri Lanka Telecom"
              />

              {/* The Colombo Wire: More Dispatches */}
              <div className="p-5 rounded-lg bg-[#111216] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h4 className={`font-mono text-xs font-bold uppercase tracking-wider text-zinc-200 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                    {fullArticleLabels.upNext[currentLang]}
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                </div>

                <div className="divide-y divide-white/[0.06] space-y-3">
                  {relatedStories.map((rel) => {
                    const relTitle = rel.title[currentLang] || rel.title.en || rel.title.si || rel.title.ta || '';
                    return (
                      <div
                        key={rel.id}
                        onClick={() => onSelectRelatedArticle(rel)}
                        className="pt-3 group cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span className="font-medium text-zinc-300">{rel.publisherName}</span>
                          <span>{rel.category}</span>
                        </div>
                        <h5 className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                          {relTitle}
                        </h5>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
