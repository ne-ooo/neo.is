import { getTypedArrayName } from '../utils/brands.js'

/**
 * Check if value is an Int8Array
 */
export function isInt8Array(value: unknown): value is Int8Array {
  return getTypedArrayName(value) === 'Int8Array'
}

/**
 * Check if value is a Uint8Array
 */
export function isUint8Array(value: unknown): value is Uint8Array {
  return getTypedArrayName(value) === 'Uint8Array'
}

/**
 * Check if value is a Uint8ClampedArray
 */
export function isUint8ClampedArray(value: unknown): value is Uint8ClampedArray {
  return getTypedArrayName(value) === 'Uint8ClampedArray'
}

/**
 * Check if value is an Int16Array
 */
export function isInt16Array(value: unknown): value is Int16Array {
  return getTypedArrayName(value) === 'Int16Array'
}

/**
 * Check if value is a Uint16Array
 */
export function isUint16Array(value: unknown): value is Uint16Array {
  return getTypedArrayName(value) === 'Uint16Array'
}

/**
 * Check if value is an Int32Array
 */
export function isInt32Array(value: unknown): value is Int32Array {
  return getTypedArrayName(value) === 'Int32Array'
}

/**
 * Check if value is a Uint32Array
 */
export function isUint32Array(value: unknown): value is Uint32Array {
  return getTypedArrayName(value) === 'Uint32Array'
}

/**
 * Check if value is a Float32Array
 */
export function isFloat32Array(value: unknown): value is Float32Array {
  return getTypedArrayName(value) === 'Float32Array'
}

/**
 * Check if value is a Float64Array
 */
export function isFloat64Array(value: unknown): value is Float64Array {
  return getTypedArrayName(value) === 'Float64Array'
}

/**
 * Check if value is a BigInt64Array
 */
export function isBigInt64Array(value: unknown): value is BigInt64Array {
  return getTypedArrayName(value) === 'BigInt64Array'
}

/**
 * Check if value is a BigUint64Array
 */
export function isBigUint64Array(value: unknown): value is BigUint64Array {
  return getTypedArrayName(value) === 'BigUint64Array'
}
