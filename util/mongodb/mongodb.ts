
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

// Check if MongoDB URI is available
const uri = process.env.MONGODB_URI?.replace(/^"|"$/g, '') || "";
if (!uri) {
  console.error("MongoDB connection string not found in environment variables");
  throw new Error("MONGODB_URI environment variable is not defined");
}

// Database name
const dbName = process.env.MONGODB_DB_NAME || "tattoo_studio";

// Global variables to cache the connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const createClient = () => new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * Connect to the database and cache the connection
 * @returns Promise<Db> - Database instance
 */
export async function connectToDatabase(): Promise<Db> {
  // If we already have a connection, return it
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  try {
    // Create a new client and connect
    const client = createClient();
    await client.connect();
    
    // Get the database instance
    const db = client.db(dbName);
    
    // Cache the client and database
    cachedClient = client;
    cachedDb = db;
    
    console.log("Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

/**
 * Get the database instance (connects if not already connected)
 * This is the main function you'll use throughout your application
 * @returns Promise<Db> - Database instance
 */
export async function getDatabase(): Promise<Db> {
  if (!cachedDb) {
    return await connectToDatabase();
  }
  return cachedDb;
}

/**
 * Get the MongoDB client instance
 * @returns MongoClient - MongoDB client instance
 */
export function getClient(): MongoClient | null {
  return cachedClient;
}

/**
 * Close the database connection
 * Useful for cleanup or testing
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed");
  }
}

/**
 * Test the connection to MongoDB
 * @returns Promise<boolean> - True if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const db = await connectToDatabase();
    await db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return true;
  } catch (error) {
    console.error("MongoDB connection test failed:", error);
    return false;
  }
}

/**
 * Get the collection for a specific content section
 * @param section - The section name (main, owner, faq, contact, etc.)
 * @returns Collection - The appropriate MongoDB collection
 */
export async function getContentCollection(section: string) {
  const db = await getDatabase();
  
  // Map sections to their collections
  // 'main' and 'owner' are about-related sections
  if (section === 'main' || section === 'owner') {
    return db.collection('about');
  }
  
  // For other sections, use the section name as collection name
  // e.g., 'faq' → 'faq' collection, 'contact' → 'contact' collection
  return db.collection(section);
}

/**
 * @deprecated Use getContentCollection instead
 * Get the website content collection (legacy)
 */
export async function getWebsiteContentCollection() {
  const db = await getDatabase();
  return db.collection('about');
}

// Export the database name for reference
export { dbName };

// Default export for convenience
export default getDatabase;
