import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/lib/full-article-extractor';

function isSafeUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      return false;
    }

    // Check private/link-local IPv4
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [, a, b] = ipv4Match.map(Number);
      if (a === 10) return false;
      if (a === 127) return false;
      if (a === 169 && b === 254) return false;
      if (a === 172 && b >= 16 && b <= 31) return false;
      if (a === 192 && b === 168) return false;
      if (a === 0) return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const fallback = searchParams.get('fallback') || '';

  if (!url) {
    return NextResponse.json({ error: 'Missing article URL parameter' }, { status: 400 });
  }

  if (!isSafeUrl(url)) {
    return NextResponse.json({ error: 'Invalid or restricted article URL' }, { status: 400 });
  }

  const result = await fetchFullArticle(url, fallback);

  return NextResponse.json({
    success: true,
    ...result
  });
}
