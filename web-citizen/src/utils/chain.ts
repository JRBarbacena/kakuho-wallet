import { ethers } from "ethers";

const REGISTRY_ABI = [
  "function issueLicense(uint256 leafCommitment) public",
  "function getAllLeaves() public view returns (uint256[] memory)",
  "function getRoot() public view returns (uint256)",
  "function admin() public view returns (address)"
];

// This address should match the one in LTORegistry_address.txt
const REGISTRY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const RPC_URL = "http://127.0.0.1:8545";

export async function getContract() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);
}

export async function getContractWithSigner(privateKey: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, wallet);
}

export async function fetchAllLeaves() {
  try {
    const contract = await getContract();
    const leaves = await contract.getAllLeaves();
    return leaves.map((l: any) => "0x" + BigInt(l).toString(16).padStart(64, '0'));
  } catch (error) {
    console.error("Failed to fetch leaves from chain:", error);
    return [];
  }
}

export async function fetchRoot() {
  try {
    const contract = await getContract();
    const root = await contract.getRoot();
    return "0x" + BigInt(root).toString(16).padStart(64, '0');
  } catch (error) {
    console.error("Failed to fetch root from chain:", error);
    return "0x0";
  }
}
