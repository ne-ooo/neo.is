/**
 * Cross-realm safe Object.prototype.toString
 *
 * Works across iframes, workers, and different realms where
 * instanceof checks fail but toString remains reliable.
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
  return Object.prototype.toString.call(value)
}

/**
 * Extract type from toString result
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
