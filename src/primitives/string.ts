/**
 * Check if value is a string
 *
 * @param value - Value to check
 * @returns true if value is a string
 *
 * @example
 * isString('hello')      // true
 * isString('')           // true
 * isString(42)           // false
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Check if value can be coerced to a number (like is-number)
 *
 * This is the STRING COERCION version - handles numeric strings.
 * For strict number checking without coercion, use isNumber().
 *
 * @param value - Value to check
 * @returns true if value is a number or numeric string
 *
 * @example
 * isNumeric(42)              // true
 * isNumeric('42')            // true (string coercion!)
 * isNumeric('42.5')          // true
 * isNumeric('  42  ')        // true (whitespace trimmed)
 * isNumeric('')              // false (empty strings)
 * isNumeric('not a number')  // false
 * isNumeric(NaN)             // false
 * isNumeric(Infinity)        // false
 */
export function isNumeric(value: unknown): boolean {
  // Handle actual numbers first (must be finite)
  if (typeof value === 'number') {
    return value - value === 0 // Excludes NaN and Infinity
  }

  // Handle string coercion (like is-number does)
  if (typeof value === 'string' && value.trim() !== '') {
    // Use Number.isFinite to check if coerced value is finite
    return Number.isFinite(+value)
  }

  return false
}
