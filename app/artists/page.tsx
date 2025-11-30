import { Metadata } from 'next';
import { getArtistsContent, defaultArtistsContent } from '@/lib/content';
import { generateArtistsMetadata, generateBreadcrumbStructuredData } from '@/lib/metadata';
import { getAllArtists } from '@/functions/dbFunction';
import ArtistsContent from './ArtistsContent';

export const revalidate = 60; // Revalidate every 60 seconds

interface Artist {
    _id?: { toString(): string } | string;
    artistId?: string;
    name: string;
    photo: string;
    tagline?: string;
    gallery?: string[];
    isActive?: boolean;
}

interface ArtistResult {
    success: boolean;
    data?: {
        artists: Artist[];
    };
    message?: string;
    error?: string;
}

async function getArtists() {
    try {
        const result = await getAllArtists({ isActive: true }) as ArtistResult;

        if (result.success && result.data?.artists) {
            // Transform artists data for the component
            return result.data.artists.map((artist) => ({
                id: artist._id?.toString() || artist.artistId || '',
                name: artist.name,
                photo: artist.photo,
                tagline: artist.tagline || '',
            }));
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch artists:', error);
        return [];
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const content = await getArtistsContent();
    return generateArtistsMetadata(content);
}

export default async function Artists() {
    const content = await getArtistsContent() || defaultArtistsContent;
    const artists = await getArtists();

    // Generate structured data
    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
        { name: 'Home', url: '/' },
        { name: 'Our Artists', url: '/artists' }
    ]);

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={breadcrumbStructuredData}
            />

            {/* Page Content */}
            <ArtistsContent artists={artists} />
        </>
    );
}
