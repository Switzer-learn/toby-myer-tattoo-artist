import { ObjectId } from 'mongodb';
import { getDatabase, getWebsiteContentCollection } from '../util/mongodb/mongodb';
import { hashPassword, verifyPassword, formatDate, createErrorResponse, createSuccessResponse } from './generalFunction';

// User interface
export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'owner' | 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
  passwordChanged?: boolean; // Track if user has changed their initial password
}

// Session interface
export interface Session {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: string;
  isActive: boolean;
}

/**
 * Create a new user in the database
 * @param userData - User data (username, email, password, role)
 * @returns Promise<object> - Success or error response
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password?: string;
  role?: 'owner' | 'admin' | 'user';
}): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const query = userData.email
      ? { $or: [{ username: userData.username }, { email: userData.email }] }
      : { username: userData.username };

    const existingUser = await usersCollection.findOne(query);
    
    if (existingUser) {
      return createErrorResponse('User with this username or email already exists', 409);
    }
    
    // Handle password - if not provided, leave empty for first-time login
    let hashedPassword = '';
    let passwordChanged = false;
    
    if (userData.password && userData.password.trim() !== '') {
      hashedPassword = await hashPassword(userData.password);
      
    }
    
    // Create new user object
    const newUser: User = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: formatDate(),
      updatedAt: formatDate(),
      isActive: true,
      passwordChanged
    };
    
    // Insert user into database
    const result = await usersCollection.insertOne(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    userWithoutPassword._id = result.insertedId;
    
    return createSuccessResponse(userWithoutPassword, 'User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    return createErrorResponse('Failed to create user', 500);
  }
}

/**
 * Get user by username
 * @param username - The username to search for
 * @returns Promise<object> - Success or error response
 */
export async function getUserByUsername(username: string): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ username, isActive: true });
    
    if (!user) {
      return createErrorResponse('User not found', 404);
    }
    
    return createSuccessResponse(user, 'User found');
  } catch (error) {
    console.error('Error getting user by username:', error);
    return createErrorResponse('Failed to get user', 500);
  }
}

/**
 * Get user by ID
 * @param userId - The user ID to search for
 * @returns Promise<object> - Success or error response
 */
export async function getUserById(userId: string): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ 
      _id: ObjectId.createFromHexString(userId), 
      isActive: true 
    });
    
    if (!user) {
      return createErrorResponse('User not found', 404);
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return createSuccessResponse(userWithoutPassword, 'User found');
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return createErrorResponse('Failed to get user', 500);
  }
}

/**
 * Verify user credentials
 * @param username - The username
 * @param password - The plain text password
 * @returns Promise<object> - Success or error response
 */
export async function verifyUserCredentials(username: string, password: string): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({
      username,
      isActive: true
    });
    
    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }
    
    // Handle blank password (first-time login)
    if (!user.password || user.password === '') {
      if (password === '') {
        // Update last login
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { lastLogin: formatDate() } }
        );
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        
        return createSuccessResponse({
          ...userWithoutPassword,
          requiresPasswordChange: true
        }, 'Credentials verified - password change required');
      } else {
        return createErrorResponse('Invalid credentials', 401);
      }
    }
    
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return createErrorResponse('Invalid credentials', 401);
    }
    
    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: formatDate() } }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return createSuccessResponse({
      ...userWithoutPassword,
      requiresPasswordChange: !user.passwordChanged
    }, 'Credentials verified');
  } catch (error) {
    console.error('Error verifying user credentials:', error);
    return createErrorResponse('Failed to verify credentials', 500);
  }
}

/**
 * Change user password
 * @param userId - The user ID
 * @param oldPassword - The old password (for verification)
 * @param newPassword - The new password
 * @returns Promise<object> - Success or error response
 */
export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    // Get user
    const user = await usersCollection.findOne({
      _id: ObjectId.createFromHexString(userId),
      isActive: true
    });
    
    if (!user) {
      return createErrorResponse('User not found', 404);
    }
    
    // Verify old password (if user has a password)
    if (user.password && user.password !== '') {
      const isOldPasswordValid = await verifyPassword(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return createErrorResponse('Current password is incorrect', 401);
      }
    } else {
      // For first-time password change, old password should be empty
      if (oldPassword !== '') {
        return createErrorResponse('Invalid old password', 401);
      }
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    
    // Update password
    await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $set: {
          password: hashedNewPassword,
          passwordChanged: true,
          updatedAt: formatDate()
        }
      }
    );
    
    return createSuccessResponse(null, 'Password changed successfully');
  } catch (error) {
    console.error('Error changing user password:', error);
    return createErrorResponse('Failed to change password', 500);
  }
}

