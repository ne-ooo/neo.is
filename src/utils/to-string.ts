/**
 * Cross-realm safe Object.prototype.toString
 *
 * Works across iframes, workers, and different realms. Custom
 * Symbol.toStringTag values can change this descriptive tag, so do not use it
 * as a security or validation boundary. Use a dedicated predicate instead.
 *
 * @param value - Value to get string tag for
 * @returns String tag like '[object Array]'
 *
 * @example
 * toString([])           // '[object Array]'
 * toString(new Date())   // '[object Date]'
 * toString(null)         // '[object Null]'
 */
export function toString(value: unknown): string {
  try {
    return Object.prototype.toString.call(value)
  } catch {
    return '[object Object]'
  }
}

/**
 * Extract a descriptive type from the toString result
 *
 * Custom Symbol.toStringTag values can change the result. Use getType() or a
 * dedicated predicate when the value is untrusted.
 *
 * @param value - Value to get type for
 * @returns Type string like 'Array', 'Date', 'Null'
 *
 * @example
 * getTag([])           // 'Array'
 * getTag(new Date())   // 'Date'
 * getTag(null)         // 'Null'
 */
export function getTag(value: unknown): string {
  return toString(value).slice(8, -1)
}
