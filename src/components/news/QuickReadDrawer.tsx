'use client';

import React, { useEffect, useState } from 'react';
import { Article, Language } from '@/lib/types';
import { X, Share2, Check, ArrowLeft, Clock, ExternalLink } from 'lucide-react';
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
    reportedBy: { en: 'Reported by ', si: 'වාර්තාකරණය: ', ta: 'செய்தියாளர்: ' },
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

          {/* Featured Photo */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-zinc-900 border border-white/[0.08]">
            <img
              src={article.imageUrl}
              alt={title}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Verified Wire Dispatch Summary */}
          <div className="p-5 rounded-md bg-white/[0.02] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-semibold text-zinc-300">{drawerLabels.wireLead[currentLang]}</span>
            </div>
            <p className={`text-sm sm:text-base text-zinc-200 leading-relaxed font-serif ${isSinhala ? 'font-sinhala leading-loose' : ''} ${isTamil ? 'font-tamil leading-relaxed' : ''}`}>
              {article.summary[currentLang] || article.summary.en || article.summary.si || article.summary.ta || ''}
            </p>
          </div>

          {/* Essential Takeaways (AI Synthesis) */}
          <div className="p-5 rounded-md bg-[#14151b] border-l-2 border-rose-500 space-y-2.5">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
              {drawerLabels.takeaways[currentLang]}
            </h3>
            <ul className="space-y-2">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200">
                  <span className="text-rose-400 font-mono select-none">—</span>
                  <span className={`leading-relaxed ${isSinhala ? 'font-sinhala' : ''} ${isTamil ? 'font-tamil' : ''}`}>
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
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
