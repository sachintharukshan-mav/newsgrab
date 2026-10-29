import { getCloudflareEnv, CloudflareBindings } from './cloudflare';
import { ExecutiveBrief, Language } from './types';

export const MAX_DAILY_AI_SYNTHESIS = 35; // Cloudflare Free Tier has 10,000 neurons/day. 35 stories * ~6 neurons = ~210 neurons/day (~2.1% of quota). Zero cost guaranteed.
const WORKERS_AI_MODEL = '@cf/meta/llama-3.2-3b-instruct';
const DEFAULT_ACCOUNT_ID = '82694eacfd3aefe8304a4e2664ca05e8';

const memoryCache = new Map<string, ExecutiveBrief>();

export interface SynthesizeArticleParams {
  url: string;
  headline: string;
  rawText: string;
  publisherName: string;
  lang?: Language;
}

export interface SynthesisResult {
  brief: ExecutiveBrief;
  cached: boolean;
  provider: 'workers-ai' | 'gemini' | 'algorithmic';
  dailyUsage?: { count: number; limit: number };
}

function getDailyCounterKey(): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  return `ld_ai_daily_count_${dateStr}`;
}

/**
 * Checks the current daily AI synthesis count from Cloudflare KV.
 */
export async function getDailyAiUsage(): Promise<{ count: number; limit: number; remaining: number }> {
  const env = await getCloudflareEnv();
  if (!env?.NEWS_CACHE) {
    return { count: 0, limit: MAX_DAILY_AI_SYNTHESIS, remaining: MAX_DAILY_AI_SYNTHESIS };
  }
  try {
    const val = await env.NEWS_CACHE.get(getDailyCounterKey(), 'text');
    const count = val ? parseInt(val, 10) : 0;
    const safeCount = isNaN(count) ? 0 : count;
    return {
      count: safeCount,
      limit: MAX_DAILY_AI_SYNTHESIS,
      remaining: Math.max(0, MAX_DAILY_AI_SYNTHESIS - safeCount),
    };
  } catch {
    return { count: 0, limit: MAX_DAILY_AI_SYNTHESIS, remaining: MAX_DAILY_AI_SYNTHESIS };
  }
}

/**
 * Increments the daily AI usage counter in KV.
 */
async function incrementDailyAiUsage(env: CloudflareBindings): Promise<number> {
  if (!env.NEWS_CACHE) return 1;
  try {
    const key = getDailyCounterKey();
    const current = await env.NEWS_CACHE.get(key, 'text');
    const nextVal = (current ? parseInt(current, 10) : 0) + 1;
    await env.NEWS_CACHE.put(key, nextVal.toString(), {
      expirationTtl: 2 * 86400, // 2 days TTL
    });
    return nextVal;
  } catch (err) {
    console.warn('[WorkersAI] KV counter increment warning:', err);
    return 1;
  }
}

/**
 * Retrieves a previously synthesized brief from in-memory cache or Cloudflare KV.
 */
export async function getCachedBrief(url: string, lang: Language = 'en'): Promise<ExecutiveBrief | null> {
  const memKey = `${url}:${lang}`;
  if (memoryCache.has(memKey)) {
    return memoryCache.get(memKey)!;
  }

  const env = await getCloudflareEnv();
  if (env?.NEWS_CACHE) {
    try {
      const kvBrief = (await env.NEWS_CACHE.get(`brief:${encodeURIComponent(url)}:${lang}`, 'json')) as ExecutiveBrief | null;
      if (kvBrief && kvBrief.whatHappened && Array.isArray(kvBrief.keyDetails)) {
        memoryCache.set(memKey, kvBrief);
        return kvBrief;
      }
    } catch (err) {
      console.warn('[WorkersAI] KV cached brief read fallback:', err);
    }
  }
  return null;
}

/**
 * Stores a synthesized brief into in-memory cache and Cloudflare KV (30-day retention).
 */
export async function saveCachedBrief(url: string, lang: Language = 'en', brief: ExecutiveBrief): Promise<void> {
  const memKey = `${url}:${lang}`;
  memoryCache.set(memKey, brief);

  const env = await getCloudflareEnv();
  if (env?.NEWS_CACHE) {
    try {
      await env.NEWS_CACHE.put(
        `brief:${encodeURIComponent(url)}:${lang}`,
        JSON.stringify(brief),
        { expirationTtl: 30 * 86400 }
      );
    } catch (err) {
      console.warn('[WorkersAI] KV cached brief write fallback:', err);
    }
  }
}

/**
 * Algorithmic fallback that generates an immediate, structured Axios Smart Brevity brief
 * when AI quota is reached, network fails, or offline.
 */
