import {
  hasGeneratorFunctionBrand,
  hasGeneratorShape,
} from '../utils/brands.js'

/**
 * Check if value is a generator function
 *
 * @param value - Value to check
 * @returns true if value is a generator function
 *
 * @example
 * isGeneratorFunction(function*() {})  // true
 * isGeneratorFunction(function() {})   // false
 */
export function isGeneratorFunction(
  value: unknown
): value is (...args: never[]) => Generator<unknown, unknown, unknown> {
  return hasGeneratorFunctionBrand(value)
}

/**
 * Check if value is a generator instance
 *
 * @param value - Value to check
 * @returns true if value is a generator instance
 *
 * @example
 * isGenerator((function*() {})())      // true (generator instance)
 * isGenerator(function*() {})          // false (generator function)
 */
export function isGenerator(
  value: unknown
): value is Generator<unknown, unknown, unknown> {
  return hasGeneratorShape(value)
}
