import { ethers } from "ethers";

const REGISTRY_ABI = [
  "function issueLicense(uint256 leafCommitment) public",
  "function getAllLeaves() public view returns (uint256[] memory)",
  "function getRoot() public view returns (uint256)",
  "function admin() public view returns (address)"
];

const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS!;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

export async function getContractWithSigner() {
  const privateKey = process.env.ADMIN_PRIVATE_KEY!;
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
