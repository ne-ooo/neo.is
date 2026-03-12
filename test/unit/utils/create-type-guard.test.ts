import { describe, it, expect } from 'vitest'
import { createTypeGuard, isNumber } from '../../../src/index.js'

describe('createTypeGuard', () => {
  it('returns the same guard function', () => {
    const guard = (v: unknown): v is number => typeof v === 'number'
    const result = createTypeGuard(guard)
    expect(result).toBe(guard)
  })

  it('created guard correctly identifies the target type', () => {
    const isPositiveNumber = createTypeGuard<number>(
      (value): value is number => isNumber(value) && (value as number) > 0
    )
    expect(isPositiveNumber(42)).toBe(true)
    expect(isPositiveNumber(0)).toBe(false)
    expect(isPositiveNumber(-1)).toBe(false)
    expect(isPositiveNumber('42')).toBe(false)
    expect(isPositiveNumber(null)).toBe(false)
  })

  it('created guard works with object types', () => {
    interface User { name: string; age: number }
    const isUser = createTypeGuard<User>(
      (v): v is User =>
        typeof v === 'object' &&
        v !== null &&
        typeof (v as User).name === 'string' &&
        typeof (v as User).age === 'number'
    )

    expect(isUser({ name: 'Alice', age: 30 })).toBe(true)
    expect(isUser({ name: 'Alice' })).toBe(false)
    expect(isUser(null)).toBe(false)
    expect(isUser('not an object')).toBe(false)
  })

  it('created guard works with union type predicates', () => {
    const isStringOrNumber = createTypeGuard<string | number>(
      (v): v is string | number => typeof v === 'string' || typeof v === 'number'
    )

    expect(isStringOrNumber('hello')).toBe(true)
    expect(isStringOrNumber(42)).toBe(true)
    expect(isStringOrNumber(null)).toBe(false)
    expect(isStringOrNumber(true)).toBe(false)
  })
})
