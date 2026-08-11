import type { TypedArray } from '../types.js'
import { getTypedArrayName } from '../utils/brands.js'

/**
 * Check if value is any typed array
 *
 * @param value - Value to check
 * @returns true if value is a typed array
 *
 * @example
 * isTypedArray(new Int8Array())      // true
 * isTypedArray(new Uint8Array())     // true
 * isTypedArray([])                   // false
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return getTypedArrayName(value) !== undefined
}
