import { describe, it, expect } from 'vitest'
import { isPositive, isNegative, isZero } from '../../../src/numbers/validators.js'

describe('isPositive', () => {
  it('should return true for positive numbers', () => {
    expect(isPositive(1)).toBe(true)
    expect(isPositive(42)).toBe(true)
    expect(isPositive(0.1)).toBe(true)
    expect(isPositive(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  it('should return false for zero', () => {
    expect(isPositive(0)).toBe(false)
    expect(isPositive(-0)).toBe(false)
  })

  it('should return false for negative numbers', () => {
    expect(isPositive(-1)).toBe(false)
    expect(isPositive(-42)).toBe(false)
  })

  it('should return false for Infinity and NaN', () => {
    expect(isPositive(Infinity)).toBe(false)
    expect(isPositive(NaN)).toBe(false)
  })
})

describe('isNegative', () => {
  it('should return true for negative numbers', () => {
    expect(isNegative(-1)).toBe(true)
    expect(isNegative(-42)).toBe(true)
    expect(isNegative(-0.1)).toBe(true)
    expect(isNegative(Number.MIN_SAFE_INTEGER)).toBe(true)
  })

  it('should return false for zero', () => {
    expect(isNegative(0)).toBe(false)
    expect(isNegative(-0)).toBe(false)
  })

  it('should return false for positive numbers', () => {
    expect(isNegative(1)).toBe(false)
    expect(isNegative(42)).toBe(false)
  })

  it('should return false for -Infinity and NaN', () => {
    expect(isNegative(-Infinity)).toBe(false)
    expect(isNegative(NaN)).toBe(false)
  })
})

describe('isZero', () => {
  it('should return true for zero', () => {
    expect(isZero(0)).toBe(true)
    expect(isZero(-0)).toBe(true)
  })

  it('should return false for non-zero numbers', () => {
    expect(isZero(1)).toBe(false)
    expect(isZero(-1)).toBe(false)
    expect(isZero(0.1)).toBe(false)
  })
})
