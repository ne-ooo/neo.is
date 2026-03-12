import { describe, it, expect } from 'vitest'
import { isUndefined, isNil } from '../../../src/index.js'

describe('isUndefined', () => {
  it('accepts undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })
  it('accepts void 0', () => {
    expect(isUndefined(void 0)).toBe(true)
  })
  it('accepts an unset variable', () => {
    let x: unknown
    expect(isUndefined(x)).toBe(true)
  })
  it('rejects null', () => {
    expect(isUndefined(null)).toBe(false)
  })
  it('rejects 0', () => {
    expect(isUndefined(0)).toBe(false)
  })
  it('rejects empty string', () => {
    expect(isUndefined('')).toBe(false)
  })
  it('rejects false', () => {
    expect(isUndefined(false)).toBe(false)
  })
  it('rejects NaN', () => {
    expect(isUndefined(NaN)).toBe(false)
  })
  it('rejects an empty object', () => {
    expect(isUndefined({})).toBe(false)
  })
})

describe('isNil', () => {
  it('accepts null', () => {
    expect(isNil(null)).toBe(true)
  })
  it('accepts undefined', () => {
    expect(isNil(undefined)).toBe(true)
  })
  it('rejects 0', () => {
    expect(isNil(0)).toBe(false)
  })
  it('rejects empty string', () => {
    expect(isNil('')).toBe(false)
  })
  it('rejects false', () => {
    expect(isNil(false)).toBe(false)
  })
  it('rejects NaN', () => {
    expect(isNil(NaN)).toBe(false)
  })
})
