import { NextRequest, NextResponse } from 'next/server';
import {
  getCommentsForArticle,
  addCommentToArticle,
  upvoteArticleComment,
  reportArticleComment,
  validateCommentContent
} from '@/lib/comments-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'Missing articleId parameter' }, { status: 400 });
  }

  const comments = getCommentsForArticle(articleId);
  return NextResponse.json({ success: true, comments });
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

    const newComment = addCommentToArticle(
      articleId,
      authorName || 'Anonymous Reader',
      authorLocation,
      content
    );

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
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

    if (action === 'upvote') {
      const ok = upvoteArticleComment(articleId, commentId);
      return NextResponse.json({ success: ok });
    }

    if (action === 'report') {
      const ok = reportArticleComment(articleId, commentId);
      return NextResponse.json({ success: ok, message: 'Comment reported for review' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Failed to update comment:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
