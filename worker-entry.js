import openNextWorker from './.open-next/worker.js';
export * from './.open-next/worker.js';

export default {
  async fetch(request, env, ctx) {
    return openNextWorker.fetch(request, env, ctx);
  },

  async scheduled(event, env, ctx) {
    console.log(`[NewsGrab Cron] Scheduled scrape event triggered at ${new Date().toISOString()}`);
    ctx.waitUntil(
      (async () => {
        try {
          const cronUrl = 'https://newsgrab.internal/api/cron/scrape';
          const cronReq = new Request(cronUrl, {
            method: 'GET',
            headers: {
              'x-cron-trigger': 'true',
              ...(env.CRON_SECRET ? { authorization: `Bearer ${env.CRON_SECRET}` } : {})
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
