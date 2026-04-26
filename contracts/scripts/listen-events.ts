import { ethers } from "hardhat";

async function main() {
    // Your exact address from your latest deployment
    const registryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const registry = await ethers.getContractAt("LTORegistry", registryAddress);

    console.log(`🔌 Connected to LTORegistry at: ${registryAddress}`);
    console.log(`🎧 Radar is online. Listening for live events...`);
    console.log(`(Waiting for someone to click a button on the frontend...)`);

    // Listen for the Issuance Event
    //@ts-ignore
    registry.on("LicenseIssued", (executor, leafCommitment, timestamp) => {
        console.log(`\n[EVENT CAUGHT] NEW LICENSE ISSUED!`);
        console.log(`Executed By:  ${executor}`);
        console.log(`Driver Hash:  ${leafCommitment}`);
        console.log(`Time:         ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
    });
    // Listen for the Revocation Event
    //@ts-ignore
    registry.on("LicenseRevoked", (executor, index, timestamp) => {
        console.log(`\n [EVENT CAUGHT] LICENSE REVOKED!`);
        console.log(`Executed By:  ${executor}`);
        console.log(`Tree Index:   ${index}`);
        console.log(`Time:         ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
    });
}

main().catch((error) => {
    console.error(error);
});