import { Metadata } from 'next';
import { generateBreadcrumbStructuredData } from '@/lib/metadata';
import { getArtistById } from '@/functions/dbFunction';
import ArtistDetailContent from './ArtistDetailContent';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

interface Props {
  params: Promise<{ id: string }>;
}

interface Artist {
  _id?: { toString(): string } | string;
  name: string;
  photo: string;
  displayPhoto?: string;
  tagline: string;
  gallery: string[];
  isActive?: boolean;
}

interface ArtistResult {
  success: boolean;
  data?: Artist;
  message?: string;
  error?: string;
}

async function getArtist(id: string) {
  try {
    const result = await getArtistById(id) as ArtistResult;

    if (result.success && result.data) {
      const artist = result.data;

      // Only show active artists
      if (artist.isActive === false) {
        return null;
      }

      return {
        _id: artist._id?.toString() || id,
        name: artist.name,
        photo: artist.photo,
        displayPhoto: artist.displayPhoto,
        tagline: artist.tagline || '',
        gallery: artist.gallery || [],
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch artist:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtist(id);

  if (!artist) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.'
    };
  }

  return {
    title: `${artist.name} - Toby Myer Tattoo`,
    description: `View ${artist.name}'s portfolio and tattoo work. ${artist.tagline}`,
  };
}

export default async function ArtistDetail({ params }: Props) {
  const { id } = await params;
  const artist = await getArtist(id);

  if (!artist) {
    notFound();
  }

  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Our Artists', url: '/' },
    { name: artist.name, url: `/${id}` }
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={breadcrumbStructuredData}
      />

      {/* Page Content */}
      <ArtistDetailContent
        initialArtist={artist}
      />
    </>
  );
}
