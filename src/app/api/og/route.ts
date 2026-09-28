import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharsPerLine = 42, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines - 1) break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawTitle = searchParams.get('title') || 'NEWSGRAB — The Sri Lankan Dispatch & Intelligence Desk';
  const rawCategory = (searchParams.get('category') || 'INTELLIGENCE').toUpperCase();
  const rawPublisher = searchParams.get('pub') || 'NEWSGRAB WIRE';
  const rawRegion = (searchParams.get('region') || 'SRI LANKA').toUpperCase();

  const titleLines = wrapText(rawTitle, 40, 3);
  const escapedCategory = escapeXml(rawCategory);
  const escapedPublisher = escapeXml(rawPublisher);
  const escapedRegion = escapeXml(rawRegion);

  const tspanLines = titleLines
    .map((line, idx) => `<tspan x="80" dy="${idx === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0d12" />
      <stop offset="50%" stop-color="#0f1118" />
      <stop offset="100%" stop-color="#151722" />
    </linearGradient>

    <!-- Crimson Glow Accent -->
    <radialGradient id="roseGlow" cx="20%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#e11d48" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Amber Glow Accent -->
    <radialGradient id="amberGlow" cx="85%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#roseGlow)" />
  <rect width="1200" height="630" fill="url(#amberGlow)" />

  <!-- Outer Border Frame -->
  <rect x="30" y="30" width="1140" height="570" rx="16" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />

  <!-- Top Header Bar -->
  <g transform="translate(80, 85)">
    <!-- Red Broadcast Dot -->
    <circle cx="10" cy="10" r="7" fill="#f43f5e" />
    <circle cx="10" cy="10" r="13" fill="none" stroke="#f43f5e" stroke-opacity="0.4" stroke-width="2" />
    
    <text x="32" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#fda4af" letter-spacing="2">
      LIVE INTELLIGENCE NETWORK
    </text>

    <text x="1040" y="16" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="14" fill="#9ca3af" letter-spacing="1.5">
      COLOMBO BUREAU // ${escapedRegion}
    </text>
  </g>

  <!-- Horizontal Divider Line -->
  <line x1="80" y1="125" x2="1120" y2="125" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <!-- Category Badge -->
  <g transform="translate(80, 165)">
    <rect width="130" height="32" rx="6" fill="rgba(225, 29, 72, 0.2)" stroke="rgba(244, 63, 94, 0.4)" stroke-width="1.2" />
    <text x="65" y="21" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" font-weight="800" fill="#fecdd3" letter-spacing="1.5">
      ${escapedCategory}
    </text>
  </g>

  <!-- Headline -->
  <text x="80" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800" fill="#f3f4f6" line-height="1.25">
    ${tspanLines}
  </text>

  <!-- Bottom Divider Line -->
  <line x1="80" y1="500" x2="1120" y2="500" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

  <!-- Bottom Footer Metadata -->
  <g transform="translate(80, 545)">
    <!-- Source Attribution -->
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#e5e7eb">
      SOURCE: <tspan fill="#38bdf8" font-weight="700">${escapedPublisher}</tspan>
    </text>

    <!-- NewsGrab Brand Tag -->
    <text x="1040" y="0" text-anchor="end" font-family="ui-monospace, monospace" font-size="16" font-weight="700" fill="#f43f5e" letter-spacing="1.5">
      NEWSGRAB.LK // 24/7 WIRE
    </text>
  </g>
</svg>
  `.trim();

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    }
  });
}
