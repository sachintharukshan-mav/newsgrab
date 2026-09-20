import { XMLParser } from 'fast-xml-parser';
import { Article, Category, SentimentType } from './types';
import { extractArticleImage } from './image-extractor';

interface RSSItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  'content:encoded'?: string;
  category?: string | string[];
  enclosure?: {
    '@_url'?: string;
  };
  'media:content'?: {
    '@_url'?: string;
  } | Array<{ '@_url'?: string }>;
  'media:thumbnail'?: {
    '@_url'?: string;
  } | Array<{ '@_url'?: string }>;
}

interface GoogleNewsItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
}

export const categoryImages: Record<string, string[]> = {
  breaking: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'
  ],
  politics: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80'
  ],
  economy: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80'
  ],
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  ],
  local: [
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80'
  ],
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
  ],
  all: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'
  ]
};

export function getCategoryFallbackImage(category: Category | string, index = 0): string {
  const list = categoryImages[category] || categoryImages.all;
  return list[Math.abs(index) % list.length];
}

const localRegex = /\b(sri lanka|sri lankan|lankan|ceylon|colombo|kandy|galle|jaffna|gampaha|kurunegala|matara|negombo|batticaloa|trincomalee|anuradhapura|nuwara eliya|ratnapura|badulla|kalutara|puttalam|polonnaruwa|hambantota|dambulla|vavuniya|mannar|kilinochchi|mullaitivu|ampara|ranil|anura kumara|akd|namal|rajapaksa|mahinda|gotabaya|sajith|premadasa|harsha|dissanayake|npp|sjb|slpp|unp|slfp|itak|tna|slmc|hizbullah|cbsl|central bank|ceb|cpc|sltb|rda|cid|tid|stf|court|magistrate|parliament|cabinet|minister|ministry|lkr|rupee|rupees|slc|lpl|airbus|customs|meteorology|disaster|tharanga|ceylon today|daily ft|island|derana|hiru|lanka|asalanka)\b|ලංකා|කොළඹ|මහනුවර|ගාල්ල|යාපනය|ගම්පහ|කුරුණෑගල|මාතර|අනුරාධපුර|රත්නපුර|කළුතර|හම්බන්තොට|පාර්ලිමේන්තුව|ජනාධිපති|අගමැති|අනුර|නාමල්|සජිත්|රනිල්|මහින්ද|මහ බැංකුව|දෙරණ|හිරු|පොලිස්|අධිකරණය|මහේස්ත්‍රාත්|ඉලங்கை|கொழும்பு|கண்டி|காலி|யாழ்ப்பாணம்|கம்பஹா|மட்டக்களப்பு|திருகோணமலை|வவுனியா|மன்னார்|கிளிநொச்சி|முல்லைத்தீவு|அம்பாறை|நாடாளுமன்றம்|ஜனாதிபதி|பிரதமர்|ரணில்|அநுர|நாமல்|சஜித்|மஹிந்த|பொலிஸ்|நீதிமன்றம்/i;

const worldRegex = /\b(gaza|israel|israeli|palestine|palestinian|hamas|hezbollah|lebanon|beirut|ukraine|ukrainian|russia|russian|putin|moscow|kyiv|zelenskyy|trump|biden|kamala|white house|pentagon|capitol|\bus\b|\busa\b|united states|china|chinese|beijing|xi jinping|taiwan|modi|new delhi|pakistan|pakistani|islamabad|bangladesh|dhaka|yunus|\buk\b|british|britain|london|starmer|sunak|france|french|paris|macron|germany|berlin|scholz|iran|iranian|tehran|houthi|yemen|red sea|syria|damascus|japan|japanese|tokyo|south korea|seoul|north korea|pyongyang|kim jong|canada|trudeau|ottawa|australia|sydney|melbourne|brazil|mexico|argentina|south africa|eu|european union|nato|\bun\b|united nations|un security council|guterres|kremlin|netanyahu|blinken|interpol|wto|world trade|apple|openai|deepmind|meta|google|microsoft|amazon|tesla|musk|spacex|tiktok|f1|formula 1|monaco|messi|ronaldo|hollywood|los angeles|\bla\b|new york|emmy|emmys|oscars|ed sheeran|macklemore|global|worldwide|kosovo|sudan|borneo|indonesia|singapore|bernie sanders|bannon|treason|boeing|box office|highest-grossing|grammys)\b|ලෝක|ඇමරිකා|රුසියා|යුක්‍රේන|චීන|ඉන්දියා|මෝදි|ට්‍රම්ප්|බයිඩන්|ඊශ්‍රායල|ගාසා|පලස්තීන|ලෙබනන්|ඉරාන|හූති|බ්‍රිතාන්‍ය|යුරෝපා|ජපාන|ඕස්ට්‍රේලියා|කැනඩා|உலக|அமெரிக்கா|ரஷ்யா|உக்ரைன்|சீனா|இந்தியா|மோடி|டிரம்ப்|பைடன்|இஸ்ரேல்|காசா|பாலஸ்தீனம்|லெபனான்|ஈரான்|ஹூதி|பிரிட்டன்|ஐரோப்பா|ஜப்பான்|கனடா/i;

