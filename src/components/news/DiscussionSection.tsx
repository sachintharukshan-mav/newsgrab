'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/lib/types';
import { ArticleComment } from '@/lib/comments-store';
import { formatRelativeTime } from '@/lib/time-utils';
import {
  MessageSquare,
  ThumbsUp,
  Flag,
  Send,
  ShieldCheck,
  MapPin,
  AlertCircle,
  Check
} from 'lucide-react';

interface DiscussionSectionProps {
  articleId: string;
  currentLang: Language;
  articleTitle: string;
}

const discussionTranslations = {
  title: {
    en: 'The Wire Discussion',
    si: 'පාඨක අදහස් සහ සංවාදය',
    ta: 'வாசகர் கருத்துக்களம்'
  },
  subtitle: {
    en: 'Civil, fact-grounded reader perspectives and analysis',
    si: 'නිරවුල්, ගෞරවනීය පාඨක අදහස් හා විග්‍රහයන්',
    ta: 'நாகரீகமான, உண்மையின் அடிப்படையிலான வாசகர் பார்வை'
  },
  namePlaceholder: {
    en: 'Your name or handle...',
    si: 'ඔබේ නම හෝ අන්වර්ථ නාමය...',
    ta: 'உங்கள் பெயர் அல்லது புனைப்பெயர்...'
  },
  locationPlaceholder: {
    en: 'Location (e.g. Colombo, Kandy, Melbourne)...',
    si: 'නගරය (උදා: කොළඹ, මහනුවර, ලන්ඩන්)...',
    ta: 'நகரம் (எ.கா: கொழும்பு, கண்டி)...'
  },
  commentPlaceholder: {
    en: 'Share your perspective or insight on this report (respectful & non-partisan)...',
    si: 'මෙම වාර්තාව පිළිබඳ ඔබේ ගෞරවනීය අදහස හෝ විශ්ලේෂණය දක්වන්න...',
    ta: 'இந்த செய்தி குறித்த உங்கள் கருத்தை அல்லது பார்வையை பதியுங்கள்...'
  },
  submitBtn: {
    en: 'Post Comment',
    si: 'අදහස පළකරන්න',
    ta: 'கருத்தை பதியவும்'
  },
  submitting: {
    en: 'Publishing...',
    si: 'පළවෙමින්...',
    ta: 'பதிவாகிறது...'
  },
  guidelinesNotice: {
    en: 'NewsGrab enforces strict community standards. Defamation, hate speech, and spam are automatically filtered.',
    si: 'නිව්ස්ග්‍රැබ් ආචාරධර්ම අනුව අපහාසාත්මක හෝ අසත්‍ය තොරතුරු ස්වයංක්‍රීයව පෙරහන් කෙරේ.',
    ta: 'அவதூறு மற்றும் தவறான தகவல்கள் தானாகவே வடிகட்டப்படும்.'
  },
  sortLatest: {
    en: 'Latest Dispatches',
    si: 'නවතම අදහස්',
    ta: 'சமீபத்தியவை'
  },
  sortTop: {
    en: 'Top Agreed',
    si: 'වැඩිම එකඟතා',
    ta: 'அதிக ஆதரவு'
  },
  reportedToast: {
    en: 'Flagged for editorial review',
    si: 'සමාලෝචනයට යොමු කෙරිණි',
    ta: 'மதிப்பாய்வுக்கு அனுப்பப்பட்டது'
  },
  report: {
    en: 'Report',
    si: 'වාර්තා කරන්න',
    ta: 'புகாரளி'
  },
  empty: {
    en: 'No comments yet. Share the first perspective on this wire report.',
    si: 'තවමත් අදහස් පළවී නොමැත. පළමු අදහස දක්වන්න.',
    ta: 'இன்னும் கருத்துக்கள் இல்லை. உங்கள் கருத்தை முதலில் பதியுங்கள்.'
  }
};

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({
  articleId,
  currentLang
}) => {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [commentText, setCommentText] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'top'>('latest');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  const isSinhala = currentLang === 'si';
  const isTamil = currentLang === 'ta';

  // Load upvoted history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('newsgrab_upvoted_comments');
      const savedName = localStorage.getItem('newsgrab_author_name');
      const savedLoc = localStorage.getItem('newsgrab_author_loc');
      React.startTransition(() => {
        if (saved) {
          setUpvotedIds(new Set(JSON.parse(saved)));
        }
        if (savedName) setAuthorName(savedName);
        if (savedLoc) setAuthorLocation(savedLoc);
      });
    } catch {}
  }, []);

  // Fetch comments for active article
  useEffect(() => {
    let isMounted = true;
    React.startTransition(() => {
      setLoading(true);
    });

    fetch(`/api/comments?articleId=${encodeURIComponent(articleId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.comments) {
          // Merge with any locally stored comments for this article
          try {
            const localRaw = localStorage.getItem(`newsgrab_comments_${articleId}`);
            const localComments: ArticleComment[] = localRaw ? JSON.parse(localRaw) : [];
            const merged = [...localComments, ...data.comments.filter((c: ArticleComment) => !localComments.some((lc) => lc.id === c.id))];
            setComments(merged);
          } catch {
            setComments(data.comments);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load comments:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          authorName: authorName.trim() || 'Anonymous Reader',
          authorLocation: authorLocation.trim() || undefined,
          content: commentText.trim(),
          honeypot
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to publish comment. Please verify content meets guidelines.');
        setSubmitting(false);
        return;
      }

      if (data.comment) {
        const updated = [data.comment, ...comments];
        setComments(updated);

        // Cache locally for immediate persistence across refresh
        try {
          const localRaw = localStorage.getItem(`newsgrab_comments_${articleId}`);
          const localComments: ArticleComment[] = localRaw ? JSON.parse(localRaw) : [];
          localStorage.setItem(
            `newsgrab_comments_${articleId}`,
            JSON.stringify([data.comment, ...localComments])
          );
          if (authorName.trim()) localStorage.setItem('newsgrab_author_name', authorName.trim());
          if (authorLocation.trim()) localStorage.setItem('newsgrab_author_loc', authorLocation.trim());
        } catch {}

        setCommentText('');
        setSuccessToast('Comment published to The Wire.');
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch {
      setErrorMsg('Network error. Unable to publish comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (commentId: string) => {
    if (upvotedIds.has(commentId)) return;

    // Optimistically update UI
    const nextUpvotes = new Set(upvotedIds);
    nextUpvotes.add(commentId);
    setUpvotedIds(nextUpvotes);

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
    );

    try {
      localStorage.setItem('newsgrab_upvoted_comments', JSON.stringify(Array.from(nextUpvotes)));
      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, commentId, action: 'upvote' })
      });
    } catch (err) {
      console.warn('Upvote sync failed:', err);
    }
  };

  const handleReport = async (commentId: string) => {
    try {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setSuccessToast(discussionTranslations.reportedToast[currentLang]);
      setTimeout(() => setSuccessToast(null), 3000);

      await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, commentId, action: 'report' })
      });
    } catch (err) {
      console.warn('Report failed:', err);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'top') {
      return b.upvotes - a.upvotes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section
      id="wire-discussion"
      className="p-6 sm:p-8 rounded-lg bg-[#111216] border border-white/[0.08] space-y-6"
    >
      {/* Header with Title and Guidelines Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <h3
              className={`text-base sm:text-lg font-bold text-white font-headline tracking-tight ${
                isSinhala ? 'font-sinhala' : ''
              } ${isTamil ? 'font-tamil' : ''}`}
            >
              {discussionTranslations.title[currentLang]}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[11px] font-mono text-zinc-400">
              {comments.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {discussionTranslations.subtitle[currentLang]}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center bg-white/[0.03] p-0.5 rounded border border-white/[0.06] text-[11px] font-mono">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              sortBy === 'latest'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {discussionTranslations.sortLatest[currentLang]}
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              sortBy === 'top'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {discussionTranslations.sortTop[currentLang]}
          </button>
        </div>
      </div>

      {/* Community Guidelines Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded bg-white/[0.02] border border-white/[0.05] text-[11px] text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {discussionTranslations.guidelinesNotice[currentLang]}
        </p>
      </div>

      {/* Toast Notifications */}
      {successToast && (
        <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        {/* Anti-spam hidden honeypot trap */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={discussionTranslations.namePlaceholder[currentLang]}
              maxLength={40}
              className="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-rose-500/50 transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              value={authorLocation}
              onChange={(e) => setAuthorLocation(e.target.value)}
              placeholder={discussionTranslations.locationPlaceholder[currentLang]}
              maxLength={35}
              className="w-full px-3.5 py-2 bg-white/[0.03] border border-white/[0.08] rounded text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-rose-500/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={discussionTranslations.commentPlaceholder[currentLang]}
            rows={3}
            maxLength={500}
            className={`w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-rose-500/50 transition-colors resize-y leading-relaxed ${
              isSinhala ? 'font-sinhala' : ''
            } ${isTamil ? 'font-tamil' : ''}`}
          />
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
            <span>{commentText.length} / 500 characters</span>
            <span>Trilingual civil moderation active</span>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>
              {submitting
                ? discussionTranslations.submitting[currentLang]
                : discussionTranslations.submitBtn[currentLang]}
            </span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-4 border-t border-white/[0.06]">
        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-16 bg-white/[0.03] rounded animate-pulse w-full" />
            <div className="h-16 bg-white/[0.03] rounded animate-pulse w-full" />
          </div>
        ) : sortedComments.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono">
            {discussionTranslations.empty[currentLang]}
          </div>
        ) : (
          sortedComments.map((comment) => {
            const hasUpvoted = upvotedIds.has(comment.id);
            const initials = comment.authorName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();
            const timeAgo = formatRelativeTime(comment.createdAt, currentLang);

            return (
              <div
                key={comment.id}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2.5 transition-colors hover:border-white/[0.09]"
              >
                {/* Author Metadata Header */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 select-none">
                      {initials || 'NR'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-200">{comment.authorName}</span>
                        {comment.authorLocation && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-zinc-500">
                            <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                            {comment.authorLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] text-zinc-500" suppressHydrationWarning>
                    {timeAgo}
                  </span>
                </div>

                {/* Comment Content */}
                <p
                  className={`text-xs sm:text-sm text-zinc-300 leading-relaxed pl-9 ${
                    isSinhala ? 'font-sinhala' : ''
                  } ${isTamil ? 'font-tamil' : ''}`}
                >
                  {comment.content}
                </p>

                {/* Footer Controls: Upvote & Report */}
                <div className="flex items-center justify-between pl-9 pt-1 text-[11px] font-mono text-zinc-500">
                  <button
                    onClick={() => handleUpvote(comment.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      hasUpvoted
                        ? 'bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20'
                        : 'hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200'
                    }`}
                    title="Helpful insight / Agree"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.upvotes}</span>
                  </button>

                  <button
                    onClick={() => handleReport(comment.id)}
                    className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
                    title="Report comment to newsdesk"
                  >
                    <Flag className="w-2.5 h-2.5" />
                    <span>{discussionTranslations.report[currentLang]}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
