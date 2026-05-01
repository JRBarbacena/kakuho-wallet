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
 * Computes Poseidon3(secret, private_license_data, public_name) using bb.js.
 * Must match the formula in circuits/src/main.nr (bn254::hash_3) and crypto.js exactly.
 */
export async function computeLeafHash(
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
  return "0x" + Array.from(result.hash).map((b: number) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Converts any value to a 0x-prefixed 32-byte hex string for Field inputs.
 */
export function toFieldHex(value: string | number | bigint): string {
  if (typeof value === "string" && value.startsWith("0x")) {
    return "0x" + value.slice(2).padStart(64, "0");
  }
  return "0x" + BigInt(value).toString(16).padStart(64, "0");
}

/**
 * Encodes a UTF-8 string as a Field by treating its bytes as a big-endian integer.
 * Truncates to 31 bytes to stay within the BN254 field modulus.
 */
export function stringToFieldHex(text: string): string {
  const bytes = new TextEncoder().encode(text).slice(0, 31);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return "0x" + hex.padStart(64, "0");
}
