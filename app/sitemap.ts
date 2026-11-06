import { MetadataRoute } from 'next';
import seoManifest from '@/public/seo-manifest.json';

export default function sitemap(): MetadataRoute.Sitemap {
  return seoManifest.entries
    .filter((entry) => entry.indexable)
    .map((entry) => ({
      url: entry.canonicalUrl,
      lastModified: new Date(entry.lastModified),
      changeFrequency: entry.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority: entry.priority,
    }));
}
