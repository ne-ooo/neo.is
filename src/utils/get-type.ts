import { getTag } from './to-string.js'
import type { TypeString } from '../types.js'

/**
 * Get the type of a value as a string (like kind-of)
 *
 * Returns lowercase type strings for all JavaScript types.
 * Uses cross-realm safe detection.
 *
 * @param value - Value to get type of
 * @returns Type string
 *
 * @example
 * getType(42)                // 'number'
 * getType('hello')           // 'string'
 * getType([])                // 'array'
 * getType({})                // 'object'
 * getType(new Date())        // 'date'
 * getType(/test/)            // 'regexp'
 * getType(null)              // 'null'
 * getType(undefined)         // 'undefined'
 * getType(async () => {})    // 'asyncfunction'
 */
export function getType(value: unknown): TypeString {
  // Handle primitives with typeof
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  const type = typeof value

  if (type === 'boolean') return 'boolean'
  if (type === 'string') return 'string'
  if (type === 'symbol') return 'symbol'
  if (type === 'bigint') return 'bigint'

  // Handle numbers (exclude NaN)
  if (type === 'number') {
    return (value as number) - (value as number) === 0 ? 'number' : 'nan'
  }

  // Handle functions
  if (type === 'function') {
    const tag = getTag(value)
    if (tag === 'AsyncFunction') return 'asyncfunction'
    if (tag === 'GeneratorFunction') return 'generatorfunction'
    return 'function'
  }

  // Handle objects using toString
  const tag = getTag(value)

  // Map toString tags to our type strings
  const tagMap: Record<string, TypeString> = {
    Array: 'array',
    Object: 'object',
    Date: 'date',
    RegExp: 'regexp',
    Error: 'error',
    Map: 'map',
    Set: 'set',
    WeakMap: 'weakmap',
    WeakSet: 'weakset',
    Promise: 'promise',
    Int8Array: 'int8array',
    Uint8Array: 'uint8array',
    Uint8ClampedArray: 'uint8clampedarray',
    Int16Array: 'int16array',
    Uint16Array: 'uint16array',
    Int32Array: 'int32array',
    Uint32Array: 'uint32array',
    Float32Array: 'float32array',
    Float64Array: 'float64array',
    BigInt64Array: 'bigint64array',
    BigUint64Array: 'biguint64array',
  }

  return tagMap[tag] || 'object'
}
