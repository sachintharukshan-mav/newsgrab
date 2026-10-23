import { Article, Category, Language } from './types';

export interface SectionHubConfig {
  slug: Exclude<Category, 'all'>;
  title: Record<Language, string>;
  seoTitle: Record<Language, string>;
  description: Record<Language, string>;
  aeoSummary: Record<Language, string>;
  keywords: string[];
}

export interface TopicHubFaq {
  question: Record<Language, string>;
  answer: Record<Language, string>;
}

export interface TopicHubFact {
  label: Record<Language, string>;
  value: Record<Language, string>;
}

export interface TopicHubConfig {
  slug: string;
  category: Exclude<Category, 'all'>;
  title: Record<Language, string>;
  shortLabel: Record<Language, string>;
  seoTitle: Record<Language, string>;
  description: Record<Language, string>;
  aeoAnswer: Record<Language, string>;
  keyFacts: TopicHubFact[];
  faqs: TopicHubFaq[];
  keywords: string[];
  matchRegex: RegExp;
}

export const SECTION_HUBS: Record<Exclude<Category, 'all'>, SectionHubConfig> = {
  local: {
    slug: 'local',
    title: {
      en: '🇱🇰 Sri Lanka National Wire',
      si: '🇱🇰 ශ්‍රී ලංකා ජාතික පුවත්',
      ta: '🇱🇰 இலங்கை தேசிய செய்திகள்',
    },
    seoTitle: {
      en: 'Sri Lanka News Today — Colombo National Wire & Live Updates',
      si: 'ශ්‍රී ලංකා පුවත් — ජාතික ප්‍රවෘත්ති සහ කොළඹ විශේෂ පුවත්',
      ta: 'இலங்கை செய்திகள் — கொழும்பு தேசிய செய்திகள் மற்றும் நேரடி தகவல்கள்',
    },
    description: {
      en: 'Live Sri Lanka national news aggregated across Ada Derana, Hiru News, Daily Mirror, Virakesari, Daily FT, EconomyNext, and NewsFirst in English, Sinhala, and Tamil.',
      si: 'අද දෙරණ, හිරු පුවත්, ඩේලි මිරර්, වීරකේසරී සහ ප්‍රධාන මාධ්‍ය ආයතන හරහා ශ්‍රී ලංකාවේ නවතම ජාතික පුවත් සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂාවලින්.',
      ta: 'அத தெரண, ஹிரு, டெய்லி மிரர், வீரகேசரி உள்ளிட்ட முன்னணி ஊடகங்களில் இருந்து இலங்கையின் 최신 தேசிய செய்திகள் தமிழ், சிங்களம் மற்றும் ஆங்கிலத்தில்.',
    },
    aeoSummary: {
      en: 'The Lanka Dispatch Sri Lanka National Wire tracks verified domestic reporting across all 9 provinces and 25 districts, synthesizing dispatches from 11 Colombo newsdesks every 15 minutes.',
      si: 'ලංකා ඩිස්පැච් ජාතික පුවත් අංශය දිවයිනේ පළාත් 9 සහ දිස්ත්‍රික්ක 25 ආවරණය කරමින් ප්‍රධාන මාධ්‍ය ආයතන 11ක තහවුරු කළ පුවත් සෑම විනාඩි 15කට වරක් යාවත්කාලීන කරයි.',
      ta: 'லங்கா டிஸ்பாட்ச் தேசிய செய்திப் பிரிவு இலங்கையின் 9 மாகாணங்கள் மற்றும் 25 மாவட்டங்களின் செய்திகளை 11 முன்னணி ஊடகங்களில் இருந்து 15 நிமிடங்களுக்கு ஒருமுறை தொகுத்து வழங்குகிறது.',
    },
    keywords: [
      'Sri Lanka News Today',
      'Colombo Breaking News',
      'Sri Lanka Local News',
      'Ada Derana Sri Lanka',
      'Hiru News Sri Lanka',
      'ශ්‍රී ලංකා පුවත්',
      'இலங்கை செய்திகள்',
    ],
  },
  world: {
    slug: 'world',
    title: {
      en: '🌐 World Intelligence Wire',
      si: '🌐 ලෝක පුවත් සේවය',
      ta: '🌐 சர்வதேச செய்திகள்',
    },
    seoTitle: {
      en: 'World News & Geopolitics — Global Wire for Sri Lanka',
      si: 'ලෝක පුවත් සහ ජාත්‍යන්තර විශ්ලේෂණ — Lanka Dispatch',
      ta: 'உலக செய்திகள் மற்றும் சர்வதேச அரசியல் — Lanka Dispatch',
    },
    description: {
      en: 'International breaking news, Indian Ocean geopolitics, global markets, and diplomatic dispatches from Reuters, BBC World, and The Guardian curated for Sri Lankan readers.',
      si: 'රොයිටර්ස්, බීබීසී සහ ගාඩියන් පුවත් සේවා ඇසුරින් ජාත්‍යන්තර දේශපාලනය, ඉන්දියන් සාගර කලාපීය ආරක්ෂාව සහ ලෝක ආර්ථික පුවත්.',
      ta: 'ராய்ட்டர்ஸ், பிபிசி மற்றும் கார்டியன் ஊடகங்களில் இருந்து சர்வதேச அரசியல், இந்தியப் பெருங்கடல் பாதுகாப்பு மற்றும் உலக வர்த்தக செய்திகள்.',
    },
    aeoSummary: {
      en: 'The World Intelligence Wire aggregates international reporting from Reuters, BBC World News, and The Guardian with a focus on South Asian diplomacy, trade corridors, energy markets, and global security.',
      si: 'ලෝක පුවත් අංශය රොයිටර්ස්, බීබීසී සහ ගාඩියන් වාර්තා ඇසුරින් දකුණු ආසියානු රාජ්‍යතාන්ත්‍රික සබඳතා, ලෝක වෙළඳපොළ සහ බලශක්ති මිල ගණන් පිළිබඳ විශ්ලේෂණ සපයයි.',
      ta: 'உலக செய்திப் பிரிவு ராய்ட்டர்ஸ், பிபிசி மற்றும் கார்டியன் ஊடகங்களின் வழியாக தெற்காசிய இராஜதந்திரம், உலக வர்த்தகம் மற்றும் எரிசக்தி சந்தை தகவல்களை வழங்குகிறது.',
    },
    keywords: [
      'World News Sri Lanka',
      'South Asia Geopolitics',
      'Reuters World Wire',
      'BBC World News',
      'ලෝක පුවත්',
      'உலக செய்திகள்',
    ],
  },
  breaking: {
    slug: 'breaking',
    title: {
      en: '🚨 Breaking Dispatches',
      si: '🚨 උණුසුම් පුවත් නිවේදන',
      ta: '🚨 முக்கிய செய்திகள்',
    },
    seoTitle: {
      en: 'Breaking News Sri Lanka — Urgent Alerts & Developing Stories',
      si: 'උණුසුම් පුවත් (Breaking News) — ශ්‍රී ලංකා හදිසි පුවත් නිවේදන',
      ta: 'முக்கிய செய்திகள் (Breaking News) — இலங்கை அவசர செய்திகள்',
    },
    description: {
      en: 'Real-time breaking news alerts from Sri Lanka. Immediate multi-source verification of cabinet decisions, CBSL notices, weather warnings, and emergency dispatches.',
      si: 'ශ්‍රී ලංකාවේ එසැණින් වාර්තා වන උණුසුම් පුවත්, රජයේ විශේෂ නිවේදන, කාලගුණ අනතුරු ඇඟවීම් සහ මහ බැංකු තීරණ.',
      ta: 'இலங்கையின் உடனடி முக்கிய செய்திகள், அரசாங்க அறிவிப்புகள், வானிலை எச்சரிக்கைகள் மற்றும் மத்திய வங்கித் தீர்மானங்கள்.',
    },
    aeoSummary: {
      en: 'Lanka Dispatch Breaking Dispatches tracks high-priority developing stories across Sri Lanka, flagging multi-newsroom corroboration when 3 or more independent outlets confirm an urgent event.',
      si: 'ලංකා ඩිස්පැච් උණුසුම් පුවත් අංශය ස්වාධීන මාධ්‍ය ආයතන තුනක් හෝ වැඩි ගණනක් මගින් තහවුරු කරන ලද හදිසි ජාතික සිදුවීම් එසැණින් වාර්තා කරයි.',
      ta: 'லங்கா டிஸ்பாட்ச் முக்கிய செய்திகள் பிரிவு மூன்று அல்லது அதற்கு மேற்பட்ட சுயாதீன ஊடகங்களால் உறுதிப்படுத்தப்பட்ட அவசர நிகழ்வுகளை உடனுக்குடன் வழங்குகிறது.',
    },
    keywords: [
      'Sri Lanka Breaking News',
      'Colombo Urgent News',
      'Sri Lanka Live Updates',
      'උණුසුම් පුවත්',
      'முக்கிய செய்திகள்',
    ],
  },
  economy: {
    slug: 'economy',
    title: {
      en: '📊 Economy & Financial Markets',
      si: '📊 ආර්ථික හා මූල්‍ය වෙළඳපොළ',
      ta: '📊 பொருளாதாரம் & நிதிச் சந்தை',
    },
    seoTitle: {
      en: 'Sri Lanka Economy & Markets — CBSL Rates, CSE ASPI, IMF & Trade',
      si: 'ශ්‍රී ලංකා ආර්ථික පුවත් — මහ බැංකු විනිමය අනුපාත, කොටස් වෙළඳපොළ සහ IMF',
      ta: 'இலங்கை பொருளாதார செய்திகள் — மத்திய வங்கி நாணய மாற்று, பங்குச் சந்தை & IMF',
    },
    description: {
      en: 'Sri Lanka macroeconomic intelligence: Central Bank (CBSL) policy rates, LKR exchange rates, Colombo Stock Exchange (CSE ASPI), IMF EFF reviews, inflation, and trade data.',
      si: 'ශ්‍රී ලංකා මහ බැංකු ප්‍රතිපත්ති පොලී අනුපාත, රුපියලේ අගය, කොළඹ කොටස් වෙළඳපොළ, ජාත්‍යන්තර මූල්‍ය අරමුදල (IMF) සහ උද්ධමන දත්ත.',
      ta: 'இலங்கை மத்திய வங்கி வட்டி வீதங்கள், ரூபாய் பெறுமதி, கொழும்பு பங்குச் சந்தை (CSE), சர்வதேச நாணய நிதியம் (IMF) மற்றும் பணவீக்கத் தகவல்கள்.',
    },
    aeoSummary: {
      en: 'The Economy & Financial Markets desk covers Central Bank of Sri Lanka (CBSL) monetary policy, Colombo Stock Exchange (ASPI/S&P SL20) performance, IMF Extended Fund Facility milestones, sovereign debt restructuring, and export sectors.',
      si: 'ආර්ථික හා මූල්‍ය වෙළඳපොළ අංශය ශ්‍රී ලංකා මහ බැංකුවේ මූල්‍ය ප්‍රතිපත්ති, කොළඹ කොටස් වෙළඳපොළ, IMF වැඩසටහන, ණය ප්‍රතිව්‍යුහගතකරණය සහ අපනයන ආදායම් පිළිබඳ දත්ත ඉදිරිපත් කරයි.',
      ta: 'பொருளாதாரம் மற்றும் நிதிச் சந்தை பிரிவு இலங்கை மத்திய வங்கியின் நாணயக் கொள்கை, கொழும்பு பங்குச் சந்தை, IMF திட்டம் மற்றும் கடன் மறுசீரமைப்பு பற்றிய தகவல்களை வழங்குகிறது.',
    },
    keywords: [
      'Sri Lanka Economy News',
      'CBSL Exchange Rates',
      'Colombo Stock Exchange ASPI',
      'IMF Sri Lanka',
      'Daily FT EconomyNext',
      'ශ්‍රී ලංකා ආර්ථිකය',
      'இலங்கை பொருளாதாரம்',
    ],
  },
  politics: {
    slug: 'politics',
    title: {
      en: '🏛️ National Politics & Governance',
      si: '🏛️ ජාතික දේශපාලනය සහ රාජ්‍ය පාලනය',
      ta: '🏛️ தேசிய அரசியல் & ஆட்சி',
    },
    seoTitle: {
      en: 'Sri Lanka Politics & Parliament — Cabinet Decisions, Bills & Elections',
      si: 'ශ්‍රී ලංකා දේශපාලන පුවත් — පාර්ලිමේන්තු විවාද, කැබිනට් තීරණ සහ මැතිවරණ',
      ta: 'இலங்கை அரசியல் செய்திகள் — பாராளுமன்ற விவாதங்கள், அமைச்சரவைத் தீர்மானங்கள்',
    },
    description: {
      en: 'Non-partisan coverage of Sri Lanka Parliament debates, Cabinet decisions, presidential directives, Supreme Court constitutional rulings, and Election Commission updates.',
      si: 'ශ්‍රී ලංකා පාර්ලිමේන්තු විවාද, කැබිනට් මණ්ඩල තීරණ, ජනාධිපති නියෝග, ශ්‍රේෂ්ඨාධිකරණ තීන්දු සහ මැතිවරණ කොමිසමේ නිවේදන.',
      ta: 'இலங்கை பாராளுமன்ற விவாதங்கள், அமைச்சரவைத் தீர்மானங்கள், ஜனாதிபதி பணிப்புரைகள், உயர்நீதிமன்றத் தீர்ப்புகள் மற்றும் தேர்தல் ஆணைக்குழு அறிவிப்புகள்.',
    },
    aeoSummary: {
      en: 'The National Politics & Governance desk provides multi-source reporting on the Parliament of Sri Lanka, Cabinet of Ministers decisions, judicial rulings, diplomatic relations, and constitutional reforms.',
      si: 'ජාතික දේශපාලන අංශය ශ්‍රී ලංකා පාර්ලිමේන්තුව, කැබිනට් මණ්ඩල තීරණ, අධිකරණ ක්‍රියාමාර්ග සහ ව්‍යවස්ථාදායක ප්‍රතිසංස්කරණ පිළිබඳ අපක්ෂපාතී වාර්තා සපයයි.',
      ta: 'தேசிய அரசியல் பிரிவு இலங்கை பாராளுமன்றம், அமைச்சரவைத் தீர்மானங்கள், நீதித்துறை நடவடிக்கைகள் மற்றும் அரசியலமைப்புச் சீர்திருத்தங்கள் குறித்த நடுநிலையான செய்திகளை வழங்குகிறது.',
    },
    keywords: [
      'Sri Lanka Politics',
      'Sri Lanka Parliament News',
      'Cabinet Decisions Sri Lanka',
      'ශ්‍රී ලංකා දේශපාලනය',
      'இலங்கை அரசியல்',
    ],
  },
  sports: {
    slug: 'sports',
    title: {
      en: '🏏 Cricket & Sports Desk',
      si: '🏏 ක්‍රිකට් සහ ක්‍රීඩා පුවත්',
      ta: '🏏 கிரிக்கெட் & விளையாட்டு',
    },
    seoTitle: {
      en: 'Sri Lanka Cricket & Sports News — Match Scores, SLC Squads & Athletics',
      si: 'ශ්‍රී ලංකා ක්‍රිකට් සහ ක්‍රීඩා පුවත් — තරග ප්‍රතිඵල සහ කණ්ඩායම් තොරතුරු',
      ta: 'இலங்கை கிரிக்கெட் மற்றும் விளையாட்டுச் செய்திகள் — போட்டி முடிவுகள்',
    },
    description: {
      en: 'Sri Lanka Cricket (SLC) national team news, Test/ODI/T20I match updates, Lanka Premier League (LPL), school rugby, and Olympic athletics coverage.',
      si: 'ශ්‍රී ලංකා ක්‍රිකට් (SLC) ජාතික කණ්ඩායමේ තොරතුරු, ටෙස්ට්, එක්දින සහ විස්සයි20 තරග ප්‍රතිඵල, LPL සහ මලල ක්‍රීඩා පුවත්.',
      ta: 'இலங்கை கிரிக்கெட் (SLC) தேசிய அணி செய்திகள், டெஸ்ட், ஒருநாள் மற்றும் T20I போட்டி முடிவுகள் மற்றும் தடகள விளையாட்டுச் செய்திகள்.',
    },
    aeoSummary: {
      en: 'The Cricket & Sports Desk covers Sri Lanka Cricket (SLC) international fixtures, ICC tournament standings, domestic Premier League matches, rugby union, and national athletics.',
      si: 'ක්‍රීඩා පුවත් අංශය ශ්‍රී ලංකා ක්‍රිකට් ජාත්‍යන්තර තරගාවලි, ICC ශ්‍රේණිගත කිරීම්, පාසල් රග්බි සහ ජාතික මලල ක්‍රීඩා තොරතුරු ආවරණය කරයි.',
      ta: 'விளையாட்டுப் பிரிவு இலங்கை கிரிக்கெட் சர்வதேச போட்டிகள், ICC தரவரிசைகள், ரக்பி மற்றும் தேசிய தடகளச் செய்திகளை வழங்குகிறது.',
    },
    keywords: [
      'Sri Lanka Cricket News',
      'SLC Match Updates',
      'Sri Lanka Sports',
      'ශ්‍රී ලංකා ක්‍රිකට්',
      'இலங்கை கிரிக்கெட்',
    ],
  },
  tech: {
    slug: 'tech',
    title: {
      en: '⚡ Technology & Digital Economy',
      si: '⚡ තාක්ෂණය සහ ඩිජිටල් ආර්ථිකය',
      ta: '⚡ தொழில்நுட்பம் & டிஜிட்டல்',
    },
    seoTitle: {
      en: 'Sri Lanka Technology & Digital Economy — AI, Telecom, Fintech & Startups',
      si: 'තාක්ෂණික පුවත් සහ ශ්‍රී ලංකාවේ ඩිජිටල් ආර්ථිකය — AI, Fintech සහ විදුලි සංදේශ',
      ta: 'இலங்கை தொழில்நுட்பம் மற்றும் டிஜிட்டல் பொருளாதாரம் — AI & தொலைத்தொடர்பு',
    },
    description: {
      en: 'Coverage of Sri Lanka digital public infrastructure, TRCSL telecom regulations, AI adoption, fintech, LankaPay, IT/BPM exports, and global tech breakthroughs.',
      si: 'ශ්‍රී ලංකාවේ ඩිජිටල් යටිතල පහසුකම්, විදුලි සංදේශ නියාමන, කෘත්‍රිම බුද්ධිය (AI), ෆින්ටෙක් සහ තොරතුරු තාක්ෂණ අපනයන පුවත්.',
      ta: 'இலங்கையின் டிஜிட்டல் உள்கட்டமைப்பு, தொலைத்தொடர்பு ஒழுங்குமுறைகள், செயற்கை நுண்ணறிவு (AI), நிதித் தொழில்நுட்பம் மற்றும் தகவல் தொழில்நுட்ப ஏற்றுமதி செய்திகள்.',
    },
    aeoSummary: {
      en: 'The Technology & Digital Economy desk tracks Sri Lanka’s IT/BPM export sector, digital ID and e-government rollouts, TRCSL spectrum policy, fintech payments, and global artificial intelligence developments.',
      si: 'තාක්ෂණික පුවත් අංශය ශ්‍රී ලංකාවේ තොරතුරු තාක්ෂණ ක්ෂේත්‍රය, ඩිජිටල් හැඳුනුම්පත් ව්‍යාපෘතිය, විදුලි සංදේශ ප්‍රතිපත්ති සහ ගෝලීය AI ප්‍රවණතා වාර්තා කරයි.',
      ta: 'தொழில்நுட்பப் பிரிவு இலங்கையின் தகவல் தொழில்நுட்பத் துறை, டிஜிட்டல் அடையாள அட்டைத் திட்டம், தொலைத்தொடர்புக் கொள்கைகள் மற்றும் உலகளாவிய AI வளர்ச்சிகளைக் கண்காணிக்கிறது.',
    },
    keywords: [
      'Sri Lanka Tech News',
      'Digital Economy Sri Lanka',
      'TRCSL Telecom Sri Lanka',
      'තාක්ෂණික පුවත්',
      'தொழில்நுட்ப செய்திகள்',
    ],
  },
};