/**
 * Update user information
 * @param userId - The user ID
 * @param updateData - The data to update
 * @returns Promise<object> - Success or error response
 */
export async function updateUser(userId: string, updateData: {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ 
      _id: ObjectId.createFromHexString(userId) 
    });
    
    if (!existingUser) {
      return createErrorResponse('User not found', 404);
    }
    
    // If updating password, hash it
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    
    // Prepare update object
    const updateObject: any = {
      ...updateData,
      updatedAt: formatDate()
    };
    
    // Update user
    const result = await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { $set: updateObject }
    );
    
    if (result.matchedCount === 0) {
      return createErrorResponse('User not found', 404);
    }
    
    // Get updated user
    const updatedUser = await usersCollection.findOne({
      _id: ObjectId.createFromHexString(userId)
    });
    
    if (!updatedUser) {
      return createErrorResponse('User not found after update', 404);
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser as any;
    
    return createSuccessResponse(userWithoutPassword, 'User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    return createErrorResponse('Failed to update user', 500);
  }
}

/**
 * Delete user (hard delete by removing from database)
 * @param userId - The user ID
 * @returns Promise<object> - Success or error response
 */
export async function deleteUser(userId: string): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const result = await usersCollection.deleteOne(
      { _id: ObjectId.createFromHexString(userId) }
    );
    
    if (result.deletedCount === 0) {
      return createErrorResponse('User not found', 404);
    }
    
    return createSuccessResponse(null, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return createErrorResponse('Failed to delete user', 500);
  }
}

/**
 * Reactivate user (set isActive to true)
 * @param userId - The user ID
 * @returns Promise<object> - Success or error response
 */
export async function reactivateUser(userId: string): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const result = await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $set: {
          isActive: true,
          updatedAt: formatDate()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return createErrorResponse('User not found', 404);
    }
    
    return createSuccessResponse(null, 'User reactivated successfully');
  } catch (error) {
    console.error('Error reactivating user:', error);
    return createErrorResponse('Failed to reactivate user', 500);
  }
}

/**
 * Get all users (admin only)
 * @param page - Page number (default: 1)
 * @param limit - Number of users per page (default: 10)
 * @returns Promise<object> - Success or error response
 */
export async function getAllUsers(page: number = 1, limit: number = 10): Promise<object> {
  try {
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    const skip = (page - 1) * limit;
    
    const users = await usersCollection
      .find({}) // Get all users (both active and inactive)
      .project({ password: 0 }) // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const totalUsers = await usersCollection.countDocuments({}); // Count all users
    
    return createSuccessResponse({
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      }
    }, 'Users retrieved successfully');
  } catch (error) {
    console.error('Error getting all users:', error);
    return createErrorResponse('Failed to get users', 500);
  }
}

/**
 * Create a session for a user
 * @param userId - The user ID
 * @param token - The session token
 * @param expiresAt - The expiration date
 * @returns Promise<object> - Success or error response
 */
export async function createSession(userId: string, token: string, expiresAt: Date): Promise<object> {
  try {
    const db = await getDatabase();
    const sessionsCollection = db.collection('sessions');
    
    const newSession: Session = {
      userId: ObjectId.createFromHexString(userId),
      token,
      expiresAt,
      createdAt: formatDate(),
      isActive: true
    };
    
    const result = await sessionsCollection.insertOne(newSession);
    
    return createSuccessResponse({
      sessionId: result.insertedId,
      token,
      expiresAt
    }, 'Session created successfully');
  } catch (error) {
    console.error('Error creating session:', error);
    return createErrorResponse('Failed to create session', 500);
  }
}

/**
 * Get session by token
 * @param token - The session token
 * @returns Promise<object> - Success or error response
 */
