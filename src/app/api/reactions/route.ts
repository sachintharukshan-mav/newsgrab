import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareEnv } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get('targetId');

  if (!targetId) {
    return NextResponse.json({ error: 'Missing targetId' }, { status: 400 });
  }

  const env = await getCloudflareEnv();

  if (env?.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT reaction_type as emoji, count FROM reactions WHERE article_id = ?'
      )
        .bind(targetId)
        .all<{ emoji: string; count: number }>();

      const countsMap: Record<string, number> = {};
      if (results) {
        for (const row of results) {
          countsMap[row.emoji] = row.count;
        }
      }

      return NextResponse.json({ success: true, counts: countsMap, storage: 'd1' });
    } catch (err) {
      console.warn('D1 reactions fetch fallback:', err);
    }
  }

  return NextResponse.json({ success: true, counts: {}, storage: 'memory' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetId, emoji } = body;

    if (!targetId || !emoji) {
      return NextResponse.json({ error: 'Missing targetId or emoji' }, { status: 400 });
    }

    const env = await getCloudflareEnv();

    if (env?.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO reactions (article_id, reaction_type, count)
           VALUES (?, ?, 1)
           ON CONFLICT(article_id, reaction_type)
           DO UPDATE SET count = count + 1`
        )
          .bind(targetId, emoji)
          .run();

        const row = await env.DB.prepare(
          'SELECT count FROM reactions WHERE article_id = ? AND reaction_type = ?'
        )
          .bind(targetId, emoji)
          .first<{ count: number }>();

        return NextResponse.json({
          success: true,
          targetId,
          emoji,
          newCount: row?.count || 1,
          storage: 'd1'
        });
      } catch (err) {
        console.warn('D1 reactions increment fallback:', err);
      }
    }

    return NextResponse.json({ success: true, targetId, emoji, storage: 'memory' });
  } catch (err) {
    console.error('Reactions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
