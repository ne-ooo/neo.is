import { hasSetBrand } from '../utils/brands.js'

/**
 * Check if value is a Set (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is a Set
 *
 * @example
 * isSet(new Set())          // true
 * isSet([])                 // false
 */
export function isSet(value: unknown): value is Set<unknown> {
  return hasSetBrand(value)
}