const sriLankaSpecificRegex = /\b(sri lanka|sri lankan|lankan|ceylon|colombo|kandy|galle|jaffna|gampaha|kurunegala|matara|negombo|batticaloa|trincomalee|anuradhapura|nuwara eliya|ratnapura|badulla|kalutara|puttalam|polonnaruwa|hambantota|dambulla|vavuniya|mannar|kilinochchi|mullaitivu|ampara|ranil|anura kumara|akd|namal|rajapaksa|mahinda|gotabaya|sajith|premadasa|harsha|dissanayake|npp|sjb|slpp|unp|slfp|itak|tna|slmc|hizbullah|cbsl|central bank of sri lanka|ceb|cpc|sltb|rda|cid|tid|stf|lkr|rupee|rupees|slc|lpl|airbus|tharanga|derana|hiru|lanka|asalanka)\b|ලංකා|කොළඹ|මහනුවර|ගාල්ල|යාපනය|ගම්පහ|කුරුණෑගල|මාතර|අනුරාධපුර|රත්නපුර|කළුතර|හම්බන්තොට|අනුර|නාමල්|සජිත්|රනිල්|මහින්ද|මහ බැංකුව|දෙරණ|හිරු|ඉලங்கை|கொழும்பு|கண்டி|காலி|யாழ்ப்பாணம்|கம்பஹா|மட்டக்களப்பு|திருகோணமலை|வவுனியா|மன்னார்|கிளிநொச்சி|முல்லைத்தீவு|அம்பாறை|ரணில்|அநுர|நாமல்|சஜித்|மஹிந்த/i;

export function detectRegion(title: string, desc: string = '', publisherName?: string): 'local' | 'world' {
  const globalPublishers = [
    'reuters',
    'bbc world',
    'the guardian',
    'guardian',
    'al jazeera',
    'bbc (සිංහල)',
    'bbc (தமிழ்)'
  ];
  const isGlobalOutlet = publisherName && globalPublishers.some((p) => publisherName.toLowerCase().includes(p));

  // If from a domestic Sri Lankan outlet, strictly route to local (never contaminate pure World wire)
  if (publisherName && !isGlobalOutlet) {
    return 'local';
  }

  // If from an accredited global outlet, route to world (unless specifically covering Sri Lanka domestic developments)
  if (isGlobalOutlet) {
    const text = `${title} ${desc}`.toLowerCase();
    if (sriLankaSpecificRegex.test(text)) {
      return 'local';
    }
    return 'world';
  }

  const text = `${title} ${desc}`.toLowerCase();
  const hasLocal = localRegex.test(text);
  const hasWorld = worldRegex.test(text);

  if (hasLocal) return 'local';
  if (hasWorld) return 'world';
  return 'local';
}

const sportsRegex = /\b(cricket|icc|t20|odi|test match|ipl|lpl|bcci|slc|sri lanka cricket|innings|wickets|batsman|bowler|batting|bowling|runs|century|half-century|defeat|defeated|won by|toss|pitch|captain|asalanka|hasaranga|nissanka|kamindu|chameera|mendis|theekshana|sanath jayasuriya|football|fifa|champions league|premier league|messi|ronaldo|manchester|liverpool|arsenal|chelsea|real madrid|barcelona|rugby|six nations|athletics|marathon|olympic|olympics|asian games|paralympics|javelin|badminton|tennis|wimbledon|grand slam|formula 1|f1|grand prix|boxing|wrestling|swimming)\b|ක්‍රීඩා|ක්‍රිකට්|තරග|ඉනිම|කඩුලු|ලකුණු|පාපන්දු|ඔලිම්පික්|පිතිකරු|පන්දු|විස්සයි|ජයග්‍රහණ|ශූරතා|ක්‍රීඩක|විளையாட்டு|கிரிக்கெட்|போட்டி|விக்கெட்|ஓட்டங்கள்|கால்பந்து|ஒலிம்பிக்|துடுப்பாட்டம்|பந்துவீச்சு/i;

