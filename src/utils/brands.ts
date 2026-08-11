import type { Thenable } from '../types.js'

export type TypedArrayName =
  | 'Int8Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Int16Array'
  | 'Uint16Array'
  | 'Int32Array'
  | 'Uint32Array'
  | 'Float32Array'
  | 'Float64Array'
  | 'BigInt64Array'
  | 'BigUint64Array'

let intrinsicApply: typeof Reflect.apply | undefined
let intrinsicGetOwnPropertyDescriptor:
  | typeof Object.getOwnPropertyDescriptor
  | undefined
let intrinsicGetPrototypeOf: typeof Object.getPrototypeOf | undefined
let intrinsicFunctionToString: typeof Function.prototype.toString | undefined
let intrinsicObjectToString: typeof Object.prototype.toString | undefined

function apply(
  target: (...args: never[]) => unknown,
  thisArgument: unknown,
  argumentsList: readonly unknown[]
): unknown {
  intrinsicApply ??= Reflect.apply
  return intrinsicApply(target, thisArgument, argumentsList)
}

function getOwnPropertyDescriptor(
  value: object,
  property: PropertyKey
): PropertyDescriptor | undefined {
  intrinsicGetOwnPropertyDescriptor ??= Object.getOwnPropertyDescriptor
  return intrinsicGetOwnPropertyDescriptor(value, property)
}

function getPrototypeOf(value: object): object | null {
  intrinsicGetPrototypeOf ??= Object.getPrototypeOf
  return intrinsicGetPrototypeOf(value)
}

function getFunctionToString(): typeof Function.prototype.toString {
  intrinsicFunctionToString ??= Function.prototype.toString
  return intrinsicFunctionToString
}

function getObjectToString(): typeof Object.prototype.toString {
  intrinsicObjectToString ??= Object.prototype.toString
  return intrinsicObjectToString
}

function getFunctionConstructorSource(
  value: (...args: never[]) => unknown
): string {
  const prototype = getPrototypeOf(value)
  if (prototype === null) return ''
  const constructor = prototype.constructor
  return apply(getFunctionToString(), constructor, []) as string
}

function getAccessor(
  prototype: object,
  property: PropertyKey
): PropertyDescriptor['get'] {
  return getOwnPropertyDescriptor(prototype, property)?.get
}

function getTypedArrayTagAccessor(): PropertyDescriptor['get'] {
  const prototype = getPrototypeOf(Uint8Array.prototype)
  return prototype === null
    ? undefined
    : getAccessor(prototype, Symbol.toStringTag)
}

let asyncFunctionConstructorSource: string | undefined
let generatorFunctionConstructorSource: string | undefined
let mapSizeGetter: PropertyDescriptor['get']
let setSizeGetter: PropertyDescriptor['get']
let regexpSourceGetter: PropertyDescriptor['get']
let typedArrayTagGetter: PropertyDescriptor['get']
let dateGetTime: typeof Date.prototype.getTime | undefined
let weakMapHas: typeof WeakMap.prototype.has | undefined
let weakSetHas: typeof WeakSet.prototype.has | undefined
let weakCollectionProbe: object | undefined

function getAsyncFunctionConstructorSource(): string {
  asyncFunctionConstructorSource ??= getFunctionConstructorSource(async function () {})
  return asyncFunctionConstructorSource
}

function getGeneratorFunctionConstructorSource(): string {
  generatorFunctionConstructorSource ??= getFunctionConstructorSource(function* () {})
  return generatorFunctionConstructorSource
}

function getMapSizeGetter(): PropertyDescriptor['get'] {
  mapSizeGetter ??= getAccessor(Map.prototype, 'size')
  return mapSizeGetter
}

function getSetSizeGetter(): PropertyDescriptor['get'] {
  setSizeGetter ??= getAccessor(Set.prototype, 'size')
  return setSizeGetter
}

function getRegExpSourceGetter(): PropertyDescriptor['get'] {
  regexpSourceGetter ??= getAccessor(RegExp.prototype, 'source')
  return regexpSourceGetter
}

