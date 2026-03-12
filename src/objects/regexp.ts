import { toString } from '../utils/to-string.js'

/**
 * Check if value is a RegExp (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is a RegExp
 *
 * @example
 * isRegExp(/test/)          // true
 * isRegExp(new RegExp('test')) // true
 * isRegExp('test')          // false
 */
export function isRegExp(value: unknown): value is RegExp {
  return toString(value) === '[object RegExp]'
}
