import { toString } from '../utils/to-string.js'

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
export function isWeakMap<K extends object = object, V = unknown>(
  value: unknown
): value is WeakMap<K, V> {
  return toString(value) === '[object WeakMap]'
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
export function isWeakSet<T extends object = object>(
  value: unknown
): value is WeakSet<T> {
  return toString(value) === '[object WeakSet]'
}
