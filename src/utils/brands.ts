import type { Thenable } from '../types.js'

export type TypedArrayName =
  | 'Int8Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Int16Array'
  | 'Uint16Array'
  | 'Int32Array'
  | 'Uint32Array'
  | 'Float16Array'
  | 'Float32Array'
  | 'Float64Array'
  | 'BigInt64Array'
  | 'BigUint64Array'

type Callable = (...args: never[]) => unknown

let intrinsicApply: typeof Reflect.apply | undefined
let intrinsicGetOwnPropertyDescriptor:
  | typeof Object.getOwnPropertyDescriptor
  | undefined
let intrinsicGetPrototypeOf: typeof Object.getPrototypeOf | undefined
let intrinsicFunctionToString: typeof Function.prototype.toString | undefined
let intrinsicObjectToString: typeof Object.prototype.toString | undefined
let negativeBrandCache: WeakMap<object, number> | undefined

const MAP_BRAND = 1 << 0
const SET_BRAND = 1 << 1
const WEAK_MAP_BRAND = 1 << 2
const WEAK_SET_BRAND = 1 << 3
const DATE_BRAND = 1 << 4
const REGEXP_BRAND = 1 << 5

function hasCachedNegativeBrand(value: object, brand: number): boolean {
  return ((negativeBrandCache?.get(value) ?? 0) & brand) !== 0
}

function cacheNegativeBrand(value: object, brand: number): void {
  negativeBrandCache ??= new WeakMap<object, number>()
  negativeBrandCache.set(value, (negativeBrandCache.get(value) ?? 0) | brand)
}

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

function hasOwnToStringTag(value: object): boolean {
  return getOwnPropertyDescriptor(value, Symbol.toStringTag) !== undefined
}

export function hasToStringTagDescriptor(value: object): boolean {
  let current: object | null = value
  for (let depth = 0; current !== null && depth < 100; depth++) {
    if (hasOwnToStringTag(current)) return true
    current = getPrototypeOf(current)
  }
  return false
}

/**
 * Use cheap identity, tag, and constructor checks before an intrinsic brand
 * check. The intrinsic remains the final authority for spoofable hints.
 */
function isPlausibleBuiltin(
  value: object,
  expectedPrototype: object,
  expectedTag: string
): boolean {
  try {
    const prototype = getPrototypeOf(value)
    if (prototype === expectedPrototype) return true
    // Replacing a built-in's prototype does not remove its internal brand.
    // Plain and null-prototype objects still need the authoritative check.
    if (prototype === null || prototype === Object.prototype) return true
    if (hasToStringTagDescriptor(value)) return true

    const tag = apply(getObjectToString(), value, [])
    if (tag === expectedTag) return true
    if (tag !== '[object Object]') {
      return false
    }

    // Any custom replacement prototype is plausible. The intrinsic check and
    // negative cache remain authoritative for this uncommon path.
    return true
  } catch {
    // Let the intrinsic brand check decide for hostile or opaque objects.
    return true
  }
}

let functionKindCache: WeakMap<Callable, FunctionKind> | undefined
let mapSizeGetter: PropertyDescriptor['get']
let setSizeGetter: PropertyDescriptor['get']
let regexpSourceGetter: PropertyDescriptor['get']
let domExceptionMessageGetter: PropertyDescriptor['get']
let typedArrayTagGetter: PropertyDescriptor['get']
let dateGetTime: typeof Date.prototype.getTime | undefined
let weakMapHas: typeof WeakMap.prototype.has | undefined
let weakSetHas: typeof WeakSet.prototype.has | undefined
let weakCollectionProbe: object | undefined

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

function getDOMExceptionMessageGetter(): PropertyDescriptor['get'] {
  const runtimeGlobals = globalThis as unknown as Record<string, unknown>
  const constructor = runtimeGlobals['DOMException']
  if (typeof constructor !== 'function') return undefined

  const prototype = getOwnPropertyDescriptor(constructor, 'prototype')?.value
  if (!isObjectLike(prototype)) return undefined
  domExceptionMessageGetter ??= getAccessor(prototype, 'message')
  return domExceptionMessageGetter
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
    case 'Float16Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array':
      return value
    default:
      return undefined
  }
}

