# Kingdom 2: The Anchor (Blockchain)

The blockchain serves as the immutable "Anchor" for the system state. It does not store private data, only the cryptographic commitments.

## 📜 Smart Contract: `LTORegistry.sol`

The registry is the source of truth for all valid licenses.

### Key Data Structures
- **LeanIMT (Incremental Merkle Tree)**: An efficient implementation of a Merkle Tree where only the rightmost branch is stored. This significantly reduces gas costs for insertions.
- **`driverLeaves`**: An on-chain array of all leaf hashes (commitments) to allow frontends to reconstruct Merkle paths easily.

### Core Logic
- **`issueLicense(uint256 leafCommitment)`**: 
    - Restricted to `admin`.
    - Inserts the hash into the `LeanIMT`.
    - Emits a `LicenseIssued` event.
- **`revokeLicense(uint256 index, uint256[] siblings)`**:
    - Overwrites a leaf at a specific index with `0`.
    - Updates the tree root to reflect the revocation.
- **`getRoot()`**:
    - Provides the public root used as a public input for [[Kingdom_1_Cryptography|ZK Proofs]].

## 🛠️ Implementation Details
- **Network**: Localhost / Sepolia / Ethereum.
- **Library**: Uses `@zk-kit/imt.sol` for the IMT logic.
- **Deployment**: Managed by `contracts/scripts/deploy.ts`.

## 🔗 Related Components
- [[Kingdom_4_Authority]]: The `admin` who calls the contract.
- [[Kingdom_3_Citizen]]: Fetches the `merkle_path` from the contract to prove their existence in the tree.
