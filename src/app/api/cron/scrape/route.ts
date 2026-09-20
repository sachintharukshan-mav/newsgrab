import { NextRequest, NextResponse } from 'next/server';
import { fetchRSSFeed } from '@/lib/rss-parser';

export async function GET(request: NextRequest) {
  // Optional security check for cron authorization header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const feeds = [
    { url: 'https://www.adaderana.lk/rss.php', name: 'Ada Derana' },
    { url: 'http://island.lk/feed/', name: 'The Island' },
    { url: 'https://www.lankabusinessonline.com/feed/', name: 'Lanka Business Online' },
    { url: 'https://readme.lk/feed/', name: 'Readme.lk' }
  ];

  const results: Record<string, number> = {};

  for (const feed of feeds) {
    try {
      const items = await fetchRSSFeed(feed.url, feed.name);
      results[feed.name] = items.length;
    } catch {
      results[feed.name] = 0;
    }
  }

  return NextResponse.json({
    success: true,
    fetchedAt: new Date().toISOString(),
    ingestedCountBySource: results
  });
}
