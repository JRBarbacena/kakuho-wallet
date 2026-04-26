// utils/crypto.js
import { ethers } from 'ethers';
import { poseidon3 } from 'poseidon-lite';
import 'dotenv/config'; // <-- Hides your ADMIN_PRIVATE_KEY

// --- ECDSA ADMIN WALLET ---
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
if (!ADMIN_PRIVATE_KEY) throw new Error("CRITICAL: ADMIN_PRIVATE_KEY missing from .env");

const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY);

export async function createFinalMerkleLeaf(secret, private_license_data, public_name) {
  const s = BigInt(secret.toString().startsWith("0x") ? secret.toString() : "0x" + secret.toString());
  const p = BigInt(private_license_data.toString().startsWith("0x") ? private_license_data.toString() : "0x" + private_license_data.toString());
  const n = BigInt(public_name.toString().startsWith("0x") ? public_name.toString() : "0x" + public_name.toString());

  const hash = poseidon3([s, p, n]);
  return '0x' + hash.toString(16).padStart(64, '0');
}

// --- 🛡️ ECDSA RUBBER STAMP ---
export async function signCredential(finalLeafHash, licenseID) {
  // We sign the Leaf Hash and License ID to prove LTO authorized this exact user
  const messageString = JSON.stringify({ leaf: finalLeafHash, id: licenseID });
  const signature = await adminWallet.signMessage(messageString);

  return {
    signature: signature,
    signedBy: adminWallet.address
  };
}
