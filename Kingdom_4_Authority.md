# Kingdom 4: The Authority (Issuer & Verifier)

The Authority (LTO - Land Transportation Office) plays a dual role: Issuing identities and Verifying them.

## 🏛️ The Issuer Portal (`/issuer`)
Responsible for onboarding new drivers.

### Workflow
1. **Data Collection**: Admin enters driver details (Name, DOB, License Type).
2. **Commitment Generation**: The system creates a `leafHash` (Pedersen/Poseidon hash of the secret and data).
3. **On-Chain Anchor**: Admin sends the `leafHash` to the `LTORegistry` on the [[Kingdom_2_Blockchain|Blockchain]].
4. **Off-Chain Database**: Full raw data is stored in **Supabase** or **Supabase** for administrative lookup (this is the "Hybrid" part—ZK for the public, DB for the authority).

## 👮 The Enforcer App (`/enforcer`)
Used by traffic enforcers to verify drivers.

### Verification Flow
1. **Scope Definition**: The enforcer app generates a unique `scope` for the transaction.
2. **Scan**: Enforcer scans the ZKP QR code provided by the [[Kingdom_3_Citizen|Citizen]].
3. **Verification**: 
    - Fetches the latest `merkle_root` from the blockchain.
    - Uses the `Barretenberg` verifier to check the ZK Proof against the root, the `scope`, and the driver's `public_name`.
    - If valid, the enforcer is 100% sure the driver is in the registry without seeing their private `licenseID` or `secret`.

## 🛠️ Key Files
- `src/app/admin/page.tsx`: The main dashboard for the LTO.
- `src/app/api/admin/issue/route.ts`: API endpoint for processing new licenses.
- `src/lib/supabase.ts`: Integration with the off-chain database.

## 🔗 Related Components
- [[Kingdom_2_Blockchain]]: The target for `issueLicense` calls.
- [[Kingdom_3_Citizen]]: The party being verified.
- [[Kingdom_1_Cryptography]]: The logic used to verify the proofs.
