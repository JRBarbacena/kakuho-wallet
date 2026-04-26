import hre from "hardhat";
async function main() {
    console.log("Keys in HRE:", Object.keys(hre));
    console.log("Ethers in HRE:", hre.ethers ? "Found" : "NOT Found");
}
main();
