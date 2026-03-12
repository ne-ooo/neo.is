import { toString } from '../utils/to-string.js'

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
export function isSet<T = unknown>(value: unknown): value is Set<T> {
  return toString(value) === '[object Set]'
}
