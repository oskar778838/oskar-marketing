// Email validation for the /subscribe double-opt-in endpoint.
//
// Linear single-char-class pattern with bounded quantifiers — no nested
// backtracking, so no ReDoS.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s) && s.length <= 254;
}
