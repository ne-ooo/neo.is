import { toString } from '../utils/to-string.js'

/**
 * Check if value is a Date (cross-realm safe)
 *
 * @param value - Value to check
 * @returns true if value is a Date
 *
 * @example
 * isDate(new Date())        // true
 * isDate('2024-01-01')      // false
 */
export function isDate(value: unknown): value is Date {
  return toString(value) === '[object Date]'
}
