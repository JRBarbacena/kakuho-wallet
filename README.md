# Hybrid-Transparency: V4 Architecture

Diagram of the system: [View on Eraser.io](https://app.eraser.io/workspace/YftjwOIfE3uFNa5aTSfs?origin=share)

Wait for further update on setup instructions, thank you.

## Repository Structure

```text
hybrid-transparency/
│
├── circuits/                     <-- KINGDOM 1: The Cryptography (Noir)
│   ├── src/
│   │   └── main.nr               <-- (The Flat Hash Circuit)
│   ├── Prover.toml               <-- (Local test inputs only)
│   ├── Nargo.toml                <-- (Noir dependencies, tag = "v0.1.1")
│   └── target/
│       └── hybrid_transparency.json <-- THE ARTIFACT (The unbreakable contract)
│
├── contracts/                    <-- KINGDOM 2: The Anchor (Blockchain)
│   ├── contracts/
│   │   └── LTORegistry.sol       <-- The Smart Contract (Stores only the Merkle Tree)
│   ├── scripts/
│   │   └── deploy.ts             <-- (Deploys LTORegistry to Localhost)
│   ├── hardhat.config.ts
│   └── package.json
│
├── web-citizen/                  <-- KINGDOM 3: The Driver (Prover)
│   ├── app/
│   │   ├── wallet/               <-- (UI: Stores Driver's JSON in localStorage)
│   │   │   └── page.tsx
│   │   └── prove/                <-- (UI: Generates the WASM Proof to show Enforcer)
│   │       └── page.tsx
│   ├── utils/
│   │   ├── mock_citizens.json    <-- NEW: Array of 100 dummy drivers for thesis benchmarking
│   │   ├── zk-prove.ts           <-- WASM ENGINE: Uses @noir-lang/backend_barretenberg
│   │   ├── commitment.js         <-- HASH ENGINE: Canonical identity commitment helper
│   │   └── chain.ts              <-- (Fetches current Merkle Root & Path from LTORegistry)
│   └── package.json
│
├── web-admin/                    <-- KINGDOM 4: The Authority (Verifier & Issuer)
│   ├── app/
│   │   ├── issuer/               <-- (UI: LTO Admin Portal to add new drivers)
│   │   │   └── page.tsx
│   │   └── enforcer/             <-- (UI: Traffic Cop App to scan Citizen's Proof)
│   │       └── page.tsx
│   ├── utils/
│   │   ├── db.json               <-- NEW: Admin's Web2 DB (Stores heavy data: Photos, Names)
│   │   ├── zk-verify.ts          <-- WASM ENGINE: Uses @noir-lang/backend_barretenberg
│   │   ├── commitment.js         <-- HASH ENGINE: Canonical identity commitment helper
│   │   └── chain.ts              <-- (Connects to LTORegistry to confirm the Root is legit)
│   └── package.json
│
├── .gitignore
└── README.md
```
