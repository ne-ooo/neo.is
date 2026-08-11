import { getCollectionSize } from '../utils/brands.js'
import { isPlainObject } from '../objects/plain-object.js'

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

  try {
    // Arrays and strings
    if (Array.isArray(value) || typeof value === 'string') {
      return value.length === 0
    }

    // Plain objects
    if (isPlainObject(value)) {
      return Reflect.ownKeys(value).length === 0
    }

    const collectionSize = getCollectionSize(value)
    if (collectionSize !== undefined) return collectionSize === 0

    return false
  } catch {
    // An uninspectable proxy must not be treated as empty.
    return false
  }
}
