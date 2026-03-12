/**
 * Check if value is a positive number (> 0)
 *
 * @param value - Value to check
 * @returns true if value is a positive number
 *
 * @example
 * isPositive(42)             // true
 * isPositive(-42)            // false
 * isPositive(0)              // false
 */
export function isPositive(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && value - value === 0
}

/**
 * Check if value is a negative number (< 0)
 *
 * @param value - Value to check
 * @returns true if value is a negative number
 *
 * @example
 * isNegative(-42)            // true
 * isNegative(42)             // false
 * isNegative(0)              // false
 */
export function isNegative(value: unknown): value is number {
  return typeof value === 'number' && value < 0 && value - value === 0
}

/**
 * Check if value is zero (0 or -0)
 *
 * @param value - Value to check
 * @returns true if value is zero
 *
 * @example
 * isZero(0)                  // true
 * isZero(-0)                 // true
 * isZero(1)                  // false
 */
export function isZero(value: unknown): value is number {
  return value === 0
}
