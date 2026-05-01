import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const RPC_URL = "http://127.0.0.1:8545";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat #0

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Deploying with address:", wallet.address);

    // 1. Deploy Poseidon
    // We'll need the bytecode. I'll check if I can find a precompiled one or use the artifact if I can find it.
    // Actually, I'll try to find the Poseidon artifact in node_modules/poseidon-solidity
    // Wait, it might be easier to just use the artifacts if they exist.
    
    // I'll check artifacts/build-info to see if the bytecode for libraries is in there.
    const buildInfoDir = "artifacts/build-info";
    const files = fs.readdirSync(buildInfoDir);
    // Find the file ending in .output.json
    const buildInfoFile = path.join(buildInfoDir, files.find(f => f.endsWith(".output.json")));
    console.log("Using build-info:", buildInfoFile);
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoFile, 'utf8'));

    const contracts = buildInfo.contracts; // In .output.json it is root level or under 'output'? 
    // In Hardhat build-info it's usually buildInfo.output.contracts.
    // If I used the .output.json directly from solc it might be buildInfo.contracts.
    const contractsData = contracts || buildInfo.output.contracts;
    
    // Helper to find contract in build-info
    function findContract(name) {
        for (const file in contractsData) {
            if (contractsData[file][name]) return contractsData[file][name];
        }
        return null;
    }

    const poseidonInfo = findContract("PoseidonT3");
    const leanIMTInfo = findContract("LeanIMT");
    const registryInfo = findContract("LTORegistry");

    if (!poseidonInfo || !leanIMTInfo || !registryInfo) {
        console.log("Missing artifacts in build-info. Make sure you compiled.");
        // I'll try to compile again with a trick.
        return;
    }

    console.log("Deploying PoseidonT3...");
    const Poseidon = new ethers.ContractFactory(poseidonInfo.abi, poseidonInfo.evm.bytecode.object, wallet);
    const poseidon = await Poseidon.deploy();
    await poseidon.waitForDeployment();
    console.log("PoseidonT3 at:", await poseidon.getAddress());

    console.log("Deploying LeanIMT...");
    let leanBytecode = leanIMTInfo.evm.bytecode.object;
    // Link Poseidon
    // Hardhat libraries are linked by replacing placeholders like __$7b...$__
    // I'll need the fully qualified name hash.
    // Usually it's like __$poseidon-solidity/PoseidonT3.sol:PoseidonT3$__
    // Or just search for placeholders.
    const poseidonAddress = (await poseidon.getAddress()).toLowerCase().replace("0x", "");
    leanBytecode = leanBytecode.replace(/__\$[0-9a-fA-F]+\$__/g, poseidonAddress);
    
    const LeanIMT = new ethers.ContractFactory(leanIMTInfo.abi, leanBytecode, wallet);
    const leanIMT = await LeanIMT.deploy();
    await leanIMT.waitForDeployment();
    console.log("LeanIMT at:", await leanIMT.getAddress());

    console.log("Deploying LTORegistry...");
    let registryBytecode = registryInfo.evm.bytecode.object;
    const leanIMTAddress = (await leanIMT.getAddress()).toLowerCase().replace("0x", "");
    registryBytecode = registryBytecode.replace(/__\$[0-9a-fA-F]+\$__/g, leanIMTAddress);

    const LTORegistry = new ethers.ContractFactory(registryInfo.abi, registryBytecode, wallet);
    const registry = await LTORegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("✅ LTORegistry at:", registryAddress);

    // Save the address to a file so the frontends can find it
    fs.writeFileSync("LTORegistry_address.txt", registryAddress);
    console.log("Address saved to LTORegistry_address.txt");
}

main().catch(console.error);
