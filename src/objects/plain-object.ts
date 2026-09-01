let intrinsicGetOwnPropertyDescriptor:
  | typeof Object.getOwnPropertyDescriptor
  | undefined
let intrinsicGetPrototypeOf: typeof Object.getPrototypeOf | undefined
let intrinsicFunctionToString: typeof Function.prototype.toString | undefined
let objectConstructorSource: string | undefined
let localObjectPrototype: object | undefined

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

function hasNoStringTag(value: object, prototype: object | null): boolean {
  return (
    getOwnPropertyDescriptor(value, Symbol.toStringTag) === undefined &&
    (prototype === null ||
      getOwnPropertyDescriptor(prototype, Symbol.toStringTag) === undefined)
  )
}

function getObjectConstructorSource(): string {
  objectConstructorSource ??= getFunctionToString().call(Object)
  return objectConstructorSource
}

function getLocalObjectPrototype(): object {
  localObjectPrototype ??= Object.prototype
  return localObjectPrototype
}

/**
 * Check if value is a plain object
 *
 * A plain object is:
 * - Created with {} or new Object()
 * - Has Object.prototype or null as prototype
 * A value whose prototype is deliberately replaced can be classified according
 * to its replacement prototype because JavaScript does not expose its origin.
 *
 * @param value - Value to check
 * @returns true if value is a plain object
 *
 * @example
 * isPlainObject({})                    // true
 * isPlainObject({ a: 1 })              // true
 * isPlainObject(Object.create(null))   // true (null prototype)
 * isPlainObject([])                    // false (array)
 * isPlainObject(new Date())            // false (date)
 * isPlainObject(null)                  // false (null)
 */
export function isPlainObject(
  value: unknown
): value is Record<PropertyKey, unknown> {
  if (value === null || typeof value !== 'object') return false

  try {
    const prototype = getPrototypeOf(value)
    if (prototype === null) return hasNoStringTag(value, prototype)
    if (prototype === getLocalObjectPrototype()) {
      return hasNoStringTag(value, prototype)
    }

    // Every realm has a different Object.prototype identity. Its own
    // constructor still has the same intrinsic source and its prototype is null.
    if (getPrototypeOf(prototype) !== null) return false
    const constructor = getOwnPropertyDescriptor(prototype, 'constructor')?.value
    return (
      typeof constructor === 'function' &&
      getOwnPropertyDescriptor(constructor, 'prototype')?.value === prototype &&
      hasNoStringTag(value, prototype) &&
      getFunctionToString().call(constructor) === getObjectConstructorSource()
    )
  } catch {
    return false
  }
}
