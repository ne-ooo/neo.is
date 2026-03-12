/**
 * Check if value is a number (NOT NaN or Infinity)
 *
 * Implementation matches is-number behavior:
 * - Uses num - num === 0 to detect NaN (NaN - NaN = NaN, not 0)
 * - Excludes Infinity
 * - Does NOT coerce strings (use isNumeric for that)
 *
 * @param value - Value to check
 * @returns true if value is a finite number
 *
 * @example
 * isNumber(42)           // true
 * isNumber(42.5)         // true
 * isNumber(NaN)          // false
 * isNumber(Infinity)     // false
 * isNumber('42')         // false (no coercion!)
 */
export function isNumber(value: unknown): value is number {
  if (typeof value !== 'number') {
    return false
  }

  // NaN - NaN = NaN (not 0), so this detects NaN
  // Also excludes Infinity: Infinity - Infinity = NaN
  return value - value === 0
}

/**
 * Check if value is NaN
 *
 * @param value - Value to check
 * @returns true if value is NaN
 *
 * @example
 * isNaN(NaN)             // true
 * isNaN('not a number')  // false (string, not NaN)
 * isNumber(NaN)          // false (NaN is not a number)
 */
export function isNaN(value: unknown): boolean {
  // Use Number.isNaN (ES6) which doesn't coerce
  return Number.isNaN(value)
}

/**
 * Check if value is a finite number
 *
 * @param value - Value to check
 * @returns true if value is a finite number
 *
 * @example
 * isFinite(42)           // true
 * isFinite(Infinity)     // false
 * isFinite(-Infinity)    // false
 */
export function isFinite(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Check if value is an integer
 *
 * @param value - Value to check
 * @returns true if value is an integer
 *
 * @example
 * isInteger(42)          // true
 * isInteger(42.5)        // false
 */
export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

/**
 * Check if value is a safe integer
 * (between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER)
 *
 * @param value - Value to check
 * @returns true if value is a safe integer
 *
 * @example
 * isSafeInteger(42)                               // true
 * isSafeInteger(Number.MAX_SAFE_INTEGER + 1)      // false
 */
export function isSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value)
}
