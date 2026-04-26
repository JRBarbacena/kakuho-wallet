import hre from "hardhat";

async function main() {
  console.log("🔍 Exploring Hardhat Runtime Environment...");
  
  function explore(obj, depth = 0, maxDepth = 2) {
    if (depth > maxDepth) return;
    for (const key of Object.keys(obj)) {
      console.log("  ".repeat(depth) + "- " + key + (typeof obj[key] === 'object' ? " (object)" : " (" + typeof obj[key] + ")"));
      if (typeof obj[key] === 'object' && obj[key] !== null && depth < maxDepth) {
        try {
          explore(obj[key], depth + 1, maxDepth);
        } catch (e) {}
      }
    }
  }

  explore(hre);
}

main().catch(console.error);
