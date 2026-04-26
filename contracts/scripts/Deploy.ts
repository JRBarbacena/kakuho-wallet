import hre from "hardhat";
const { ethers } = hre as any;

async function main() {
  const ethers = (hre as any).ethers;
  console.log("1. Deploying Poseidon Hashing Library...");
  // Fetch the exact Poseidon library from the node_modules
  const PoseidonT3 = await ethers.getContractFactory("poseidon-solidity/PoseidonT3.sol:PoseidonT3");
  const poseidonT3 = await PoseidonT3.deploy();
  await poseidonT3.waitForDeployment();
  console.log(`-> PoseidonT3 successfully deployed to: ${poseidonT3.target}`);

  console.log("2. Deploying the LeanIMT Library...");
  // Link Poseidon to the LeanIMT library
  const LeanIMT = await ethers.getContractFactory("LeanIMT", {
    libraries: {
      "poseidon-solidity/PoseidonT3.sol:PoseidonT3": poseidonT3.target,
    },
  });
  const leanIMT = await LeanIMT.deploy();
  await leanIMT.waitForDeployment();
  console.log(`-> LeanIMT successfully deployed to: ${leanIMT.target}`);

  console.log("3. Deploying LTORegistry and linking library...");
  // Link LeanIMT to your main Anchor
  const LTORegistry = await ethers.getContractFactory("LTORegistry", {
    libraries: {
      LeanIMT: leanIMT.target,
    },
  });
  const registry = await LTORegistry.deploy();
  await registry.waitForDeployment();

  console.log(`LTORegistry deployed successfully to: ${registry.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});