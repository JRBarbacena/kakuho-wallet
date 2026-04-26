// index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Hides your ADMIN_PRIVATE_KEY
import { createFinalMerkleLeaf, signCredential } from './utils/crypto.js';
import { LTOMerkleTree } from './utils/merkleTree.js';
import { connectToDatabase } from './utils/db.js';
import { getMockApplicant } from './utils/mockData.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const tree = new LTOMerkleTree();

// --- 🌐 API ENDPOINTS ---

// 1. Get Mock Data (For Frontend Simulation)
app.get('/api/mock-applicant', (req, res) => {
  const applicant = getMockApplicant();
  res.json(applicant);
});

// 2. Issue License (Admin Only)
app.post('/api/issue-license', async (req, res) => {
  try {
    const { secret, privateData, fullName, licenseID } = req.body;
    
    // Create Merkle Leaf
    const leafHash = await createFinalMerkleLeaf(secret, privateData, fullName);
    
    // Add to Tree
    tree.insert(leafHash);
    const root = tree.getRoot();
    
    // Sign Credential
    const signedData = await signCredential(leafHash, licenseID);
    
    // Save to Database
    const db = await connectToDatabase();
    await db.collection("identities").insertOne({
      licenseID,
      fullName,
      leafHash,
      signedData,
      rootAtIssuance: root,
      issuedAt: new Date()
    });

    res.json({
      success: true,
      leafHash,
      root,
      signature: signedData.signature
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Get All Identities
app.get('/api/identities', async (req, res) => {
  const db = await connectToDatabase();
  const identities = await db.collection("identities").find().toArray();
  res.json(identities);
});

app.listen(PORT, () => {
  console.log(`[SERVER] LTO Backend running on http://localhost:${PORT}`);
});
