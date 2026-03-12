import { toString } from '../utils/to-string.js'

/**
 * Check if value is an Int8Array
 */
export function isInt8Array(value: unknown): value is Int8Array {
  return toString(value) === '[object Int8Array]'
}

/**
 * Check if value is a Uint8Array
 */
export function isUint8Array(value: unknown): value is Uint8Array {
  return toString(value) === '[object Uint8Array]'
}

/**
 * Check if value is a Uint8ClampedArray
 */
export function isUint8ClampedArray(value: unknown): value is Uint8ClampedArray {
  return toString(value) === '[object Uint8ClampedArray]'
}

/**
 * Check if value is an Int16Array
 */
export function isInt16Array(value: unknown): value is Int16Array {
  return toString(value) === '[object Int16Array]'
}

/**
 * Check if value is a Uint16Array
 */
export function isUint16Array(value: unknown): value is Uint16Array {
  return toString(value) === '[object Uint16Array]'
}

/**
 * Check if value is an Int32Array
 */
export function isInt32Array(value: unknown): value is Int32Array {
  return toString(value) === '[object Int32Array]'
}

/**
 * Check if value is a Uint32Array
 */
export function isUint32Array(value: unknown): value is Uint32Array {
  return toString(value) === '[object Uint32Array]'
}

/**
 * Check if value is a Float32Array
 */
export function isFloat32Array(value: unknown): value is Float32Array {
  return toString(value) === '[object Float32Array]'
}

/**
 * Check if value is a Float64Array
 */
export function isFloat64Array(value: unknown): value is Float64Array {
  return toString(value) === '[object Float64Array]'
}

/**
 * Check if value is a BigInt64Array
 */
export function isBigInt64Array(value: unknown): value is BigInt64Array {
  return toString(value) === '[object BigInt64Array]'
}

/**
 * Check if value is a BigUint64Array
 */
export function isBigUint64Array(value: unknown): value is BigUint64Array {
  return toString(value) === '[object BigUint64Array]'
}
