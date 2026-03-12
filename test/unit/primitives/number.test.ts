import { describe, it, expect } from 'vitest'
import {
  isNumber,
  isNaN,
  isFinite,
  isInteger,
  isSafeInteger,
} from '../../../src/primitives/number.js'

describe('isNumber', () => {
  it('should return true for integers', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber(42)).toBe(true)
    expect(isNumber(-42)).toBe(true)
    expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true)
    expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true)
  })

  it('should return true for floats', () => {
    expect(isNumber(42.5)).toBe(true)
    expect(isNumber(-42.5)).toBe(true)
    expect(isNumber(0.1 + 0.2)).toBe(true)
    expect(isNumber(Math.PI)).toBe(true)
  })

  it('should return false for NaN', () => {
    expect(isNumber(NaN)).toBe(false)
  })

  it('should return false for Infinity', () => {
    expect(isNumber(Infinity)).toBe(false)
    expect(isNumber(-Infinity)).toBe(false)
  })

  it('should NOT coerce strings', () => {
    expect(isNumber('42')).toBe(false)
    expect(isNumber('42.5')).toBe(false)
    expect(isNumber('0')).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber({})).toBe(false)
    expect(isNumber([])).toBe(false)
  })
})

describe('isNaN', () => {
  it('should return true for NaN', () => {
    expect(isNaN(NaN)).toBe(true)
  })

  it('should return false for numbers', () => {
    expect(isNaN(42)).toBe(false)
    expect(isNaN(0)).toBe(false)
    expect(isNaN(Infinity)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isNaN('not a number')).toBe(false)
    expect(isNaN(null)).toBe(false)
    expect(isNaN(undefined)).toBe(false)
  })
})

describe('isFinite', () => {
  it('should return true for finite numbers', () => {
    expect(isFinite(0)).toBe(true)
    expect(isFinite(42)).toBe(true)
    expect(isFinite(-42.5)).toBe(true)
  })

  it('should return false for Infinity', () => {
    expect(isFinite(Infinity)).toBe(false)
    expect(isFinite(-Infinity)).toBe(false)
  })

  it('should return false for NaN', () => {
    expect(isFinite(NaN)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isFinite('42')).toBe(false)
    expect(isFinite(null)).toBe(false)
  })
})

describe('isInteger', () => {
  it('should return true for integers', () => {
    expect(isInteger(0)).toBe(true)
    expect(isInteger(42)).toBe(true)
    expect(isInteger(-42)).toBe(true)
  })

  it('should return false for floats', () => {
    expect(isInteger(42.5)).toBe(false)
    expect(isInteger(0.1)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isInteger(NaN)).toBe(false)
    expect(isInteger(Infinity)).toBe(false)
    expect(isInteger('42')).toBe(false)
  })
})

describe('isSafeInteger', () => {
  it('should return true for safe integers', () => {
    expect(isSafeInteger(0)).toBe(true)
    expect(isSafeInteger(42)).toBe(true)
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
    expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
  })

  it('should return false for unsafe integers', () => {
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
    expect(isSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false)
  })

  it('should return false for floats', () => {
    expect(isSafeInteger(42.5)).toBe(false)
  })

  it('should return false for non-numbers', () => {
    expect(isSafeInteger(NaN)).toBe(false)
    expect(isSafeInteger(Infinity)).toBe(false)
  })
})
