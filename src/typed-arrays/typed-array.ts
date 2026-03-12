import { toString } from '../utils/to-string.js'
import type { TypedArray } from '../types.js'

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
  const tag = toString(value)
  return (
    tag === '[object Int8Array]' ||
    tag === '[object Uint8Array]' ||
    tag === '[object Uint8ClampedArray]' ||
    tag === '[object Int16Array]' ||
    tag === '[object Uint16Array]' ||
    tag === '[object Int32Array]' ||
    tag === '[object Uint32Array]' ||
    tag === '[object Float32Array]' ||
    tag === '[object Float64Array]' ||
    tag === '[object BigInt64Array]' ||
    tag === '[object BigUint64Array]'
  )
}
