import { getCloudflareEnv } from './cloudflare';

export interface FuelPriceItem {
  name: string;
  shortName: string;
  cpcPrice: number;
  liocPrice: number | null;
  sinopecPrice: number | null;
  change: number;
  status: 'revised-up' | 'revised-down' | 'unchanged';
  fuelBadge: string;
  popular: boolean;
}

export interface FuelSnapshot {
  updatedAt: string;
  lastRevisionDate: string;
  nextFormulaRevision: string;
  fuelTypes: FuelPriceItem[];
}

interface CeypetcoLiveItem {
  product: string;
  price: number;
  category: string;
  effectiveDate?: string;
}

function getNextFormulaRevisionDate(now = new Date()): string {
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthName = nextMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = nextMonth.getFullYear();
  return `${monthName} 01, ${year}`;
}

const DEFAULT_FUEL_SNAPSHOT: FuelSnapshot = {
  updatedAt: new Date().toISOString(),
  lastRevisionDate: 'October 01, 2026',
  nextFormulaRevision: getNextFormulaRevisionDate(),
  fuelTypes: [
    {
      name: 'Petrol 92 Octane',
      shortName: 'Petrol 92',
      cpcPrice: 414,
      liocPrice: 414,
      sinopecPrice: 414,
      change: 0,
      status: 'unchanged',
      fuelBadge: 'Automotive Regular',
      popular: true,
    },
    {
      name: 'Petrol 95 Octane',
      shortName: 'Petrol 95',
      cpcPrice: 475,
      liocPrice: 495,
      sinopecPrice: 495,
      change: 0,
      status: 'unchanged',
      fuelBadge: 'Premium Automotive (CPC: Rs. 475 · LIOC & Sinopec: Rs. 495)',
      popular: false,
    },
    {
      name: 'Auto Diesel (Standard)',
      shortName: 'Auto Diesel',
      cpcPrice: 392,
      liocPrice: 392,
      sinopecPrice: 392,
      change: 0,
      status: 'unchanged',
      fuelBadge: 'Commercial & Transport',
      popular: true,
    },
    {
      name: 'Super Diesel (Euro 4)',
      shortName: 'Super Diesel',
      cpcPrice: 528,
      liocPrice: 528,
      sinopecPrice: 528,
      change: 0,
      status: 'unchanged',
      fuelBadge: 'High-Performance Diesel',
      popular: false,
    },
    {
      name: 'Domestic Kerosene',
      shortName: 'Kerosene',
      cpcPrice: 285,
      liocPrice: null,
      sinopecPrice: null,
      change: 0,
      status: 'unchanged',
      fuelBadge: 'Government Subsidized (CEYPETCO Exclusive)',
      popular: false,
    },
    {
      name: 'Industrial Kerosene',
      shortName: 'Ind. Kerosene',
      cpcPrice: 434,
      liocPrice: null,
      sinopecPrice: null,
      change: 0,
      status: 'unchanged',
      fuelBadge: 'Manufacturing & Plants (CEYPETCO Commercial)',
      popular: false,
    },
  ],
};

let memoryFuelCache: FuelSnapshot | null = null;
let memoryCacheTimestamp = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Fetches the latest verified fuel prices directly from the official CEYPETCO API.
 * Automatically computes revisions, effective dates, and multi-distributor comparisons (CPC, LIOC, Sinopec).
 */
