/**
 * Check if value is an object (any object, including arrays)
 *
 * @param value - Value to check
 * @returns true if value is an object
 *
 * @example
 * isObject({})              // true
 * isObject([])              // true (arrays are objects)
 * isObject(new Date())      // true
 * isObject(null)            // false (null is not an object in our API)
 */
export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}
