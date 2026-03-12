/**
 * Check if value is a function
 *
 * @param value - Value to check
 * @returns true if value is a function
 *
 * @example
 * isFunction(() => {})              // true
 * isFunction(function() {})         // true
 * isFunction(async () => {})        // true (async functions are functions)
 * isFunction(class {})              // true (classes are functions)
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}
