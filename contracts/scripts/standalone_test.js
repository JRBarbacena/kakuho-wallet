import { ethers } from "ethers";
import fs from "fs";

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const address = fs.readFileSync("../LTORegistry_address.txt", "utf8").trim();
    const art = JSON.parse(fs.readFileSync("./scripts/LTORegistry.json", "utf8"));

    const registry = new ethers.Contract(address, art.abi, wallet);

    console.log("🧪 Starting LTORegistry State Test...");

    const initialRoot = await registry.getRoot();
    console.log(`-> Current Merkle Root: ${initialRoot}`);

    // Generate a UNIQUE commitment using a random hex string
    const randomBytes = ethers.randomBytes(32);
    const testCommitment = ethers.hexlify(randomBytes);
    
    console.log(`-> Issuing UNIQUE License with commitment: ${testCommitment}`);
    
    const tx = await registry.issueLicense(testCommitment);
    console.log(`-> Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log("-> Transaction confirmed!");

    const newRoot = await registry.getRoot();
    console.log(`-> New Merkle Root: ${newRoot}`);

    const allLeaves = await registry.getAllLeaves();
    console.log(`-> Total Registered Licenses: ${allLeaves.length}`);

    if (newRoot !== initialRoot) {
        console.log("\n✅ SUCCESS: Merkle Root updated with new unique commitment!");
    } else {
        console.error("\n❌ FAILURE: Merkle Root did not change.");
    }
}

main().catch(console.error);
