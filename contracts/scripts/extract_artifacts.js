import fs from "fs";
import path from "path";

const buildInfoPath = "artifacts/build-info/solc-0_8_28-9fb748730a630786cf0209265452614b225dec57.output.json";
const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, "utf8"));

const contracts = buildInfo.output.contracts;

function save(name, data) {
    fs.writeFileSync(`./scripts/${name}.json`, JSON.stringify(data, null, 2));
    console.log(`Saved ${name}.json`);
}

// 1. Poseidon
const poseidon = contracts["npm/poseidon-solidity@0.0.5/PoseidonT3.sol"]["PoseidonT3"];
save("PoseidonT3", {
    abi: poseidon.abi,
    bytecode: poseidon.evm.bytecode.object
});

// 2. LeanIMT
const leanIMT = contracts["npm/@zk-kit/imt.sol@2.0.0-beta.12/LeanIMT.sol"]["LeanIMT"];
save("LeanIMT", {
    abi: leanIMT.abi,
    bytecode: leanIMT.evm.bytecode.object
});

// 3. LTORegistry
const registry = contracts["project/contracts/LTORegistry.sol"]["LTORegistry"];
save("LTORegistry", {
    abi: registry.abi,
    bytecode: registry.evm.bytecode.object
});
