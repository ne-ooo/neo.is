/**
 * Check if value is an array (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is an array
 *
 * @example
 * isArray([])               // true
 * isArray([1, 2, 3])        // true
 * isArray('not array')      // false
 */
export function isArray(value: unknown): value is unknown[] {
  try {
    return Array.isArray(value)
  } catch {
    return false
  }
}
