import { describe, it, expect } from 'vitest'
import { isEmpty } from '../../../src/collections/empty.js'
import { isIterable } from '../../../src/collections/iterable.js'
import { isArrayLike } from '../../../src/collections/array-like.js'

describe('isEmpty', () => {
  it('should return true for empty arrays', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('should return true for empty maps and sets', () => {
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
  })

  it('should return false for non-empty arrays', () => {
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty([1, 2, 3])).toBe(false)
  })

  it('should return false for non-empty objects', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('should return false for non-empty strings', () => {
    expect(isEmpty('test')).toBe(false)
    expect(isEmpty(' ')).toBe(false)
  })

  it('should return false for non-empty maps and sets', () => {
    expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    expect(isEmpty(new Set([1]))).toBe(false)
  })

  it('should return true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })
})

describe('isIterable', () => {
  it('should return true for arrays', () => {
    expect(isIterable([])).toBe(true)
    expect(isIterable([1, 2, 3])).toBe(true)
  })

  it('should return true for strings', () => {
    expect(isIterable('')).toBe(true)
    expect(isIterable('test')).toBe(true)
  })

  it('should return true for maps and sets', () => {
    expect(isIterable(new Map())).toBe(true)
    expect(isIterable(new Set())).toBe(true)
  })

  it('should return false for objects', () => {
    expect(isIterable({})).toBe(false)
    expect(isIterable({ a: 1 })).toBe(false)
  })

  it('should return false for null and undefined', () => {
    expect(isIterable(null)).toBe(false)
    expect(isIterable(undefined)).toBe(false)
  })
})

describe('isArrayLike', () => {
  it('should return true for arrays', () => {
    expect(isArrayLike([])).toBe(true)
    expect(isArrayLike([1, 2, 3])).toBe(true)
  })

  it('should return true for strings', () => {
    expect(isArrayLike('test')).toBe(true)
  })

  it('should return true for objects with length', () => {
    expect(isArrayLike({ length: 0 })).toBe(true)
    expect(isArrayLike({ length: 3 })).toBe(true)
  })

  it('should return false for objects without length', () => {
    expect(isArrayLike({})).toBe(false)
    expect(isArrayLike({ a: 1 })).toBe(false)
  })

  it('should return false for null and undefined', () => {
    expect(isArrayLike(null)).toBe(false)
    expect(isArrayLike(undefined)).toBe(false)
  })

  it('should return false for invalid length values', () => {
    expect(isArrayLike({ length: -1 })).toBe(false)
    expect(isArrayLike({ length: 'test' })).toBe(false)
    expect(isArrayLike({ length: 1.5 })).toBe(false)
  })
})
