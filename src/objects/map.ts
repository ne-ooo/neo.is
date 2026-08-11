import { hasMapBrand } from '../utils/brands.js'

/**
 * Check if value is a Map (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is a Map
 *
 * @example
 * isMap(new Map())          // true
 * isMap({})                 // false
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return hasMapBrand(value)
}
