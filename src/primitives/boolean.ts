/**
 * Check if value is a boolean
 *
 * @param value - Value to check
 * @returns true if value is a boolean
 *
 * @example
 * isBoolean(true)        // true
 * isBoolean(false)       // true
 * isBoolean(1)           // false (no coercion)
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