function getTypedArrayTagGetter(): PropertyDescriptor['get'] {
  typedArrayTagGetter ??= getTypedArrayTagAccessor()
  return typedArrayTagGetter
}

function getDateGetTime(): typeof Date.prototype.getTime {
  dateGetTime ??= Date.prototype.getTime
  return dateGetTime
}

function getWeakMapHas(): typeof WeakMap.prototype.has {
  weakMapHas ??= WeakMap.prototype.has
  return weakMapHas
}

function getWeakSetHas(): typeof WeakSet.prototype.has {
  weakSetHas ??= WeakSet.prototype.has
  return weakSetHas
}

function getWeakCollectionProbe(): object {
  weakCollectionProbe ??= Object.freeze({})
  return weakCollectionProbe
}

function toTypedArrayName(value: unknown): TypedArrayName | undefined {
  switch (value) {
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array':
      return value
    default:
      return undefined
  }
}

function createNativeErrorConstructorSources(): Set<string> {
  const runtimeGlobals = globalThis as unknown as Record<string, unknown>
  const nativeErrorConstructors: unknown[] = [
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    runtimeGlobals['AggregateError'],
    runtimeGlobals['DOMException'],
  ]

  return new Set(nativeErrorConstructors.flatMap((constructor) => {
    if (typeof constructor !== 'function') return []
    try {
      return [apply(getFunctionToString(), constructor, []) as string]
    } catch {
      return []
    }
  }))
}

let errorIsErrorInitialized = false
let errorIsError: ((value: unknown) => boolean) | undefined
let nativeErrorConstructorSources: Set<string> | undefined

function getErrorIsError(): ((value: unknown) => boolean) | undefined {
  if (errorIsErrorInitialized) return errorIsError
  errorIsError = (Error as ErrorConstructor & {
    isError?: (value: unknown) => boolean
  }).isError
  errorIsErrorInitialized = true
  return errorIsError
}

function getNativeErrorConstructorSources(): Set<string> {
  nativeErrorConstructorSources ??= createNativeErrorConstructorSources()
  return nativeErrorConstructorSources
}

function isObjectLike(value: unknown): value is object {
  return value !== null && (typeof value === 'object' || typeof value === 'function')
}

export function getMapSize(value: unknown): number | undefined {
  if (!isObjectLike(value)) return undefined
  const getter = getMapSizeGetter()
  if (getter === undefined) return undefined
  try {
    return apply(getter, value, []) as number
  } catch {
    return undefined
  }
}

export function hasMapBrand(value: unknown): value is Map<unknown, unknown> {
  return getMapSize(value) !== undefined
}

export function getSetSize(value: unknown): number | undefined {
  if (!isObjectLike(value)) return undefined
  const getter = getSetSizeGetter()
  if (getter === undefined) return undefined
  try {
    return apply(getter, value, []) as number
  } catch {
    return undefined
  }
}

/**
 * Read the size of a Map or Set without using exceptions for local dispatch.
 * Cross-realm and disguised collections still fall back to intrinsic checks.
 */
export function getCollectionSize(value: unknown): number | undefined {
  if (!isObjectLike(value)) return undefined

  try {
    const prototype = getPrototypeOf(value)
    if (prototype === Map.prototype) return getMapSize(value)
    if (prototype === Set.prototype) return getSetSize(value)

    const tag = apply(getObjectToString(), value, [])
    if (tag === '[object Map]') return getMapSize(value)
    if (tag === '[object Set]') return getSetSize(value)
  } catch {
    // Continue with intrinsic checks for hostile or disguised objects.
  }

  const mapSize = getMapSize(value)
  return mapSize === undefined ? getSetSize(value) : mapSize
}

export function hasSetBrand(value: unknown): value is Set<unknown> {
  return getSetSize(value) !== undefined
}

export function hasWeakMapBrand(value: unknown): value is WeakMap<object, unknown> {
  if (!isObjectLike(value)) return false
  try {
    apply(getWeakMapHas(), value, [getWeakCollectionProbe()])
    return true
  } catch {
    return false
  }
}

