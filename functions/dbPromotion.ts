import { ObjectId } from 'mongodb';
import { getDatabase } from '../util/mongodb/mongodb';
import { formatDate, createErrorResponse, createSuccessResponse } from './generalFunction';

// ============================================================================
// PROMOTION FUNCTIONS
// ============================================================================

/**
 * Get all promotions with filtering
 * @param options - Query options (isActive)
 * @returns Promise<object> - Success or error response with promotion data
 */
export async function getAllPromotions(options: {
  isActive?: boolean;
} = {}): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    // Build query filter
    const filter: any = {};
    if (options.isActive !== undefined) filter.isActive = options.isActive;
    
    // Fetch promotions
    const promotions = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    return createSuccessResponse({ promotions }, 'Promotions retrieved successfully');
  } catch (error) {
    console.error('Error getting all promotions:', error);
    return createErrorResponse('Failed to retrieve promotions', 500);
  }
}

/**
 * Get active promotions only (for display on menu page)
 * @returns Promise<object> - Success or error response with active promotions
 */
export async function getActivePromotions(): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    const promotions = await collection
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();
    
    return createSuccessResponse({ promotions }, 'Active promotions retrieved successfully');
  } catch (error) {
    console.error('Error getting active promotions:', error);
    return createErrorResponse('Failed to retrieve active promotions', 500);
  }
}

/**
 * Create new promotion
 * @param promotionData - Promotion data (name, image, isActive)
 * @returns Promise<object> - Success or error response
 */
export async function createPromotion(promotionData: any): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    const newPromotion = {
      ...promotionData,
      createdAt: formatDate(),
      updatedAt: formatDate(),
      isActive: promotionData.isActive !== undefined ? promotionData.isActive : true
    };
    
    const result = await collection.insertOne(newPromotion);
    
    return createSuccessResponse({
      ...newPromotion,
      _id: result.insertedId
    }, 'Promotion created successfully');
  } catch (error) {
    console.error('Error creating promotion:', error);
    return createErrorResponse('Failed to create promotion', 500);
  }
}

/**
 * Get promotion by ID
 * @param id - Promotion ID
 * @returns Promise<object> - Success or error response
 */
export async function getPromotionById(id: string): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    if (!ObjectId.isValid(id)) {
      return createErrorResponse('Invalid ID format', 400);
    }
    
    const promotion = await collection.findOne({ _id: ObjectId.createFromHexString(id) });
    
    if (!promotion) {
      return createErrorResponse('Promotion not found', 404);
    }
    
    return createSuccessResponse(promotion, 'Promotion retrieved successfully');
  } catch (error) {
    console.error('Error getting promotion by ID:', error);
    return createErrorResponse('Failed to retrieve promotion', 500);
  }
}

/**
 * Update promotion
 * @param id - Promotion ID
 * @param updateData - Data to update
 * @returns Promise<object> - Success or error response
 */
export async function updatePromotion(id: string, updateData: any): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    if (!ObjectId.isValid(id)) {
      return createErrorResponse('Invalid ID format', 400);
    }
    
    const { _id, createdAt, ...dataToUpdate } = updateData;
    dataToUpdate.updatedAt = formatDate();
    
    const result = await collection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { $set: dataToUpdate },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return createErrorResponse('Promotion not found', 404);
    }
    
    return createSuccessResponse(result, 'Promotion updated successfully');
  } catch (error) {
    console.error('Error updating promotion:', error);
    return createErrorResponse('Failed to update promotion', 500);
  }
}

/**
 * Update promotion status (toggle active/inactive)
 * @param id - Promotion ID
 * @param isActive - New status
 * @returns Promise<object> - Success or error response
 */
export async function updatePromotionStatus(id: string, isActive: boolean): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    if (!ObjectId.isValid(id)) {
      return createErrorResponse('Invalid ID format', 400);
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { 
        $set: { 
          isActive,
          updatedAt: formatDate()
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return createErrorResponse('Promotion not found', 404);
    }
    
    return createSuccessResponse(result, 'Promotion status updated successfully');
  } catch (error) {
    console.error('Error updating promotion status:', error);
    return createErrorResponse('Failed to update promotion status', 500);
  }
}

/**
 * Delete promotion (soft delete by setting isActive to false)
 * @param id - Promotion ID
 * @returns Promise<object> - Success or error response
 */
export async function deletePromotion(id: string): Promise<object> {
  try {
    const db = await getDatabase();
    const collection = db.collection('promotion');
    
    if (!ObjectId.isValid(id)) {
      return createErrorResponse('Invalid ID format', 400);
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(id) },
      { 
        $set: { 
          isActive: false,
          updatedAt: formatDate()
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return createErrorResponse('Promotion not found', 404);
    }
    
    return createSuccessResponse(null, 'Promotion deleted successfully');
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return createErrorResponse('Failed to delete promotion', 500);
  }
}
