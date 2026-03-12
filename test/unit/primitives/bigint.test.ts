import { describe, it, expect } from 'vitest'
import { isBigInt } from '../../../src/index.js'

describe('isBigInt', () => {
  it('accepts a bigint literal', () => {
    expect(isBigInt(42n)).toBe(true)
  })
  it('accepts BigInt() constructor result', () => {
    expect(isBigInt(BigInt(42))).toBe(true)
  })
  it('accepts zero as bigint', () => {
    expect(isBigInt(0n)).toBe(true)
  })
  it('accepts negative bigint', () => {
    expect(isBigInt(-100n)).toBe(true)
  })
  it('accepts very large bigint', () => {
    expect(isBigInt(9007199254740993n)).toBe(true)
  })
  it('rejects a regular number', () => {
    expect(isBigInt(42)).toBe(false)
  })
  it('rejects a string', () => {
    expect(isBigInt('42')).toBe(false)
  })
  it('rejects null', () => {
    expect(isBigInt(null)).toBe(false)
  })
  it('rejects undefined', () => {
    expect(isBigInt(undefined)).toBe(false)
  })
  it('rejects boolean', () => {
    expect(isBigInt(true)).toBe(false)
  })
})
