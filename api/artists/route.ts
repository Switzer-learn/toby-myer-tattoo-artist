import { NextRequest, NextResponse } from 'next/server';
import { getAllArtists, createArtist } from '../../functions/dbFunction';
import { getToken } from 'next-auth/jwt';

/**
 * GET /api/artists
 * Fetch all artists
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const options: any = {};
    if (isActive !== null) {
      options.isActive = isActive === 'true';
    }

    const result = await getAllArtists(options) as {
      success: boolean;
      data?: any;
      message?: string;
      error?: string;
    };

    console.log("all artists result", result)

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/artists:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/artists
 * Create a new artist (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token.role !== 'admin' && token.role !== 'owner')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const artistData = await request.json();

    // Validate required fields (only name is required now, MongoDB will generate _id)
    if (!artistData.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const result = await createArtist(artistData) as {
      success: boolean;
      data?: any;
      message?: string;
      error?: string;
    };

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      const status = result.error?.includes('already exists') ? 409 : 500;
      return NextResponse.json(result, { status });
    }
  } catch (error) {
    console.error('Error in POST /api/artists:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
