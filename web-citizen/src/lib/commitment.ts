/**
 * Generates a cryptographically secure 256-bit secret for the citizen.
 * Uses the browser's built-in CSPRNG (crypto.getRandomValues).
 * The secret is stored only in localStorage and never transmitted.
 */
export function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Converts a 0x hex string to a 32-byte Uint8Array for bb.js Field inputs. */
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const padded = clean.padStart(64, "0");
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Computes the Merkle leaf commitment: Poseidon3(secret, private_license_data, public_name).
 * Must match the formula in circuits/src/main.nr (bn254::hash_3) and crypto.js exactly.
 */
export async function createFinalMerkleLeaf(
  secret: string,
  privateLicenseData: string,
  publicName: string
): Promise<string> {
  const { Barretenberg } = await import("@aztec/bb.js");
  const bb = await Barretenberg.new({ threads: 1 });

  const result = await bb.poseidon2Hash({
    inputs: [
      hexToBytes(secret),
      hexToBytes(privateLicenseData),
      hexToBytes(publicName),
    ],
  });

  await bb.destroy();
  // result.hash is a Uint8Array — convert to 0x hex string
  return "0x" + Array.from(result.hash).map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Converts any value to a 0x-prefixed 32-byte hex string suitable for Noir Field inputs.
 * Noir Fields are BN254 scalars; anything that fits in 32 bytes is valid.
 */
export function toFieldHex(value: string | number | bigint): string {
  if (typeof value === 'string' && value.startsWith('0x')) {
    // Already hex — just pad to 32 bytes
    return '0x' + value.slice(2).padStart(64, '0');
  }

  if (typeof value === 'string') {
    // Try numeric string first
    const asNum = BigInt(value);
    return '0x' + asNum.toString(16).padStart(64, '0');
  }

  return '0x' + BigInt(value).toString(16).padStart(64, '0');
}

/**
 * Converts a UTF-8 string (e.g. a name) to a Field by taking its bytes as a big-endian integer.
 * Truncates to 31 bytes to stay safely within the BN254 field modulus.
 */
export function stringToFieldHex(text: string): string {
  const bytes = new TextEncoder().encode(text).slice(0, 31);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return '0x' + hex.padStart(64, '0');
}
