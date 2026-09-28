import { NextResponse } from 'next/server';
import { getCloudflareEnv } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env = await getCloudflareEnv();
  const keys = env ? Object.keys(env) : [];
  const hasKv = Boolean(env?.NEWS_CACHE);
  const hasDb = Boolean(env?.DB);

  let kvTestResult = 'not-run';
  if (env?.NEWS_CACHE) {
    try {
      await env.NEWS_CACHE.put('test_key', 'hello_from_kv', { expirationTtl: 300 });
      const readVal = await env.NEWS_CACHE.get('test_key');
      kvTestResult = `success: read back "${readVal}"`;
    } catch (err) {
      kvTestResult = `error: ${(err as Error).message}`;
    }
  }

  return NextResponse.json({
    envAvailable: Boolean(env),
    bindingsFound: keys,
    hasKv,
    hasDb,
    kvTestResult
  });
}
