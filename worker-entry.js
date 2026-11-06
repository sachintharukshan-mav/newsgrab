import openNextWorker from './.open-next/worker.js';
export * from './.open-next/worker.js';

export default {
  async fetch(request, env, ctx) {
    // 1. Fast-path: Only cache GET and HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return openNextWorker.fetch(request, env, ctx);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // 2. Bypass cache for mutations, analytics, AI generation, internal cron, and authenticated requests
    if (
      request.headers.get('authorization') ||
      pathname.startsWith('/api/metrics') ||
      pathname.startsWith('/api/comments') ||
      pathname.startsWith('/api/reactions') ||
      pathname.startsWith('/api/synthesize') ||
      pathname.startsWith('/api/cron/')
    ) {
      return openNextWorker.fetch(request, env, ctx);
    }

    const cache = typeof caches !== 'undefined' ? caches.default : null;
    if (!cache) {
      return openNextWorker.fetch(request, env, ctx);
    }

    // 3. Next.js App Router RSC handling:
    // Client-side router transitions send 'rsc: 1' or 'next-router-prefetch'.
    // To prevent serving RSC payloads to direct browser visits or HTML to client transitions,
    // we use a discriminator query parameter on the edge cache key.
    const isRsc = request.headers.get('rsc') === '1';
    const isPrefetch = request.headers.has('next-router-prefetch');

    let cacheKeyUrl = request.url;
    if (isRsc || isPrefetch) {
      const u = new URL(request.url);
      if (isRsc) u.searchParams.set('__cf_rsc', '1');
      if (isPrefetch) u.searchParams.set('__cf_pre', '1');
      cacheKeyUrl = u.toString();
    }
    const cacheKey = new Request(cacheKeyUrl, {
      method: request.method,
      headers: request.headers
    });

    // 4. Check Edge Cache
    try {
      const cached = await cache.match(cacheKey);
      if (cached) {
        const hitHeaders = new Headers(cached.headers);
        hitHeaders.set('X-Edge-Cache', 'HIT');
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers: hitHeaders
        });
      }
    } catch (cacheErr) {
      console.warn('[NewsGrab Cache] match warning:', cacheErr);
    }

    // 5. Cache Miss: Execute OpenNext Worker
    const response = await openNextWorker.fetch(request, env, ctx);

    // 6. Cache 200 OK responses without Set-Cookie
    if (
      response.status === 200 &&
      !response.headers.get('set-cookie') &&
      request.method === 'GET'
    ) {
      let edgeTtl = 60; // 60s default edge cache for pages and articles
      let swr = 120;

      if (pathname.startsWith('/api/rates')) {
        edgeTtl = 900;
        swr = 1800;
      } else if (pathname.startsWith('/_next/static/') || pathname.startsWith('/images/')) {
        edgeTtl = 86400 * 7;
        swr = 86400;
      } else if (
        pathname.startsWith('/utility/') ||
        pathname.startsWith('/guides/') ||
        pathname.startsWith('/calculators/') ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/privacy') ||
        pathname.startsWith('/terms')
      ) {
        edgeTtl = 300;
        swr = 600;
      } else if (pathname.startsWith('/api/news')) {
        edgeTtl = 60;
        swr = 120;
      }

      const cacheHeaders = new Headers(response.headers);
      cacheHeaders.set(
        'Cache-Control',
        `public, max-age=${Math.min(30, edgeTtl)}, s-maxage=${edgeTtl}, stale-while-revalidate=${swr}`
      );
      cacheHeaders.set('X-Edge-Cache', 'MISS');

      const responseToCache = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: cacheHeaders
      });

      ctx.waitUntil(
        cache.put(cacheKey, responseToCache).catch((err) => {
          console.warn('[NewsGrab Cache] put warning:', err);
        })
      );

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: cacheHeaders
      });
    }

    return response;
  },

  async scheduled(event, env, ctx) {
    console.log(`[NewsGrab Cron] Scheduled scrape event triggered at ${new Date().toISOString()}`);
    ctx.waitUntil(
      (async () => {
        try {
          if (!env.CRON_SECRET) {
            console.error('[NewsGrab Cron] CRON_SECRET is not set. Run `wrangler secret put CRON_SECRET`.');
            return;
          }
          const cronUrl = 'https://newsgrab.internal/api/cron/scrape';
          const cronReq = new Request(cronUrl, {
            method: 'GET',
            headers: {
              authorization: `Bearer ${env.CRON_SECRET}`
            }
          });
          const res = await openNextWorker.fetch(cronReq, env, ctx);
          console.log(`[NewsGrab Cron] Auto-scrape response status: ${res.status}`);
        } catch (err) {
          console.error('[NewsGrab Cron] Auto-scrape failed:', err);
        }
      })()
    );
  }
};
