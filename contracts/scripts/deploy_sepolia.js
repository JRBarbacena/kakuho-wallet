// Deploy to Sepolia: PoseidonT3 → LeanIMT → HonkVerifier (optional) → LTORegistry
// Usage:
//   node scripts/deploy_sepolia.js                        (no verifier yet)
//   node scripts/deploy_sepolia.js 0xYourVerifierAddress  (with verifier)
//
// Requires contracts/.env with:
//   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
//   DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

const { ethers } = require("hardhat");

async function main() {
  const verifierArg = process.argv[2] || "0x0000000000000000000000000000000000000000";
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // 1. PoseidonT3
  console.log("1. Deploying PoseidonT3...");
  const PoseidonT3 = await ethers.getContractFactory("poseidon-solidity/PoseidonT3.sol:PoseidonT3");
  const poseidonT3 = await PoseidonT3.deploy();
  await poseidonT3.waitForDeployment();
  console.log("   PoseidonT3:", poseidonT3.target);

  // 2. LeanIMT
  console.log("2. Deploying LeanIMT...");
  const LeanIMT = await ethers.getContractFactory("LeanIMT", {
    libraries: { "poseidon-solidity/PoseidonT3.sol:PoseidonT3": poseidonT3.target },
  });
  const leanIMT = await LeanIMT.deploy();
  await leanIMT.waitForDeployment();
  console.log("   LeanIMT:", leanIMT.target);

  // 3. LTORegistry (pass verifier address — can be zero if HonkVerifier not yet deployed)
  console.log("3. Deploying LTORegistry...");
  const LTORegistry = await ethers.getContractFactory("LTORegistry", {
    libraries: { LeanIMT: leanIMT.target },
  });
  const registry = await LTORegistry.deploy(verifierArg);
  await registry.waitForDeployment();
  console.log("   LTORegistry:", registry.target);

  console.log("\n✅ DONE. Add these to your .env.local and Vercel dashboard:");
  console.log(`NEXT_PUBLIC_REGISTRY_ADDRESS=${registry.target}`);
  console.log(`NEXT_PUBLIC_RPC_URL=<your Sepolia Alchemy/Infura URL>`);

  if (verifierArg === "0x0000000000000000000000000000000000000000") {
    console.log("\n⚠️  No verifier set. After generating HonkVerifier.sol:");
    console.log("   1. Deploy HonkVerifier.sol separately");
    console.log("   2. Call registry.setVerifier(<HonkVerifier address>) from admin wallet");
  } else {
    console.log(`\nVerifier set to: ${verifierArg}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
