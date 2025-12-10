
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function check() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('.env.local not found');
      return;
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const uriMatch = envContent.match(/MONGODB_URI=(.+)/);
    
    if (!uriMatch) {
      console.error('MONGODB_URI not found in .env.local');
      return;
    }
    
    const uri = uriMatch[1].trim();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('test'); // Default DB name from connection string usually, or 'test'
      // Parse DB name if in URI
      // But assuming standard connection, let's list databases or just try 'tobymyer' or whatever
      // Actually usually the URI contains the db name.
      
      // Let's rely on default db from URI
      const database = client.db(); 
      console.log('Connected to database:', database.databaseName);
      
      const artists = await database.collection('artists').find({}).toArray();
      
      console.log('Found artists:', artists.length);
      artists.forEach(a => {
        console.log(`Name: ${a.name}, Order: ${a.order}, ID: ${a._id}`);
      });
      
    } finally {
      await client.close();
    }
    
  } catch (e) {
    console.error(e);
  }
}

check();
