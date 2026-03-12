/**
 * Type guard function signature
 */
export type TypeGuard<T> = (value: unknown) => value is T

/**
 * Type string returned by getType()
 */
export type TypeString =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'number'
  | 'nan'
  | 'string'
  | 'symbol'
  | 'bigint'
  | 'function'
  | 'asyncfunction'
  | 'generatorfunction'
  | 'generator'
  | 'array'
  | 'object'
  | 'date'
  | 'regexp'
  | 'error'
  | 'map'
  | 'set'
  | 'weakmap'
  | 'weakset'
  | 'promise'
  | 'int8array'
  | 'uint8array'
  | 'uint8clampedarray'
  | 'int16array'
  | 'uint16array'
  | 'int32array'
  | 'uint32array'
  | 'float32array'
  | 'float64array'
  | 'bigint64array'
  | 'biguint64array'

/**
 * TypedArray union type
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
