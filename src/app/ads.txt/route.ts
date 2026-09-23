import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rawPubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'pub-1562210028522673';
  const pubId = rawPubId.startsWith('ca-') ? rawPubId.slice(3) : rawPubId;

  const adsTxtContent = `# NewsGrab (newsgrab.lk) - Authorized Digital Sellers (ads.txt)
# Specification: IAB Tech Lab Ads.txt v1.1
# Last Updated: ${new Date().toISOString().split('T')[0]}

# -------------------------------------------------------------
# Google AdSense (Primary Direct Publisher Account)
# -------------------------------------------------------------
google.com, ${pubId}, DIRECT, f08c47fec0942fa0
`;

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
