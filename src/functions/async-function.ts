import { hasAsyncFunctionBrand } from '../utils/brands.js'

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
): value is (...args: never[]) => Promise<unknown> {
  return hasAsyncFunctionBrand(value)
}