let errorIsErrorInitialized = false
let errorIsError: ((value: unknown) => boolean) | undefined
let nodeUtilTypesInitialized = false
let nodeUtilTypes: Record<string, unknown> | undefined

function getNodeUtilTypes(): Record<string, unknown> | undefined {
  if (nodeUtilTypesInitialized) return nodeUtilTypes

  try {
    const process = (globalThis as unknown as Record<string, unknown>)['process']
    if (!isObjectLike(process)) return nodeUtilTypes

    const getBuiltinModule = (process as Record<string, unknown>)[
      'getBuiltinModule'
    ]
    if (typeof getBuiltinModule === 'function') {
      const util = apply(getBuiltinModule as Callable, process, ['node:util'])
      if (isObjectLike(util)) {
        const types = (util as Record<string, unknown>)['types']
        if (isObjectLike(types)) {
          nodeUtilTypes = types as Record<string, unknown>
          return nodeUtilTypes
        }
      }
    }

    const binding = (process as Record<string, unknown>)['binding']
    if (typeof binding !== 'function') return nodeUtilTypes
    const util = apply(binding as Callable, process, ['util'])
    if (isObjectLike(util)) nodeUtilTypes = util as Record<string, unknown>
  } catch {
    // A non-Node runtime has no native util type checks.
  } finally {
    nodeUtilTypesInitialized = true
  }

  return nodeUtilTypes
}

function getNodeTypeCheck(
  name: string
): ((value: unknown) => boolean) | undefined {
  const check = getNodeUtilTypes()?.[name]
  return typeof check === 'function'
    ? (check as (value: unknown) => boolean)
    : undefined
}

function getErrorIsError(): ((value: unknown) => boolean) | undefined {
  if (errorIsErrorInitialized) return errorIsError
  errorIsError = (Error as ErrorConstructor & {
    isError?: (value: unknown) => boolean
  }).isError ?? getNodeTypeCheck('isNativeError')
  errorIsErrorInitialized = true
  return errorIsError
}

function isObjectLike(value: unknown): value is object {
  return value !== null && (typeof value === 'object' || typeof value === 'function')
}

export function getMapSize(value: unknown): number | undefined {
  if (!isObjectLike(value)) return undefined
  if (hasCachedNegativeBrand(value, MAP_BRAND)) return undefined
  if (!isPlausibleBuiltin(value, Map.prototype, '[object Map]')) {
    return undefined
  }
  const getter = getMapSizeGetter()
  if (getter === undefined) return undefined
  try {
    return apply(getter, value, []) as number
  } catch {
    cacheNegativeBrand(value, MAP_BRAND)
    return undefined
  }
}

export function hasMapBrand(value: unknown): value is Map<unknown, unknown> {
  return getMapSize(value) !== undefined
}

export function getSetSize(value: unknown): number | undefined {
  if (!isObjectLike(value)) return undefined
  if (hasCachedNegativeBrand(value, SET_BRAND)) return undefined
  if (!isPlausibleBuiltin(value, Set.prototype, '[object Set]')) {
    return undefined
  }
  const getter = getSetSizeGetter()
  if (getter === undefined) return undefined
  try {
    return apply(getter, value, []) as number
  } catch {
    cacheNegativeBrand(value, SET_BRAND)
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

  } catch {
    // Continue with intrinsic checks for hostile or disguised objects.
  }

  const mapSize = getMapSize(value)
  return mapSize === undefined ? getSetSize(value) : mapSize
}

export function hasSetBrand(value: unknown): value is Set<unknown> {
  return getSetSize(value) !== undefined
}

