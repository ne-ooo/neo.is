import { describe, it, expect } from 'vitest'
import { runInNewContext } from 'node:vm'
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
    expect(isAsyncFunction(async() => 1)).toBe(true)
    expect(isAsyncFunction(async function () {})).toBe(true)
    expect(isAsyncFunction(async /* comment */ function () {})).toBe(true)
    expect(isAsyncFunction(async /* comment */ (value) => value)).toBe(true)
    expect(isAsyncFunction(({ async /* comment */ method() {} }).method)).toBe(true)
    expect(isAsyncFunction(({ async 'method'() {} }).method)).toBe(true)
    expect(isAsyncFunction(({ async 1() {} })[1])).toBe(true)
    expect(isAsyncFunction(async (value = /[)]/) => value)).toBe(true)
    expect(isAsyncFunction(async (value = /}/) => value)).toBe(true)
    expect(isAsyncFunction(async (value = /"'`/) => value)).toBe(true)
    expect(isAsyncFunction(async (value = `a${`b)`}`) => value)).toBe(true)
    expect(isAsyncFunction(async (value = `${'{'}`) => value)).toBe(true)
    expect(isAsyncFunction(async (value = `${/{/}`) => value)).toBe(true)
    expect(
      isAsyncFunction(
        runInNewContext('(async (value = class extends /{/.constructor {}) => value)')
      )
    ).toBe(true)
    expect(
      isAsyncFunction(
        runInNewContext('(async (value = class extends /}/.constructor {}) => value)')
      )
    ).toBe(true)
    expect(
      isAsyncFunction(
        async (value = function (condition = true) {
          if (condition) {
            // Keep an explicit empty branch before the regexp statement.
          } else /"/.test('')
        }) => value
      )
    ).toBe(true)
    expect(
      isAsyncFunction(
        async (value = function (condition = false) {
          do /"/.test('')
          while (condition)
        }) => value
      )
    ).toBe(true)
    expect(
      isAsyncFunction(
        async (value = function (condition = false) {
          if (condition) /"/.test('')
          while (condition) /"/.test('')
          for (; condition; ) /"/.test('')
        }) => value
      )
    ).toBe(true)
    expect(isAsyncFunction(async (value = 1 / /"/.test('')) => value)).toBe(
      true
    )
    for (const source of [
      '(async (value = function () { {} /"/.test("") }) => value)',
      '(async (value = function () { try {} finally {} /"/.test("") }) => value)',
      '(async (value = async function () { for await (const item of []) /"/.test(item) }) => value)',
      '(async (value = function () {} / 2) => value)',
      '(async (value = async function () {} / 2) => value)',
      '(async (value = function* () {} / 2) => value)',
      '(async (value = function () { class Neo {} /"/.test("") }) => value)',
    ]) {
      expect(isAsyncFunction(runInNewContext(source))).toBe(true)
    }
  })

  it('should return false for regular functions', () => {
    expect(isAsyncFunction(() => {})).toBe(false)
    expect(isAsyncFunction(function () {})).toBe(false)
    expect(isAsyncFunction(({ async() {} }).async)).toBe(false)
    expect(isAsyncFunction(({ async /* comment */ () {} }).async)).toBe(false)
    expect(isAsyncFunction(({ async *generator() {} }).generator)).toBe(false)

    for (const lineTerminator of ['\r', '\u2028', '\u2029']) {
      const asyncGenerator = runInNewContext(
        `(async function// comment${lineTerminator}* () {})`
      )
      expect(isAsyncFunction(asyncGenerator)).toBe(false)
      expect(isGeneratorFunction(asyncGenerator)).toBe(false)
    }
  })

  it('rejects regular functions with an async-function prototype', () => {
    const regular = () => 1
    Object.setPrototypeOf(regular, Object.getPrototypeOf(async () => {}))
    expect(isAsyncFunction(regular)).toBe(false)
  })

  it('conservatively rejects bound functions whose target brand is hidden', () => {
    expect(isAsyncFunction((async () => {}).bind(null))).toBe(false)

    const regular = (() => 1).bind(null)
    Object.setPrototypeOf(regular, Object.getPrototypeOf(async () => {}))
    expect(isAsyncFunction(regular)).toBe(false)
  })

  it('should return false for non-functions', () => {
    expect(isAsyncFunction(Promise.resolve())).toBe(false)
    expect(isAsyncFunction({})).toBe(false)
  })
})

describe('isGeneratorFunction', () => {
  it('should return true for generator functions', () => {
    expect(isGeneratorFunction(function* () {})).toBe(true)
    expect(isGeneratorFunction(function /* comment */ * () {})).toBe(true)
    for (const lineTerminator of ['\r', '\u2028', '\u2029']) {
      expect(
        isGeneratorFunction(
          runInNewContext(`(function// comment${lineTerminator}* () {})`)
        )
      ).toBe(true)
    }
  })

  it('should return false for regular functions', () => {
    expect(isGeneratorFunction(function () {})).toBe(false)
    expect(isGeneratorFunction(() => {})).toBe(false)
  })

  it('rejects regular functions with a generator-function prototype', () => {
    const regular = () => 1
    Object.setPrototypeOf(regular, Object.getPrototypeOf(function* () {}))
    expect(isGeneratorFunction(regular)).toBe(false)
  })

  it('conservatively rejects bound functions whose target brand is hidden', () => {
    expect(isGeneratorFunction((function* () {}).bind(null))).toBe(false)

    const regular = (() => 1).bind(null)
    Object.setPrototypeOf(regular, Object.getPrototypeOf(function* () {}))
    expect(isGeneratorFunction(regular)).toBe(false)
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