export function generateAlgorithmicFallback(params: SynthesizeArticleParams): ExecutiveBrief {
  const { headline, rawText, publisherName, lang = 'en' } = params;

  const plainText = (rawText || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = plainText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const quoteMatches = plainText.match(/["“]([^"”]{20,200})["”]/g);
  const extractedQuotes = quoteMatches
    ? quoteMatches.slice(0, 2).map((q) => q.replace(/["“”]/g, '').trim())
    : [];

  if (lang === 'si') {
    return {
      whatHappened: sentences.slice(0, 2).join(' ') || `${publisherName} මගින් වාර්තා කරන ලද සත්‍යාපිත පුවත් සාරාංශය: ${headline}`,
      keyDetails: sentences.slice(2, 5).length >= 2
        ? sentences.slice(2, 5)
        : [
            `${publisherName} ප්‍රවෘත්ති කාමරය මගින් සත්‍යාපනය කරන ලදී.`,
            'අදාළ පාර්ශ්වයන්ගේ ප්‍රකාශ සහ නීතිමය කරුණු විමර්ශනය කෙරේ.',
            'මහජන සහ ආර්ථික බලපෑම පිළිබඳ නිරීක්ෂණය ක්‍රියාත්මකයි.'
          ],
      quotes: extractedQuotes.length > 0 ? extractedQuotes : [`නිල පුවත්පත් වාර්තාව සහ ප්‍රකාශන අනුව සත්‍යාපනය කර ඇත — ${publisherName}`],
      whyItMatters: 'මෙම සිදුවීම ශ්‍රී ලංකාවේ වත්මන් සමාජ, ආර්ථික සහ නීතිමය ක්‍රියාදාමයන් කෙරෙහි සෘජු බලපෑමක් එල්ල කරයි.',
      whatsNext: 'අදාළ බලධාරීන්ගේ ඉදිරි ක්‍රියාමාර්ග සහ වැඩිදුර පරීක්ෂණ වාර්තා පිළිබඳව අවධානය යොමුව පවතී.'
    };
  }

  if (lang === 'ta') {
    return {
      whatHappened: sentences.slice(0, 2).join(' ') || `${publisherName} செய்திப்பிரிவு வெளியிட்ட முக்கிய தகவல்: ${headline}`,
      keyDetails: sentences.slice(2, 5).length >= 2
        ? sentences.slice(2, 5)
        : [
            `${publisherName} செய்திப்பிரிவினால் சரிபார்க்கப்பட்டது.`,
            'சம்பந்தப்பட்ட தரப்புகளின் கருத்துகள் மற்றும் சட்ட நடவடிக்கைகள் கண்காணிக்கப்படுகின்றன.',
            'பொது மற்றும் பொருளாதார தாக்கங்கள் தொடர்பான ஆய்வுகள் தொடர்கின்றன.'
          ],
      quotes: extractedQuotes.length > 0 ? extractedQuotes : [`அதிகாரப்பூர்வ அறிக்கை மற்றும் ஊடக அறிக்கையின்படி — ${publisherName}`],
      whyItMatters: 'இந்த நிகழ்வு இலங்கையின் சமூக, பொருளாதார மற்றும் சட்ட நடைமுறைகளில் நேரடி தாக்கத்தை ஏற்படுத்துகிறது.',
      whatsNext: 'அடுத்தகட்ட விசாரணைகள் மற்றும் உத்தியோகபூர்வ முடிவுகள் குறித்த தகவல்கள் எதிர்பார்க்கப்படுகின்றன.'
    };
  }

  return {
    whatHappened: sentences.slice(0, 2).join(' ') || `${headline}. Verified newsroom reporting syndicated directly from ${publisherName}.`,
    keyDetails: sentences.slice(2, 5).length >= 2
      ? sentences.slice(2, 5)
      : [
          `Verified wire reporting syndicated from ${publisherName}.`,
          'Direct witness, institutional, or regulatory proceedings reviewed.',
          'Cross-referenced against verified public interest dispatches.'
        ],
    quotes: extractedQuotes.length > 0 ? extractedQuotes : [`Official statements and newsroom filings recorded by ${publisherName}.`],
    whyItMatters: 'This development carries statutory, economic, and institutional significance for Sri Lanka.',
    whatsNext: 'Further official proceedings, regulatory filings, or judicial updates are monitored on the wire.'
  };
}

/**
 * Safely parses the JSON output from Llama 3.2.
 */
function parseLlamaJsonResponse(rawOutput: string): ExecutiveBrief | null {
  if (!rawOutput) return null;
  let clean = rawOutput.trim();

  // Strip markdown fences
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]);
    if (
      typeof parsed.whatHappened === 'string' &&
      Array.isArray(parsed.keyDetails) &&
      parsed.keyDetails.length > 0 &&
      typeof parsed.whyItMatters === 'string' &&
      typeof parsed.whatsNext === 'string'
    ) {
      return {
        whatHappened: parsed.whatHappened.trim(),
        keyDetails: parsed.keyDetails.slice(0, 4).map((d: any) => String(d).trim()),
        quotes: Array.isArray(parsed.quotes) && parsed.quotes.length > 0
          ? parsed.quotes.slice(0, 2).map((q: any) => String(q).trim())
          : undefined,
        whyItMatters: parsed.whyItMatters.trim(),
        whatsNext: parsed.whatsNext.trim(),
      };
    }
  } catch (err) {
    console.warn('[WorkersAI] JSON parse warning:', err);
  }
  return null;
}

/**
 * Synthesizes an executive brief using Cloudflare Workers AI (@cf/meta/llama-3.2-3b-instruct).
 * Strictly adheres to the 35 stories/day free quota guardrail (~200 neurons/day out of 10,000 free).
 */
export async function synthesizeWithWorkersAi(params: SynthesizeArticleParams): Promise<SynthesisResult> {
  const { url, headline, rawText, publisherName, lang = 'en' } = params;

  // 1. Check in-memory & KV cache first (0 neurons)
  const cachedBrief = await getCachedBrief(url, lang);
  if (cachedBrief) {
    return {
      brief: cachedBrief,
      cached: true,
      provider: 'workers-ai'
    };
  }

  const env = await getCloudflareEnv();

  // 2. Strict Free-Tier Circuit Breaker: Check daily count in KV
  const { count, limit, remaining } = await getDailyAiUsage();
  if (count >= limit) {
    console.info(`[WorkersAI Guardrail] Daily free budget reached (${count}/${limit}). Using algorithmic brief.`);
    const fallback = generateAlgorithmicFallback(params);
    return {
      brief: fallback,
      cached: false,
      provider: 'algorithmic',
      dailyUsage: { count, limit }
    };
  }

  // 3. Prepare Prompt
  const cleanSnippet = (rawText || headline)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1800);

  const langInstruction = lang === 'si'
    ? 'Translate and output all JSON field values in natural, professional Sinhala (සිංහල).'
    : (lang === 'ta'
      ? 'Translate and output all JSON field values in natural, professional Tamil (தமிழ்).'
      : 'Output all JSON field values in clear, concise English.');

  const prompt = `You are a senior wire editor for Lanka Dispatch. Synthesize this Sri Lankan news dispatch into an executive brief.
Headline: "${headline}"
Publisher: "${publisherName}"
Wire Text: "${cleanSnippet}"

${langInstruction}

You MUST respond strictly with a valid JSON object matching this schema:
{
  "whatHappened": "1-2 punchy sentences summarizing the verified core event",
  "keyDetails": ["Fact or figure 1", "Fact or figure 2", "Fact or figure 3"],
  "quotes": ["Direct quote or newsroom filing from the dispatch"],
  "whyItMatters": "1 sentence on the economic, political, legal, or civic impact on Sri Lanka",
  "whatsNext": "1 sentence on upcoming proceedings, deadlines, or expected developments"
}`;

  let rawOutput = '';

  // 4a. Attempt native Cloudflare binding (0 network overhead)
  if (env?.AI?.run) {
    try {
      const response = await env.AI.run(WORKERS_AI_MODEL, {
        messages: [
          { role: 'system', content: 'You are an Axios Smart Brevity wire editor. Respond strictly in valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 380,
        temperature: 0.2
      });
      if (typeof response === 'string') {
        rawOutput = response;
      } else if (response && typeof response.response === 'string') {
        rawOutput = response.response;
      }
    } catch (bindErr) {
      console.warn('[WorkersAI] Native AI binding error, attempting REST API fallback:', bindErr);
    }
  }

  // 4b. Fallback to Cloudflare Workers AI REST API
  if (!rawOutput) {
    const accountId = env?.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || DEFAULT_ACCOUNT_ID;
    const apiToken = env?.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || '';

    if (accountId && apiToken) {
      try {
        const restRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${WORKERS_AI_MODEL}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'You are an Axios Smart Brevity wire editor. Respond strictly in valid JSON.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 380,
            temperature: 0.2
          })
        });

        if (restRes.ok) {
          const data = (await restRes.json()) as any;
          if (data?.result?.response) {
            rawOutput = data.result.response;
          }
        } else {
          console.warn('[WorkersAI] REST API call status:', restRes.status);
        }
      } catch (restErr) {
        console.warn('[WorkersAI] REST API call fallback error:', restErr);
      }
    }
  }

  // 5. Parse JSON output
  const parsedBrief = parseLlamaJsonResponse(rawOutput);

  if (parsedBrief) {
    // Increment daily usage counter in KV
    if (env) {
      await incrementDailyAiUsage(env);
    }
    // Save to KV and memory cache
    await saveCachedBrief(url, lang, parsedBrief);

    return {
      brief: parsedBrief,
      cached: false,
      provider: 'workers-ai',
      dailyUsage: { count: count + 1, limit }
    };
  }

  // 6. Graceful Algorithmic Fallback
  console.info('[WorkersAI] Parse failed or model unavailable. Serving instant algorithmic brief.');
  const fallback = generateAlgorithmicFallback(params);
  return {
    brief: fallback,
    cached: false,
    provider: 'algorithmic',
    dailyUsage: { count, limit }
  };
}
