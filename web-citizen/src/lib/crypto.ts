// src/lib/crypto.ts
import { ethers } from 'ethers';
import { createIdentityLeafHash } from './commitment.js';

export async function createFinalMerkleLeaf(secret: string, privateData: string, fullName: string) {
  return createIdentityLeafHash(secret, privateData, fullName);
}

export async function signCredential(finalLeafHash: string, licenseID: string) {
  const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
  if (!ADMIN_PRIVATE_KEY) throw new Error("ADMIN_PRIVATE_KEY missing");

  const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY);
  const messageString = JSON.stringify({ leaf: finalLeafHash, id: licenseID });
  const signature = await wallet.signMessage(messageString);

  return {
    signature,
    signedBy: wallet.address
  };
}
