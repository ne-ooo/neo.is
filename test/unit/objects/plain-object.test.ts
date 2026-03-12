import { describe, it, expect } from 'vitest'
import { isPlainObject } from '../../../src/objects/plain-object.js'

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
    expect(isPlainObject({ a: 1, b: { c: 2 } })).toBe(true)
  })

  it('should return true for Object.create(null)', () => {
    expect(isPlainObject(Object.create(null))).toBe(true)
  })

  it('should return false for arrays', () => {
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject([1, 2, 3])).toBe(false)
  })

  it('should return false for dates', () => {
    expect(isPlainObject(new Date())).toBe(false)
  })

  it('should return false for regexp', () => {
    expect(isPlainObject(/test/)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isPlainObject(null)).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isPlainObject(42)).toBe(false)
    expect(isPlainObject('test')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
  })

  it('should return false for class instances', () => {
    class TestClass {}
    expect(isPlainObject(new TestClass())).toBe(false)
  })
})
