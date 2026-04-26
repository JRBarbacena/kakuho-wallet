import fs from "fs";
const buildInfoPath = "artifacts/build-info/solc-0_8_28-9fb748730a630786cf0209265452614b225dec57.output.json";
const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf8"));
console.log("Available contract keys:");
console.log(Object.keys(buildInfo.output.contracts).filter(k => k.includes("LTORegistry")));