export const TOPIC_HUBS: Record<string, TopicHubConfig> = {
  cbsl: {
    slug: 'cbsl',
    category: 'economy',
    title: {
      en: 'Central Bank of Sri Lanka (CBSL) & LKR Exchange Rates',
      si: 'ශ්‍රී ලංකා මහ බැංකුව (CBSL) සහ විනිමය අනුපාත',
      ta: 'இலங்கை மத்திய வங்கி (CBSL) & நாணய மாற்று வீதங்கள்',
    },
    shortLabel: {
      en: 'CBSL & LKR Rates',
      si: 'මහ බැංකුව / LKR',
      ta: 'மத்திய வங்கி / LKR',
    },
    seoTitle: {
      en: 'Central Bank of Sri Lanka (CBSL) News — Policy Rates, LKR to USD & Inflation',
      si: 'ශ්‍රී ලංකා මහ බැංකුව (CBSL) — පොලී අනුපාත, ඩොලර් විනිමය අනුපාතය සහ මූල්‍ය ප්‍රතිපත්ති',
      ta: 'இலங்கை மத்திய வங்கி (CBSL) செய்திகள் — வட்டி வீதங்கள் மற்றும் டொலர் பெறுமதி',
    },
    description: {
      en: 'Live coverage of Central Bank of Sri Lanka (CBSL) monetary policy reviews, Overnight Policy Rate (OPR), LKR/USD indicative exchange rates, foreign reserves, and Treasury bill auctions.',
      si: 'ශ්‍රී ලංකා මහ බැංකුවේ මූල්‍ය ප්‍රතිපත්ති විවරණ, පොලී අනුපාත, රුපියලට සාපේක්ෂව ඩොලරයේ අගය, නිල සංචිත සහ භාණ්ඩාගාර බිල්පත් වෙන්දේසි තොරතුරු.',
      ta: 'இலங்கை மத்திய வங்கியின் நாணயக் கொள்கை மீளாய்வுகள், வட்டி வீதங்கள், டொலருக்கு நிகரான ரூபாய் பெறுமதி, வெளிநாட்டுக் கையிருப்பு மற்றும் திறைசேரி உண்டியல் ஏலங்கள்.',
    },
    aeoAnswer: {
      en: 'The Central Bank of Sri Lanka (CBSL) is the national monetary authority responsible for price stability, financial system oversight, and publishing daily indicative LKR exchange rates. Under the Central Bank Act No. 16 of 2023, CBSL conducts bi-monthly monetary policy reviews targeting headline inflation of 5%.',
      si: 'ශ්‍රී ලංකා මහ බැංකුව (CBSL) දේශීය මිල ස්ථායිතාව, මූල්‍ය පද්ධති නියාමනය සහ දෛනික විනිමය අනුපාත ප්‍රකාශයට පත් කිරීම සඳහා වගකියන ජාතික මූල්‍ය අධිකාරියයි. 2023 අංක 16 දරන මහ බැංකු පනත යටතේ 5%ක උද්ධමන ඉලක්කයක් පවත්වා ගැනීමට මූල්‍ය ප්‍රතිපත්ති ක්‍රියාත්මක කරයි.',
      ta: 'இலங்கை மத்திய வங்கி (CBSL) விலை உறுதிப்பாடு, நிதி முறைமை கண்காணிப்பு மற்றும் தினசரி நாணய மாற்று வீதங்களை வெளியிடுவதற்குப் பொறுப்பான தேசிய நாணய அதிகார சபையாகும். 2023 ஆம் ஆண்டின் 16 ஆம் இலக்க மத்திய வங்கிச் சட்டத்தின் கீழ் 5% பணவீக்க இலக்கைக் கொண்டு செயற்படுகிறது.',
    },
    keyFacts: [
      {
        label: { en: 'Statutory Mandate', si: 'නීතිමය පදනම', ta: 'சட்ட அதிகாரம்' },
        value: { en: 'CBSL Act No. 16 of 2023', si: '2023 අංක 16 දරන පනත', ta: '2023 சட்டம் இல. 16' },
      },
      {
        label: { en: 'Inflation Target', si: 'උද්ධමන ඉලක්කය', ta: 'பணவீக்க இலக்கு' },
        value: { en: '5.0% Medium-Term (CCPI)', si: '5.0% මධ්‍යකාලීන (CCPI)', ta: '5.0% நடுத்தர கால (CCPI)' },
      },
      {
        label: { en: 'Key Benchmarks', si: 'ප්‍රධාන දර්ශක', ta: 'முக்கிய குறிகாட்டிகள்' },
        value: { en: 'OPR, AWPR, T-Bill Yields, USD/LKR', si: 'OPR, AWPR, භාණ්ඩාගාර පොලී, USD/LKR', ta: 'OPR, AWPR, T-Bill, USD/LKR' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What is the Central Bank of Sri Lanka inflation target?',
          si: 'ශ්‍රී ලංකා මහ බැංකුවේ උද්ධමන ඉලක්කය කුමක්ද?',
          ta: 'இலங்கை மத்திய வங்கியின் பணவீக்க இலக்கு என்ன?',
        },
        answer: {
          en: 'Under the flexible inflation targeting framework established by the Central Bank of Sri Lanka Act No. 16 of 2023, CBSL maintains a medium-term headline inflation target of 5% measured by the Colombo Consumer Price Index (CCPI).',
          si: '2023 අංක 16 දරන ශ්‍රී ලංකා මහ බැංකු පනත යටතේ කොළඹ පාරිභෝගික මිල දර්ශකය (CCPI) මත පදනම්ව 5%ක මධ්‍යකාලීන උද්ධමන ඉලක්කයක් පවත්වා ගනී.',
          ta: '2023 ஆம் ஆண்டின் 16 ஆம் இலக்க மத்திய வங்கிச் சட்டத்தின் கீழ் கொழும்பு நுகர்வோர் விலைச் சுட்டெண் (CCPI) அடிப்படையில் 5% நடுத்தர கால பணவீக்க இலக்கு பேணப்படுகிறது.',
        },
      },
      {
        question: {
          en: 'How are daily LKR exchange rates determined in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ දෛනික විනිමය අනුපාත තීරණය වන්නේ කෙසේද?',
          ta: 'இலங்கையில் தினசரி நாணய மாற்று வீதங்கள் எவ்வாறு தீர்மானிக்கப்படுகின்றன?',
        },
        answer: {
          en: 'The Sri Lankan Rupee (LKR) operates on a market-determined exchange rate regime. Each business day, CBSL publishes the USD/LKR spot middle rate and commercial bank telegraphic transfer (TT) buying and selling rates based on weighted interbank foreign exchange transactions.',
          si: 'ශ්‍රී ලංකා රුපියල වෙළඳපොළ ඉල්ලුම සහ සැපයුම මත තීරණය වන අතර, අන්තර් බැංකු විදේශ විනිමය ගනුදෙනු පදනම් කරගෙන මහ බැංකුව දෛනිකව ගැනුම් සහ විකුණුම් අනුපාත ප්‍රකාශයට පත් කරයි.',
          ta: 'இலங்கை ரூபாய் சந்தை அடிப்படையிலான மாற்று வீத முறையில் இயங்குகிறது. வங்கிகளுக்கு இடையிலான அந்நியச் செலாவணி பரிவர்த்தனைகளின் அடிப்படையில் மத்திய வங்கி தினசரி கொள்வனவு மற்றும் விற்பனை வீதங்களை வெளியிடுகிறது.',
        },
      },
    ],
    keywords: ['CBSL', 'Central Bank of Sri Lanka', 'USD to LKR', 'OPR Sri Lanka', 'Treasury Bill Auction Sri Lanka', 'Foreign Reserves Sri Lanka'],
    matchRegex: /\b(cbsl|central bank|rupee|lkr|exchange rate|monetary policy|interest rate|treasury bill|t-bill|t-bond|foreign reserve|governor weerasinghe|nandala|opr|awpr|forex)\b|මහ බැංකු|රුපියල|විනිමය|පොලී අනුපාත|සංචිත|மத்திய வங்கி|ரூபாய்|வட்டி வீதம்/i,
  },
  imf: {
    slug: 'imf',
    category: 'economy',
    title: {
      en: 'IMF Extended Fund Facility & Debt Restructuring',
      si: 'ජාත්‍යන්තර මූල්‍ය අරමුදල (IMF) සහ ණය ප්‍රතිව්‍යුහගතකරණය',
      ta: 'சர்வதேச நாணய நிதியம் (IMF) & கடன் மறுசீரமைப்பு',
    },
    shortLabel: {
      en: 'IMF & Debt Deal',
      si: 'IMF / ණය වැඩසටහන',
      ta: 'IMF & கடன் திட்டம்',
    },
    seoTitle: {
      en: 'IMF Sri Lanka News — EFF Tranche Reviews, Fiscal Targets & Debt Restructuring',
      si: 'IMF ශ්‍රී ලංකා පුවත් — විස්තීරණ ණය පහසුකම, වාරික නිදහස් කිරීම් සහ ණය ප්‍රතිව්‍යුහගතකරණය',
      ta: 'IMF இலங்கை செய்திகள் — கடன் தவணை மீளாய்வுகள் மற்றும் கடன் மறுசீரமைப்பு',
    },
    description: {
      en: 'Updates on Sri Lanka’s 48-month USD 3 Billion IMF Extended Fund Facility (EFF), staff-level agreements, primary balance targets, ISB bondholder restructuring, and bilateral creditor deals.',
      si: 'ශ්‍රී ලංකාවේ ඩොලර් බිලියන 3ක ජාත්‍යන්තර මූල්‍ය අරමුදලේ (IMF) විස්තීරණ ණය පහසුකම, සමාලෝචන වාර්තා, රාජ්‍ය මූල්‍ය ඉලක්ක සහ විදේශ ණය ප්‍රතිව්‍යුහගතකරණය.',
      ta: 'இலங்கையின் 3 பில்லியன் டொலர் IMF விரிவாக்கப்பட்ட நிதி வசதி (EFF), மீளாய்வு அறிக்கைகள், நிதி இலக்குகள் மற்றும் வெளிநாட்டுக் கடன் மறுசீரமைப்புச் செய்திகள்.',
    },
    aeoAnswer: {
      en: 'Sri Lanka is executing a 48-month Extended Fund Facility (EFF) program worth approximately USD 3 billion with the International Monetary Fund (IMF), approved in March 2023. Disbursements occur in semi-annual tranches contingent on meeting primary budget surplus targets, tax-to-GDP growth, reserve accumulation, and governance reforms.',
      si: '2023 මාර්තු මාසයේදී අනුමත කරන ලද ඇමරිකානු ඩොලර් බිලියන 3ක මාස 48ක විස්තීරණ ණය පහසුකම (EFF) යටතේ ශ්‍රී ලංකාව ජාත්‍යන්තර මූල්‍ය අරමුදල සමඟ ආර්ථික ප්‍රතිසංස්කරණ වැඩසටහනක් ක්‍රියාත්මක කරයි.',
      ta: '2023 மார்ச்சில் அங்கீகரிக்கப்பட்ட சுமார் 3 பில்லியன் அமெரிக்க டொலர் பெறுமதியான 48 மாத விரிவாக்கப்பட்ட நிதி வசதி (EFF) திட்டத்தின் கீழ் இலங்கை சர்வதேச நாணய நிதியத்துடன் பொருளாதாரச் சீர்திருத்தங்களை முன்னெடுக்கிறது.',
    },
    keyFacts: [
      {
        label: { en: 'Facility Size', si: 'මුළු ණය පහසුකම', ta: 'மொத்த நிதி வசதி' },
        value: { en: '~USD 3.0 Billion (48 Months)', si: 'ඩොලර් බිලියන 3 (මාස 48)', ta: '~USD 3.0 பில்லியன் (48 மாதங்கள்)' },
      },
      {
        label: { en: 'Primary Surplus Goal', si: 'ප්‍රාථමික ගිණුම් ඉලක්කය', ta: 'முதன்மை இருப்பு இலக்கு' },
        value: { en: '2.3% of GDP', si: 'දළ දේශීය නිෂ්පාදිතයෙන් 2.3%', ta: 'மொத்த உள்நாட்டு உற்பத்தியில் 2.3%' },
      },
      {
        label: { en: 'External Creditors', si: 'විදේශ ණයහිමියන්', ta: 'வெளிநாட்டுக் கடன் வழங்குநர்கள்' },
        value: { en: 'OCC, China Exim, ISB Bondholders', si: 'OCC, චීන එක්සිම්, ISB බැඳුම්කරහිමියන්', ta: 'OCC, சீனா எக்ஸிம், ISB பிணைமுறி' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'How does the IMF Extended Fund Facility work in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ IMF විස්තීරණ ණය පහසුකම ක්‍රියාත්මක වන්නේ කෙසේද?',
          ta: 'இலங்கையில் IMF விரிவாக்கப்பட்ட நிதி வசதி எவ்வாறு செயல்படுகிறது?',
        },
        answer: {
          en: 'The IMF reviews Sri Lanka’s macroeconomic performance every six months against quantitative performance criteria (QPCs) and structural benchmarks. Upon reaching a Staff-Level Agreement and Executive Board approval, each review unlocks a tranche of approximately USD 330–350 million.',
          si: 'ජාත්‍යන්තර මූල්‍ය අරමුදල සෑම මාස හයකට වරක් ශ්‍රී ලංකාවේ ආර්ථික ඉලක්ක පරීක්ෂා කරන අතර, විධායක මණ්ඩල අනුමැතියෙන් පසු ඩොලර් මිලියන 330-350ක පමණ වාරිකයක් නිදහස් කරයි.',
          ta: 'சர்வதேச நாணய நிதியம் ஆறு மாதங்களுக்கு ஒருமுறை இலங்கையின் பொருளாதார இலக்குகளை மதிப்பாய்வு செய்து, நிறைவேற்று சபையின் ஒப்புதலின் பின்னர் சுமார் 330–350 மில்லியன் டொலர் தவணையை விடுவிக்கிறது.',
        },
      },
    ],
    keywords: ['IMF Sri Lanka', 'Extended Fund Facility Sri Lanka', 'Sri Lanka Debt Restructuring', 'ISB Bondholders Sri Lanka', 'World Bank Sri Lanka'],
    matchRegex: /\b(imf|international monetary fund|extended fund facility|debt restructur|sovereign bond|isb|bilateral creditor|paris club|world bank|adb|asian development bank|tranche|fiscal|primary surplus|soe reform)\b|මූල්‍ය අරමුදල|ණය ප්‍රතිව්‍යුහගත|ලෝක බැංකුව|சர்வதேச நாணய நிதியம்|கடன் மறுசீரமைப்பு/i,
  },
  'economy-inflation': {
    slug: 'economy-inflation',
    category: 'economy',
    title: {
      en: 'Cost of Living, Inflation, Taxes & Consumer Prices',
      si: 'ජීවන වියදම, උද්ධමනය, බදු සහ පාරිභෝගික මිල ගණන්',
      ta: 'வாழ்க்கைச் செலவு, பணவீக்கம், வரிகள் & நுகர்வோர் விலைகள்',
    },
    shortLabel: {
      en: 'Cost of Living & Taxes',
      si: 'ජීවන වියදම / බදු',
      ta: 'வாழ்க்கைச் செலவு / வரி',
    },
    seoTitle: {
      en: 'Sri Lanka Cost of Living & Tax News — CCPI Inflation, VAT, PAYE & Market Prices',
      si: 'ශ්‍රී ලංකාවේ ජීවන වියදම, උද්ධමනය සහ බදු පුවත් — CCPI, VAT සහ භාණ්ඩ මිල',
      ta: 'இலங்கை வாழ்க்கைச் செலவு, பணவீக்கம் மற்றும் வரிச் செய்திகள் — CCPI & VAT',
    },
    description: {
      en: 'Tracking Sri Lanka consumer prices, Colombo Consumer Price Index (CCPI), National Consumer Price Index (NCPI), Inland Revenue (IRD) PAYE/VAT tax revisions, and essential food prices.',
      si: 'කොළඹ පාරිභෝගික මිල දර්ශකය (CCPI), ජාතික උද්ධමනය, දේශීය ආදායම් බදු (PAYE/VAT) සංශෝධන සහ අත්‍යවශ්‍ය ආහාර ද්‍රව්‍ය මිල ගණන්.',
      ta: 'கொழும்பு நுகர்வோர் விலைச் சுட்டெண் (CCPI), தேசிய பணவீக்கம், உள்நாட்டு இறைவரித் திருத்தங்கள் (PAYE/VAT) மற்றும் அத்தியாவசியப் பொருட்களின் விலைகள்.',
    },
    aeoAnswer: {
      en: 'Sri Lanka tracks consumer inflation through two official indices compiled by the Department of Census and Statistics (DCS): the Colombo Consumer Price Index (CCPI), released on the last working day of each month, and the National Consumer Price Index (NCPI), released on the 21st of the following month.',
      si: 'ජනලේඛන හා සංඛ්‍යාලේඛන දෙපාර්තමේන්තුව විසින් කොළඹ පාරිභෝගික මිල දර්ශකය (CCPI) සහ ජාතික පාරිභෝගික මිල දර්ශකය (NCPI) මගින් ශ්‍රී ලංකාවේ මාසික උද්ධමනය ගණනය කරනු ලබයි.',
      ta: 'தொகைமதிப்பு மற்றும் புள்ளிவிபரத் திணைக்களம் கொழும்பு நுகர்வோர் விலைச் சுட்டெண் (CCPI) மற்றும் தேசிய நுகர்வோர் விலைச் சுட்டெண் (NCPI) மூலம் இலங்கையின் மாதாந்த பணவீக்கத்தைக் கணக்கிடுகிறது.',
    },
    keyFacts: [
      {
        label: { en: 'Primary Index', si: 'ප්‍රධාන දර්ශකය', ta: 'முதன்மைச் சுட்டெண்' },
        value: { en: 'CCPI (2021=100 Base)', si: 'CCPI (2021=100 පදනම)', ta: 'CCPI (2021=100 அடிப்படை)' },
      },
      {
        label: { en: 'Statistical Agency', si: 'දත්ත ආයතනය', ta: 'புள்ளிவிபர அமைப்பு' },
        value: { en: 'Dept. of Census & Statistics', si: 'ජනලේඛන හා සංඛ්‍යාලේඛන දෙපාර්තමේන්තුව', ta: 'தொகைமதிப்பு புள்ளிவிபரத் திணைக்களம்' },
      },
      {
        label: { en: 'Tax Authority', si: 'බදු අධිකාරිය', ta: 'வரி அதிகார சபை' },
        value: { en: 'Inland Revenue Dept (IRD)', si: 'දේශීය ආදායම් දෙපාර්තමේන්තුව', ta: 'உள்நாட்டு இறைவரித் திணைக்களம்' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'What is the difference between CCPI and NCPI inflation in Sri Lanka?',
          si: 'CCPI සහ NCPI උද්ධමන දර්ශක අතර වෙනස කුමක්ද?',
          ta: 'இலங்கையில் CCPI மற்றும் NCPI பணவீக்கச் சுட்டெண்களுக்கு இடையிலான வேறுபாடு என்ன?',
        },
        answer: {
          en: 'CCPI measures urban household price changes within the Colombo district and serves as the operational target for CBSL monetary policy. NCPI covers expenditure weights across all nine provinces of Sri Lanka and is published three weeks after the reference month.',
          si: 'CCPI මගින් කොළඹ දිස්ත්‍රික්කයේ නාගරික මිල වෙනස්වීම් මනිනු ලබන අතර, NCPI මගින් දිවයිනේ පළාත් නවයම ආවරණය කරමින් ජාතික මිල මට්ටම් මනිනු ලබයි.',
          ta: 'CCPI கொழும்பு மாவட்டத்தின் நகர்ப்புற விலை மாற்றங்களை அளவிடுகிறது; NCPI இலங்கையின் ஒன்பது மாகாணங்களையும் உள்ளடக்கிய தேசிய விலை மாற்றங்களை அளவிடுகிறது.',
        },
      },
    ],
    keywords: ['Sri Lanka Inflation', 'CCPI Sri Lanka', 'Cost of Living Sri Lanka', 'VAT Sri Lanka', 'PAYE Tax Sri Lanka', 'CSE ASPI'],
    matchRegex: /\b(inflation|ccpi|ncpi|cost of living|tax|vat|paye|ird|inland revenue|customs|export|import|rice price|vegetable|consumer|salary|wage|budget|treasury|cse|aspi|stock exchange|gold price)\b|උද්ධමනය|බදු|මිල|ජීවන වියදම|අයවැය|කොටස් වෙළඳපොළ|பணவீக்கம்|வரி|விலை|வரவு செலவுத் திட்டம்/i,
  },
  'energy-ceb': {
    slug: 'energy-ceb',
    category: 'local',
    title: {
      en: 'CEB Electricity Grid, Power Cuts & CPC Fuel Prices',
      si: 'ලංවිම විදුලිබල පද්ධතිය, විදුලි කප්පාදු සහ ඉන්ධන මිල',
      ta: 'மின்சார சபை (CEB), மின்வெட்டு & எரிபொருள் விலைகள்',
    },
    shortLabel: {
      en: 'Power & Fuel (CEB/CPC)',
      si: 'විදුලිය සහ ඉන්ධන',
      ta: 'மின்சாரம் & எரிபொருள்',
    },
    seoTitle: {
      en: 'Sri Lanka Power Cut & Fuel Price News — CEB, PUCSL Tariffs & CPC Petrol/Diesel',
      si: 'ශ්‍රී ලංකා විදුලි කප්පාදු සහ ඉන්ධන මිල පුවත් — ලංවිම (CEB), PUCSL සහ සිපෙට්කෝ',
      ta: 'இலங்கை மின்வெட்டு மற்றும் எரிபொருள் விலை செய்திகள் — CEB, PUCSL & CPC',
    },
    description: {
      en: 'Updates on Ceylon Electricity Board (CEB) generation, PUCSL electricity tariff revisions, Lakvijaya & hydro reservoir levels, Litro/Laugfs LP gas, and Monthly CPC fuel price formula changes.',
      si: 'ලංකා විදුලිබල මණ්ඩලයේ (CEB) විදුලි ජනනය, PUCSL විදුලි ගාස්තු සංශෝධන, ජලාශ මට්ටම්, ගෑස් මිල සහ මාසික සිපෙට්කෝ (CPC) ඉන්ධන මිල සූත්‍රය.',
      ta: 'இலங்கை மின்சார சபை (CEB) மின் உற்பத்தி, PUCSL மின் கட்டணத் திருத்தங்கள், சமையல் எரிவாயு மற்றும் மாதாந்த பெற்றோலியக் கூட்டுத்தாபன (CPC) எரிபொருள் விலை மாற்றங்கள்.',
    },
    aeoAnswer: {
      en: 'Electricity tariffs and load-management schedules in Sri Lanka are proposed by the Ceylon Electricity Board (CEB) and regulated by the Public Utilities Commission of Sri Lanka (PUCSL). Retail fuel prices (Petrol 92/95, Auto Diesel, Super Diesel, Kerosene) are revised on the last day of each month by the Ceylon Petroleum Corporation (CPC) under a cost-reflective pricing formula.',
      si: 'ශ්‍රී ලංකාවේ විදුලි ගාස්තු සහ විදුලි සැපයුම් කාලසටහන් ලංකා විදුලිබල මණ්ඩලය (CEB) විසින් යෝජනා කර මහජන උපයෝගිතා කොමිෂන් සභාව (PUCSL) විසින් අනුමත කරනු ලබයි. ඉන්ධන මිල ගණන් සෑම මසකම අවසාන දිනයේදී මිල සූත්‍රය අනුව ලංකා ඛනිජ තෙල් නීතිගත සංස්ථාව (CPC) මගින් සංශෝධනය කෙරේ.',
      ta: 'இலங்கையில் மின் கட்டணங்கள் மற்றும் மின் விநியோக அட்டவணைகள் இலங்கை மின்சார சபையினால் (CEB) முன்மொழியப்பட்டு பொதுப் பயன்பாடுகள் ஆணைக்குழுவினால் (PUCSL) அங்கீகரிக்கப்படுகின்றன. எரிபொருள் விலைகள் ஒவ்வொரு மாத இறுதியிலும் பெற்றோலியக் கூட்டுத்தாபனத்தினால் (CPC) திருத்தப்படுகின்றன.',
    },
    keyFacts: [
      {
        label: { en: 'Grid Regulator', si: 'විදුලි නියාමකයා', ta: 'மின்சார ஒழுங்குமுறை' },
        value: { en: 'PUCSL & CEB / LECO', si: 'PUCSL සහ ලංවිම / LECO', ta: 'PUCSL & CEB / LECO' },
      },
      {
        label: { en: 'Fuel Revision Cycle', si: 'ඉන්ධන මිල සංශෝධනය', ta: 'எரிபொருள் விலைத் திருத்தம்' },
        value: { en: 'Monthly (End of Month Formula)', si: 'මාසිකව (මස අවසානයේ)', ta: 'மாதாந்தம் (மாத இறுதி)' },
      },
      {
        label: { en: 'Interactive Utility', si: 'විදුලි කප්පාදු සිතියම', ta: 'மின்வெட்டு வரைபடம்' },
        value: { en: 'lankadispatch.com/powercut', si: 'lankadispatch.com/powercut', ta: 'lankadispatch.com/powercut' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'When are fuel prices revised in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ ඉන්ධන මිල සංශෝධනය කරන්නේ කවදාද?',
          ta: 'இலங்கையில் எரிபொருள் விலைகள் எப்போது திருத்தப்படுகின்றன?',
        },
        answer: {
          en: 'Ceylon Petroleum Corporation (CPC), Lanka IOC, and Sinopec revise retail fuel prices at midnight on the final day of each calendar month based on Singapore Platts benchmark crude/refined product averages and the USD/LKR exchange rate.',
          si: 'සිංගප්පූරු ප්ලැට්ස් (Platts) මිල දර්ශකය සහ ඩොලර් විනිමය අනුපාතය පදනම් කරගෙන සෑම මසකම අවසන් දින මධ්‍යම රාත්‍රියේදී CPC, LIOC සහ Sinopec ඉන්ධන මිල සංශෝධනය කෙරේ.',
          ta: 'சிங்கப்பூர் பிளாட்ஸ் (Platts) விலைச் சுட்டெண் மற்றும் டொலர் மாற்று வீதத்தின் அடிப்படையில் ஒவ்வொரு மாதத்தின் இறுதி நாள் நள்ளிரவில் CPC, LIOC மற்றும் Sinopec எரிபொருள் விலைகள் திருத்தப்படுகின்றன.',
        },
      },
    ],
    keywords: ['CEB Sri Lanka', 'PUCSL Power Cut', 'CPC Fuel Price Sri Lanka', 'Petrol 92 Price Sri Lanka', 'Litro Gas Price', 'Electricity Tariff Sri Lanka'],
    matchRegex: /\b(ceb|pucsl|electricity|power cut|load shedding|lakvijaya|norochcholai|kelanitissa|grid|substation|tariff|fuel|petrol|diesel|kerosene|cpc|ceypetco|lioc|sinopec|litro|laugfs|cooking gas|renewable|solar|hydro)\b|විදුලි|ලංවිම|ඉන්ධන|පෙට්‍රල්|ඩීසල්|ගෑස්|மின்சார|மின்வெட்டு|எரிபொருள்|பெற்றோல்|டீசல்/i,
  },
  'parliament-politics': {
    slug: 'parliament-politics',
    category: 'politics',
    title: {
      en: 'Sri Lanka Parliament, Cabinet & National Governance',
      si: 'ශ්‍රී ලංකා පාර්ලිමේන්තුව, කැබිනට් තීරණ සහ රාජ්‍ය පාලනය',
      ta: 'இலங்கை பாராளுமன்றம், அமைச்சரவை & தேசிய ஆட்சி',
    },
    shortLabel: {
      en: 'Parliament & Cabinet',
      si: 'පාර්ලිමේන්තුව / කැබිනට්',
      ta: 'பாராளுமன்றம் / அமைச்சரவை',
    },
    seoTitle: {
      en: 'Sri Lanka Parliament & Cabinet News — Bills, Constitutional Reforms & Judiciary',
      si: 'ශ්‍රී ලංකා පාර්ලිමේන්තුව සහ කැබිනට් තීරණ — පනත් කෙටුම්පත් සහ අධිකරණ පුවත්',
      ta: 'இலங்கை பாராளுமன்றம் மற்றும் அமைச்சரவைச் செய்திகள் — சட்டமூலங்கள் & நீதித்துறை',
    },
    description: {
      en: 'Direct reporting on the Parliament of Sri Lanka (225 MPs), weekly Cabinet of Ministers press briefings, Supreme Court determinations, COPE/COPA oversight committees, and Election Commission notices.',
      si: 'ශ්‍රී ලංකා පාර්ලිමේන්තු සැසිවාර, සතිපතා කැබිනට් තීරණ දැනුම්දීම්, COPE/COPA කමිටු, ශ්‍රේෂ්ඨාධිකරණ තීන්දු සහ මැතිවරණ කොමිෂන් සභා වාර්තා.',
      ta: 'இலங்கை பாராளுமன்ற அமர்வுகள், வாராந்த அமைச்சரவை முடிவுகள், COPE/COPA குழுக்கள், உயர்நீதிமன்றத் தீர்ப்புகள் மற்றும் தேர்தல் ஆணைக்குழு அறிவிப்புகள்.',
    },
    aeoAnswer: {
      en: 'The Parliament of Sri Lanka is a unicameral legislature of 225 Members of Parliament (196 elected from 22 multi-member electoral districts and 29 appointed via the National List) serving a five-year term. Executive Cabinet decisions are announced weekly following the Tuesday Cabinet of Ministers meeting in Colombo.',
      si: 'ශ්‍රී ලංකා පාර්ලිමේන්තුව මැතිවරණ දිස්ත්‍රික්ක 22කින් තේරී පත්වන මන්ත්‍රීවරුන් 196ක් සහ ජාතික ලැයිස්තු මන්ත්‍රීවරුන් 29ක් ඇතුළුව මුළු මන්ත්‍රීවරුන් 225 දෙනෙකුගෙන් සමන්විත වේ.',
      ta: 'இலங்கை பாராளுமன்றம் 22 தேர்தல் மாவட்டங்களில் இருந்து தெரிவு செய்யப்படும் 196 உறுப்பினர்கள் மற்றும் தேசியப் பட்டியல் மூலம் நியமிக்கப்படும் 29 உறுப்பினர்கள் உட்பட மொத்தம் 225 பாராளுமன்ற உறுப்பினர்களைக் கொண்டது.',
    },
    keyFacts: [
      {
        label: { en: 'Legislature Composition', si: 'පාර්ලිමේන්තු සංයුතිය', ta: 'பாராளுமன்ற அமைப்பு' },
        value: { en: '225 MPs (196 District + 29 National List)', si: 'මන්ත්‍රීවරුන් 225 (196 + 29)', ta: '225 உறுப்பினர்கள் (196 + 29)' },
      },
      {
        label: { en: 'Oversight Committees', si: 'අධීක්ෂණ කමිටු', ta: 'மேற்பார்வைக் குழுக்கள்' },
        value: { en: 'COPE, COPA, Public Finance Committee', si: 'COPE, COPA, මුදල් කාරක සභාව', ta: 'COPE, COPA, பொது நிதிக் குழு' },
      },
      {
        label: { en: 'Constitutional Court', si: 'ඉහළම අධිකරණය', ta: 'உயர் நீதிமன்றம்' },
        value: { en: 'Supreme Court of Sri Lanka', si: 'ශ්‍රී ලංකා ශ්‍රේෂ්ඨාධිකරණය', ta: 'இலங்கை உயர்நீதிமன்றம்' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'When are Cabinet decisions announced in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ කැබිනට් තීරණ ප්‍රකාශයට පත් කරන්නේ කවදාද?',
          ta: 'இலங்கையில் அமைச்சரவைத் தீர்மானங்கள் எப்போது அறிவிக்கப்படுகின்றன?',
        },
        answer: {
          en: 'The Cabinet of Ministers typically convenes on Mondays, and official Cabinet decisions are briefed to the media by the Cabinet Spokesperson at the Department of Government Information on Tuesday mornings.',
          si: 'කැබිනට් මණ්ඩලය සාමාන්‍යයෙන් සඳුදා දිනවල රැස්වන අතර, අඟහරුවාදා පෙරවරුවේ රජයේ ප්‍රවෘත්ති දෙපාර්තමේන්තුවේදී කැබිනට් ප්‍රකාශක විසින් නිල තීරණ මාධ්‍ය වෙත නිකුත් කරනු ලබයි.',
          ta: 'அமைச்சரவை பொதுவாக திங்கட்கிழமைகளில் கூடுகிறது, மேலும் செவ்வாய்க்கிழமை காலை அரசாங்க தகவல் திணைக்களத்தில் அமைச்சரவைப் பேச்சாளரால் உத்தியோகபூர்வ தீர்மானங்கள் அறிவிக்கப்படுகின்றன.',
        },
      },
    ],
    keywords: ['Sri Lanka Parliament', 'Cabinet Decisions Sri Lanka', 'President Anura Kumara Dissanayake', 'Supreme Court Sri Lanka', 'Election Commission Sri Lanka'],
    matchRegex: /\b(parliament|cabinet|president|prime minister|minister|ministry|dissanayake|akd|sajith|premadasa|ranil|wickremesinghe|rajapaksa|harini|amarasuriya|vijitha|herath|npp|sjb|slpp|unp|itak|speaker|gazette|supreme court|attorney general|bribery|ciaboc|cid|election commission|cope|copa)\b|පාර්ලිමේන්තු|කැබිනට්|ජනාධිපති|අගමැති|අමාත්‍ය|ශ්‍රේෂ්ඨාධිකරණ|මැතිවරණ|பாராளுமன்ற|அமைச்சரவை|ஜனாதிபதி|பிரதமர்|அமைச்சர்|நீதிமன்றம்|தேர்தல்/i,
  },
  cricket: {
    slug: 'cricket',
    category: 'sports',
    title: {
      en: 'Sri Lanka Cricket (SLC) & International Fixtures',
      si: 'ශ්‍රී ලංකා ක්‍රිකට් (SLC) සහ ජාත්‍යන්තර තරගාවලි',
      ta: 'இலங்கை கிரிக்கெட் (SLC) & சர்வதேச போட்டிகள்',
    },
    shortLabel: {
      en: 'Sri Lanka Cricket',
      si: 'ශ්‍රී ලංකා ක්‍රිකට්',
      ta: 'இலங்கை கிரிக்கெட்',
    },
    seoTitle: {
      en: 'Sri Lanka Cricket News Today — SLC Squads, Live Scores, ICC Rankings & LPL',
      si: 'ශ්‍රී ලංකා ක්‍රිකට් පුවත් — ජාතික සංචිතය, තරග ලකුණු, ICC ශ්‍රේණිගත කිරීම් සහ LPL',
      ta: 'இலங்கை கிரிக்கெட் செய்திகள் — SLC அணி, போட்டி முடிவுகள் & ICC தரவரிசை',
    },
    description: {
      en: 'Complete coverage of the Sri Lanka national men’s and women’s cricket teams, Test Championship series, ODI & T20I squads, Pathum Nissanka, Kamindu Mendis, Wanindu Hasaranga, Charith Asalanka, and LPL.',
      si: 'ශ්‍රී ලංකා ජාතික ක්‍රිකට් කණ්ඩායමේ ටෙස්ට්, එක්දින සහ විස්සයි20 තරගාවලි, ක්‍රීඩක දක්ෂතා, ICC ශ්‍රේණිගත කිරීම් සහ ලංකා ප්‍රිමියර් ලීග් (LPL) පුවත්.',
      ta: 'இலங்கை தேசிய ஆடவர் மற்றும் மகளிர் கிரிக்கெட் அணிகளின் டெஸ்ட், ஒருநாள் மற்றும் T20I தொடர்கள், வீரர்கள் விபரம் மற்றும் லங்கா பிரீமியர் லீக் (LPL) செய்திகள்.',
    },
    aeoAnswer: {
      en: 'Sri Lanka Cricket (SLC) governs professional and international cricket in Sri Lanka, hosting Test, ODI, and T20I fixtures primarily at R. Premadasa International Cricket Stadium (Colombo), Pallekele International Cricket Stadium (Kandy), Galle International Stadium, and Rangiri Dambulla International Stadium.',
      si: 'ශ්‍රී ලංකා ක්‍රිකට් ආයතනය (SLC) දිවයිනේ ජාත්‍යන්තර සහ දේශීය ක්‍රිකට් පාලනාධිකාරිය වන අතර කොළඹ ආර්. ප්‍රේමදාස, මහනුවර පල්ලෙකැලේ, ගාල්ල සහ දඹුල්ල ජාත්‍යන්තර ක්‍රීඩාංගණවල ප්‍රධාන තරග පවත්වයි.',
      ta: 'இலங்கை கிரிக்கெட் நிறுவனம் (SLC) நாட்டின் சர்வதேச மற்றும் உள்நாட்டு கிரிக்கெட்டை நிர்வகிக்கிறது. கொழும்பு ஆர். பிரேமதாச, கண்டி பல்லேகல, காலி மற்றும் தம்புள்ளை மைதானங்களில் போட்டிகள் நடத்தப்படுகின்றன.',
    },
    keyFacts: [
      {
        label: { en: 'Governing Body', si: 'පාලන ආයතනය', ta: 'நிர்வாக அமைப்பு' },
        value: { en: 'Sri Lanka Cricket (SLC)', si: 'ශ්‍රී ලංකා ක්‍රිකට් (SLC)', ta: 'இலங்கை கிரிக்கெட் (SLC)' },
      },
      {
        label: { en: 'Major Venues', si: 'ප්‍රධාන ක්‍රීඩාංගණ', ta: 'முக்கிய மைதானங்கள்' },
        value: { en: 'R. Premadasa, Galle, Pallekele, Dambulla', si: 'ආර්. ප්‍රේමදාස, ගාල්ල, පල්ලෙකැලේ, දඹුල්ල', ta: 'ஆர். பிரேமதாச, காலி, பல்லேகல, தம்புள்ளை' },
      },
      {
        label: { en: 'World Titles', si: 'ලෝක ශූරතා', ta: 'உலக சம்பியன் பட்டங்கள்' },
        value: { en: '1996 Cricket World Cup, 2014 T20 World Cup, 6× Asia Cup', si: '1996 ලෝක කුසලානය, 2014 T20, ආසියානු කුසලාන 6', ta: '1996 உலகக் கிண்ணம், 2014 T20, 6× ஆசியக் கிண்ணம்' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'Which stadiums host international cricket matches in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ ජාත්‍යන්තර ක්‍රිකට් තරග පැවැත්වෙන ප්‍රධාන ක්‍රීඩාංගණ මොනවාද?',
          ta: 'இலங்கையில் சர்வதேச கிரிக்கெட் போட்டிகள் நடைபெறும் முக்கிய மைதானங்கள் எவை?',
        },
        answer: {
          en: 'International cricket in Sri Lanka is primarily played at R. Premadasa Stadium and Sinhalese Sports Club (SSC) in Colombo, Galle International Stadium, Pallekele International Cricket Stadium in Kandy, and Rangiri Dambulla International Stadium.',
          si: 'කොළඹ ආර්. ප්‍රේමදාස සහ SSC ක්‍රීඩාංගණ, ගාල්ල ජාත්‍යන්තර ක්‍රීඩාංගණය, මහනුවර පල්ලෙකැලේ ක්‍රීඩාංගණය සහ රංගිරි දඹුල්ල ජාත්‍යන්තර ක්‍රීඩාංගණය ප්‍රධාන ජාත්‍යන්තර ක්‍රීඩාංගණ වේ.',
          ta: 'கொழும்பு ஆர். பிரேமதாச மற்றும் SSC மைதானம், காலி சர்வதேச மைதானம், கண்டி பல்லேகல மைதானம் மற்றும் ரங்கிரி தம்புள்ளை சர்வதேச மைதானம் ஆகியன முக்கிய மைதானங்களாகும்.',
        },
      },
    ],
    keywords: ['Sri Lanka Cricket', 'SLC News', 'Charith Asalanka', 'Kamindu Mendis', 'Wanindu Hasaranga', 'Pathum Nissanka', 'Sanath Jayasuriya'],
    matchRegex: /\b(cricket|slc|lpl|icc|test match|odi|t20|wicket|century|innings|asalanka|hasaranga|nissanka|mendis|jayasuriya|theekshana|pathirana|madushanka|wellalage|karunaratne|chandimal|mathews|kusal|premadasa stadium|pallekele|galle test|chamari|athapaththu)\b|ක්‍රිකට්|කඩුලු|ලකුණු|තරගාවලිය|கிரிக்கெட்|ஓட்டங்கள்|விக்கெட்/i,
  },
  'tourism-aviation': {
    slug: 'tourism-aviation',
    category: 'economy',
    title: {
      en: 'Sri Lanka Tourism, Visa Policy & Aviation',
      si: 'ශ්‍රී ලංකා සංචාරක කර්මාන්තය, වීසා සහ ගුවන් සේවා',
      ta: 'இலங்கை சுற்றுலாத்துறை, விசா & விமானப் போக்குவரத்து',
    },
    shortLabel: {
      en: 'Tourism & Aviation',
      si: 'සංචාරක / ගුවන් සේවා',
      ta: 'சுற்றுலா & விமானம்',
    },
    seoTitle: {
      en: 'Sri Lanka Tourism & Aviation News — Tourist Arrivals, SLTDA, Visa & SriLankan Airlines',
      si: 'ශ්‍රී ලංකා සංචාරක සහ ගුවන් සේවා පුවත් — සංචාරක පැමිණීම්, වීසා සහ ශ්‍රීලංකන් ගුවන් සේවය',
      ta: 'இலங்கை சுற்றுலா மற்றும் விமானப் போக்குவரத்துச் செய்திகள் — சுற்றுலாப் பயணிகள் வருகை',
    },
    description: {
      en: 'Monthly SLTDA tourist arrival statistics, Katunayake (BIA) & Mattala airport updates, SriLankan Airlines fleet & restructuring, free-visa / ETA policy, and hospitality revenue.',
      si: 'ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරියේ (SLTDA) සංචාරක පැමිණීමේ දත්ත, කටුනායක ගුවන්තොටුපළ, ශ්‍රීලංකන් ගුවන් සේවය සහ වීසා ප්‍රතිපත්ති පුවත්.',
      ta: 'இலங்கை சுற்றுலா அபிவிருத்தி அதிகார சபையின் (SLTDA) சுற்றுலாப் பயணிகள் வருகைத் தரவுகள், கட்டுநாயக்க விமான நிலையம், ஸ்ரீலங்கன் எயார்லைன்ஸ் மற்றும் விசா கொள்கைச் செய்திகள்.',
    },
    aeoAnswer: {
      en: 'The Sri Lanka Tourism Development Authority (SLTDA) publishes official monthly foreign tourist arrival statistics and hospitality metrics, while the Department of Immigration and Emigration manages Electronic Travel Authorization (ETA) and visa-free entry programs through Bandaranaike International Airport (CMB).',
      si: 'ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරිය (SLTDA) මාසික විදේශ සංචාරක පැමිණීමේ නිල සංඛ්‍යාලේඛන ප්‍රකාශයට පත් කරන අතර, ආගමන හා විගමන දෙපාර්තමේන්තුව විසින් ETA සහ වීසා පහසුකම් ක්‍රියාත්මක කරයි.',
      ta: 'இலங்கை சுற்றுலா அபிவிருத்தி அதிகார சபை (SLTDA) மாதாந்த வெளிநாட்டு சுற்றுலாப் பயணிகளின் வருகை புள்ளிவிபரங்களை வெளியிடுவதுடன், குடிவரவு மற்றும் குடியகல்வுத் திணைக்களம் ETA மற்றும் விசா சேவைகளை நிர்வகிக்கிறது.',
    },
    keyFacts: [
      {
        label: { en: 'Tourism Regulator', si: 'සංචාරක අධිකාරිය', ta: 'சுற்றுலா அதிகார சபை' },
        value: { en: 'SLTDA (sltda.gov.lk)', si: 'SLTDA (sltda.gov.lk)', ta: 'SLTDA (sltda.gov.lk)' },
      },
      {
        label: { en: 'Primary Hub', si: 'ප්‍රධාන ගුවන්තොටුපළ', ta: 'முதன்மை விமான நிலையம்' },
        value: { en: 'Bandaranaike Int’l Airport (CMB)', si: 'කටුනායක ජාත්‍යන්තර ගුවන්තොටුපළ (BIA)', ta: 'பண்டாரநாயக்க சர்வதேச விமான நிலையம் (CMB)' },
      },
      {
        label: { en: 'National Carrier', si: 'ජාතික ගුවන් සේවය', ta: 'தேசிய விமான சேவை' },
        value: { en: 'SriLankan Airlines (UL)', si: 'ශ්‍රීලංකන් ගුවන් සේවය (UL)', ta: 'ஸ்ரீலங்கன் எயார்லைன்ஸ் (UL)' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'Which authority publishes official tourist arrival numbers in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ නිල සංචාරක පැමිණීමේ දත්ත ප්‍රකාශයට පත් කරන්නේ කවුරුන්ද?',
          ta: 'இலங்கையில் உத்தியோகபூர்வ சுற்றுலாப் பயணிகள் வருகை தரவுகளை வெளியிடுவது யார்?',
        },
        answer: {
          en: 'The Sri Lanka Tourism Development Authority (SLTDA) compiles and releases weekly and monthly tourist arrival reports categorized by source market (India, Russia, UK, Germany, China, etc.), alongside CBSL foreign exchange earnings estimates.',
          si: 'ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරිය (SLTDA) විසින් රටවල් අනුව සතිපතා සහ මාසික සංචාරක පැමිණීමේ වාර්තා ප්‍රකාශයට පත් කරනු ලබයි.',
          ta: 'இலங்கை சுற்றுலா அபிவிருத்தி அதிகார சபை (SLTDA) வாராந்த மற்றும் மாதாந்த சுற்றுலாப் பயணிகளின் வருகை அறிக்கைகளை நாடுகளின் அடிப்படையில் வெளியிடுகிறது.',
        },
      },
    ],
    keywords: ['Sri Lanka Tourism', 'SLTDA Tourist Arrivals', 'SriLankan Airlines', 'Katunayake Airport BIA', 'Sri Lanka Visa ETA'],
    matchRegex: /\b(tourism|tourist|sltda|srilankan airlines|aviation|airport|katunayake|bia|mattala|visa|eta|passport|immigration|hotel|hospitality|ella|sigiriya|yala|mirissa)\b|සංචාරක|ගුවන්තොටුපළ|ගුවන් සේවා|වීසා|විදේශ ගමන් බලපත්‍ර|சுற்றுலா|விமான நிலையம்|விசா|கடவுச்சீட்டு/i,
  },
  'weather-disaster': {
    slug: 'weather-disaster',
    category: 'local',
    title: {
      en: 'Sri Lanka Weather, Monsoon Alerts & DMC Advisories',
      si: 'ශ්‍රී ලංකා කාලගුණ වාර්තා, මෝසම් වැසි සහ ආපදා නිවේදන',
      ta: 'இலங்கை வானிலை, பருவமழை எச்சரிக்கைகள் & இடர் முகாமைத்துவம்',
    },
    shortLabel: {
      en: 'Weather & Alerts',
      si: 'කාලගුණ / ආපදා',
      ta: 'வானிலை & இடர்',
    },
    seoTitle: {
      en: 'Sri Lanka Weather Today — Met Department Forecasts, Rain Alerts & NBRO Warnings',
      si: 'අද කාලගුණ වාර්තාව — කාලගුණ විද්‍යා දෙපාර්තමේන්තුවේ නිවේදන සහ නායයෑම් අනතුරු ඇඟවීම්',
      ta: 'இலங்கை வானிலை அறிக்கை — வளிமண்டலவியல் திணைக்கள எச்சரிக்கைகள் மற்றும் மழைவீழ்ச்சி',
    },
    description: {
      en: 'Daily Department of Meteorology weather forecasts, red/amber heavy rain advisories, NBRO landslide warnings, Disaster Management Centre (DMC) flood updates, and naval wind warnings.',
      si: 'කාලගුණ විද්‍යා දෙපාර්තමේන්තුවේ දෛනික කාලගුණ අනාවැකි, තද වැසි පිළිබඳ රතු නිවේදන, NBRO නායයෑම් අනතුරු ඇඟවීම් සහ ආපදා කළමනාකරණ මධ්‍යස්ථානයේ තොරතුරු.',
      ta: 'வளிமண்டலவியல் திணைக்களத்தின் தினசரி வானிலை முன்னறிவிப்புகள், பலத்த மழை எச்சரிக்கைகள், NBRO மண்சரிவு அறிவிப்புகள் மற்றும் இடர் முகாமைத்துவ நிலையத் தகவல்கள்.',
    },
    aeoAnswer: {
      en: 'Official weather forecasts and cyclone warnings for Sri Lanka are issued by the Department of Meteorology (meteo.gov.lk), landslide early warnings by the National Building Research Organisation (NBRO), and flood/evacuation coordination by the Disaster Management Centre (DMC) via emergency hotline 117.',
      si: 'ශ්‍රී ලංකාවේ නිල කාලගුණ අනාවැකි කාලගුණ විද්‍යා දෙපාර්තමේන්තුව මගින්ද, නායයෑම් පූර්ව අනතුරු ඇඟවීම් ජාතික ගොඩනැගිලි පර්යේෂණ සංවිධානය (NBRO) මගින්ද, හදිසි ආපදා සම්බන්ධීකරණය ආපදා කළමනාකරණ මධ්‍යස්ථානය (DMC - 117) මගින්ද සිදු කෙරේ.',
      ta: 'இலங்கையின் உத்தியோகபூர்வ வானிலை முன்னறிவிப்புகள் வளிமண்டலவியல் திணைக்களத்தினாலும், மண்சரிவு எச்சரிக்கைகள் தேசிய கட்டிட ஆராய்ச்சி நிறுவனத்தினாலும் (NBRO), அவசர இடர் ஒருங்கிணைப்பு இடர் முகாமைத்துவ நிலையத்தினாலும் (DMC - 117) வழங்கப்படுகின்றன.',
    },
    keyFacts: [
      {
        label: { en: 'Forecasting Agency', si: 'කාලගුණ ආයතනය', ta: 'வானிலை திணைக்களம்' },
        value: { en: 'Dept. of Meteorology', si: 'කාලගුණ විද්‍යා දෙපාර්තමේන්තුව', ta: 'வளிமண்டலவியல் திணைக்களம்' },
      },
      {
        label: { en: 'Landslide Authority', si: 'නායයෑම් අංශය', ta: 'மண்சரிவுப் பிரிவு' },
        value: { en: 'NBRO Early Warning Division', si: 'NBRO පූර්ව අනතුරු ඇඟවීමේ අංශය', ta: 'NBRO ஆரம்ப எச்சரிக்கைப் பிரிவு' },
      },
      {
        label: { en: 'Emergency Hotline', si: 'හදිසි ඇමතුම්', ta: 'அவசர தொலைபேசி' },
        value: { en: '117 (Disaster Management Centre)', si: '117 (ආපදා කළමනාකරණ මධ්‍යස්ථානය)', ta: '117 (இடர் முகாமைத்துவ நிலையம்)' },
      },
    ],
    faqs: [
      {
        question: {
          en: 'Who issues official landslide and flood warnings in Sri Lanka?',
          si: 'ශ්‍රී ලංකාවේ නිල නායයෑම් සහ ගංවතුර අනතුරු ඇඟවීම් නිකුත් කරන්නේ කවුරුන්ද?',
          ta: 'இலங்கையில் உத்தியோகபூர்வ மண்சரிவு மற்றும் வெள்ள எச்சரிக்கைகளை வெளியிடுவது யார்?',
        },
        answer: {
          en: 'Landslide warnings (Level 1 Yellow, Level 2 Amber, Level 3 Red Evacuation) are issued by the National Building Research Organisation (NBRO). River basin flood alerts are issued by the Hydrology Division of the Irrigation Department, coordinated by the Disaster Management Centre (DMC).',
          si: 'නායයෑම් අනතුරු ඇඟවීම් ජාතික ගොඩනැගිලි පර්යේෂණ සංවිධානය (NBRO) මගින්ද, ගංවතුර අනතුරු ඇඟවීම් වාරිමාර්ග දෙපාර්තමේන්තුව සහ ආපදා කළමනාකරණ මධ්‍යස්ථානය (DMC) මගින්ද නිකුත් කරනු ලබයි.',
          ta: 'மண்சரிவு எச்சரிக்கைகள் தேசிய கட்டிட ஆராய்ச்சி நிறுவனத்தினாலும் (NBRO), வெள்ள எச்சரிக்கைகள் நீர்ப்பாசனத் திணைக்களம் மற்றும் இடர் முகாமைத்துவ நிலையத்தினாலும் (DMC) வெளியிடப்படுகின்றன.',
        },
      },
    ],
    keywords: ['Sri Lanka Weather Today', 'Department of Meteorology Sri Lanka', 'NBRO Landslide Warning', 'DMC Flood Alert Sri Lanka', 'Monsoon Rain Sri Lanka'],
    matchRegex: /\b(weather|meteorolog|rain|rainfall|monsoon|cyclone|flood|landslide|nbro|dmc|disaster management|reservoir|spill|thunderstorm|lightning|wind warning|heat index|drought)\b|කාලගුණ|වැසි|ගංවතුර|නායයෑම්|ආපදා|සුළං|வானிலை|மழை|வெள்ளம்|மண்சரிவு|இடர்/i,
  },
};

