/**
 * Check if value is undefined
 *
 * @param value - Value to check
 * @returns true if value is undefined
 *
 * @example
 * isUndefined(undefined) // true
 * isUndefined(null)      // false
 * isUndefined(0)         // false
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * Check if value is null or undefined
 *
 * @param value - Value to check
 * @returns true if value is null or undefined
 *
 * @example
 * isNil(null)            // true
 * isNil(undefined)       // true
 * isNil(0)               // false
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined
}
