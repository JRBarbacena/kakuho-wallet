import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import circuit from './hybrid_transparency.json';
import { toFieldHex } from '../lib/commitment';

/**
 * Generates a real ZK-SNARK proof using NoirJS and Barretenberg.
 */
export async function generateIdentityProof(
  secret: string, 
  privateLicenseData: string, 
  privateName: string,
  merklePath: string[], 
  leafIndex: number,
  scope: string,
  publicMerkleRoot: string
) {
  try {
    console.log("🚀 Starting Real ZK Proof Generation...");
    
    // 1. Initialize Backend and Noir
    // @ts-ignore
    const backend = new BarretenbergBackend(circuit);
    // @ts-ignore
    const noir = new Noir(circuit, backend);

    // 2. Prepare Inputs (Ensure all are hex strings compatible with Field)
    const inputs = {
      secret: toFieldHex(secret),
      private_license_data: toFieldHex(privateLicenseData),
      private_name: toFieldHex(privateName),
      merkle_path: merklePath.map(p => p.startsWith('0x') ? p : toFieldHex(p)),
      leaf_index: leafIndex,
      scope: toFieldHex(scope),
      public_merkle_root: toFieldHex(publicMerkleRoot)
    };

    console.log("📥 Circuit Inputs Ready:", inputs);

    // 3. Generate Proof
    const { witness } = await noir.execute(inputs);
    const proof = await backend.generateProof(witness);

    console.log("✅ ZK Proof Generated successfully!");

    return {
      proof: "0x" + Buffer.from(proof.proof).toString('hex'),
      publicInputs: proof.publicInputs,
      // The nullifier is the first public output (return value)
      nullifier: proof.publicInputs[0] 
    };
  } catch (error) {
    console.error("❌ ZK Proof Generation failed:", error);
    throw error;
  }
}
