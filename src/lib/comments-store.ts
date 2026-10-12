export interface ArticleComment {
  id: string;
  articleId: string;
  authorName: string;
  authorLocation?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  flagged?: boolean;
}

// In-memory comments store (shared across requests in server runtime)
const commentsStore = new Map<string, ArticleComment[]>();

// Hate-speech and abusive slurs list (checked with word boundaries to avoid false positives like "skill")
const BLOCKED_PATTERNS = [
  /\b(nigger|faggot|chink|retard|whore|slut|bitch|bastard|asshole|fuck)\b/i,
  /(හුක|පක|කැරි|හුත්ත|වේසි|තොපිව මරනවා)/i,
  /(தேவிடியா|புண்டை|சுன்னி|நாயே)/i
];

export function validateCommentContent(text: string): { isValid: boolean; reason?: string } {
  if (!text || text.trim().length < 3) {
    return { isValid: false, reason: 'Comment is too short (minimum 3 characters required).' };
  }

  if (text.length > 500) {
    return { isValid: false, reason: 'Comment exceeds maximum limit of 500 characters.' };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        reason: 'Comment violates community guidelines on civil, non-abusive discourse.'
      };
    }
  }

  // Check for malicious links or raw script tags
  if (/<script|<\/script|javascript:|data:text\/html/i.test(text)) {
    return { isValid: false, reason: 'Automated scripts and HTML tags are strictly prohibited.' };
  }

  return { isValid: true };
}

export function getCommentsForArticle(articleId: string): ArticleComment[] {
  const existing = commentsStore.get(articleId);
  if (!existing || existing.length === 0) {
    return [];
  }
  return existing.filter((c) => !c.flagged);
}

export function addCommentToArticle(
  articleId: string,
  authorName: string,
  authorLocation: string | undefined,
  content: string
): ArticleComment {
  const newComment: ArticleComment = {
    id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    articleId,
    authorName: authorName.trim() || 'Anonymous Reader',
    authorLocation: authorLocation?.trim() || undefined,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    upvotes: 1
  };

  const list = commentsStore.get(articleId) || [];
  list.unshift(newComment);
  commentsStore.set(articleId, list);

  return newComment;
}

export function upvoteArticleComment(articleId: string, commentId: string): boolean {
  const list = commentsStore.get(articleId);
  if (!list) return false;

  const target = list.find((c) => c.id === commentId);
  if (target) {
    target.upvotes += 1;
    return true;
  }
  return false;
}

export function reportArticleComment(articleId: string, commentId: string): boolean {
  const list = commentsStore.get(articleId);
  if (!list) return false;

  const target = list.find((c) => c.id === commentId);
  if (target) {
    target.flagged = true;
    return true;
  }
  return false;
}
