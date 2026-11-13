/**
 * SHA-256 hex digest via Web Crypto. Web Crypto only exists in secure contexts
 * (https or localhost); on file:// or plain http we fall back to a deterministic
 * non-cryptographic hash so the demo still works. This is DEMO-level protection only —
 * real authentication must happen on a server (see docs, chapter 11).
 */
export async function hashPassword(s: string): Promise<string> {
  try {
    if (window.crypto?.subtle) {
      const buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
      return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    /* fall through */
  }
  // FNV-1a 32-bit ×4 with different seeds → 32 hex chars
  let out = "";
  for (let seed = 0; seed < 4; seed++) {
    let h = 0x811c9dc5 ^ (seed * 0x9e3779b1);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    out += (h >>> 0).toString(16).padStart(8, "0");
  }
  return "fnv:" + out;
}