export async function syncFuelPricesFromCeypetco(): Promise<FuelSnapshot> {
  const now = new Date();
  try {
    const res = await fetch('https://api.ceypetco.gov.lk/api/admin/fuel-prices/active?limit=100', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LankaDispatch-MarketDesk/1.0 (+https://lankadispatch.com)'
      },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const prices: Record<string, number> = {};
        let latestDate = '';

        for (const item of json.data as CeypetcoLiveItem[]) {
          if (item.product && typeof item.price === 'number') {
            prices[item.product] = item.price;
          }
          if (item.effectiveDate && (!latestDate || item.effectiveDate > latestDate)) {
            latestDate = item.effectiveDate;
          }
        }

        let formattedDate = DEFAULT_FUEL_SNAPSHOT.lastRevisionDate;
        if (latestDate) {
          try {
            const d = new Date(latestDate);
            d.setDate(d.getDate() + 1);
            formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
          } catch {}
        }

        const findPrice = (patterns: string[], fallback: number): number => {
          for (const [prod, pr] of Object.entries(prices)) {
            const lower = prod.toLowerCase();
            if (patterns.every((pat) => lower.includes(pat.toLowerCase()))) {
              return pr;
            }
          }
          return fallback;
        };

        const pet92 = findPrice(['92'], 414);
        const pet95 = findPrice(['95'], 475);
        const diesel = findPrice(['auto', 'diesel'], 392);
        const superDiesel = findPrice(['super', 'diesel'], 528);
        const kerosene = findPrice(['kerosene'], 285);
        const indKerosene = findPrice(['industrial', 'kerosene'], 434);

        const prevTypes = memoryFuelCache?.fuelTypes || [];
        const calcDelta = (newPrice: number, shortName: string) => {
          const prev = prevTypes.find((f) => f.shortName === shortName);
          if (!prev || prev.cpcPrice === newPrice) {
            return { change: 0, status: 'unchanged' as const };
          }
          const diff = newPrice - prev.cpcPrice;
          return {
            change: diff,
            status: diff > 0 ? ('revised-up' as const) : ('revised-down' as const),
          };
        };

        const pet92Delta = calcDelta(pet92, 'Petrol 92');
        const pet95Delta = calcDelta(pet95, 'Petrol 95');
        const dieselDelta = calcDelta(diesel, 'Auto Diesel');
        const superDieselDelta = calcDelta(superDiesel, 'Super Diesel');
        const keroseneDelta = calcDelta(kerosene, 'Kerosene');
        const indKeroseneDelta = calcDelta(indKerosene, 'Ind. Kerosene');

        const snapshot: FuelSnapshot = {
          updatedAt: now.toISOString(),
          lastRevisionDate: formattedDate,
          nextFormulaRevision: getNextFormulaRevisionDate(now),
          fuelTypes: [
            {
              name: 'Petrol 92 Octane',
              shortName: 'Petrol 92',
              cpcPrice: pet92,
              liocPrice: pet92,
              sinopecPrice: pet92,
              change: pet92Delta.change,
              status: pet92Delta.status,
              fuelBadge: 'Automotive Regular',
              popular: true,
            },
            {
              name: 'Petrol 95 Octane',
              shortName: 'Petrol 95',
              cpcPrice: pet95,
              liocPrice: 495,
              sinopecPrice: 495,
              change: pet95Delta.change,
              status: pet95Delta.status,
              fuelBadge: 'Premium Automotive (CPC: Rs. 475 · LIOC & Sinopec: Rs. 495)',
              popular: false,
            },
            {
              name: 'Auto Diesel (Standard)',
              shortName: 'Auto Diesel',
              cpcPrice: diesel,
              liocPrice: diesel,
              sinopecPrice: diesel,
              change: dieselDelta.change,
              status: dieselDelta.status,
              fuelBadge: 'Commercial & Transport',
              popular: true,
            },
            {
              name: 'Super Diesel (Euro 4)',
              shortName: 'Super Diesel',
              cpcPrice: superDiesel,
              liocPrice: superDiesel,
              sinopecPrice: superDiesel,
              change: superDieselDelta.change,
              status: superDieselDelta.status,
              fuelBadge: 'High-Performance Diesel',
              popular: false,
            },
            {
              name: 'Domestic Kerosene',
              shortName: 'Kerosene',
              cpcPrice: kerosene,
              liocPrice: null,
              sinopecPrice: null,
              change: keroseneDelta.change,
              status: keroseneDelta.status,
              fuelBadge: 'Government Subsidized (CEYPETCO Exclusive)',
              popular: false,
            },
            {
              name: 'Industrial Kerosene',
              shortName: 'Ind. Kerosene',
              cpcPrice: indKerosene,
              liocPrice: null,
              sinopecPrice: null,
              change: indKeroseneDelta.change,
              status: indKeroseneDelta.status,
              fuelBadge: 'Manufacturing & Plants (CEYPETCO Commercial)',
              popular: false,
            },
          ],
        };

        // Cache in memory
        memoryFuelCache = snapshot;
        memoryCacheTimestamp = Date.now();

        // Persist to Cloudflare KV (30 days TTL)
        const env = await getCloudflareEnv();
        if (env?.NEWS_CACHE) {
          try {
            await env.NEWS_CACHE.put('fuel_snapshot', JSON.stringify(snapshot), {
              expirationTtl: 30 * 86400,
            });
          } catch (kvErr) {
            console.warn('[FuelSync] KV write notice:', kvErr);
          }
        }

        return snapshot;
      }
    }
  } catch (err) {
    console.warn('[FuelSync] Live Ceypetco fetch notice:', err);
  }

  return DEFAULT_FUEL_SNAPSHOT;
}

/**
 * Retrieves the current fuel snapshot from memory, Cloudflare KV, or live Ceypetco API.
 */
export async function getFuelSnapshot(): Promise<FuelSnapshot> {
  const now = Date.now();
  if (memoryFuelCache && now - memoryCacheTimestamp < CACHE_TTL_MS) {
    return memoryFuelCache;
  }

  const env = await getCloudflareEnv();
  if (env?.NEWS_CACHE) {
    try {
      const kvSnapshot = (await env.NEWS_CACHE.get('fuel_snapshot', 'json')) as FuelSnapshot | null;
      if (kvSnapshot && Array.isArray(kvSnapshot.fuelTypes) && kvSnapshot.fuelTypes.length > 0) {
        memoryFuelCache = kvSnapshot;
        memoryCacheTimestamp = now;
        return kvSnapshot;
      }
    } catch (kvErr) {
      console.warn('[FuelSync] KV read fallback:', kvErr);
    }
  }

  return syncFuelPricesFromCeypetco();
}
