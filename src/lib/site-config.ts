/**
 * Centralized site configuration for canonical URLs, SEO, and sitemaps.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // In production builds, never output localhost
  if (process.env.NODE_ENV === 'production') {
    if (envUrl && !envUrl.includes('localhost')) {
      return envUrl.replace(/\/$/, '');
    }
    return 'https://newsgrab.makemytourlk.workers.dev';
  }

  // Local development fallback
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}
