import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/config
 * Fetch site configuration including social media links
 */
export async function GET(request: NextRequest) {
  try {
    // Return default configuration
    // This should be replaced with actual database fetch when config management is implemented
    const config = {
      socialMedia: {
        facebook: 'https://facebook.com/profile.php?id=61584087054163',
        instagram: 'https://instagram.com/commandos18tattoobali',
        website: 'https://commandos18tattoo.com',
        youtube: 'https://www.youtube.com/@commandos18tattoobali',
        tiktok: 'https://www.tiktok.com/@commandos18tattoobali',
        linktree: '/',
        whatsapp: 'https://wa.me/6287777222020',
        email: 'mailto:commandos18tattoo@gmail.com'
      }
    };

    return NextResponse.json(
      { success: true, data: config },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/config:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
