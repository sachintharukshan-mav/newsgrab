/**
 * Outbound fetch allowlist for the article extraction / synthesis endpoints.
 *
 * `/api/article` and `/api/synthesize` fetch a URL supplied in the query string.
 * Without an allowlist, they act as an open proxy (anyone could make our Worker
 * fetch arbitrary sites and burn Gemini quota). String-based private-IP filters are
 * also easy to bypass (decimal/hex IPs, IPv6, DNS rebinding, redirects), so instead
 * we only accept hosts belonging to the newsrooms we actually syndicate.
 *
 * Keep this list in sync with the feeds in `rss-parser.ts` / `news-service.ts`.
 */
const ALLOWED_PUBLISHER_DOMAINS = [
  'adaderana.lk',
  'hirunews.lk',
  'dailymirror.lk',
  'newsfirst.lk',
  'ft.lk',
  'economynext.com',
  'virakesari.lk',
  'newswire.lk',
  'island.lk',
  'srilankamirror.com',
  'lankabusinessonline.com',
  'readme.lk',
  'bbc.co.uk',
  'bbc.com',
  'theguardian.com',
  'reuters.com',
  // Google News RSS item links redirect to the publisher's article.
  'news.google.com'
] as const;

/** Maximum length accepted for a source URL query parameter. */
const MAX_URL_LENGTH = 2048;

/**
 * Returns true only for https/http URLs whose hostname is (or is a subdomain of)
 * an allowlisted publisher domain, on the default port, without embedded credentials.
 */
export function isAllowedPublisherUrl(rawUrl: string): boolean {
  if (!rawUrl || rawUrl.length > MAX_URL_LENGTH) return false;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
  if (parsed.username || parsed.password) return false;
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') return false;

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
  return ALLOWED_PUBLISHER_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

/** Trims and clamps a free-text query parameter to a safe maximum length. */
export function clampParam(value: string | null, maxLength: number, fallback = ''): string {
  if (!value) return fallback;
  return value.trim().slice(0, maxLength);
}
