import type { TypeString } from '../types.js'
import { isPlainObject } from '../objects/plain-object.js'
import {
  getTypedArrayName,
  hasAsyncFunctionBrand,
  hasDateBrand,
  hasErrorBrand,
  hasGeneratorFunctionBrand,
  hasGeneratorShape,
  hasMapBrand,
  hasRegExpBrand,
  hasSetBrand,
  hasThenableShape,
  hasWeakMapBrand,
  hasWeakSetBrand,
  type TypedArrayName,
} from './brands.js'

const TYPED_ARRAY_TYPES: Record<TypedArrayName, TypeString> = {
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

let objectToString: typeof Object.prototype.toString | undefined

function getObjectTagHint(value: object): string | undefined {
  objectToString ??= Object.prototype.toString
  try {
    return objectToString.call(value)
  } catch {
    return undefined
  }
}

function getLocalHintedType(value: object): TypeString | undefined {
  let prototype: object | null
  try {
    prototype = Object.getPrototypeOf(value)
  } catch {
    return undefined
  }

  switch (prototype) {
    case Date.prototype:
      return hasDateBrand(value) ? 'date' : undefined
    case RegExp.prototype:
      return hasRegExpBrand(value) ? 'regexp' : undefined
    case Error.prototype:
      return hasErrorBrand(value) ? 'error' : undefined
    case Map.prototype:
      return hasMapBrand(value) ? 'map' : undefined
    case Set.prototype:
      return hasSetBrand(value) ? 'set' : undefined
    case WeakMap.prototype:
      return hasWeakMapBrand(value) ? 'weakmap' : undefined
    case WeakSet.prototype:
      return hasWeakSetBrand(value) ? 'weakset' : undefined
    case Promise.prototype:
      return hasThenableShape(value) ? 'promise' : undefined
    default:
      return undefined
  }
}

function getHintedType(value: object, tag: string): TypeString | undefined {
  switch (tag) {
    case '[object Date]':
      return hasDateBrand(value) ? 'date' : undefined
    case '[object RegExp]':
      return hasRegExpBrand(value) ? 'regexp' : undefined
    case '[object Error]':
      return hasErrorBrand(value) ? 'error' : undefined
    case '[object Map]':
      return hasMapBrand(value) ? 'map' : undefined
    case '[object Set]':
      return hasSetBrand(value) ? 'set' : undefined
    case '[object WeakMap]':
      return hasWeakMapBrand(value) ? 'weakmap' : undefined
    case '[object WeakSet]':
      return hasWeakSetBrand(value) ? 'weakset' : undefined
    case '[object Generator]':
      return hasGeneratorShape(value) ? 'generator' : undefined
    case '[object Promise]':
      return hasThenableShape(value) ? 'promise' : undefined
    default:
      return undefined
  }
}

/**
 * Get the type of a value as a string (like kind-of)
 *
 * Returns lowercase type strings for supported JavaScript types.
 * Uses cross-realm brand detection for built-in objects.
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

  // Handle numbers and distinguish only the NaN value.
  if (type === 'number') {
    return Number.isNaN(value) ? 'nan' : 'number'
  }

  // Handle functions
  if (type === 'function') {
    if (hasAsyncFunctionBrand(value)) return 'asyncfunction'
    if (hasGeneratorFunctionBrand(value)) return 'generatorfunction'
    return 'function'
  }

  try {
    if (Array.isArray(value)) return 'array'
  } catch {
    return 'object'
  }

  if (isPlainObject(value)) {
    return hasThenableShape(value) ? 'promise' : 'object'
  }

  const typedArrayName = getTypedArrayName(value)
  if (typedArrayName !== undefined) return TYPED_ARRAY_TYPES[typedArrayName]

  const localHintedType = getLocalHintedType(value as object)
  if (localHintedType !== undefined) return localHintedType

  const tag = getObjectTagHint(value as object)
  if (tag !== undefined) {
    const hintedType = getHintedType(value as object, tag)
    if (hintedType !== undefined) return hintedType
  }

  // Fall back to every intrinsic check when Symbol.toStringTag was forged.
  if (hasDateBrand(value)) return 'date'
  if (hasRegExpBrand(value)) return 'regexp'
  if (hasErrorBrand(value)) return 'error'
  if (hasMapBrand(value)) return 'map'
  if (hasSetBrand(value)) return 'set'
  if (hasWeakMapBrand(value)) return 'weakmap'
  if (hasWeakSetBrand(value)) return 'weakset'
  if (hasGeneratorShape(value)) return 'generator'
  if (hasThenableShape(value)) return 'promise'
  return 'object'
}
