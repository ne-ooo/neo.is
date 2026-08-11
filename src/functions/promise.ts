import { hasThenableShape } from '../utils/brands.js'
import type { Thenable } from '../types.js'

/**
 * Check if value is a Promise or thenable
 *
 * @param value - Value to check
 * @returns true if value has a callable then property
 *
 * @example
 * isPromise(Promise.resolve())      // true
 * isPromise({ then: () => {} })     // true (thenable)
 * isPromise(async () => {})         // false (function, not promise)
 */
export function isPromise(value: unknown): value is Thenable {
  return hasThenableShape(value)
}
