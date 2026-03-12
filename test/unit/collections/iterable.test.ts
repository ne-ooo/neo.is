import { describe, it, expect } from 'vitest'
import { isIterable, isArrayLike } from '../../../src/index.js'

describe('isIterable', () => {
  it('accepts an array', () => {
    expect(isIterable([])).toBe(true)
  })
  it('accepts a non-empty array', () => {
    expect(isIterable([1, 2, 3])).toBe(true)
  })
  it('accepts a string (strings are iterable)', () => {
    expect(isIterable('')).toBe(true)
    expect(isIterable('hello')).toBe(true)
  })
  it('accepts a Map', () => {
    expect(isIterable(new Map())).toBe(true)
  })
  it('accepts a Set', () => {
    expect(isIterable(new Set())).toBe(true)
  })
  it('accepts a generator result', () => {
    function* gen() { yield 1 }
    expect(isIterable(gen())).toBe(true)
  })
  it('rejects a plain object', () => {
    expect(isIterable({})).toBe(false)
  })
  it('rejects a number', () => {
    expect(isIterable(42)).toBe(false)
  })
  it('rejects null', () => {
    expect(isIterable(null)).toBe(false)
  })
  it('rejects undefined', () => {
    expect(isIterable(undefined)).toBe(false)
  })
  it('rejects a boolean', () => {
    expect(isIterable(true)).toBe(false)
  })
})

describe('isArrayLike', () => {
  it('accepts an array', () => {
    expect(isArrayLike([])).toBe(true)
  })
  it('accepts a string', () => {
    expect(isArrayLike('hello')).toBe(true)
    expect(isArrayLike('')).toBe(true)
  })
  it('accepts an object with numeric length', () => {
    expect(isArrayLike({ length: 0 })).toBe(true)
    expect(isArrayLike({ length: 3, 0: 'a', 1: 'b', 2: 'c' })).toBe(true)
  })
  it('accepts arguments object', () => {
    function getArgs() { return arguments }
    expect(isArrayLike(getArgs(1, 2, 3))).toBe(true)
  })
  it('rejects plain object without length', () => {
    expect(isArrayLike({})).toBe(false)
  })
  it('rejects object with negative length', () => {
    expect(isArrayLike({ length: -1 })).toBe(false)
  })
  it('rejects object with non-integer length', () => {
    expect(isArrayLike({ length: 1.5 })).toBe(false)
  })
  it('rejects null', () => {
    expect(isArrayLike(null)).toBe(false)
  })
  it('rejects undefined', () => {
    expect(isArrayLike(undefined)).toBe(false)
  })
  it('rejects a number', () => {
    expect(isArrayLike(42)).toBe(false)
  })
  it('rejects a boolean', () => {
    expect(isArrayLike(true)).toBe(false)
  })
})