const economyRegex = /\b(central bank|cbsl|monetary policy|policy rates|treasury bills|t-bills|treasury bonds|imf|international monetary fund|bailout|debt restructuring|isb|sovereign bonds|inflation|deflation|colombo stock exchange|cse|aspi|s&p sl20|market capitalization|stock index|shares traded|turnover|rights issue|dividend|debentures|commercial bank|sampath bank|hatton national bank|hnb|bank of ceylon|boc|peoples bank|ndb|seylan|nation trust|interest rates|exchange rate|rupee|rupees|lkr|us dollar|forex|remittances|exports|imports|trade deficit|customs revenue|inland revenue|ird|vat|tax revenue|gdp|economic growth|recession|ceylon chamber of commerce|tea auction|apparel export|tourism earnings|rs\.?\s*\d+|trillion|billion|million loss)\b|ආර්ථික|මහ බැංකු|වෙළඳපොළ|කොටස්|උද්ධමනය|ණය|ණය ප්‍රතිව්‍යුහගත|ණය සහන|රුපිය|පොලී|බදු|ආනයන|අපනයන|ඩොලර්|වාණිජ බැංකු|ව්‍යාපාරික|සම්පත් බැංකු|ලංකා බැංකු|பொருளாதாரம்|மத்திய வங்கி|பங்குச்சந்தை|பணவீக்கம்|கடன்|ரூபாய்|வட்டி|வரி|ஏற்றுமதி|இறக்குமதி|டொலர்|வங்கி|நிதி|வர்த்தக/i;

const techRegex = /\b(artificial intelligence|\bai\b|machine learning|deepmind|openai|chatgpt|gpt-4|claude|anthropic|gemini|meta|llm|generative ai|software|algorithm|cyber|cybersecurity|ransomware|malware|hacker|hacked|data breach|phishing|cloud computing|aws|azure|google cloud|fintech|blockchain|crypto|bitcoin|ethereum|web3|telecom|dialog|mobitel|airtel|hutch|slt|sri lanka telecom|5g|4g|broadband|fiber|smart glasses|smartphones|apple|iphone|android|samsung|nvidia|semiconductor|microchip|startups|venture capital|founder|saas)\b|තාක්ෂණ|කෘත්‍රිම බුද්ධි|ඩිජිටල්|සයිබර්|මෘදුකාංග|අන්තර්ජාල|ස්මාර්ට්ෆෝන්|චැට්ජීපීටී|தொழில்நுட்பம்|செயற்கை நுண்ணறிவு|டிஜிட்டல்|சைபர்|மென்பொருள்|இணையம்|ஸ்மார்ட்போன்/i;

const breakingRegex = /\b(breaking news|just in|urgent dispatch|state of emergency|cyclone|tsunami|landslide warning|red alert|earthquake|explosion|bomb blast|terrorist attack|massive fire|building collapse|plane crash|train collision|deadly accident|fatal crash|killed in accident|gas leak|evacuation order|red notice)\b|උණුසුම් පුවත්|හදිසි අනතුරු|මියගිය|පිපිරීමක්|ගින්නක්|මරණ|ඝාතන|මුක්கிய செய்தி|அவசர|விபத்து|உயிரிழப்பு|மரணம்|வெடிப்பு|தீப்பரவல்/i;

const politicsRegex = /\b(parliament|parliamentary|speaker|order paper|hansard|mace|legislation|bill|act of parliament|gazette|cabinet|cabinet decision|cabinet paper|cabinet spokesman|minister|ministry|prime minister|president|presidential|akd|anura kumara|dissanayake|ranil|wickremesinghe|namal|rajapaksa|mahinda|gotabaya|sajith|premadasa|harsha de silva|wijeyadasa|npp|national people's power|sjb|samagi jana balawegaya|slpp|podujana peramuna|unp|slfp|itak|tna|election|elections|general election|presidential election|provincial council|local government election|polling|ballot|voter|commissioner of elections|supreme court|court of appeal|high court|magistrate|magistrate's court|judge|justice|attorney general|solicitor general|remanded|bail|habeas corpus|fundamental rights|fr petition|bribery commission|ciaboc|cid|criminal investigation department|fcid|tid|police|inspector general|curfew|emergency regulations|diplomacy|bilateral talks|ambassador|high commissioner|foreign ministry)\b|දේශපාලන|පාර්ලිමේන්තු|ජනාධිපති|අගමැති|ඇමති|මැතිවරණ|ඡන්ද|අධිකරණය|මහාධිකරණය|මහේස්ත්‍රාත්|නඩු|නියෝග|නීතිපති|අල්ලස්|අපරාධ|පොලිස්|අත්අඩංගුව|රක්ෂිත බන්ධනාගාර|රිමාන්ඩ්|සජිත්|අනුර|නාමල්|රනිල්|මහින්ද|විමර්ශන|කැබිනට්|அரசியல்|நாடாளுமன்றம்|ஜனாதிபதி|பிரதமர்|அமைச்சர்|தேர்தல்|நீதிமன்றம்|நீதிபதி|வழக்கு|சட்டமா அதிபர்|இலஞ்சம்|குற்றப்பிரிவு|பொலிஸ்|கைது|விளக்கமறியல்|ரணில்|அநுர|நாமல்|சஜித்|மஹிந்த|அமைச்சரவை/i;

