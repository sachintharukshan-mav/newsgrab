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

// Basic profanity / hate-speech keyword safety list to guarantee Google AdSense compliance
const BLOCKED_TERMS = [
  'kill', 'murder', 'bomb', 'terrorist', 'nigger', 'faggot', 'chink', 'retard',
  'fuck', 'bitch', 'asshole', 'bastard', 'whore', 'slut', 'dick',
  'හුක', 'පක', 'කැරි', 'හුත්ත', 'වේසි', 'තොපිව මරනවා',
  'தேவிடியா', 'புண்டை', 'சுன்னி', 'நாயே'
];

export function validateCommentContent(text: string): { isValid: boolean; reason?: string } {
  if (!text || text.trim().length < 3) {
    return { isValid: false, reason: 'Comment is too short (minimum 3 characters required).' };
  }

  if (text.length > 500) {
    return { isValid: false, reason: 'Comment exceeds maximum limit of 500 characters.' };
  }

  const lower = text.toLowerCase();
  for (const term of BLOCKED_TERMS) {
    if (lower.includes(term.toLowerCase())) {
      return {
        isValid: false,
        reason: 'Comment violates NewsGrab community guidelines on civil, non-abusive discourse.'
      };
    }
  }

  // Check for malicious links or raw script tags
  if (/<script|<\/script|javascript:|data:text\/html/i.test(text)) {
    return { isValid: false, reason: 'Automated scripts and tags are strictly prohibited.' };
  }

  return { isValid: true };
}

// Initial seed discussions to demonstrate multi-perspective reader exchange
const DEFAULT_SEED_COMMENTS: ArticleComment[] = [
  {
    id: 'seed-comment-1',
    articleId: 'default',
    authorName: 'Dr. Rohan Samarasinghe',
    authorLocation: 'Colombo 03',
    content: 'Important context here regarding institutional stabilization. The macroeconomic indicators mentioned align closely with recent central bank releases, but sustainable policy implementation remains key.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    upvotes: 14
  },
  {
    id: 'seed-comment-2',
    articleId: 'default',
    authorName: 'Ananya Sivalingam',
    authorLocation: 'Jaffna',
    content: 'Appreciate the trilingual availability and multi-perspective cross-indexing on this issue. Providing transparent source citations across publishers helps readers verify the full picture.',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    upvotes: 9
  }
];

export function getCommentsForArticle(articleId: string): ArticleComment[] {
  const existing = commentsStore.get(articleId);
  if (!existing || existing.length === 0) {
    // Generate context-appropriate demo seed comments for active reading engagement
    const seeded = DEFAULT_SEED_COMMENTS.map((c, idx) => ({
      ...c,
      id: `${articleId}-seed-${idx + 1}`,
      articleId
    }));
    commentsStore.set(articleId, seeded);
    return seeded;
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