export function hasWeakMapBrand(
  value: unknown
): value is WeakMap<WeakKey, unknown> {
  if (!isObjectLike(value)) return false
  if (hasCachedNegativeBrand(value, WEAK_MAP_BRAND)) return false
  if (!isPlausibleBuiltin(value, WeakMap.prototype, '[object WeakMap]')) {
    return false
  }
  try {
    apply(getWeakMapHas(), value, [getWeakCollectionProbe()])
    return true
  } catch {
    cacheNegativeBrand(value, WEAK_MAP_BRAND)
    return false
  }
}

export function hasWeakSetBrand(value: unknown): value is WeakSet<WeakKey> {
  if (!isObjectLike(value)) return false
  if (hasCachedNegativeBrand(value, WEAK_SET_BRAND)) return false
  if (!isPlausibleBuiltin(value, WeakSet.prototype, '[object WeakSet]')) {
    return false
  }
  try {
    apply(getWeakSetHas(), value, [getWeakCollectionProbe()])
    return true
  } catch {
    cacheNegativeBrand(value, WEAK_SET_BRAND)
    return false
  }
}

export function hasDateBrand(value: unknown): value is Date {
  if (!isObjectLike(value)) return false
  if (hasCachedNegativeBrand(value, DATE_BRAND)) return false
  if (!isPlausibleBuiltin(value, Date.prototype, '[object Date]')) {
    return false
  }
  try {
    apply(getDateGetTime(), value, [])
    return true
  } catch {
    cacheNegativeBrand(value, DATE_BRAND)
    return false
  }
}

export function hasRegExpBrand(value: unknown): value is RegExp {
  if (!isObjectLike(value)) return false
  if (hasCachedNegativeBrand(value, REGEXP_BRAND)) return false
  if (!isPlausibleBuiltin(value, RegExp.prototype, '[object RegExp]')) {
    return false
  }
  const getter = getRegExpSourceGetter()
  if (getter === undefined) return false
  try {
    apply(getter, value, [])
    return true
  } catch {
    cacheNegativeBrand(value, REGEXP_BRAND)
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
      if (isError(value)) return true
      const getter = getDOMExceptionMessageGetter()
      if (getter === undefined) return false
      apply(getter, value, [])
      return true
    } catch {
      return false
    }
  }

  const domExceptionGetter = getDOMExceptionMessageGetter()
  if (domExceptionGetter !== undefined) {
    try {
      apply(domExceptionGetter, value, [])
      return true
    } catch {
      // Continue to the structured-clone Error brand check.
    }
  }

  const clone = (globalThis as unknown as Record<string, unknown>)[
    'structuredClone'
  ]
  if (typeof clone !== 'function') return false

  try {
    const cloned = apply(clone as Callable, undefined, [value])
    return apply(getObjectToString(), cloned, []) === '[object Error]'
  } catch {
    // A non-cloneable cause cannot be proved to be an Error in this fallback.
    return false
  }
}

function getFunctionSource(value: unknown): string | undefined {
  if (typeof value !== 'function') return undefined
  try {
    return (apply(getFunctionToString(), value, []) as string).trimStart()
  } catch {
    return undefined
  }
}

const enum FunctionKind {
  Ordinary,
  Async,
  Generator,
}

function skipTrivia(source: string, start: number): number {
  const trivia = /^(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\r\n\u2028\u2029]*(?:\r\n|[\r\n\u2028\u2029]|$))*/u.exec(
    source.slice(start)
  )![0]
  return start + trivia.length
}

function isIdentifierPart(character: string | undefined): boolean {
  return character !== undefined && /[\w$]/u.test(character)
}

