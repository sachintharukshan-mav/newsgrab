import React, { useEffect, useState } from 'react';
import { Article, Language } from '@/lib/types';
import { ArrowLeft, Clock, Share2, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';
import { DiscussionSection } from './DiscussionSection';

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

  const fullArticleLabels = {
    backToFront: { en: 'Back to Front Page', si: 'මුල් පිටුවට', ta: 'முகப்பிற்குத் திரும்பு' },
    originalWire: { en: 'Original Wire', si: 'මූලික පුවත', ta: 'அசல் செய்தி' },
    share: { en: 'Share', si: 'බෙදාගන්න', ta: 'பகிர்' },
    linkCopied: { en: 'Link Copied', si: 'පිටපත් කරන ලදී', ta: 'நகலெடுக்கப்பட்டது' },
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
    }
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

        {/* Featured Full-Width Editorial Photo */}
        <div className="max-w-5xl mx-auto my-8 sm:my-10">
          <div className="relative aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden rounded-lg bg-zinc-900 border border-white/[0.08]">
            <img
              src={article.imageUrl}
              alt={title}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2 text-[11px] font-mono text-zinc-500 text-right">
            Newsroom photo dispatch · {article.publisherName}
          </div>
        </div>

        {/* Two-Column Broadsheet Reading Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 pt-4">
          {/* Main Article Reading Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Essential Takeaways Box (AI Key Points) */}
            <div className="p-6 sm:p-7 rounded-lg bg-[#14151b] border-l-4 border-rose-500 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`text-xs font-mono font-bold uppercase tracking-widest text-zinc-200 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                  {fullArticleLabels.takeaways[currentLang]}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">{fullArticleLabels.synthesis[currentLang]}</span>
              </div>
              <ul className="space-y-3">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-zinc-200">
                    <span className="text-rose-500 font-mono font-bold select-none text-base">—</span>
                    <span className={`leading-relaxed ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In-Article Monetization Slot #1 (Leaderboard) */}
            <div className="py-2">
              <AdBanner
                format="leaderboard"
                slotId="fullpage-article-ad-1"
                sponsorName="Commercial Bank Remittance"
              />
            </div>

            {/* Verified Wire Dispatch Summary */}
            <div className="p-6 sm:p-7 rounded-lg bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-semibold text-zinc-300">{fullArticleLabels.wireDispatch[currentLang]}</span>
              </div>
              <p
                className={`text-base sm:text-lg text-zinc-200 leading-relaxed font-serif prose-${fontSize} ${
                  isSinhala ? 'font-sinhala leading-loose' : ''
                } ${isTamil ? 'font-tamil leading-relaxed' : ''}`}
              >
                {article.summary[currentLang] || article.summary.en || article.summary.si || article.summary.ta || ''}
              </p>
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
