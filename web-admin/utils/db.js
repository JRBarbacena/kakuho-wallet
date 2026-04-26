// utils/db.js
import { MongoClient } from 'mongodb';
import 'dotenv/config'; // Pulling the secure link from your hidden .env vault

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("CRITICAL: MONGODB_URI missing from .env");

const client = new MongoClient(uri);
let dbInstance = null;

export async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    console.log("[SYSTEM] Database Anchor successfully connected!");
    dbInstance = client.db("lto_system");
    return dbInstance;
  } catch (error) {
    console.error("[CRITICAL] Connection failed:", error.message);
    throw error; // Let the main API know it failed
  }
}
