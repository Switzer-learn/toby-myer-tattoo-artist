import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/promotion
 * Fetch all active promotions
 */
export async function GET(request: NextRequest) {
  try {
    // Return empty promotions array for now
    // This should be replaced with actual database fetch when promotion management is implemented
    const promotions: any[] = [];

    return NextResponse.json(
      { success: true, data: promotions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
