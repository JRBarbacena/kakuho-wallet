# Hybrid-Transparency: V5 Architecture

This system implements a Privacy-Preserving Identity Registry using Zero-Knowledge Proofs (Noir), Blockchain Anchoring (Hardhat), and Off-chain Storage (Supabase).

## Repository Structure

```text
hybrid-transparency/
│
├── circuits/                     <-- Noir Cryptography
│   ├── src/main.nr               <-- The ZK Circuit (Flat Hash)
│   └── target/                   <-- Compiled Circuit Artifacts
│
├── contracts/                    <-- Blockchain Anchor
│   ├── contracts/                <-- Solidity Smart Contracts
│   ├── scripts/                  <-- Deployment & Test Scripts
│   └── hardhat.config.ts         <-- Hardhat Configuration
│
├── web-citizen/                  <-- Citizen Identity Wallet
│   ├── src/app/                  <-- Next.js Pages (Wallet, Register)
│   ├── src/lib/                  <-- ZK & Supabase Utilities
│   └── src/utils/                <-- Merkle & Chain Utilities
│
├── web-admin/                    <-- Authority Management Portal
│   ├── src/app/                  <-- Next.js Pages (Registry, Management)
│   ├── src/lib/                  <-- Supabase & Shared Logic
│   └── src/utils/                <-- Chain Utilities
│
├── Private Keys.md               <-- Local Development Credentials
└── README.md                     <-- System Overview
```

## Key Technologies
- **Noir**: Zero-knowledge circuit language for privacy-preserving claims.
- **Hardhat**: Ethereum development environment for the Merkle Root anchor.
- **Supabase**: Scalable off-chain storage for non-private metadata.
- **Next.js**: Modern web framework for both Admin and Citizen interfaces.

## Cleanup Notes (V5)
- Removed MongoDB legacy files and references.
- Removed 0-byte utility files and redundant JSON mocks.
- Optimized for clear separation of concerns between ZK proof generation and data persistence.
