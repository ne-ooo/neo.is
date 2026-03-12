import { describe, it, expect } from 'vitest'
import { isFunction } from '../../../src/functions/function.js'
import { isAsyncFunction } from '../../../src/functions/async-function.js'
import { isGeneratorFunction, isGenerator } from '../../../src/functions/generator.js'
import { isPromise } from '../../../src/functions/promise.js'

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(function () {})).toBe(true)
    expect(isFunction(async () => {})).toBe(true)
    expect(isFunction(function* () {})).toBe(true)
  })

  it('should return true for classes', () => {
    class TestClass {}
    expect(isFunction(TestClass)).toBe(true)
  })

  it('should return false for non-functions', () => {
    expect(isFunction({})).toBe(false)
    expect(isFunction([])).toBe(false)
    expect(isFunction(null)).toBe(false)
  })
})

describe('isAsyncFunction', () => {
  it('should return true for async functions', () => {
    expect(isAsyncFunction(async () => {})).toBe(true)
    expect(isAsyncFunction(async function () {})).toBe(true)
  })

  it('should return false for regular functions', () => {
    expect(isAsyncFunction(() => {})).toBe(false)
    expect(isAsyncFunction(function () {})).toBe(false)
  })

  it('should return false for non-functions', () => {
    expect(isAsyncFunction(Promise.resolve())).toBe(false)
    expect(isAsyncFunction({})).toBe(false)
  })
})

describe('isGeneratorFunction', () => {
  it('should return true for generator functions', () => {
    expect(isGeneratorFunction(function* () {})).toBe(true)
  })

  it('should return false for regular functions', () => {
    expect(isGeneratorFunction(function () {})).toBe(false)
    expect(isGeneratorFunction(() => {})).toBe(false)
  })
})

describe('isGenerator', () => {
  it('should return true for generator instances', () => {
    const gen = (function* () {})()
    expect(isGenerator(gen)).toBe(true)
  })

  it('should return false for generator functions', () => {
    expect(isGenerator(function* () {})).toBe(false)
  })
})

describe('isPromise', () => {
  it('should return true for promises', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(new Promise(() => {}))).toBe(true)
  })

  it('should return true for thenables', () => {
    expect(isPromise({ then: () => {} })).toBe(true)
  })

  it('should return false for async functions', () => {
    expect(isPromise(async () => {})).toBe(false)
  })

  it('should return false for non-promises', () => {
    expect(isPromise({})).toBe(false)
    expect(isPromise(null)).toBe(false)
  })
})
