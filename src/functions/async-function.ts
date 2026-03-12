import { getTag } from '../utils/to-string.js'

/**
 * Check if value is an async function
 *
 * @param value - Value to check
 * @returns true if value is an async function
 *
 * @example
 * isAsyncFunction(async () => {})   // true
 * isAsyncFunction(() => {})         // false
 */
export function isAsyncFunction(
  value: unknown
): value is (...args: unknown[]) => Promise<unknown> {
  return getTag(value) === 'AsyncFunction'
}
