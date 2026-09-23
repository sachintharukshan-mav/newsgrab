import { NextResponse } from 'next/server';
import { mockMarketPulse } from '@/lib/mock-data';
import { MarketPulse } from '@/lib/types';

export const dynamic = 'force-dynamic';

let cachedPulse: MarketPulse | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

function getWeatherDescription(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Clear Sky', icon: 'Sun' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { condition: 'Overcast', icon: 'Cloud' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { condition: 'Light Drizzle', icon: 'CloudRain' };
  if (code >= 61 && code <= 65) return { condition: 'Rain', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { condition: 'Showers', icon: 'CloudRain' };
  if (code >= 95) return { condition: 'Thunderstorm', icon: 'CloudLightning' };
  return { condition: 'Partly Cloudy', icon: 'CloudSun' };
}

async function fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 900 }
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function GET() {
  const now = Date.now();

  // Return cached pulse if within TTL
  if (cachedPulse && now - lastFetchTime < CACHE_TTL_MS) {
    return NextResponse.json(cachedPulse, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800'
      }
    });
  }

  try {
    const [fxSettled, goldSettled, weatherSettled] = await Promise.allSettled([
      fetchWithTimeout('https://open.er-api.com/v6/latest/USD'),
      fetchWithTimeout('https://api.gold-api.com/price/XAU'),
      fetchWithTimeout('https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current_weather=true')
    ]);

    // 1. Process FX Rates
    let cbslRates = mockMarketPulse.cbslRates;
    let usdLkr = 305.0; // fallback reference

    if (fxSettled.status === 'fulfilled' && fxSettled.value.ok) {
      const fxData = await fxSettled.value.json();
      const rates = fxData.rates;

      if (rates && rates.LKR) {
        usdLkr = rates.LKR;
        const eurRate = rates.EUR ? (1 / rates.EUR) * usdLkr : 330;
        const gbpRate = rates.GBP ? (1 / rates.GBP) * usdLkr : 395;
        const audRate = rates.AUD ? (1 / rates.AUD) * usdLkr : 202;
        const aedRate = rates.AED ? usdLkr / rates.AED : 83;

        cbslRates = [
          {
            code: 'USD',
            name: 'US Dollar',
            buyRate: Number((usdLkr * 0.985).toFixed(2)),
            sellRate: Number((usdLkr * 1.015).toFixed(2)),
            change24h: -0.12
          },
          {
            code: 'EUR',
            name: 'Euro',
            buyRate: Number((eurRate * 0.982).toFixed(2)),
            sellRate: Number((eurRate * 1.018).toFixed(2)),
            change24h: 0.28
          },
          {
            code: 'GBP',
            name: 'British Pound',
            buyRate: Number((gbpRate * 0.982).toFixed(2)),
            sellRate: Number((gbpRate * 1.018).toFixed(2)),
            change24h: 0.15
          },
          {
            code: 'AUD',
            name: 'Australian Dollar',
            buyRate: Number((audRate * 0.980).toFixed(2)),
            sellRate: Number((audRate * 1.020).toFixed(2)),
            change24h: -0.08
          },
          {
            code: 'AED',
            name: 'UAE Dirham',
            buyRate: Number((aedRate * 0.988).toFixed(2)),
            sellRate: Number((aedRate * 1.012).toFixed(2)),
            change24h: 0.00
          }
        ];
      }
    }

    // 2. Process Gold Price
    // 1 Troy Ounce = 31.1034768 grams. 1 Sovereign (Pound) = 8g of 24K gold.
    let goldPrice24kPerSovereign = mockMarketPulse.goldPrice24kPerSovereign;
    if (goldSettled.status === 'fulfilled' && goldSettled.value.ok) {
      const goldData = await goldSettled.value.json();
      const spotUsd = goldData.price;
      if (spotUsd && spotUsd > 0) {
        const sovereignLkr = Math.round((spotUsd / 31.1034768) * 8 * usdLkr);
        goldPrice24kPerSovereign = {
          lkr: sovereignLkr,
          change24h: 1450
        };
      }
    }

    // 3. Process Colombo Weather
    let colomboWeather = mockMarketPulse.colomboWeather;
    if (weatherSettled.status === 'fulfilled' && weatherSettled.value.ok) {
      const weatherData = await weatherSettled.value.json();
      const current = weatherData.current_weather;
      if (current && typeof current.temperature === 'number') {
        const desc = getWeatherDescription(current.weathercode ?? 1);
        colomboWeather = {
          tempC: Math.round(current.temperature),
          condition: desc.condition,
          icon: desc.icon
        };
      }
    }

    const livePulse: MarketPulse = {
      updatedAt: new Date().toISOString(),
      cbslRates,
      goldPrice24kPerSovereign,
      cseIndex: mockMarketPulse.cseIndex,
      colomboWeather
    };

    cachedPulse = livePulse;
    lastFetchTime = now;

    return NextResponse.json(livePulse, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800'
      }
    });
  } catch (error) {
    console.error('Error fetching live market pulse:', error);
    return NextResponse.json(cachedPulse || mockMarketPulse, {
      headers: {
        'Cache-Control': 'public, s-maxage=300'
      }
    });
  }
}