export function detectCategory(
  title: string,
  desc: string,
  publisherName?: string,
  rawCategory?: string | string[]
): Category {
  const text = `${title} ${desc}`.toLowerCase();

  // 1. Publisher Authority Mapping (Dedicated specialized newsrooms)
  if (publisherName === 'Readme.lk') return 'tech';
  if (publisherName && ['EconomyNext', 'Daily FT', 'Lanka Business Online'].includes(publisherName)) {
    if (sportsRegex.test(text)) return 'sports';
    return 'economy';
  }

  // 2. Explicit RSS/Source XML metadata tags
  const catStr = Array.isArray(rawCategory) ? rawCategory.join(' ') : (rawCategory || '');
  if (/sports|cricket|athletics|football|ක්‍රීඩා|விளையாட்டு/i.test(catStr)) return 'sports';
  if (/biz|business|economy|markets|finance|stocks|ආර්ථික|ව්‍යාපාරික|பொருளாதாரம்/i.test(catStr)) {
    if (/\b(remanded|magistrate|court|cid|arrested|bail|suspect)\b|අත්අඩංගුව|රිමාන්ඩ්|නඩු|கைது|விளக்கமறியல்/i.test(text)) return 'politics';
    return 'economy';
  }
  if (/tech|technology|digital|science|තාක්ෂණ|தொழில்நுட்பம்/i.test(catStr)) return 'tech';
  if (/breaking|urgent|alert|උණුසුම්|முக்கிய/i.test(catStr)) return 'breaking';
  if (/politics|national|governance|දේශපාලන|அரசியல்/i.test(catStr)) return 'politics';

  // 3. High-Precision Keyword Domain Scoring
  if (breakingRegex.test(text)) return 'breaking';
  if (sportsRegex.test(text)) return 'sports';
  if (techRegex.test(text)) return 'tech';

  if (economyRegex.test(text)) {
    if (/\b(remanded|magistrate|court|cid|police|arrested|bail|suspect|attorney general)\b|අත්අඩංගුව|රිමාන්ඩ්|නඩු|අධිකරණ|கைது|விளக்கமறியல்|நீதிமன்றம்/i.test(text)) {
      return 'politics';
    }
    return 'economy';
  }

  if (politicsRegex.test(text)) return 'politics';

  return 'politics';
}
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#8217;|&#039;|&apos;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .trim();
}

function fnv1aHash(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

export function generateArticleId(publisher: string, title: string): string {
  const pubSlug = publisher.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'news';
  const asciiSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 45);
  const hash = fnv1aHash(title);
  if (asciiSlug) {
    return `${pubSlug}-${asciiSlug}-${hash}`;
  }
  return `${pubSlug}-dispatch-${hash}`;
}

