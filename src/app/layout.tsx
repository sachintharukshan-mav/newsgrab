import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { CookieConsent } from "@/components/compliance/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsgrab.lk';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NEWSGRAB — The Sri Lankan Dispatch & Intelligence Desk',
    template: '%s | NEWSGRAB',
  },
  description:
    'Sri Lanka’s authoritative trilingual digital dispatch. Real-time newsroom syndication across Ada Derana, Hiru, Daily Mirror, Virakesari, BBC, and CBSL verified financial indicators.',
  keywords: [
    'Sri Lanka News',
    'Colombo Wire',
    'Sri Lanka Politics',
    'Sri Lanka Economy',
    'CBSL Exchange Rates',
    'CSE ASPI Index',
    'Ada Derana',
    'Daily Mirror Sri Lanka',
    'Hiru News',
    'Virakesari',
    'ශ්‍රී ලංකා පුවත්',
    'දෙරණ',
    'හිරු',
    'දේශපාලනය',
    'ආර්ථිකය',
    'இலங்கை செய்திகள்',
    'வீரகேசரி',
    'ஹிரு',
  ],
  authors: [{ name: 'NEWSGRAB Editorial Desk', url: SITE_URL }],
  creator: 'NEWSGRAB Media Network',
  publisher: 'NEWSGRAB',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
    languages: {
      'en-LK': '/?lang=en',
      'si-LK': '/?lang=si',
      'ta-LK': '/?lang=ta',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'NEWSGRAB — The Sri Lankan Dispatch & Intelligence Desk',
    description:
      'Real-time trilingual news aggregation, CBSL macroeconomic fixing, and verified multi-newsroom perspectives.',
    url: SITE_URL,
    siteName: 'NEWSGRAB',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'NEWSGRAB Digital Newsroom Dispatch',
      },
    ],
    locale: 'en_LK',
    alternateLocale: ['si_LK', 'ta_LK'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEWSGRAB — Sri Lankan Dispatch',
    description: 'Real-time multi-newsroom reporting and verified financial data for Sri Lanka.',
    site: '@newsgrab_lk',
    creator: '@newsgrab_lk',
    images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-newsgrab-lk',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': [process.env.NEXT_PUBLIC_BING_VERIFICATION || ''],
      'google-adsense-account': [process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000'],
    },
  },
  category: 'news',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${newsreader.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.hirunews.lk" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://sinhala.adaderana.lk" />
        <link rel="dns-prefetch" href="https://feeds.bbci.co.uk" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#0b0c0e] text-[#f1f2f4]">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
