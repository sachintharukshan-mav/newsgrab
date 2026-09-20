import { NextResponse } from 'next/server';
import { mockMarketPulse } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ...mockMarketPulse,
    updatedAt: new Date().toISOString()
  });
}
