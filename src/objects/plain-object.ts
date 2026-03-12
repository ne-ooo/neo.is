import { toString } from '../utils/to-string.js'

/**
 * Check if value is a plain object
 *
 * A plain object is:
 * - Created with {} or new Object()
 * - Has Object.prototype or null as prototype
 * - NOT an array, date, regexp, or other built-in object type
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
export function isPlainObject<T = Record<string, unknown>>(
  value: unknown
): value is T {
  // Quick type check
  if (toString(value) !== '[object Object]') {
    return false
  }

  // Object.create(null) has no prototype
  const proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }

  // Check if prototype is Object.prototype
  // (objects created with {} or new Object())
  return proto === Object.prototype
}
