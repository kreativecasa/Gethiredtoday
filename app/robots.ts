import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/builder/',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://gethiretoday.com/sitemap.xml',
    host: 'https://gethiretoday.com',
  };
}
