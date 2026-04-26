# Kingdom 1: The Cryptography (Noir)

This kingdom handles the zero-knowledge logic, ensuring privacy while maintaining auditability.

## 📄 Main Circuit: `circuits/src/main.nr`

The circuit is written in **Noir**, a domain-specific language for ZK-SNARKs.

### Witness Inputs
- **Private**:
    - `secret`: A 256-bit random value known only to the citizen.
    - `private_license_data`: The license ID or other sensitive data.
    - `merkle_path`: 20 sibling hashes for the Merkle proof.
    - `leaf_index`: The position of the leaf in the tree.
- **Public**:
    - `public_name`: The driver's name (revealed to the enforcer).
    - `scope`: A context-specific value (e.g., a traffic stop ID).
    - `public_merkle_root`: The root currently stored on the [[Kingdom_2_Blockchain|Blockchain]].

### Constraints
1. **Inclusion Proof**: Uses the `merkle_path` and `leaf_index` to reconstruct the root from the leaf and asserts it matches the `public_merkle_root`.
2. **Identity Verification**: Asserts that `hash(secret, private_license_data, public_name)` equals the leaf commitment stored in the tree.
3. **Nullifier Construction**: Generates a unique `nullifier = hash(secret, scope)`. This allows the system to see that the *same* person has interacted within the same scope without knowing *who* that person is.

## ⚙️ Proving System
- **Curve**: BN254.
- **Backend**: `Barretenberg` (PLONK-based).
- **Artifacts**: Found in `circuits/target/hybrid_transparency.json`.

## 🔗 Related Components
- [[Kingdom_3_Citizen]]: Generates proofs using this circuit.
- [[Kingdom_4_Authority]]: Verifies proofs using the verification key derived from this circuit.
