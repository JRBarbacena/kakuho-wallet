# Hybrid-Transparency-core

This repository contains:
- `circuits/`: Noir circuit for credential validity + Merkle membership + nullifier checks
- `contracts/`: Solidity contracts for proof verification and Merkle root anchoring
- `web-admin/`, `web-citizen/`: app layers (still under construction)

## 1) Circuit setup (`circuits/`)

### Files added
- `Nargo.toml` (Noir package + Poseidon dependency)
- `Prover.toml` (CLI proving input)
- `prover-input.example.json` (app-side JSON format)

### Build / execute witness
```bash
cd circuits
nargo check
nargo execute witness
```

## 2) Prover input format

The circuit expects:
- Public: `root`, `nullifierHash`, `scope`
- Private: `secret`, `salt`, `age`, `medical_grade`, `pdc_completion`, `driving_hours`, `pathIndices[20]`, `pathElements[20]`

Use either:
- `Prover.toml` for `nargo execute` / CLI workflows
- `prover-input.example.json` for JS/TS SDK-based witness generation

All scalar values should be passed as decimal strings (field-compatible values).

## 3) Merkle smart contract (`contracts/`)

### New contract
- `contracts/MerkleRegistry.sol`
  - stores current root
  - stores root history (`isKnownRoot`)
  - owner-only root updates
  - emits `RootUpdated`

### Hardhat setup added
- `package.json`
- `hardhat.config.ts`
- `scripts/deploy.ts`
- `.env.example`
- `tsconfig.json`

### Deploy locally
```bash
cd contracts
npm install
cp .env.example .env
npm run build
npm run deploy:localhost
```

Set `INITIAL_ROOT` in `.env` to your off-chain Merkle root (`bytes32`, non-zero).

If you also want to deploy `HonkVerifier`, set:
```bash
DEPLOY_VERIFIER=true
```

## Notes
- `Verifier.sol` is preserved as-is.
- `Lock.sol` is currently unused and can be removed later.
