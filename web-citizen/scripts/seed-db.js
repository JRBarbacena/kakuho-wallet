// scripts/seed-db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createIdentityLeafHash } from '../src/lib/commitment.js';

import dns from 'dns';

// Force the script to use Google DNS to bypass ISP blocking of SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("❌ ERROR: MONGODB_URI not found in .env.local");
    process.exit(1);
}

const firstNames = ["Juan", "Maria", "Jose", "Ana", "Pedro", "Liza", "Mark", "Sofia", "Carlos", "Elena"];
const lastNames = ["Dela Cruz", "Santos", "Reyes", "Garcia", "Bautista", "Ocampo", "Torres", "Flores", "Rivera", "Gomez"];

function createFinalMerkleLeaf(secret, privateData, fullName) {
    return createIdentityLeafHash(secret, privateData, fullName);
}

async function seed() {
    console.log("🌱 Seeding Database with Mock Data...");
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    });

    try {
        await client.connect();
        const db = client.db("lto_system");
        const collection = db.collection("identities");

        // Clear existing mock data if any (optional)
        // await collection.deleteMany({});

        for (let i = 0; i < 5; i++) {
            const firstName = firstNames[i];
            const lastName = lastNames[i];
            const fullName = `${firstName} ${lastName}`;
            const licenseID = `N01-26-${Math.floor(100000 + Math.random() * 900000)}`;
            const secretHash = Math.floor(100000000 + Math.random() * 900000000).toString();

            const leafHash = createFinalMerkleLeaf(secretHash, licenseID, fullName);

            await collection.insertOne({
                licenseID,
                fullName,
                leafHash,
                leaf_hash: leafHash,
                issuedAt: new Date(),
                isMock: true,
                public_name: fullName,
                raw_data: { firstName, lastName, secretHash, licenseID }
            });
            console.log(`✅ Inserted: ${fullName} (${leafHash})`);
        }

        console.log("✨ Seeding Complete!");
    } catch (e) {
        console.error("❌ Seeding Failed:", e);
    } finally {
        await client.close();
    }
}

seed();
