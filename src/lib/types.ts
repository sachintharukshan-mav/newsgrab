export type Language = 'en' | 'si' | 'ta';

export type Category = 
  | 'all'
  | 'local'
  | 'world'
  | 'breaking'
  | 'economy'
  | 'politics'
  | 'tech'
  | 'sports';

export type Region = 'local' | 'world';

export type DateRange = 'all' | '24h' | '7d' | '30d' | '1y';

export type SentimentType = 'positive' | 'neutral' | 'critical' | 'developing';

export interface SourcePerspective {
  publisherName: string;
  publisherSlug: string;
  sourceUrl: string;
  headline: string;
  publishedAt: string;
}

export interface ExecutiveBrief {
  whatHappened: string;
  keyDetails: string[];
  quotes?: string[];
  whyItMatters: string;
  whatsNext: string;
}

export interface Article {
  id: string;
  title: {
    en: string;
    si?: string;
    ta?: string;
  };
  summary: {
    en: string;
    si?: string;
    ta?: string;
  };
  aiBullets: {
    en: string[];
    si?: string[];
    ta?: string[];
  };
  brief?: Partial<Record<Language, ExecutiveBrief>>;
  sentiment: SentimentType;
  category: Category;
  region?: Region;
  imageUrl: string;
  imageCredit?: string;
  publisherName: string;
  publisherLogo?: string;
  sourceUrl: string;
  publishedAt: string;
  readTimeMinutes: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  clusterCount?: number;
  perspectives?: SourcePerspective[];
}

export interface CurrencyRate {
  code: string; // USD, EUR, GBP, AUD
  name: string;
  buyRate: number;
  sellRate: number;
  change24h: number; // percentage
}

export interface MarketPulse {
  updatedAt: string;
  cbslRates: CurrencyRate[];
  goldPrice24kPerSovereign: {
    lkr: number;
    change24h: number;
  };
  cseIndex: {
    aspi: number;
    change: number;
    changePercent: number;
  };
  colomboWeather: {
    tempC: number;
    condition: string;
    icon: string;
  };
}