export async function getSessionByToken(token: string): Promise<object> {
  try {
    const db = await getDatabase();
    const sessionsCollection = db.collection('sessions');
    
    const session = await sessionsCollection.findOne({ 
      token, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
    
    if (!session) {
      return createErrorResponse('Session not found or expired', 404);
    }
    
    return createSuccessResponse(session, 'Session found');
  } catch (error) {
    console.error('Error getting session by token:', error);
    return createErrorResponse('Failed to get session', 500);
  }
}

/**
 * Delete session (logout)
 * @param token - The session token
 * @returns Promise<object> - Success or error response
 */
export async function deleteSession(token: string): Promise<object> {
  try {
    const db = await getDatabase();
    const sessionsCollection = db.collection('sessions');
    
    const result = await sessionsCollection.updateOne(
      { token },
      { $set: { isActive: false } }
    );
    
    if (result.matchedCount === 0) {
      return createErrorResponse('Session not found', 404);
    }
    
    return createSuccessResponse(null, 'Session deleted successfully');
  } catch (error) {
    console.error('Error deleting session:', error);
    return createErrorResponse('Failed to delete session', 500);
  }
}

/**
 * Clean up expired sessions
 * @returns Promise<object> - Success or error response
 */
export async function cleanupExpiredSessions(): Promise<object> {
  try {
    const db = await getDatabase();
    const sessionsCollection = db.collection('sessions');
    
    const result = await sessionsCollection.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    return createSuccessResponse({
      deletedCount: result.deletedCount
    }, 'Expired sessions cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return createErrorResponse('Failed to clean up expired sessions', 500);
  }
}

/**
 * Get content by section name from the website content collection
 * @param section - The section name (about, faq, contact, artists)
 * @returns Promise<object> - Success or error response with content data
 */
export async function getContentBySection(section: string): Promise<object> {
  try {
    const { getContentCollection } = await import('../util/mongodb/mongodb');
    const collection = await getContentCollection(section);
    
    // Validate section name
    const validSections = ['about', 'faq', 'contact', 'artists', 'main', 'owner'];
    if (!validSections.includes(section)) {
      return createErrorResponse('Invalid section name', 400);
    }
    
    // Find content by section
    const contentDoc = await collection.findOne({ section });
    
    if (!contentDoc) {
      return createErrorResponse('Content not found', 404);
    }
    
    // Return the content field from the document with section
    return createSuccessResponse(contentDoc, 'Content retrieved successfully');
  } catch (error: any) {
    console.error('Error getting content by section:', error);
    return createErrorResponse(`Failed to retrieve content: ${error.message || error}`, 500);
  }
}

/**
 * Update content by section name in the website content collection
 * @param section - The section name (about, faq, contact, artists)
 * @param content - The content data to update
 * @returns Promise<object> - Success or error response
 */
export async function updateContentBySection(section: string, content: any): Promise<object> {
  try {
    const { getContentCollection } = await import('../util/mongodb/mongodb');
    const collection = await getContentCollection(section);
    
    // Validate section name
    const validSections = ['about', 'faq', 'contact', 'artists', 'main', 'owner'];
    if (!validSections.includes(section)) {
      return createErrorResponse('Invalid section name', 400);
    }
    
    // Exclude immutable fields like _id from the update
    const { _id, ...contentWithoutId } = content;
    
    // Ensure the section field matches the parameter
    const updateData = {
      ...contentWithoutId,
      section: section,  // Override to ensure consistency
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { section },
      { $set: updateData },
      { upsert: true } // Create document if it doesn't exist
    );
    
    if (result.upsertedCount > 0) {
      return createSuccessResponse(null, 'Content created successfully');
    } else if (result.modifiedCount > 0) {
      return createSuccessResponse(null, 'Content updated successfully');
    } else {
      return createErrorResponse('No changes made to content', 400);
    }
  } catch (error) {
    console.error('Error updating content by section:', error);
    return createErrorResponse('Failed to update content', 500);
  }
}

/**
 * Get all content from the website content collection
 * @returns Promise<object> - Success or error response with all content data
 */
export async function getAllContent(): Promise<object> {
  try {
    const { getContentCollection } = await import('../util/mongodb/mongodb');
    const collection = await getContentCollection('about');
    
    // Find all content documents
    const contentDocs = await collection.find({}).toArray();
    
    if (!contentDocs || contentDocs.length === 0) {
      return createErrorResponse('No content found', 404);
    }
    
    // Transform documents to include section and content data
    const allContent = contentDocs.map(doc => ({
      section: doc.section,
      ...doc.content
    }));
    
    return createSuccessResponse(allContent, 'All content retrieved successfully');
  } catch (error) {
    console.error('Error getting all content:', error);
    return createErrorResponse('Failed to retrieve all content', 500);
  }
}
// ============================================================================
// ARTIST FUNCTIONS
// ============================================================================

/**
 * Get all artists with pagination and filtering
 * @param options - Query options (page, limit, isActive)
 * @returns Promise<object> - Success or error response with artists data
 */
export async function getAllArtists(options: {
  isActive?: boolean;
} = {}): Promise<object> {
  try {
    const db = await getDatabase();
    const dbCollection = db.collection('artists');
    
    // Build query filter
    const filter: any = {};
    if (options.isActive !== undefined) {
      filter.isActive = options.isActive;
    }
    
    // Fetch all artists
    const artists = await dbCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    return createSuccessResponse({
      artists
    }, 'Artists retrieved successfully');
  } catch (error) {
    console.error('Error getting all artists:', error);
    return createErrorResponse('Failed to retrieve artists', 500);
  }
}

/**
 * Create a new artist
 * @param artistData - Artist data
 * @returns Promise<object> - Success or error response
 */
export async function createArtist(artistData: any): Promise<object> {
  try {
    const db = await getDatabase();
    const artistsCollection = db.collection('artists');
    
    // Check if artist with same artistId already exists
    if (artistData.artistId) {
      const existingArtist = await artistsCollection.findOne({ artistId: artistData.artistId });
      if (existingArtist) {
        return createErrorResponse('Artist with this ID already exists', 409);
      }
    }
    
    // Create new artist object with timestamps
    const newArtist = {
      ...artistData,
      createdAt: formatDate(),
      updatedAt: formatDate(),
      isActive: artistData.isActive !== undefined ? artistData.isActive : true
    };
    
    // Insert artist into database
    const result = await artistsCollection.insertOne(newArtist);
    
    // Return created artist with MongoDB _id
    const createdArtist = {
      ...newArtist,
      _id: result.insertedId
    };
    
    return createSuccessResponse(createdArtist, 'Artist created successfully');
  } catch (error) {
    console.error('Error creating artist:', error);
    return createErrorResponse('Failed to create artist', 500);
  }
}

/**
 * Get artist by ID (artistId or MongoDB _id)
 * @param id - Artist ID (artistId string or MongoDB _id)
 * @returns Promise<object> - Success or error response
 */
export async function getArtistById(id: string): Promise<object> {
  try {
    const db = await getDatabase();
    const artistsCollection = db.collection('artists');
    
    // Try to find by artistId first, then by MongoDB _id
    let artist = await artistsCollection.findOne({ artistId: id });
    
    if (!artist && ObjectId.isValid(id)) {
      artist = await artistsCollection.findOne({ _id: ObjectId.createFromHexString(id) });
    }
    
    if (!artist) {
      return createErrorResponse('Artist not found', 404);
    }
    
    return createSuccessResponse(artist, 'Artist retrieved successfully');
  } catch (error) {
    console.error('Error getting artist by ID:', error);
    return createErrorResponse('Failed to retrieve artist', 500);
  }
}

/**
 * Update artist by ID
 * @param id - Artist ID (artistId string or MongoDB _id)
 * @param updateData - Data to update
 * @returns Promise<object> - Success or error response
 */
export async function updateArtist(id: string, updateData: any): Promise<object> {
  try {
    const db = await getDatabase();
    const artistsCollection = db.collection('artists');
    
    // Remove fields that shouldn't be updated
    const { _id, createdAt, ...dataToUpdate } = updateData;
    
    // Add updated timestamp
    dataToUpdate.updatedAt = formatDate();
    
    // Try to find and update by artistId first, then by MongoDB _id
    let result = await artistsCollection.findOneAndUpdate(
      { artistId: id },
      { $set: dataToUpdate },
      { returnDocument: 'after' }
    );
    
    if (!result && ObjectId.isValid(id)) {
      result = await artistsCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id) },
        { $set: dataToUpdate },
        { returnDocument: 'after' }
      );
    }
    
    if (!result) {
      return createErrorResponse('Artist not found', 404);
    }
    
    return createSuccessResponse(result, 'Artist updated successfully');
  } catch (error) {
    console.error('Error updating artist:', error);
    return createErrorResponse('Failed to update artist', 500);
  }
}

/**
 * Delete artist by ID (hard delete - permanently removes from database)
 * @param id - Artist ID (artistId string or MongoDB _id)
 * @returns Promise<object> - Success or error response
 */
export async function deleteArtist(id: string): Promise<object> {
  try {
    const db = await getDatabase();
    const artistsCollection = db.collection('artists');
    
    // Hard delete - permanently remove from database
    let result = null;
    
    // Try to delete by MongoDB _id first (most common case)
    if (ObjectId.isValid(id)) {
      result = await artistsCollection.deleteOne(
        { _id: ObjectId.createFromHexString(id) }
      );
    }
    
    // If not found by _id, try artistId
    if (!result || result.deletedCount === 0) {
      result = await artistsCollection.deleteOne(
        { artistId: id }
      );
    }
    
    if (!result || result.deletedCount === 0) {
      return createErrorResponse('Artist not found', 404);
    }
    
    return createSuccessResponse(null, 'Artist deleted successfully');
  } catch (error) {
    console.error('Error deleting artist:', error);
    return createErrorResponse('Failed to delete artist', 500);
  }
}
