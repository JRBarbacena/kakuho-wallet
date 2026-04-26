import { ethers } from "hardhat";

describe("Deployment Flow", function () {
  it("Should deploy the full LTO system", async function () {
    console.log("1. Deploying Poseidon Hashing Library...");
    const PoseidonT3 = await ethers.getContractFactory("poseidon-solidity/PoseidonT3.sol:PoseidonT3");
    const poseidonT3 = await PoseidonT3.deploy();
    await poseidonT3.waitForDeployment();
    console.log(`-> PoseidonT3 deployed to: ${poseidonT3.target}`);

    console.log("2. Deploying LeanIMT Library...");
    const LeanIMT = await ethers.getContractFactory("LeanIMT", {
      libraries: {
        "poseidon-solidity/PoseidonT3.sol:PoseidonT3": poseidonT3.target,
      },
    });
    const leanIMT = await LeanIMT.deploy();
    await leanIMT.waitForDeployment();
    console.log(`-> LeanIMT deployed to: ${leanIMT.target}`);

    console.log("3. Deploying LTORegistry...");
    const LTORegistry = await ethers.getContractFactory("LTORegistry", {
      libraries: {
        LeanIMT: leanIMT.target,
      },
    });
    const registry = await LTORegistry.deploy();
    await registry.waitForDeployment();

    console.log(`✅ SUCCESS! LTORegistry deployed to: ${registry.target}`);
    
    // Write the address to a file for the user
    const fs = await import("fs");
    fs.writeFileSync("../LTORegistry_address.txt", String(registry.target));
  });
});
