/**
 * Check if value is a bigint
 *
 * @param value - Value to check
 * @returns true if value is a bigint
 *
 * @example
 * isBigInt(42n)          // true
 * isBigInt(42)           // false
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}
