import { ethers } from "ethers";
import fs from "fs";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

    console.log("🚀 Starting Super-Stable Deployment...");

    const getArt = (n) => JSON.parse(fs.readFileSync(`./scripts/${n}.json`, "utf8"));

    // 1. Deploy Poseidon
    console.log("-> Step 1: Deploying Poseidon...");
    const poseidonArt = getArt("PoseidonT3");
    const PoseidonFactory = new ethers.ContractFactory(poseidonArt.abi, poseidonArt.bytecode, wallet);
    const poseidon = await PoseidonFactory.deploy();
    await poseidon.waitForDeployment();
    const poseidonAddress = poseidon.target.toLowerCase().replace("0x", "");
    console.log(`✅ Poseidon deployed to: ${poseidon.target}`);

    await delay(2000); // Give the node time to sync

    // 2. Deploy LeanIMT (Link Poseidon)
    console.log("-> Step 2: Deploying LeanIMT...");
    const leanArt = getArt("LeanIMT");
    let leanBytecode = leanArt.bytecode;
    const poseidonPlaceholder = /__\$[0-9a-fA-F]+\$__/g;
    leanBytecode = leanBytecode.replace(poseidonPlaceholder, poseidonAddress);
    
    const LeanIMTFactory = new ethers.ContractFactory(leanArt.abi, leanBytecode, wallet);
    const leanIMT = await LeanIMTFactory.deploy();
    await leanIMT.waitForDeployment();
    const leanAddress = leanIMT.target.toLowerCase().replace("0x", "");
    console.log(`✅ LeanIMT deployed to: ${leanIMT.target}`);

    await delay(2000); // Give the node time to sync

    // 3. Deploy LTORegistry (Link LeanIMT)
    console.log("-> Step 3: Deploying LTORegistry...");
    const regArt = getArt("LTORegistry");
    let regBytecode = regArt.bytecode;
    const leanPlaceholder = /__\$[0-9a-fA-F]+\$__/g;
    regBytecode = regBytecode.replace(leanPlaceholder, leanAddress);

    const RegistryFactory = new ethers.ContractFactory(regArt.abi, regBytecode, wallet);
    const registry = await RegistryFactory.deploy();
    await registry.waitForDeployment();

    console.log(`✨ SUCCESS! LTORegistry deployed to: ${registry.target}`);
    fs.writeFileSync("../LTORegistry_address.txt", String(registry.target));
}

main().catch(console.error);
