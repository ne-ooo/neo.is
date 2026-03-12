import { toString } from '../utils/to-string.js'

/**
 * Check if value is a Promise
 *
 * @param value - Value to check
 * @returns true if value is a Promise
 *
 * @example
 * isPromise(Promise.resolve())      // true
 * isPromise({ then: () => {} })     // true (thenable)
 * isPromise(async () => {})         // false (function, not promise)
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  // Check for native Promise
  if (toString(value) === '[object Promise]') {
    return true
  }

  // Check for thenable (has .then method)
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}
