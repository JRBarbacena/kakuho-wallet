import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://fayeanndanica_db_user:fayeanndanica_db_user@cluster0.ogoiq01.mongodb.net/lto_system?appName=Cluster0";

async function test() {
    console.log("Testing connection...");
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        console.log("Connected!");
        await client.close();
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
test();
