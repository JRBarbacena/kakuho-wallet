import { ethers } from "ethers";

const REGISTRY_ABI = [
  "function issueLicense(uint256 leafCommitment) public",
  "function getAllLeaves() public view returns (uint256[] memory)",
  "function getRoot() public view returns (uint256)",
  "function admin() public view returns (address)"
];

const REGISTRY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545";

export async function getContractWithSigner() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, wallet);
}

export async function issueLicenseOnChain(leafHash: string) {
  try {
    const contract = await getContractWithSigner();
    const tx = await contract.issueLicense(BigInt(leafHash));
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error: any) {
    console.error("On-chain issuance failed:", error);
    return { success: false, error: error.message };
  }
}
