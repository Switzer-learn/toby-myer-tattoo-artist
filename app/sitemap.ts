import { MetadataRoute } from 'next';
import { getAllArtists } from '@/functions/dbFunction';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://commandos18tattoo.com';
  
  // Fetch all active artists for dynamic routes
  let artistRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await getAllArtists({ isActive: true }) as any;
    if (result.success && result.data?.artists) {
      artistRoutes = result.data.artists.map((artist: any) => ({
        url: `${baseUrl}/ourArtists/${artist._id?.toString() || artist.artistId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Failed to generate artist sitemap routes:', error);
  }

  // Static routes
  const routes = [
    '',
    '/gallery',
    '/merchandise',
    '/contact',
    '/about',
    '/faq',
    '/ourArtists',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...routes, ...artistRoutes];
}