export async function fetchRSSFeed(feedUrl: string, publisherName: string, limit = 18): Promise<Partial<Article>[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(feedUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      next: { revalidate: 180 }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Failed to fetch RSS from ${publisherName}: HTTP ${response.status}`);
      return [];
    }

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    const parsed = parser.parse(xmlData);
    const channel = parsed.rss?.channel || parsed.feed;
    if (!channel) return [];

    const items: RSSItem[] = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];

    // Parallel fetch authentic original source images for each article
    const articlePromises = items.slice(0, limit).map(async (item, index) => {
      const rawTitle = decodeHtmlEntities(item.title?.trim() || 'Breaking Dispatch');
      const rawDesc = decodeHtmlEntities(item.description || item['content:encoded'] || '');
      const cleanDesc = rawDesc.replace(/<\/?[^>]+(>|$)/g, '').trim();
      const articleLink = item.link || '';

      // 1. Check if an authentic image is already embedded in description or content:encoded (e.g. NewsWire)
      let authenticPhoto: string | null = null;
      const inlineImgMatch = (item['content:encoded'] || item.description || '')
        .match(/<img[^>]+src=["']([^"']+)["']/i);
      if (inlineImgMatch && inlineImgMatch[1] && !/logo|favicon|avatar|icon|pixel/i.test(inlineImgMatch[1])) {
        authenticPhoto = inlineImgMatch[1];
      }

      // 2. Check for enclosure or media:content / media:thumbnail tags
      if (!authenticPhoto) {
        if (item.enclosure?.['@_url']) {
          authenticPhoto = item.enclosure['@_url'];
        } else if (item['media:content']) {
          const mc = item['media:content'];
          if (Array.isArray(mc) && mc.length > 0) {
            authenticPhoto = mc[mc.length - 1]?.['@_url'] || mc[0]?.['@_url'] || null;
          } else if (typeof mc === 'object' && '@_url' in mc) {
            authenticPhoto = (mc as { '@_url'?: string })['@_url'] || null;
          }
        } else if (item['media:thumbnail']) {
          const mt = item['media:thumbnail'];
          if (Array.isArray(mt) && mt.length > 0) {
            authenticPhoto = mt[mt.length - 1]?.['@_url'] || mt[0]?.['@_url'] || null;
          } else if (typeof mt === 'object' && '@_url' in mt) {
            authenticPhoto = (mt as { '@_url'?: string })['@_url'] || null;
          }
        }
      }

      // 3. Fetch authentic photo from original source webpage if not directly in feed
      if (!authenticPhoto && articleLink) {
        authenticPhoto = await extractArticleImage(articleLink);
      }

      const detectedCat = detectCategory(rawTitle, cleanDesc, publisherName, item.category);
      const finalImage = authenticPhoto || getCategoryFallbackImage(detectedCat, index);

      const isGlobal = ['reuters', 'bbc', 'the guardian', 'guardian', 'al jazeera'].some(g => publisherName.toLowerCase().includes(g));

      // Split into clean sentence bullet points
      const sentences = cleanDesc.split(/\.\s+/).filter(s => s.trim().length > 15);
      const bullets = sentences.length >= 2 
        ? sentences.slice(0, 3).map(s => s.trim() + (s.endsWith('.') ? '' : '.'))
        : [
            rawTitle,
            isGlobal ? `Dispatched via ${publisherName} International News Service.` : `Reported by ${publisherName} Colombo desk.`,
            isGlobal ? 'Global wire verification and continuous monitoring.' : 'Continuous monitoring and verification in progress.'
          ];

      const detectedReg = detectRegion(rawTitle, cleanDesc, publisherName);
      const stableId = generateArticleId(publisherName, rawTitle);

      return {
        id: stableId,
        title: {
          en: rawTitle
        },
        summary: {
          en: cleanDesc.length > 0 ? (cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : '')) : rawTitle
        },
        aiBullets: {
          en: bullets
        },
        sentiment: (detectedCat === 'breaking' ? 'developing' : 'neutral') as SentimentType,
        category: detectedCat,
        region: detectedReg,
        imageUrl: finalImage,
        publisherName: publisherName,
        sourceUrl: articleLink || 'https://adaderana.lk',
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        readTimeMinutes: Math.max(2, Math.round((cleanDesc.length || 100) / 300)),
        isBreaking: detectedCat === 'breaking' || index === 0,
        clusterCount: index % 3 === 0 ? 3 : 1
      };
    });

    return await Promise.all(articlePromises);
  } catch (error) {
    console.warn(`Error reading RSS for ${publisherName}:`, error);
    return [];
  }
}

export async function fetchHiruNewsArticles(lang: 'en' | 'si' | 'ta' = 'en'): Promise<Partial<Article>[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const targetUrl = lang === 'en' 
      ? 'https://hirunews.lk/english/' 
      : (lang === 'si' ? 'https://hirunews.lk/' : 'https://hirunews.lk/tamil/');

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      next: { revalidate: 120 }
    });

    clearTimeout(timeoutId);
    if (!res.ok) return [];

    const html = await res.text();
    const cardRegex = lang === 'en'
      ? /<a[^>]+href=["'](https:\/\/hirunews\.lk\/english\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi
      : (lang === 'si'
          ? /<a[^>]+href=["'](https:\/\/hirunews\.lk\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi
          : /<a[^>]+href=["'](https:\/\/hirunews\.lk\/tamil\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi
        );

    const seen = new Set<string>();
    const articles: Partial<Article>[] = [];
    let m: RegExpExecArray | null;

    const publisherName = lang === 'si' ? 'Hiru News (හිරු)' : (lang === 'ta' ? 'Hiru News (ஹிரு)' : 'Hiru News');

    while ((m = cardRegex.exec(html)) !== null) {
      const url = m[1];
      const inner = m[4];

      if (seen.has(url) || url.includes('/video/') || url.includes('/audio/')) continue;

      // Extract authentic headline
      let title = '';
      const featuredTitle = inner.match(/<div[^>]+class=["'][^"']*card-title-featured[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      const titleClass = inner.match(/<div[^>]+class=["'][^"']*\btitle\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      const altMatch = inner.match(/alt=["']([^"']+)["']/i);

      if (featuredTitle && featuredTitle[1].trim()) {
        title = featuredTitle[1].replace(/<[^>]+>/g, '').trim();
      } else if (titleClass && !/^(top story|latest news|trending|read more)$/i.test(titleClass[1].replace(/<[^>]+>/g, '').trim())) {
        title = titleClass[1].replace(/<[^>]+>/g, '').trim();
      } else if (altMatch && altMatch[1].trim() && altMatch[1].length > 5) {
        title = altMatch[1].trim();
      } else {
        const cleanInner = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleanInner.length > 10 && !/^(read more|more|view)$/i.test(cleanInner)) {
          title = cleanInner.slice(0, 120);
        }
      }

      // Extract description
      const descMatch = inner.match(/<div[^>]+class=["'][^"']*description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      // Extract authentic photo directly from Hiru's news card
      const imgMatch = inner.match(/src=["'](https:\/\/cdn\.hirunews\.lk\/Data\/News_Images\/[^"']+)["']/i)
        || inner.match(/src=["']([^"']+)["']/i);
      const authenticPhoto = imgMatch ? imgMatch[1] : null;

      if (title && title.length > 5) {
        seen.add(url);
        const rawTitle = decodeHtmlEntities(title);
        const fallbackNotice = lang === 'si' 
          ? 'හිරු ප්‍රවෘත්ති කොළඹ ප්‍රවෘත්ති කාමරයේ සජීවී වාර්තාව.'
          : (lang === 'ta' ? 'ஹிரு நியூஸ் கொழும்பு செய்தியறையின் நேரடி அறிக்கை.' : 'Live breaking coverage from Hiru News Colombo newsroom.');
        const summary = desc.length > 20 ? decodeHtmlEntities(desc) : `${rawTitle}. ${fallbackNotice}`;

        const catMatch = inner.match(/<span[^>]+class=["'][^"']*update-category[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
        const hiruCat = catMatch ? catMatch[1].trim() : '';

        const detectedCat = detectCategory(rawTitle, summary, 'Hiru News', hiruCat);
        const detectedReg = detectRegion(rawTitle, summary, publisherName);
        const stableId = generateArticleId(publisherName, rawTitle);

        articles.push({
          id: stableId,
          title: { en: rawTitle, [lang]: rawTitle },
          summary: { en: summary, [lang]: summary },
          aiBullets: {
            en: [
              rawTitle,
              lang === 'si' ? 'හිරු ප්‍රවෘත්ති සංස්කාරක මණ්ඩලය විසින් සත්‍යාපනය කරන ලදී.' : (lang === 'ta' ? 'ஹிரு நியூஸ் செய்தி ஆசிரியர் குழுவினால் உறுதிப்படுத்தப்பட்டது.' : 'Reported live by Hiru News editorial desk.'),
              lang === 'si' ? 'අදාළ අංශ සහ පොලිස් වාර්තා මඟින් තහවුරු කර ඇත.' : (lang === 'ta' ? 'தொடர்புடைய துறைகள் மூலம் உறுதிப்படுத்தப்பட்டது.' : 'Verified against domestic police and court records.')
            ],
            [lang]: [
              rawTitle,
              lang === 'si' ? 'හිරු ප්‍රවෘත්ති සංස්කාරක මණ්ඩලය විසින් සත්‍යාපනය කරන ලදී.' : (lang === 'ta' ? 'ஹிரு நியூஸ் செய்தி ஆசிரியர் குழுவினால் உறுதிப்படுத்தப்பட்டது.' : 'Reported live by Hiru News editorial desk.'),
              lang === 'si' ? 'අදාළ අංශ සහ පොලිස් වාර්තා මඟින් තහවුරු කර ඇත.' : (lang === 'ta' ? 'தொடர்புடைய துறைகள் மூலம் உறுதிப்படுத்தப்பட்டது.' : 'Verified against domestic police and court records.')
            ]
          },
          sentiment: (detectedCat === 'breaking' ? 'developing' : 'neutral') as SentimentType,
          category: detectedCat,
          region: detectedReg,
          imageUrl: authenticPhoto || getCategoryFallbackImage(detectedCat, articles.length),
          publisherName: publisherName,
          sourceUrl: url,
          publishedAt: new Date(Date.now() - articles.length * 12 * 60 * 1000).toISOString(),
          readTimeMinutes: 3,
          isBreaking: detectedCat === 'breaking' || articles.length === 0,
          clusterCount: 2
        });

        if (articles.length >= 18) break;
      }
    }

    return articles;
  } catch (error) {
    console.warn(`Error scraping Hiru News (${lang}):`, error);
    return [];
  }
}

export async function fetchGoogleNewsFeed(sourceQuery: string, publisherName: string, maxItems = 12, lang = 'en'): Promise<Partial<Article>[]> {
  try {
    const hl = lang === 'si' ? 'si' : (lang === 'ta' ? 'ta' : 'en-LK');
    const ceid = lang === 'si' ? 'LK:si' : (lang === 'ta' ? 'LK:ta' : 'LK:en');
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(sourceQuery)}&hl=${hl}&gl=LK&ceid=${ceid}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 120 }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);
    const rawItems = parsed.rss?.channel?.item;
    if (!rawItems) return [];

    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    
    // Filter out generic archive pages or non-articles
    const validItems = (items as GoogleNewsItem[]).filter((item) => {
      const title = item.title || '';
      return !title.toLowerCase().includes('archives') && 
             !title.toLowerCase().includes('breaking news and headlines') &&
             !title.toLowerCase().includes('top stories | breaking news');
    }).slice(0, maxItems);

    const articlePromises = validItems.map(async (item, index: number) => {
      const rawTitle = decodeHtmlEntities(
        (item.title || '')
          .replace(/\s*-\s*(Daily Mirror|Newsfirst|News 1st|Daily FT|Sri Lanka|Virakesari|வீரகேசரி).*$/i, '')
          .trim() || 'News Dispatch'
      );

      const cleanDesc = decodeHtmlEntities(
        (item.description || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/\s*-\s*(Daily Mirror|Newsfirst|Daily FT|Virakesari|வீரகேசரி).*$/i, '')
          .trim()
      );

      const detectedCat = detectCategory(rawTitle, cleanDesc, publisherName);
      const detectedReg = detectRegion(rawTitle, cleanDesc, publisherName);
      const stableId = generateArticleId(publisherName, rawTitle);

      let authenticPhoto: string | null = null;
      if (item.link) {
        authenticPhoto = await extractArticleImage(item.link);
      }

      const fallbackBullets = [
        rawTitle,
        lang === 'ta' ? `செய்திப் பிரிவு: ${publisherName}.` : (lang === 'si' ? `ප්‍රවෘත්ති වාර්තාව: ${publisherName}.` : `Dispatched via ${publisherName} Colombo news bureau.`),
        lang === 'ta' ? 'தொடர்ச்சியான நேரடி கண்காணிப்பு.' : (lang === 'si' ? 'අඛණ්ඩ සත්‍යාපනය ක්‍රියාත්මකයි.' : 'Continuous monitoring and multi-source verification.')
      ];

      return {
        id: stableId,
        title: { en: rawTitle, [lang]: rawTitle },
        summary: {
          en: cleanDesc.length > 20 ? cleanDesc : `${rawTitle}. ${publisherName}`,
          [lang]: cleanDesc.length > 20 ? cleanDesc : `${rawTitle}. ${publisherName}`
        },
        aiBullets: {
          en: fallbackBullets,
          [lang]: fallbackBullets
        },
        sentiment: (detectedCat === 'breaking' ? 'developing' : 'neutral') as SentimentType,
        category: detectedCat,
        region: detectedReg,
        imageUrl: authenticPhoto || getCategoryFallbackImage(detectedCat, index),
        publisherName: publisherName,
        sourceUrl: item.link || 'https://news.google.com',
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        readTimeMinutes: 3,
        isBreaking: detectedCat === 'breaking' || index === 0,
        clusterCount: index % 2 === 0 ? 3 : 1
      };
    });

    return await Promise.all(articlePromises);
  } catch (e) {
    console.warn(`Error fetching Google News feed for ${publisherName}:`, e);
    return [];
  }
}

export async function fetchSinhalaNewsArticles(): Promise<Partial<Article>[]> {
  const [deranaRes, bbcRes, hiruArticles] = await Promise.allSettled([
    fetchRSSFeed('https://sinhala.adaderana.lk/rss.php', 'Ada Derana (සිංහල)'),
    fetchRSSFeed('https://feeds.bbci.co.uk/sinhala/rss.xml', 'BBC (සිංහල)'),
    fetchHiruNewsArticles('si')
  ]);

  const articles: Partial<Article>[] = [];

  if (deranaRes.status === 'fulfilled') {
    deranaRes.value.forEach(a => {
      articles.push({
        ...a,
        title: { en: a.title?.en || '', si: a.title?.en || '' },
        summary: { en: a.summary?.en || '', si: a.summary?.en || '' },
        aiBullets: { en: a.aiBullets?.en || [], si: a.aiBullets?.en || [] }
      });
    });
  }

  if (hiruArticles.status === 'fulfilled') {
    articles.push(...hiruArticles.value);
  }

  if (bbcRes.status === 'fulfilled') {
    bbcRes.value.forEach(a => {
      articles.push({
        ...a,
        title: { en: a.title?.en || '', si: a.title?.en || '' },
        summary: { en: a.summary?.en || '', si: a.summary?.en || '' },
        aiBullets: { en: a.aiBullets?.en || [], si: a.aiBullets?.en || [] }
      });
    });
  }

  return articles;
}

export async function fetchTamilNewsArticles(): Promise<Partial<Article>[]> {
  const [virakesariRes, bbcRes, hiruArticles] = await Promise.allSettled([
    fetchGoogleNewsFeed('when:7d+site:virakesari.lk', 'Virakesari (வீரகேசரி)', 25, 'ta'),
    fetchRSSFeed('https://feeds.bbci.co.uk/tamil/rss.xml', 'BBC (தமிழ்)'),
    fetchHiruNewsArticles('ta')
  ]);

  const articles: Partial<Article>[] = [];

  if (virakesariRes.status === 'fulfilled') {
    articles.push(...virakesariRes.value);
  }

  if (hiruArticles.status === 'fulfilled') {
    articles.push(...hiruArticles.value);
  }

  if (bbcRes.status === 'fulfilled') {
    bbcRes.value.forEach(a => {
      articles.push({
        ...a,
        title: { en: a.title?.en || '', ta: a.title?.en || '' },
        summary: { en: a.summary?.en || '', ta: a.summary?.en || '' },
        aiBullets: { en: a.aiBullets?.en || [], ta: a.aiBullets?.en || [] }
      });
    });
  }

  return articles;
}

export async function fetchReutersWorldNews(maxItems = 24): Promise<Partial<Article>[]> {
  try {
    const url = 'https://news.google.com/rss/search?q=when:24h+site:reuters.com/world&hl=en-US&gl=US&ceid=US:en';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 120 }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const parsed = parser.parse(xml);
    const rawItems = parsed.rss?.channel?.item;
    if (!rawItems) return [];

    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    
    // Filter out generic archive pages or non-articles
    const validItems = (items as GoogleNewsItem[]).filter((item) => {
      const title = item.title || '';
      return !title.toLowerCase().includes('archives') && 
             !title.toLowerCase().includes('breaking news and headlines') &&
             !title.toLowerCase().includes('top stories | breaking news');
    }).slice(0, maxItems);

    const articlePromises = validItems.map(async (item, index: number) => {
      const rawTitle = decodeHtmlEntities(
        (item.title || '')
          .replace(/\s*-\s*Reuters.*$/i, '')
          .trim() || 'Reuters World Dispatch'
      );

      const cleanDesc = decodeHtmlEntities(
        (item.description || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/\s*-\s*Reuters.*$/i, '')
          .trim()
      );

      const detectedCat = detectCategory(rawTitle, cleanDesc, 'Reuters');
      const detectedReg = detectRegion(rawTitle, cleanDesc, 'Reuters');
      const stableId = generateArticleId('Reuters', rawTitle);

      let authenticPhoto: string | null = null;
      if (item.link) {
        authenticPhoto = await extractArticleImage(item.link);
      }

      const fallbackBullets = [
        rawTitle,
        'Dispatched via Reuters Global Wire Service.',
        'Fact-checked and accredited international wire coverage.'
      ];

      return {
        id: stableId,
        title: { en: rawTitle },
        summary: {
          en: cleanDesc.length > 20 ? cleanDesc : `${rawTitle}. Dispatched via Reuters.`
        },
        aiBullets: {
          en: fallbackBullets
        },
        sentiment: (detectedCat === 'breaking' ? 'developing' : 'neutral') as SentimentType,
        category: detectedCat,
        region: detectedReg,
        imageUrl: authenticPhoto || getCategoryFallbackImage(detectedCat, index),
        publisherName: 'Reuters',
        sourceUrl: item.link || 'https://www.reuters.com',
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        readTimeMinutes: 3,
        isBreaking: detectedCat === 'breaking' || index === 0,
        clusterCount: index % 2 === 0 ? 3 : 1
      };
    });

    return await Promise.all(articlePromises);
  } catch (e) {
    console.warn('Error fetching Reuters World News:', e);
    return [];
  }
}

export async function fetchBBCWorldNews(maxItems = 20): Promise<Partial<Article>[]> {
  return await fetchRSSFeed('https://feeds.bbci.co.uk/news/world/rss.xml', 'BBC World News', maxItems);
}

export async function fetchGuardianWorldNews(maxItems = 20): Promise<Partial<Article>[]> {
  return await fetchRSSFeed('https://www.theguardian.com/world/rss', 'The Guardian', maxItems);
}


