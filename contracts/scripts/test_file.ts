import hre from "hardhat";

async function main() {
  const { ethers } = hre;
  // 1. The address you just deployed to (Update this if your address is different!)
  const registryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  console.log(`🔌 Connecting to LTORegistry at: ${registryAddress}`);

  // Connect to the live contract
  const registry = await ethers.getContractAt("LTORegistry", registryAddress);

  // 2. Check the tree before we add anyone
  const initialRoot = await registry.getRoot();
  console.log(`🌳 Initial Merkle Root: ${initialRoot}`);

  // 3. Create a "Mock Driver"
  // In reality, Kingdom 1 generates a massive cryptographic hash. 
  // For this test, we will just use a dummy number to represent Driver #1.
  const mockDriverHash = "9999888877776666";
  console.log(`📝 Admin is issuing a new license for Driver Hash: ${mockDriverHash}...`);

  // 4. Send the transaction to your local blockchain
  const tx = await registry.issueLicense(mockDriverHash);
  await tx.wait(); // Wait for the "block" to be mined

  console.log("✅ Transaction confirmed! Driver added to the Merkle Tree.");

  // 5. Check the tree AFTER we added the driver
  const newRoot = await registry.getRoot();
  console.log(`🌳 New Merkle Root: ${newRoot}`);

  if (initialRoot !== newRoot) {
    console.log("🎉 SUCCESS: The Zero-Knowledge Tree updated perfectly!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});