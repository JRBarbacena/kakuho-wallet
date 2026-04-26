import { ethers } from "ethers";
import fs from "fs";

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const address = fs.readFileSync("../LTORegistry_address.txt", "utf8").trim();
    const art = JSON.parse(fs.readFileSync("./scripts/LTORegistry.json", "utf8"));

    const registry = new ethers.Contract(address, art.abi, provider);

    console.log(`📡 Listening for events on LTORegistry at ${address}...`);

    registry.on("LicenseIssued", (executor, commitment, root, event) => {
        console.log("\n✅ [Event: LicenseIssued]");
        console.log(`   Executor:   ${executor}`);
        console.log(`   Commitment: ${commitment}`);
        console.log(`   New Root:   ${root}`);
    });

    registry.on("LicenseRevoked", (executor, commitment, root, event) => {
        console.log("\n❌ [Event: LicenseRevoked]");
        console.log(`   Executor:   ${executor}`);
        console.log(`   Commitment: ${commitment}`);
        console.log(`   New Root:   ${root}`);
    });

    // Keep process alive
    process.stdin.resume();
}

main().catch(console.error);
