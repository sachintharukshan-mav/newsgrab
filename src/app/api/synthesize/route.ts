import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/lib/full-article-extractor';
import { synthesizeExecutiveBrief } from '@/lib/gemini-synthesizer';
import { Language } from '@/lib/types';

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
  const headline = searchParams.get('headline') || 'Sri Lanka News Dispatch';
  const publisher = searchParams.get('publisher') || 'Newsroom Wire';
  const rawLang = searchParams.get('lang') || 'en';
  const fallbackSummary = searchParams.get('fallback') || '';

  const lang: Language = (rawLang === 'si' || rawLang === 'ta') ? rawLang : 'en';

  if (!url) {
    return NextResponse.json({ error: 'Missing article URL parameter' }, { status: 400 });
  }

  if (!isSafeUrl(url)) {
    return NextResponse.json({ error: 'Invalid or restricted article URL' }, { status: 400 });
  }

  try {
    // 1. Fetch raw story text from publisher with isolated fair-dealing cleaner
    const extracted = await fetchFullArticle(url, fallbackSummary);
    const rawText = extracted.rawFullText || extracted.content || fallbackSummary || headline;

    // 2. Synthesize Axios Smart Brevity brief via Google Gemini 2.0/1.5 Flash (or algorithmic fallback)
    const { brief, cached, provider } = await synthesizeExecutiveBrief({
      url,
      headline,
      rawText,
      publisherName: publisher,
      lang
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        brief,
        cached,
        provider,
        source: {
          publisher,
          url,
          image: extracted.image
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200'
        }
      }
    );
  } catch (err) {
    console.error('Synthesis route error:', err);
    return NextResponse.json(
      { error: 'Failed to synthesize executive brief' },
      { status: 500 }
    );
  }
}
