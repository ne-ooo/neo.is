import { describe, it, expect } from 'vitest'
import { isSymbol } from '../../../src/index.js'

describe('isSymbol', () => {
  it('accepts a Symbol literal', () => {
    expect(isSymbol(Symbol('test'))).toBe(true)
  })
  it('accepts Symbol.for()', () => {
    expect(isSymbol(Symbol.for('test'))).toBe(true)
  })
  it('accepts well-known symbols', () => {
    expect(isSymbol(Symbol.iterator)).toBe(true)
    expect(isSymbol(Symbol.toPrimitive)).toBe(true)
  })
  it('rejects a string', () => {
    expect(isSymbol('symbol')).toBe(false)
  })
  it('rejects a number', () => {
    expect(isSymbol(42)).toBe(false)
  })
  it('rejects null', () => {
    expect(isSymbol(null)).toBe(false)
  })
  it('rejects undefined', () => {
    expect(isSymbol(undefined)).toBe(false)
  })
  it('rejects an object', () => {
    expect(isSymbol({})).toBe(false)
  })
  it('rejects boolean', () => {
    expect(isSymbol(true)).toBe(false)
  })
})
