
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { getAllArtists } from './functions/dbFunction';

async function checkOrder() {
  console.log('Fetching artists...');
  try {
    const result: any = await getAllArtists({ isActive: true });
    if (result.success && result.data && result.data.artists) {
      const artists = result.data.artists;
      console.log('Current Artists Order in Database:');
      artists.forEach((a: any) => {
        console.log(`- ${a.name}: ${a.order} (ID: ${a._id || a.artistId})`);
      });
      
      const sorted = [...artists].sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
      console.log('\nSorted Display Order (Ascending):');
      sorted.forEach((a: any) => {
        console.log(`- ${a.name}: ${a.order ?? 'N/A'}`);
      });

    } else {
      console.log('Failed to fetch artists or no artists found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkOrder();
