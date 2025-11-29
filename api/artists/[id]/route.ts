import { NextRequest, NextResponse } from 'next/server';
import { getArtistById, updateArtist, deleteArtist } from '../../../functions/dbFunction';
import { getToken } from 'next-auth/jwt';

/**
 * GET /api/artists/[id]
 * Get a single artist by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await getArtistById(id) as {
      success: boolean;
      data?: any;
      message?: string;
      error?: string;
    };

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      const status = result.error?.includes('not found') ? 404 : 500;
      return NextResponse.json(result, { status });
    }
  } catch (error) {
    console.error('Error in GET /api/artists/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/artists/[id]
 * Update an artist (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token.role !== 'admin' && token.role !== 'owner')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updateData = await request.json();

    const result = await updateArtist(id, updateData) as {
      success: boolean;
      data?: any;
      message?: string;
      error?: string;
    };

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      const status = result.error?.includes('not found') ? 404 :
                     result.error?.includes('already in use') ? 409 : 500;
      return NextResponse.json(result, { status });
    }
  } catch (error) {
    console.error('Error in PUT /api/artists/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/artists/[id]
 * Delete an artist (soft delete, admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token.role !== 'admin' && token.role !== 'owner')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await deleteArtist(id) as {
      success: boolean;
      data?: any;
      message?: string;
      error?: string;
    };

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      const status = result.error?.includes('not found') ? 404 : 500;
      return NextResponse.json(result, { status });
    }
  } catch (error) {
    console.error('Error in DELETE /api/artists/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
