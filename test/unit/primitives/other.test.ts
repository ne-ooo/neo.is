import { describe, it, expect } from 'vitest'
import { isBoolean } from '../../../src/primitives/boolean.js'
import { isSymbol } from '../../../src/primitives/symbol.js'
import { isBigInt } from '../../../src/primitives/bigint.js'
import { isNull } from '../../../src/primitives/null.js'
import { isUndefined, isNil } from '../../../src/primitives/undefined.js'

describe('isBoolean', () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean(Boolean(1))).toBe(true)
  })

  it('should return false for non-booleans', () => {
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(null)).toBe(false)
  })
})

describe('isSymbol', () => {
  it('should return true for symbols', () => {
    expect(isSymbol(Symbol())).toBe(true)
    expect(isSymbol(Symbol('test'))).toBe(true)
    expect(isSymbol(Symbol.for('test'))).toBe(true)
  })

  it('should return false for non-symbols', () => {
    expect(isSymbol('symbol')).toBe(false)
    expect(isSymbol(42)).toBe(false)
    expect(isSymbol(null)).toBe(false)
  })
})

describe('isBigInt', () => {
  it('should return true for bigints', () => {
    expect(isBigInt(42n)).toBe(true)
    expect(isBigInt(0n)).toBe(true)
    expect(isBigInt(BigInt(42))).toBe(true)
  })

  it('should return false for numbers', () => {
    expect(isBigInt(42)).toBe(false)
    expect(isBigInt(0)).toBe(false)
  })

  it('should return false for non-bigints', () => {
    expect(isBigInt('42n')).toBe(false)
    expect(isBigInt(null)).toBe(false)
  })
})

describe('isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  it('should return false for non-null', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull({})).toBe(false)
  })
})

describe('isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(void 0)).toBe(true)
  })

  it('should return false for non-undefined', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(false)).toBe(false)
  })
})

describe('isNil', () => {
  it('should return true for null and undefined', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil(void 0)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil(false)).toBe(false)
    expect(isNil({})).toBe(false)
    expect(isNil([])).toBe(false)
  })
})
