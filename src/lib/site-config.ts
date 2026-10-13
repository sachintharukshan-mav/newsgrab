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
    return 'https://lankadispatch.com';
  }

  // Local development fallback
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  return 'https://lankadispatch.com';
}
