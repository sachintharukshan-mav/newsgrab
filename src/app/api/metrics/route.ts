import { NextRequest, NextResponse } from 'next/server';
import { getBatchArticleMetrics, incrementArticleRead } from '@/lib/metrics-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawIds = searchParams.get('ids') || '';
    
    if (!rawIds.trim()) {
      return NextResponse.json({ success: true, metrics: {} });
    }

    const idList = rawIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 100); // Guard limit to prevent excessive query batches

    const items = idList.map((id) => ({ id }));
    const metrics = await getBatchArticleMetrics(items);

    return NextResponse.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Error fetching article metrics:', error);
    return NextResponse.json({ success: false, metrics: {} }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articleId = typeof body.articleId === 'string' ? body.articleId.trim() : '';
    const publishedAt = typeof body.publishedAt === 'string' ? body.publishedAt : undefined;

    if (!articleId || articleId.length > 256) {
      return NextResponse.json({ error: 'Valid articleId is required' }, { status: 400 });
    }

    const updatedReads = await incrementArticleRead(articleId, publishedAt);

    return NextResponse.json({
      success: true,
      articleId,
      reads: updatedReads
    });
  } catch (error) {
    console.error('Error incrementing article read count:', error);
    return NextResponse.json({ error: 'Failed to record read' }, { status: 500 });
  }
}
