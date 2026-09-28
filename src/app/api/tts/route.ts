import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Supported high-fidelity broadcast voice locales
export const VOICE_LOCALES = {
  'en-us': { tl: 'en-US', name: 'US Newsroom Anchor' },
  'en-gb': { tl: 'en-GB', name: 'BBC World Correspondent' },
  'en-in': { tl: 'en-IN', name: 'South Asian Wire' },
  'si': { tl: 'si', name: 'Sinhala News Broadcast' },
  'ta': { tl: 'ta', name: 'Tamil News Broadcast' }
} as const;

export type VoiceKey = keyof typeof VOICE_LOCALES;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text')?.trim();
    const voiceKey = (searchParams.get('voice') || 'en-us') as VoiceKey;
    const lang = searchParams.get('lang') || 'en';

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    // Determine target locale
    let targetLocale = VOICE_LOCALES[voiceKey]?.tl || 'en-US';
    if (lang === 'si') {
      targetLocale = 'si';
    } else if (lang === 'ta') {
      targetLocale = 'ta';
    }

    // Clean text: strip special markdown and clamp to safe length
    const cleanText = text
      .replace(/[*_#`~[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);

    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
      targetLocale
    )}&q=${encodeURIComponent(cleanText)}`;

    const upstreamRes = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/'
      }
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: 'Upstream TTS provider responded with error', status: upstreamRes.status },
        { status: 502 }
      );
    }

    const audioBuffer = await upstreamRes.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        'X-TTS-Locale': targetLocale
      }
    });
  } catch (error) {
    console.error('TTS proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to synthesize speech', details: (error as Error).message },
      { status: 500 }
    );
  }
}
