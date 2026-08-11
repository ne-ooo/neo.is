import { hasErrorBrand } from '../utils/brands.js'

/**
 * Check if value is an Error (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is an Error
 *
 * @example
 * isError(new Error())      // true
 * isError(new TypeError())  // true
 * isError('error')          // false
 */
export function isError(value: unknown): value is Error {
  return hasErrorBrand(value)
}
