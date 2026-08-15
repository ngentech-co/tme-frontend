'use client';

/**
 * Minimal CBOR parser — just enough to decode WebAuthn attestation objects
 * and extract the COSE public key from attestedCredentialData.
 *
 * Structure we need (attestationObject, a CBOR map):
 *   { 1: fmt, 2: authData (byte string), 3: attStmt }
 *
 * authData:
 *   rpIdHash (32) || flags (1) || signCount (4) || attestedCredentialData? || extensions?
 *
 * attestedCredentialData:
 *   aaguid (16) || credIdLen (2) || credentialId || cosePublicKey (CBOR)
 */

export function decodeCborPublicKey(attestationObject: Uint8Array): Uint8Array {
  const parsed = parseCbor(attestationObject, 0);
  if (parsed.value instanceof Map) {
    const authData = parsed.value.get(2);
    if (!(authData instanceof Uint8Array)) {
      throw new Error('attestationObject missing authData');
    }
    return extractCosePublicKey(authData);
  }
  throw new Error('attestationObject is not a CBOR map');
}

export function extractCosePublicKey(authData: Uint8Array): Uint8Array {
  // Skip rpIdHash (32) + flags (1) + signCount (4)
  let offset = 32 + 1 + 4;
  if (offset >= authData.length) {
    throw new Error('authData too short');
  }

  const flags = authData[32];
  const hasAttestedCredentialData = (flags & 0x40) !== 0;
  if (!hasAttestedCredentialData) {
    throw new Error('No attested credential data present');
  }

  // Skip AAGUID (16)
  offset += 16;
  if (offset + 2 > authData.length) throw new Error('authData truncated (aaguid)');

  const credIdLen = (authData[offset] << 8) | authData[offset + 1];
  offset += 2;

  if (offset + credIdLen > authData.length) {
    throw new Error('authData truncated (credential id)');
  }
  offset += credIdLen;

  // The rest is the COSE public key, a CBOR map.
  const { value, bytesRead } = parseCbor(authData, offset);
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('COSE key is not a CBOR map');
  }

  return authData.slice(offset, offset + bytesRead);
}

/**
 * Minimal CBOR decoder. Returns { value, bytesRead }.
 * Supports: unsigned/negative ints, byte strings, text strings,
 * arrays, maps, booleans, null, and simple values.
 * Maps are decoded into a Map<unknown, unknown> with numeric keys intact.
 */
export function parseCbor(
  data: Uint8Array,
  offset: number
): { value: unknown; bytesRead: number } {
  if (offset >= data.length) throw new Error('CBOR out of bounds');

  const startOffset = offset;
  const initial = data[offset];
  const majorType = initial >> 5;
  const additionalInfo = initial & 0x1f;
  offset++;

  let value: unknown;
  let extra = 0;

  // Read argument
  if (additionalInfo < 24) {
    extra = additionalInfo;
  } else if (additionalInfo === 24) {
    extra = data[offset++];
  } else if (additionalInfo === 25) {
    extra = (data[offset] << 8) | data[offset + 1];
    offset += 2;
  } else if (additionalInfo === 26) {
    extra =
      (data[offset] << 24) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3];
    offset += 4;
  } else if (additionalInfo === 27) {
    // 64-bit — read as two 32-bit halves (safe enough for our sizes)
    const hi =
      (data[offset] << 24) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3];
    const lo =
      (data[offset + 4] << 24) |
      (data[offset + 5] << 16) |
      (data[offset + 6] << 8) |
      data[offset + 7];
    offset += 8;
    extra = hi * 0x100000000 + lo;
  } else {
    throw new Error('Unsupported CBOR additional info');
  }

  switch (majorType) {
    case 0: // unsigned int
      value = extra;
      break;
    case 1: // negative int
      value = -1 - extra;
      break;
    case 2: {
      // byte string
      value = data.slice(offset, offset + extra);
      offset += extra;
      break;
    }
    case 3: {
      // text string
      const slice = data.slice(offset, offset + extra);
      value = new TextDecoder().decode(slice);
      offset += extra;
      break;
    }
    case 4: {
      // array
      const arr: unknown[] = [];
      for (let i = 0; i < extra; i++) {
        const r = parseCbor(data, offset);
        arr.push(r.value);
        offset += r.bytesRead;
      }
      value = arr;
      break;
    }
    case 5: {
      // map
      const map = new Map<unknown, unknown>();
      for (let i = 0; i < extra; i++) {
        const k = parseCbor(data, offset);
        offset += k.bytesRead;
        const v = parseCbor(data, offset);
        offset += v.bytesRead;
        map.set(k.value, v.value);
      }
      value = map;
      break;
    }
    case 6: {
      // tag — decode the tagged value, lose the tag
      const r = parseCbor(data, offset);
      offset += r.bytesRead;
      value = r.value;
      break;
    }
    case 7: {
      // simple / float / bool / null / undefined
      if (additionalInfo === 20) value = false;
      else if (additionalInfo === 21) value = true;
      else if (additionalInfo === 22) value = null;
      else if (additionalInfo === 23) value = undefined;
      else value = null;
      break;
    }
    default:
      throw new Error(`Unsupported CBOR major type ${majorType}`);
  }

  return { value, bytesRead: offset - startOffset };
}
