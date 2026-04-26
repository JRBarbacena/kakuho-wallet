// src/lib/db.ts
import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Force use of Google DNS to bypass ISP SRV blocking
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("CRITICAL: MONGODB_URI missing from .env");

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
});
let dbInstance: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    console.log("[SYSTEM] Database Anchor successfully connected!");
    dbInstance = client.db("lto_system");
    return dbInstance;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[CRITICAL] Connection failed:", message);
    throw error;
  }
}
