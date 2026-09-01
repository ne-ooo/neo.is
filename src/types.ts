/**
 * Type guard function signature
 */
export type TypeGuard<T> = (value: unknown) => value is T

/**
 * Minimal structural contract checked by isPromise().
 *
 * A thenable does not necessarily provide Promise methods such as catch() or finally().
 */
export interface Thenable {
  then(
    onfulfilled?: ((value: unknown) => unknown) | null,
    onrejected?: ((reason: unknown) => unknown) | null
  ): unknown
}

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
  | 'float16array'
  | 'bigint64array'
  | 'biguint64array'

/** Minimal Float16Array shape for consumers whose TypeScript lib predates ESNext.Float16. */
export interface Float16ArrayFallback {
  readonly BYTES_PER_ELEMENT: number
  readonly buffer: ArrayBufferLike
  readonly byteLength: number
  readonly byteOffset: number
  readonly length: number
  [index: number]: number
  [Symbol.iterator](): IterableIterator<number>
  set(array: ArrayLike<number>, offset?: number): void
  subarray(begin?: number, end?: number): Float16ArrayFallback
}

/** Float16Array, with a structural fallback for older TypeScript libraries. */
export type Float16ArrayValue = typeof globalThis extends {
  Float16Array: { readonly prototype: infer TValue }
}
  ? TValue
  : Float16ArrayFallback

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
  | Float16ArrayValue
  | BigInt64Array
  | BigUint64Array
