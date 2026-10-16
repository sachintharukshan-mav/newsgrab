import { GET as apiRssGet } from '@/app/api/rss/route';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return apiRssGet(request);
}
