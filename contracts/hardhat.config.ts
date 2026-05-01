import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

task("deploy-lto", "Deploys the LTO Registry and libraries")
  .setAction(async (taskArgs, hre) => {
    const ethers = (hre as any).ethers;
    if (!ethers) {
        console.error("❌ Ethers still not found in Task HRE.");
        return;
    }

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
  });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts", 
  },
  networks: {
    hardhat: {
      type: "edr-simulated" as any,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      type: "http" as any,
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      type: "http" as any,
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};

export default config;