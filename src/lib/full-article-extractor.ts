import { extract } from '@extractus/article-extractor';

const MAX_CACHE_ENTRIES = 200;

const articleBodyCache = new Map<string, {
  title?: string;
  content: string;
  author?: string;
  published?: string;
  image?: string;
}>();

function setCache(url: string, data: { title?: string; content: string; author?: string; published?: string; image?: string }) {
  if (articleBodyCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = articleBodyCache.keys().next().value;
    if (oldestKey) articleBodyCache.delete(oldestKey);
  }
  articleBodyCache.set(url, data);
}

interface ExtractedArticle {
  title?: string;
  content?: string;
  author?: string;
  published?: string;
  image?: string;
}

export async function fetchFullArticle(url: string, fallbackText: string = ''): Promise<{
  title?: string;
  content: string;
  rawFullText?: string;
  author?: string;
  published?: string;
  image?: string;
}> {
  if (!url || url === '#' || !url.startsWith('http')) {
    return { content: fallbackText };
  }

  if (articleBodyCache.has(url)) {
    return articleBodyCache.get(url)!;
  }

  // Fast-path fallback for syndicated Google News / Cloudflare protected URLs to avoid hanging
  if (url.includes('news.google.com') || url.includes('dailymirror.lk') || url.includes('newsfirst.lk')) {
    const rawParagraphs = fallbackText
      ? fallbackText.split(/[\.\n]\s*/).filter(s => s.trim().length > 10).map(s => `<p class="mb-4 leading-relaxed">${s.trim()}${s.endsWith('.') ? '' : '.'}</p>`).join('')
      : '<p class="mb-4 leading-relaxed">Full dispatch report is being syndicated directly from the newsroom wire.</p>';
    const fallback = { content: rawParagraphs };
    setCache(url, fallback);
    return fallback;
  }

  // Dedicated parser for Ada Derana (both English and Sinhala)
  if (url.includes('adaderana.lk')) {
    try {
      const fetchUrl = url.includes('sinhala.adaderana.lk') ? url.replace('https://sinhala', 'http://sinhala') : url;
      const res = await fetch(fetchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const html = await res.text();
        const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];

        // Isolate genuine article container to avoid "Most Read" / sidebar / trending news contamination
        let articleChunk = '';
        const proseMatch = html.match(/<div[^>]*class=["'][^"']*\bprose\b[^"']*["'][\s\S]*?<\/div>\s*<\/div>/i);
        const articleTagMatch = html.match(/<article[\s\S]*?<\/article>/i);
        const newsContentMatch = html.match(/<div[^>]*class=["'][^"']*\b(news-content|story-text)\b[^"']*["'][\s\S]*?<\/div>/i);

        if (proseMatch) {
          articleChunk = proseMatch[0];
        } else if (articleTagMatch) {
          articleChunk = articleTagMatch[0];
        } else if (newsContentMatch) {
          articleChunk = newsContentMatch[0];
        }

        if (articleChunk) {
          // Remove sub-elements that contain sidebars, social buttons, or "most read" widgets
          articleChunk = articleChunk
            .replace(/<aside[\s\S]*?<\/aside>/gi, '')
            .replace(/<div[^>]*class=["'][^"']*(?:most-read|trending|related|sidebar|share|banner|ad-|whatsapp)[\s\S]*?<\/div>/gi, '');

          const pTags = articleChunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
          const seen = new Set<string>();
          const cleanParagraphs = pTags
            .map(p => p.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(p => {
              if (p.length < 25) return false;
              // Filter out noise, social widgets, promotional labels, or "Most Read" headings
              if (/^(share|tweet|whatsapp|facebook|google news|add ada derana|most read|top stories|related news|trending|breaking news)/i.test(p)) {
                return false;
              }
              if (p.includes('©') || /^all rights reserved/i.test(p) || p.includes('GoogleAdd')) {
                return false;
              }
              // Deduplicate identical or teaser paragraphs
              const norm = p.toLowerCase().slice(0, 45);
              if (seen.has(norm)) return false;
              seen.add(norm);
              return true;
            });

          if (cleanParagraphs.length > 0) {
            // Return 2-3 paragraphs under statutory Fair Dealing limits
            const content = cleanParagraphs.slice(0, 3).map(p => `<p class="mb-4 leading-relaxed">${p}</p>`).join('');
            const rawFullText = cleanParagraphs.join('\n\n');
            const result = { content, rawFullText, image: ogImg };
            setCache(url, result);
            return result;
          }
        }
      }
    } catch {
      // Gracefully continue to generic extractor
    }
  }

  // Dedicated parser for Hiru News (English, Sinhala, Tamil)
  if (url.includes('hirunews.lk')) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const html = await res.text();
        const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
          || html.match(/src=["'](https:\/\/cdn\.hirunews\.lk\/Data\/News_Images\/[^"']+)["']/i)?.[1];

        // Hiru renders article text inside #this-article or .description-content
        const thisArticleMatch = html.match(/<div[^>]*id=["']this-article["'][^>]*>([\s\S]*?)<\/div>/i)
          || html.match(/<div[^>]*class=["'][^"']*\bdescription-content\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

        if (thisArticleMatch) {
          const raw = thisArticleMatch[1];
          const cleanParagraphs = raw
            .split(/<br\s*\/?>|<p[^>]*>|<\/p>/gi)
            .map(p => p.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(p => p.length > 20 && !p.includes('©') && !p.includes('Hiru News') && !p.includes('Latest News') && !p.includes('විபரங்களுக்கு'));

          if (cleanParagraphs.length > 0) {
            // Return 2-3 paragraphs under statutory Fair Dealing limits
            const content = cleanParagraphs.slice(0, 3).map(p => `<p class="mb-4 leading-relaxed">${p}</p>`).join('');
            const rawFullText = cleanParagraphs.join('\n\n');
            const result = { content, rawFullText, image: ogImg };
            setCache(url, result);
            return result;
          }
        }
      }
    } catch {
      // Gracefully continue to generic extractor
    }
  }

  try {
    // 3.5-second timeout to prevent hanging on slow external publishers
    const extractPromise = extract(url);
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Article extraction timeout')), 3500)
    );

    const extracted = (await Promise.race([extractPromise, timeoutPromise])) as ExtractedArticle | null;

    if (extracted && extracted.content && extracted.content.trim().length > 100) {
      // Clean unwanted scripts/styles, event handlers, and "Most Read" / Related story blocks from extracted HTML
      const cleanHtml = extracted.content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
        .replace(/<(?:div|section|aside|ul|ol)[^>]*class=["'][^"']*(?:most-read|related-articles|trending-stories|sidebar|popular-posts|more-news)[^"']*["'][\s\S]*?<\/(?:div|section|aside|ul|ol)>/gi, '')
        .replace(/<(?:h[2-6]|p|strong|b)[^>]*>(?:\s*|\W*)(?:Most Read|Top Stories|Related Stories|Related News|Trending|Recommended Stories|You May Also Like)(?:\s*|\W*)<\/(?:h[2-6]|p|strong|b)>[\s\S]*$/gi, '');

      const result = {
        title: extracted.title,
        content: cleanHtml,
        author: extracted.author,
        published: extracted.published,
        image: extracted.image
      };

      setCache(url, result);
      return result;
    }
  } catch {
    // Gracefully handled by fallback below
  }

  // Graceful fallback to provided summary if direct extraction fails
  const paragraphs = fallbackText
    ? fallbackText.split(/[\.\n]\s*/).filter(s => s.trim().length > 10).map(s => `<p class="mb-4 leading-relaxed">${s.trim()}${s.endsWith('.') ? '' : '.'}</p>`).join('')
    : '<p class="mb-4 leading-relaxed">Full dispatch report is being processed from the newsroom wire.</p>';
  const fallback = { content: paragraphs };
  setCache(url, fallback);
  return fallback;
}
