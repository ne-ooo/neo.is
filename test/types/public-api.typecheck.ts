import {
  isArray,
  isArrayLike,
  isFinite,
  isIterable,
  isMap,
  isNaN,
  isNumeric,
  isPlainObject,
  isPromise,
  isSet,
  isWeakMap,
  isWeakSet,
} from '../../src/index.js'
import type { Thenable } from '../../src/index.js'

declare const value: unknown

if (isArray(value)) {
  const array: unknown[] = value
  void array

  // @ts-expect-error The predicate does not inspect array elements.
  const strings: string[] = value
  void strings
}

if (isPlainObject(value)) {
  const record: Record<PropertyKey, unknown> = value
  void record
}

if (isMap(value)) {
  const map: Map<unknown, unknown> = value
  void map
}

if (isSet(value)) {
  const set: Set<unknown> = value
  void set
}

if (isWeakMap(value)) {
  const weakMap: WeakMap<WeakKey, unknown> = value
  void weakMap
}

if (isWeakSet(value)) {
  const weakSet: WeakSet<WeakKey> = value
  void weakSet
}

if (isIterable(value)) {
  const iterable: Iterable<unknown> = value
  void iterable
}

if (isArrayLike(value)) {
  const arrayLike: ArrayLike<unknown> = value
  void arrayLike
}

if (isPromise(value)) {
  const thenable: Thenable = value
  void thenable

  // @ts-expect-error Thenables do not necessarily implement Promise.catch().
  value.catch(() => {})

  async function consumeThenable() {
    await value
  }
  void consumeThenable
}

if (isNaN(value) || isFinite(value)) {
  const number: number = value
  void number
}

if (isNumeric(value)) {
  const numeric: number | string = value
  void numeric
}

const realPromise: Thenable = Promise.resolve(1)
realPromise.then()
// @ts-expect-error Runtime checking proves only that then is callable.
realPromise.then(123)

// @ts-expect-error Caller-selected element types are intentionally unsupported.
isArray<string>(value)
// @ts-expect-error A plain-object check cannot validate an arbitrary shape.
isPlainObject<{ id: number }>(value)
// @ts-expect-error Map key/value types are not inspected.
isMap<string, number>(value)
// @ts-expect-error Set element types are not inspected.
isSet<string>(value)
// @ts-expect-error WeakMap key/value types are not inspected.
isWeakMap<object, number>(value)
// @ts-expect-error WeakSet element types are not inspected.
isWeakSet<object>(value)
// @ts-expect-error Iterable element types are not inspected.
isIterable<string>(value)
// @ts-expect-error Array-like element types are not inspected.
isArrayLike<string>(value)
// @ts-expect-error Thenable resolution types are not inspected.
isPromise<string>(value)
