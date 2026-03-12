import { toString } from '../utils/to-string.js'

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
export function isMap<K = unknown, V = unknown>(
  value: unknown
): value is Map<K, V> {
  return toString(value) === '[object Map]'
}
