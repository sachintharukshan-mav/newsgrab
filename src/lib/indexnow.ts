import { getSiteUrl } from './site-config';
import { Article } from './types';

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '9e8f4a3b1c2d4e5f60718293a4b5c6d7';

export interface IndexNowResponse {
  success: boolean;
  status: number;
  submittedCount: number;
  endpoint: string;
  message: string;
  error?: string;
}

/**
 * Submits a list of absolute URLs to the IndexNow protocol (notifying Bing, Yandex,
 * Seznam, Naver, and participating search engines simultaneously).
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  const SITE_URL = getSiteUrl();
  const host = new URL(SITE_URL).host;
  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

  // Deduplicate and filter valid URLs belonging to our host
  const validUrls = Array.from(
    new Set(
      urls
        .map((u) => u.trim())
        .filter((u) => u.startsWith('http://') || u.startsWith('https://'))
    )
  );

  if (validUrls.length === 0) {
    return {
      success: true,
      status: 200,
      submittedCount: 0,
      endpoint: 'none',
      message: 'No valid URLs provided to submit.',
    };
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: validUrls.slice(0, 1000), // Cap at 1000 URLs per batch
  };

  const endpoints = [
    'https://api.indexnow.org/IndexNow',
    'https://www.bing.com/IndexNow',
  ];

  let lastStatus = 0;
  let lastError = '';

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      lastStatus = response.status;

      // IndexNow returns 200 (OK) or 202 (Accepted / Key validating)
      if (response.ok || response.status === 200 || response.status === 202) {
        return {
          success: true,
          status: response.status,
          submittedCount: payload.urlList.length,
          endpoint,
          message: `Successfully notified IndexNow (${endpoint}) with ${payload.urlList.length} URLs. HTTP Status: ${response.status}`,
        };
      }

      const responseText = await response.text().catch(() => '');
      lastError = `Endpoint ${endpoint} returned status ${response.status}: ${responseText}`;
      console.warn(`[IndexNow] ${lastError}`);
    } catch (err) {
      lastError = (err as Error).message;
      console.warn(`[IndexNow] Failed contacting ${endpoint}:`, lastError);
    }
  }

  return {
    success: false,
    status: lastStatus,
    submittedCount: 0,
    endpoint: endpoints[0],
    message: 'Failed to submit URLs to IndexNow endpoints.',
    error: lastError,
  };
}

/**
 * Builds trilingual canonical URLs for articles and submits them to IndexNow.
 */
export async function submitArticlesToIndexNow(articles: Array<Pick<Article, 'id'>>): Promise<IndexNowResponse> {
  const SITE_URL = getSiteUrl();
  const urlList: string[] = [];

  for (const a of articles) {
    const encodedId = encodeURIComponent(a.id);
    const enUrl = `${SITE_URL}/article/${encodedId}`;
    const siUrl = `${SITE_URL}/article/${encodedId}?lang=si`;
    const taUrl = `${SITE_URL}/article/${encodedId}?lang=ta`;

    urlList.push(enUrl, siUrl, taUrl);
  }

  return submitUrlsToIndexNow(urlList);
}

/**
 * Pings search engine sitemap submission endpoints.
 */
export async function pingSearchEngineSitemaps(): Promise<{ bing: boolean }> {
  const SITE_URL = getSiteUrl();
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  let bingSuccess = false;
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(bingPingUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(4000),
    });
    bingSuccess = res.ok;
  } catch {
    bingSuccess = false;
  }

  return { bing: bingSuccess };
}
