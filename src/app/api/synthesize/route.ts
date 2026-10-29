import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/lib/full-article-extractor';
import { synthesizeWithWorkersAi, getCachedBrief as getWorkersAiCachedBrief } from '@/lib/workers-ai-synthesizer';
import { synthesizeExecutiveBrief, getCachedBrief as getGeminiCachedBrief } from '@/lib/gemini-synthesizer';
import { Language } from '@/lib/types';
import { isAllowedPublisherUrl, clampParam } from '@/lib/url-safety';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  // Clamp free-text params: they are interpolated into the prompt.
  const headline = clampParam(searchParams.get('headline'), 300, 'Sri Lanka News Dispatch');
  const publisher = clampParam(searchParams.get('publisher'), 80, 'Newsroom Wire');
  const rawLang = searchParams.get('lang') || 'en';
  const fallbackSummary = clampParam(searchParams.get('fallback'), 2000);

  const lang: Language = (rawLang === 'si' || rawLang === 'ta') ? rawLang : 'en';

  if (!url) {
    return NextResponse.json({ error: 'Missing article URL parameter' }, { status: 400 });
  }

  // Only fetch/synthesize articles from syndicated publisher domains.
  if (!isAllowedPublisherUrl(url)) {
    return NextResponse.json({ error: 'Invalid or restricted article URL' }, { status: 400 });
  }

  const cachedOnly = searchParams.get('cachedOnly') === 'true';
  if (cachedOnly) {
    const cached = (await getWorkersAiCachedBrief(url, lang)) || getGeminiCachedBrief(url, lang);
    if (cached) {
      return NextResponse.json({
        success: true,
        brief: cached,
        cached: true,
        provider: 'workers-ai'
      }, {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200'
        }
      });
    }
    // Return early without spending AI quota or scraping
    return NextResponse.json({ success: false, cached: false, brief: null }, { status: 200 });
  }

  try {
    // 1. Fetch raw story text from publisher with isolated fair-dealing cleaner
    const extracted = await fetchFullArticle(url, fallbackSummary);
    const rawText = extracted.rawFullText || extracted.content || fallbackSummary || headline;

    // 2. Synthesize Axios Smart Brevity brief via Cloudflare Workers AI (Zero billable cost, hard 35/day cap)
    const result = await synthesizeWithWorkersAi({
      url,
      headline,
      rawText,
      publisherName: publisher,
      lang
    });

    let brief = result.brief;
    let provider = result.provider;
    const cached = result.cached;

    // 3. Fallback to Gemini if Workers AI hit daily circuit-breaker and GEMINI_API_KEY is configured
    if (provider === 'algorithmic' && process.env.GEMINI_API_KEY) {
      try {
        const geminiRes = await synthesizeExecutiveBrief({
          url,
          headline,
          rawText,
          publisherName: publisher,
          lang
        });
        if (geminiRes.provider === 'gemini') {
          brief = geminiRes.brief;
          provider = 'gemini';
        }
      } catch (geminiErr) {
        console.warn('Gemini secondary fallback notice:', geminiErr);
      }
    }

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