export function hasWeakSetBrand(value: unknown): value is WeakSet<object> {
  if (!isObjectLike(value)) return false
  try {
    apply(getWeakSetHas(), value, [getWeakCollectionProbe()])
    return true
  } catch {
    return false
  }
}

export function hasDateBrand(value: unknown): value is Date {
  if (!isObjectLike(value)) return false
  try {
    apply(getDateGetTime(), value, [])
    return true
  } catch {
    return false
  }
}

export function hasRegExpBrand(value: unknown): value is RegExp {
  if (!isObjectLike(value)) return false
  const getter = getRegExpSourceGetter()
  if (getter === undefined) return false
  try {
    apply(getter, value, [])
    return true
  } catch {
    return false
  }
}

export function getTypedArrayName(value: unknown): TypedArrayName | undefined {
  if (!isObjectLike(value)) return undefined

  try {
    if (!ArrayBuffer.isView(value)) return undefined
  } catch {
    return undefined
  }

  const getter = getTypedArrayTagGetter()
  if (getter === undefined) return undefined
  try {
    return toTypedArrayName(apply(getter, value, []))
  } catch {
    return undefined
  }
}

export function hasErrorBrand(value: unknown): value is Error {
  if (!isObjectLike(value)) return false

  const isError = getErrorIsError()
  if (isError !== undefined) {
    try {
      return isError(value)
    } catch {
      return false
    }
  }

  try {
    let prototype: object | null = getPrototypeOf(value)
    while (prototype !== null) {
      const constructor = getOwnPropertyDescriptor(prototype, 'constructor')?.value
      if (typeof constructor === 'function') {
        const source = apply(getFunctionToString(), constructor, []) as string
        if (getNativeErrorConstructorSources().has(source)) return true
      }
      prototype = getPrototypeOf(prototype)
    }
  } catch {
    return false
  }

  return false
}

function getFunctionSource(value: unknown): string | undefined {
  if (typeof value !== 'function') return undefined
  try {
    return (apply(getFunctionToString(), value, []) as string).trimStart()
  } catch {
    return undefined
  }
}

function hasFunctionPrototypeConstructor(
  value: (...args: never[]) => unknown,
  expectedConstructorSource: string
): boolean {
  try {
    const prototype = getPrototypeOf(value)
    if (prototype === null) return false
    const constructor = getOwnPropertyDescriptor(prototype, 'constructor')?.value
    return (
      typeof constructor === 'function' &&
      apply(getFunctionToString(), constructor, []) === expectedConstructorSource
    )
  } catch {
    return false
  }
}

export function hasAsyncFunctionBrand(
  value: unknown
): value is (...args: never[]) => Promise<unknown> {
  const source = getFunctionSource(value)
  if (source === undefined) return false
  if (source.startsWith('async')) {
    return !/^async\s+function\s*\*/.test(source) && !/^async\s*\*/.test(source)
  }
  return hasFunctionPrototypeConstructor(
    value as (...args: never[]) => unknown,
    getAsyncFunctionConstructorSource()
  )
}

export function hasGeneratorFunctionBrand(
  value: unknown
): value is (...args: never[]) => Generator<unknown, unknown, unknown> {
  const source = getFunctionSource(value)
  if (source === undefined) return false
  if (/^(?:function\s*)?\*/.test(source)) return true
  return hasFunctionPrototypeConstructor(
    value as (...args: never[]) => unknown,
    getGeneratorFunctionConstructorSource()
  )
}

export function hasGeneratorShape(
  value: unknown
): value is Generator<unknown, unknown, unknown> {
  if (!isObjectLike(value)) return false
  try {
    const generator = value as Record<PropertyKey, unknown>
    return (
      typeof generator['next'] === 'function' &&
      typeof generator['return'] === 'function' &&
      typeof generator['throw'] === 'function' &&
      typeof generator[Symbol.iterator] === 'function'
    )
  } catch {
    return false
  }
}

export function hasThenableShape(value: unknown): value is Thenable {
  if (!isObjectLike(value)) return false
  try {
    return typeof (value as { then?: unknown }).then === 'function'
  } catch {
    return false
  }
}
