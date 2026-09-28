import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface CloudflareBindings {
  NEWS_CACHE?: {
    get: (key: string, type?: 'text' | 'json') => Promise<any>;
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };
  DB?: {
    prepare: (query: string) => {
      bind: (...args: any[]) => {
        all: <T = any>() => Promise<{ results: T[]; success: boolean }>;
        first: <T = any>(colName?: string) => Promise<T | null>;
        run: () => Promise<{ success: boolean; meta: any }>;
      };
    };
  };
  NEXT_PUBLIC_ADSENSE_CLIENT_ID?: string;
  NEXT_PUBLIC_ADSENSE_PUB_ID?: string;
  CRON_SECRET?: string;
}

/**
 * Safely retrieves Cloudflare Worker environment bindings (KV, D1, Environment variables)
 * Returns null if executed during build-time static generation or outside Cloudflare runtime.
 */
export async function getCloudflareEnv(): Promise<CloudflareBindings | null> {
  try {
    const context = await getCloudflareContext({ async: true });
    return (context?.env as CloudflareBindings) || null;
  } catch {
    return null;
  }
}
