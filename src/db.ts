import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jeeturadicalloop:Mjvesqnj8gY3t0zP@cluster0.by2xy6x.mongodb.net/goldencrust-bakery';

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Extract database name from URI or use default
    const dbName = MONGODB_URI.includes('/') 
      ? MONGODB_URI.split('/').pop()?.split('?')[0] || 'goldencrust-bakery'
      : 'goldencrust-bakery';
    
    db = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
  }
}

export { db };