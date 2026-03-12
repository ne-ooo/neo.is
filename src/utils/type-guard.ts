import type { TypeGuard } from '../types.js'

/**
 * Create a custom type guard
 *
 * This is a helper function that returns the guard function as-is,
 * providing proper TypeScript typing for custom type guards.
 *
 * @param guard - Type guard function
 * @returns The same type guard function with proper typing
 *
 * @example
 * const isPositiveNumber = createTypeGuard<number>(
 *   (value): value is number => isNumber(value) && value > 0
 * )
 *
 * isPositiveNumber(42)       // true
 * isPositiveNumber(-42)      // false
 * isPositiveNumber('42')     // false (TypeScript knows it's not a number)
 */
export function createTypeGuard<T>(guard: TypeGuard<T>): TypeGuard<T> {
  return guard
}
