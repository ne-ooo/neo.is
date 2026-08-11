/**
 * Check if value is array-like (has numeric .length property)
 *
 * @param value - Value to check
 * @returns true if value is array-like
 *
 * @example
 * isArrayLike([])            // true
 * isArrayLike('test')        // true (strings have .length)
 * isArrayLike({ length: 0 }) // true (has length property)
 * isArrayLike({})            // false
 */
export function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  if (value === null || value === undefined) {
    return false
  }

  // Strings are array-like
  if (typeof value === 'string') {
    return true
  }

  if (typeof value !== 'object' && typeof value !== 'function') {
    return false
  }

  try {
    const length = (value as { length?: unknown }).length
    return typeof length === 'number' && length >= 0 && Number.isSafeInteger(length)
  } catch {
    return false
  }
}
