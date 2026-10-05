// src/utils/cryptoUtils.ts - Secure cryptographic derivation for Pattern Lock Protection

const SALT = 'StudyMate_Pattern_Salt_v2_2026';

export async function hashPattern(pattern: number[]): Promise<string> {
  const patternString = `${SALT}:${pattern.join('-')}:${pattern.length}`;
  
  // Use Web Crypto API SHA-256
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(patternString);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `pat_sha256_${hashHex}`;
    } catch {
      // Fallback
    }
  }

  // Fallback hash
  let hash = 0;
  for (let i = 0; i < patternString.length; i++) {
    const char = patternString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `pat_fb_${Math.abs(hash).toString(16)}`;
}

export async function verifyPattern(inputPattern: number[], storedHash?: string): Promise<boolean> {
  if (!storedHash) return true;
  const computed = await hashPattern(inputPattern);
  return computed === storedHash;
}
