import { NextRequest, NextResponse } from 'next/server';
import {
  getCommentsForArticle,
  addCommentToArticle,
  upvoteArticleComment,
  reportArticleComment,
  validateCommentContent,
  ArticleComment
} from '@/lib/comments-store';
import { getCloudflareEnv } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'Missing articleId parameter' }, { status: 400 });
  }

  const env = await getCloudflareEnv();

  // Try persistent Cloudflare D1 database if bound
  if (env?.DB) {
    try {
      const query = `
        SELECT 
          id, 
          article_id as articleId, 
          author_name as authorName, 
          author_location as authorLocation, 
          content, 
          created_at as createdAt, 
          upvotes 
        FROM comments 
        WHERE article_id = ? AND flagged = 0 
        ORDER BY datetime(created_at) DESC
      `;
      const { results } = await env.DB.prepare(query).bind(articleId).all<ArticleComment>();

      if (results && results.length > 0) {
        return NextResponse.json({ success: true, comments: results, storage: 'd1' });
      }
    } catch (d1Err) {
      console.warn('D1 comments fetch fallback:', d1Err);
    }
  }

  // In-memory / seed fallback
  const comments = getCommentsForArticle(articleId);
  return NextResponse.json({ success: true, comments, storage: 'memory' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, authorName, authorLocation, content, honeypot } = body;

    // Silent rejection for spambots filling hidden honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Comment submitted successfully' });
    }

    if (!articleId) {
      return NextResponse.json({ error: 'Missing articleId' }, { status: 400 });
    }

    // Validate AdSense & Community Compliance
    const validation = validateCommentContent(content || '');
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    const env = await getCloudflareEnv();
    const cleanAuthor = (authorName || 'Anonymous Reader').trim();
    const cleanLocation = authorLocation?.trim() || null;
    const cleanContent = content.trim();

    if (env?.DB) {
      try {
        const commentId = `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const createdAt = new Date().toISOString();

        await env.DB.prepare(
          `INSERT INTO comments (id, article_id, author_name, author_location, content, created_at, upvotes, flagged)
           VALUES (?, ?, ?, ?, ?, ?, 1, 0)`
        )
          .bind(commentId, articleId, cleanAuthor, cleanLocation, cleanContent, createdAt)
          .run();

        const newComment: ArticleComment = {
          id: commentId,
          articleId,
          authorName: cleanAuthor,
          authorLocation: cleanLocation || undefined,
          content: cleanContent,
          createdAt,
          upvotes: 1
        };

        return NextResponse.json({ success: true, comment: newComment, storage: 'd1' }, { status: 201 });
      } catch (d1Err) {
        console.warn('D1 comments insert fallback:', d1Err);
      }
    }

    // In-memory fallback
    const newComment = addCommentToArticle(
      articleId,
      cleanAuthor,
      cleanLocation || undefined,
      cleanContent
    );

    return NextResponse.json({ success: true, comment: newComment, storage: 'memory' }, { status: 201 });
  } catch (err) {
    console.error('Failed to submit comment:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, commentId, action } = body;

    if (!articleId || !commentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const env = await getCloudflareEnv();

    if (action === 'upvote') {
      if (env?.DB) {
        try {
          await env.DB.prepare('UPDATE comments SET upvotes = upvotes + 1 WHERE id = ?').bind(commentId).run();
          return NextResponse.json({ success: true, storage: 'd1' });
        } catch (d1Err) {
          console.warn('D1 comments upvote fallback:', d1Err);
        }
      }
      const ok = upvoteArticleComment(articleId, commentId);
      return NextResponse.json({ success: ok, storage: 'memory' });
    }

    if (action === 'report') {
      if (env?.DB) {
        try {
          await env.DB.prepare('UPDATE comments SET flagged = 1 WHERE id = ?').bind(commentId).run();
          return NextResponse.json({ success: true, message: 'Comment reported for review', storage: 'd1' });
        } catch (d1Err) {
          console.warn('D1 comments report fallback:', d1Err);
        }
      }
      const ok = reportArticleComment(articleId, commentId);
      return NextResponse.json({ success: ok, message: 'Comment reported for review', storage: 'memory' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Failed to update comment:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
