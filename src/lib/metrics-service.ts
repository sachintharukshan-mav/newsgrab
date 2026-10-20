import { getCloudflareEnv } from './cloudflare';

// In-memory fallback for local development or when D1 is offline
const memoryReadsStore = new Map<string, number>();

/**
 * Deterministic hash function to generate a stable pseudo-random integer
 * from a string (e.g. article ID). This guarantees all visitors see identical
 * baseline numbers across page reloads.
 */
function deterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculates a realistic, organic baseline read count based on publication age
 * and a deterministic seed from the article's unique ID.
 */
export function calculateBaselineReads(
  articleId: string,
  publishedAt?: string,
  isLead: boolean = false
): number {
  const seed = deterministicHash(articleId);
  const variance = (seed % 45) + 15; // 15 to 59 base variance

  let ageInHours = 1;
  if (publishedAt) {
    const pubTime = new Date(publishedAt).getTime();
    if (!isNaN(pubTime)) {
      const diffMs = Math.max(0, Date.now() - pubTime);
      ageInHours = diffMs / (1000 * 60 * 60);
    }
  }

  let baseReads = 35;
  if (ageInHours < 0.5) {
    baseReads = 20 + (seed % 25);
  } else if (ageInHours < 2) {
    baseReads = 55 + (seed % 45);
  } else if (ageInHours < 6) {
    baseReads = 110 + (seed % 85);
  } else if (ageInHours < 12) {
    baseReads = 220 + (seed % 140);
  } else if (ageInHours < 24) {
    baseReads = 380 + (seed % 220);
  } else {
    baseReads = 650 + (seed % 400);
  }

  const finalBaseline = baseReads + variance;
  return isLead ? Math.round(finalBaseline * 1.4) : finalBaseline;
}

export interface ArticleMetrics {
  reads: number;
  comments: number;
}

/**
 * Batch retrieves read counts and comment counts for multiple articles.
 * Combines Cloudflare D1 persistent storage with deterministic baseline seeding.
 */
export async function getBatchArticleMetrics(
  items: { id: string; publishedAt?: string; isLead?: boolean }[]
): Promise<Record<string, ArticleMetrics>> {
  const metrics: Record<string, ArticleMetrics> = {};
  if (!items || items.length === 0) return metrics;

  // Initialize with deterministic baselines
  for (const item of items) {
    metrics[item.id] = {
      reads: calculateBaselineReads(item.id, item.publishedAt, item.isLead),
      comments: 0
    };
  }

  const env = await getCloudflareEnv();

  // 1. Fetch from D1 if available
  if (env?.DB) {
    try {
      const ids = items.map((i) => i.id);
      const placeholders = ids.map(() => '?').join(',');

      // Fetch persisted reads
      const readsQuery = `SELECT article_id, reads FROM article_reads WHERE article_id IN (${placeholders})`;
      const readsResult = await env.DB.prepare(readsQuery).bind(...ids).all<{ article_id: string; reads: number }>();

      if (readsResult.results) {
        for (const row of readsResult.results) {
          if (metrics[row.article_id]) {
            // Live reads are added to baseline or take precedence
            metrics[row.article_id].reads += row.reads;
          }
        }
      }

      // Fetch comment counts
      const commentsQuery = `SELECT article_id, COUNT(*) as comment_count FROM comments WHERE article_id IN (${placeholders}) AND flagged = 0 GROUP BY article_id`;
      const commentsResult = await env.DB.prepare(commentsQuery).bind(...ids).all<{ article_id: string; comment_count: number }>();

      if (commentsResult.results) {
        for (const row of commentsResult.results) {
          if (metrics[row.article_id]) {
            metrics[row.article_id].comments = row.comment_count;
          }
        }
      }

      return metrics;
    } catch (err) {
      console.warn('D1 batch metrics query error, using fallback:', err);
    }
  }

  // 2. Local memory fallback for development
  for (const item of items) {
    const memoryRead = memoryReadsStore.get(item.id) || 0;
    metrics[item.id].reads += memoryRead;
  }

  return metrics;
}

/**
 * Increments the live read count for an article in Cloudflare D1.
 */
export async function incrementArticleRead(
  articleId: string,
  publishedAt?: string
): Promise<number> {
  const baseline = calculateBaselineReads(articleId, publishedAt);
  const env = await getCloudflareEnv();

  if (env?.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO article_reads (article_id, reads, updated_at)
         VALUES (?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(article_id)
         DO UPDATE SET reads = reads + 1, updated_at = CURRENT_TIMESTAMP`
      )
        .bind(articleId)
        .run();

      const row = await env.DB.prepare(
        'SELECT reads FROM article_reads WHERE article_id = ?'
      )
        .bind(articleId)
        .first<{ reads: number }>();

      return baseline + (row?.reads || 1);
    } catch (err) {
      console.warn('D1 read increment error:', err);
    }
  }

  // Memory fallback
  const current = memoryReadsStore.get(articleId) || 0;
  const updated = current + 1;
  memoryReadsStore.set(articleId, updated);
  return baseline + updated;
}
