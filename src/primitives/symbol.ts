/**
 * Check if value is a symbol
 *
 * @param value - Value to check
 * @returns true if value is a symbol
 *
 * @example
 * isSymbol(Symbol('test'))  // true
 * isSymbol('test')          // false
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}
