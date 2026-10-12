import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/lib/full-article-extractor';
import { isAllowedPublisherUrl, clampParam } from '@/lib/url-safety';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const fallback = clampParam(searchParams.get('fallback'), 2000);

  if (!url) {
    return NextResponse.json({ error: 'Missing article URL parameter' }, { status: 400 });
  }

  // Only fetch from syndicated publisher domains (prevents open-proxy / SSRF abuse).
  if (!isAllowedPublisherUrl(url)) {
    return NextResponse.json({ error: 'Invalid or restricted article URL' }, { status: 400 });
  }

  const result = await fetchFullArticle(url, fallback);

  return NextResponse.json({
    success: true,
    ...result
  });
}
