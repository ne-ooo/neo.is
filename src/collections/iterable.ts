/**
 * Check if value is iterable
 *
 * @param value - Value to check
 * @returns true if value is iterable
 *
 * @example
 * isIterable([])             // true
 * isIterable(new Set())      // true
 * isIterable(new Map())      // true
 * isIterable('')             // true (strings are iterable)
 * isIterable({})             // false
 */
export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  if (value === null || value === undefined) {
    return false
  }

  return typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function'
}
