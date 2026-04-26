import { poseidon3 } from 'poseidon-lite';

const FIELD_MODULUS = BigInt("0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001");
const FIELD_BYTES = 32;

function normalizeField(value) {
  return ((value % FIELD_MODULUS) + FIELD_MODULUS) % FIELD_MODULUS;
}

export function toFieldBigInt(input) {
  if (typeof input === 'bigint') {
    return normalizeField(input);
  }

  if (typeof input === 'number') {
    return normalizeField(BigInt(input));
  }

  const text = String(input ?? '');
  if (text.startsWith('0x') || text.startsWith('0X')) {
    return normalizeField(BigInt(text));
  }

  if (/^-?\d+$/.test(text)) {
    return normalizeField(BigInt(text));
  }

  const bytes = new TextEncoder().encode(text);
  let acc = BigInt(0);
  for (const byte of bytes) {
    acc = (acc << BigInt(8)) + BigInt(byte);
  }

  return normalizeField(acc);
}

export function toFieldHex(input) {
  return `0x${toFieldBigInt(input).toString(16).padStart(FIELD_BYTES * 2, '0')}`;
}

export function createIdentityLeafHash(secret, privateData, fullName) {
  const hash = poseidon3([
    toFieldBigInt(secret),
    toFieldBigInt(privateData),
    toFieldBigInt(fullName)
  ]);

  return `0x${hash.toString(16).padStart(FIELD_BYTES * 2, '0')}`;
}