function compilesAsExpression(source: string): boolean {
  try {
    // Compile an expression wrapper without running it.
    apply(Function as unknown as Callable, undefined, [
      `return (${source}\n)`,
    ])
    return true
  } catch {
    const contextFreeSource = source
      .replace(
        /\bimport(?:\s|\/\*[^]*?\*\/|\/\/[^\r\n\u2028\u2029]*(?:\r\n|[\r\n\u2028\u2029]|$))*\.(?:\s|\/\*[^]*?\*\/|\/\/[^\r\n\u2028\u2029]*(?:\r\n|[\r\n\u2028\u2029]|$))*meta\b/gu,
        'ImportMeta'
      )
      .replace(/\bsuper\b/gu, 'self')
      .replace(/#(?=[$_\p{ID_Start}]|\\u)/gu, '')

    if (contextFreeSource === source) return false
    try {
      apply(Function as unknown as Callable, undefined, [
        `return (${contextFreeSource}\n)`,
      ])
      return true
    } catch {
      return false
    }
  }
}

function hasAsyncSource(source: string): boolean {
  if (!source.startsWith('async') || isIdentifierPart(source[5])) return false
  const start = skipTrivia(source, 5)
  if (start === 5 && source[start] !== '(') return false
  if (source[start] === '*') return false

  if (
    source.startsWith('function', start) &&
    !isIdentifierPart(source[start + 8])
  ) {
    return source[skipTrivia(source, start + 8)] !== '*'
  }

  if (source[start] === '(') {
    // An async arrow is a valid expression. An ordinary method named `async`
    // is not, even after removing lexical class and module context.
    return compilesAsExpression(source)
  }

  let end = start
  while (isIdentifierPart(source[end])) end++
  if (end > start && source.startsWith('=>', skipTrivia(source, end))) {
    return true
  }

  // Function.prototype.toString() returned valid syntax that starts with the
  // async modifier, so the remaining string/numeric/computed key is a method.
  return true
}

function hasAsyncGeneratorSource(source: string): boolean {
  if (!source.startsWith('async') || isIdentifierPart(source[5])) return false
  const start = skipTrivia(source, 5)
  if (source[start] === '*') return true
  if (
    !source.startsWith('function', start) ||
    isIdentifierPart(source[start + 8])
  ) {
    return false
  }
  return source[skipTrivia(source, start + 8)] === '*'
}

function hasGeneratorSource(source: string): boolean {
  if (source[0] === '*') return true
  if (!source.startsWith('function') || isIdentifierPart(source[8])) return false
  return source[skipTrivia(source, 8)] === '*'
}

function getFunctionKind(value: Callable): FunctionKind {
  const cached = functionKindCache?.get(value)
  if (cached !== undefined) return cached

  const source = getFunctionSource(value)
  const nativeAsyncCheck = getNodeTypeCheck('isAsyncFunction')
  const nativeGeneratorCheck = getNodeTypeCheck('isGeneratorFunction')
  let kind = FunctionKind.Ordinary

  try {
    if (nativeAsyncCheck?.(value)) {
      kind =
        source !== undefined && hasAsyncGeneratorSource(source)
          ? FunctionKind.Ordinary
          : FunctionKind.Async
    } else if (nativeGeneratorCheck?.(value)) {
      kind = FunctionKind.Generator
    } else if (
      nativeAsyncCheck === undefined &&
      source !== undefined &&
      !source.includes('[native code]') &&
      hasAsyncSource(source)
    ) {
      kind = FunctionKind.Async
    } else if (
      source !== undefined &&
      !source.includes('[native code]') &&
      hasGeneratorSource(source)
    ) {
      kind = FunctionKind.Generator
    }
  } catch {
    // Treat hostile or replaced native checks as ordinary functions.
  }

  functionKindCache ??= new WeakMap<Callable, FunctionKind>()
  functionKindCache.set(value, kind)
  return kind
}

export function hasAsyncFunctionBrand(
  value: unknown
): value is (...args: never[]) => Promise<unknown> {
  return (
    typeof value === 'function' &&
    getFunctionKind(value as Callable) === FunctionKind.Async
  )
}

export function hasGeneratorFunctionBrand(
  value: unknown
): value is (...args: never[]) => Generator<unknown, unknown, unknown> {
  return (
    typeof value === 'function' &&
    getFunctionKind(value as Callable) === FunctionKind.Generator
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
