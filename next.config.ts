import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'cdn.hirunews.lk' },
      { protocol: 'https', hostname: '**.newswire.lk' },
      { protocol: 'https', hostname: 'i.guim.co.uk' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'srilankamirror.com' },
      { protocol: 'https', hostname: '**.lankabusinessonline.com' },
      { protocol: 'https', hostname: 'readme.lk' }
    ]
  },
  async rewrites() {
    return [
      // Sinhala (si) localized routes
      { source: '/si', destination: '/?lang=si' },
      { source: '/si/article/:path*', destination: '/article/:path*?lang=si' },
      { source: '/si/category/:path*', destination: '/category/:path*?lang=si' },
      { source: '/si/topic/:path*', destination: '/topic/:path*?lang=si' },
      { source: '/si/utility/:path*', destination: '/utility/:path*?lang=si' },
      { source: '/si/markets/:path*', destination: '/markets/:path*?lang=si' },
      { source: '/si/powercut', destination: '/powercut?lang=si' },
      { source: '/si/about', destination: '/about?lang=si' },
      { source: '/si/privacy', destination: '/privacy?lang=si' },
      { source: '/si/terms', destination: '/terms?lang=si' },

      // Tamil (ta) localized routes
      { source: '/ta', destination: '/?lang=ta' },
      { source: '/ta/article/:path*', destination: '/article/:path*?lang=ta' },
      { source: '/ta/category/:path*', destination: '/category/:path*?lang=ta' },
      { source: '/ta/topic/:path*', destination: '/topic/:path*?lang=ta' },
      { source: '/ta/utility/:path*', destination: '/utility/:path*?lang=ta' },
      { source: '/ta/markets/:path*', destination: '/markets/:path*?lang=ta' },
      { source: '/ta/powercut', destination: '/powercut?lang=ta' },
      { source: '/ta/about', destination: '/about?lang=ta' },
      { source: '/ta/privacy', destination: '/privacy?lang=ta' },
      { source: '/ta/terms', destination: '/terms?lang=ta' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagservices.com https://tpc.googlesyndication.com https://*.google.com https://*.doubleclick.net https://static.cloudflareinsights.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob: data: https:",
              "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.google.com https://*.googlesyndication.com https://cloudflareinsights.com https://*.google-analytics.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;
