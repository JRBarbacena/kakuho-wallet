// server.js
import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';
import { createFinalMerkleLeaf, signCredential } from './utils/crypto.js';
import { LTOMerkleTree } from './utils/merkleTree.js';
import { connectToDatabase } from './utils/db.js'; 

const app = express();
app.use(cors()); 
app.use(express.json());

// Serve the Admin UI
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/api/register', async (req, res) => {
    try {
        console.log("\n[API] Incoming LTO Registration Request...");
        const data = req.body;
        const { secretHash, licenseID } = data;
        const ltoData = {
            licenseID: data.licenseID,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            licenseType: data.licenseType,
            expirationDate: data.expirationDate,
            bloodType: data.bloodType,
            addressCity: data.addressCity
        };

        const finalLeafHash = await createFinalMerkleLeaf(secretHash, licenseID, `${data.firstName} ${data.lastName}`);
        const credential = await signCredential(finalLeafHash, ltoData);

        const db = await connectToDatabase();
        const leavesCollection = db.collection("merkle_leaves");
        const savedLeaves = await leavesCollection.find().sort({ index: 1 }).toArray();
        const leafValues = savedLeaves.map(doc => doc.leafHash);
        
        const tree = new LTOMerkleTree();
        await tree.initialize(leafValues);
        tree.insert(finalLeafHash);
        const newIndex = tree.tree.leaves.length - 1;

        await leavesCollection.insertOne({ index: newIndex, leafHash: finalLeafHash, timestamp: new Date() });

        res.status(200).json({
            documentType: "Philippine LTO Driver's License",
            registryMetadata: { treeIndex: newIndex.toString(), leafHash: finalLeafHash },
            subject: ltoData, 
            ltoSignature: credential.signature,
            issuerAddress: credential.signedBy
        });
    } catch (error) { res.status(500).json({ error: "Failed to register driver" }); }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[SERVER] LTO Admin Backend is LIVE on http://localhost:${PORT}`);
});
