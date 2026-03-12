import { describe, it, expect } from 'vitest'
import { isString, isNumeric } from '../../../src/primitives/string.js'

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('')).toBe(true)
    expect(isString('hello')).toBe(true)
    expect(isString('42')).toBe(true)
    expect(isString(String('test'))).toBe(true)
  })

  it('should return false for non-strings', () => {
    expect(isString(42)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

describe('isNumeric', () => {
  it('should return true for numbers', () => {
    expect(isNumeric(42)).toBe(true)
    expect(isNumeric(42.5)).toBe(true)
    expect(isNumeric(0)).toBe(true)
    expect(isNumeric(-42)).toBe(true)
  })

  it('should return true for numeric strings', () => {
    expect(isNumeric('42')).toBe(true)
    expect(isNumeric('42.5')).toBe(true)
    expect(isNumeric('0')).toBe(true)
    expect(isNumeric('-42')).toBe(true)
  })

  it('should return true for numeric strings with whitespace', () => {
    expect(isNumeric('  42  ')).toBe(true)
    expect(isNumeric('\t42\n')).toBe(true)
  })

  it('should return false for non-numeric strings', () => {
    expect(isNumeric('not a number')).toBe(false)
    expect(isNumeric('')).toBe(false)
    expect(isNumeric('   ')).toBe(false)
    expect(isNumeric('42abc')).toBe(false)
  })

  it('should return false for NaN and Infinity', () => {
    expect(isNumeric(NaN)).toBe(false)
    expect(isNumeric(Infinity)).toBe(false)
    expect(isNumeric(-Infinity)).toBe(false)
  })

  it('should return false for other types', () => {
    expect(isNumeric(null)).toBe(false)
    expect(isNumeric(undefined)).toBe(false)
    expect(isNumeric(true)).toBe(false)
    expect(isNumeric({})).toBe(false)
    expect(isNumeric([])).toBe(false)
  })
})
