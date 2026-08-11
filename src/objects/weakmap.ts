import { hasWeakMapBrand, hasWeakSetBrand } from '../utils/brands.js'

/**
 * Check if value is a WeakMap (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is a WeakMap
 *
 * @example
 * isWeakMap(new WeakMap())  // true
 * isWeakMap(new Map())      // false
 */
export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
  return hasWeakMapBrand(value)
}

/**
 * Check if value is a WeakSet (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is a WeakSet
 *
 * @example
 * isWeakSet(new WeakSet())  // true
 * isWeakSet(new Set())      // false
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
  return hasWeakSetBrand(value)
}