export const SECTION_SLUGS = Object.keys(SECTION_HUBS) as Array<Exclude<Category, 'all'>>;
export const TOPIC_SLUGS = Object.keys(TOPIC_HUBS);

export function getSectionHub(slug: string): SectionHubConfig | null {
  return SECTION_HUBS[slug as Exclude<Category, 'all'>] || null;
}

export function getTopicHub(slug: string): TopicHubConfig | null {
  return TOPIC_HUBS[slug] || null;
}

export function filterArticlesForSection(articles: Article[], category: Exclude<Category, 'all'>): Article[] {
  return articles.filter((article) => {
    if (category === 'breaking') {
      return Boolean(article.isBreaking || article.category === 'breaking');
    }
    if (category === 'local') {
      return (article.region || 'local') === 'local';
    }
    if (category === 'world') {
      return article.region === 'world';
    }
    return article.category === category;
  });
}

export function filterArticlesForTopic(articles: Article[], topicSlug: string): Article[] {
  const topic = TOPIC_HUBS[topicSlug];
  if (!topic) return [];

  const matched = articles.filter((article) => {
    const textPool = [
      article.title.en || '',
      article.title.si || '',
      article.title.ta || '',
      article.summary.en || '',
      article.summary.si || '',
      article.summary.ta || '',
      ...(article.aiBullets?.en || []),
      article.publisherName || '',
    ].join(' ');
    return topic.matchRegex.test(textPool);
  });

  if (matched.length >= 2) {
    return matched;
  }

  // Fallback: include articles from the topic's parent category so the hub always provides live context
  const categoryFallback = filterArticlesForSection(articles, topic.category);
  const seen = new Set(matched.map((a) => a.id));
  const combined = [...matched];
  for (const art of categoryFallback) {
    if (!seen.has(art.id)) {
      combined.push(art);
      seen.add(art.id);
    }
    if (combined.length >= 12) break;
  }
  return combined;
}

export function getMatchingTopicsForArticle(article: Article): TopicHubConfig[] {
  const textPool = [
    article.title.en || '',
    article.title.si || '',
    article.title.ta || '',
    article.summary.en || '',
    article.summary.si || '',
    article.summary.ta || '',
    ...(article.aiBullets?.en || []),
    article.publisherName || '',
  ].join(' ');

  return Object.values(TOPIC_HUBS).filter((topic) => topic.matchRegex.test(textPool));
}
