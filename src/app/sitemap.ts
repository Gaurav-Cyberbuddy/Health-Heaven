import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const now = new Date().toISOString();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/assessment`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/scanner`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/voice-entry`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/profile`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}




