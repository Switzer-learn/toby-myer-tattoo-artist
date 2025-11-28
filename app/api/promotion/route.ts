import { NextRequest, NextResponse } from 'next/server';
import { getActivePromotions } from '../../../functions/dbPromotion';

export async function GET(req: NextRequest) {
  try {
    const result = await getActivePromotions() as {
      success: boolean;
      data?: any;
      message?: string;
      error?: string;
    };

    if (result.success) {
      const promotions = result.data?.promotions || [];
      return NextResponse.json({ success: true, data: promotions }, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active promotions' },
      { status: 500 }
    );
  }
}
