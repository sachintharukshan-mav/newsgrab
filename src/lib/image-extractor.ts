const MAX_CACHE_ENTRIES = 300;
const imageCache = new Map<string, string>();

function setImageCache(url: string, imgUrl: string) {
  if (imageCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = imageCache.keys().next().value;
    if (oldest) imageCache.delete(oldest);
  }
  imageCache.set(url, imgUrl);
}

export async function extractArticleImage(url: string): Promise<string | null> {
  if (!url || url === '#' || url.startsWith('http://localhost')) return null;
  if (imageCache.has(url)) return imageCache.get(url)!;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const html = await res.text();

    // 1. Check for standard og:image or twitter:image meta tags
    const metaMatch = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);

    if (metaMatch && metaMatch[1] && !/logo|favicon|icon|avatar|placeholder|default|unsplash\.com/i.test(metaMatch[1])) {
      let imgUrl = metaMatch[1].startsWith('//') ? `https:${metaMatch[1]}` : metaMatch[1];
      imgUrl = imgUrl.replace(/&amp;/g, '&').trim();

      // Upgrade Google UserContent thumbnails to high-definition 1200px broadsheet photography
      if (imgUrl.includes('googleusercontent.com')) {
        imgUrl = imgUrl.replace(/=s\d+.*|=w\d+.*$/, '=s0-w1200');
      }

      setImageCache(url, imgUrl);
      return imgUrl;
    }

    // 2. Check JSON-LD structured data for article image
    const jsonLdMatches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const jm of jsonLdMatches) {
      try {
        const parsed = JSON.parse(jm[1]);
        const candidate = parsed.image?.url || parsed.image || (Array.isArray(parsed.image) ? parsed.image[0] : null);
        if (candidate && typeof candidate === 'string' && candidate.startsWith('http') && !/logo|favicon|avatar|unsplash\.com/i.test(candidate)) {
          let cleanCandidate = candidate.replace(/&amp;/g, '&').trim();
          if (cleanCandidate.includes('googleusercontent.com')) {
            cleanCandidate = cleanCandidate.replace(/=s\d+.*|=w\d+.*$/, '=s0-w1200');
          }
          setImageCache(url, cleanCandidate);
          return cleanCandidate;
        }
      } catch {}
    }

    // 3. Check for specific publisher CDNs (Hiru CDN, Ada Derana S3 bucket, WordPress uploads)
    const cdnMatch = html.match(/https:\/\/cdn\.hirunews\.lk\/Data\/News_Images\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)/i)
      || html.match(/https:\/\/[^"'<>\s]+\.(?:s3\.amazonaws\.com|s3\.[^"'\s<>]+\.amazonaws\.com)\/articles\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)/i)
      || html.match(/https?:\/\/[^"'<>\s]+\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)/i);
    if (cdnMatch && cdnMatch[0]) {
      const cleanCdn = cdnMatch[0].replace(/&amp;/g, '&').trim();
      setImageCache(url, cleanCdn);
      return cleanCdn;
    }

    return null;
  } catch {
    return null;
  }
}
