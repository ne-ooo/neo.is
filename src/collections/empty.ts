import { toString } from '../utils/to-string.js'

/**
 * Check if value is empty
 * Works with arrays, objects, strings, maps, and sets
 *
 * @param value - Value to check
 * @returns true if value is empty
 *
 * @example
 * isEmpty([])                // true
 * isEmpty({})                // true
 * isEmpty('')                // true
 * isEmpty(new Map())         // true
 * isEmpty(new Set())         // true
 * isEmpty([1])               // false
 * isEmpty({ a: 1 })          // false
 * isEmpty('test')            // false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }

  // Arrays and strings
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0
  }

  // Maps and Sets
  const tag = toString(value)
  if (tag === '[object Map]' || tag === '[object Set]') {
    return (value as Map<unknown, unknown> | Set<unknown>).size === 0
  }

  // Plain objects
  if (tag === '[object Object]') {
    return Object.keys(value as object).length === 0
  }

  return false
}
