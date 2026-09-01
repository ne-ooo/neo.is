import { describe, it, expect } from 'vitest'
import { getType } from '../../../src/utils/get-type.js'

describe('getType', () => {
  it('should return correct type for primitives', () => {
    expect(getType(null)).toBe('null')
    expect(getType(undefined)).toBe('undefined')
    expect(getType(true)).toBe('boolean')
    expect(getType(42)).toBe('number')
    expect(getType('test')).toBe('string')
    expect(getType(Symbol('test'))).toBe('symbol')
    expect(getType(42n)).toBe('bigint')
  })

  it('should return "nan" for NaN', () => {
    expect(getType(NaN)).toBe('nan')
  })

  it('should return correct type for objects', () => {
    expect(getType([])).toBe('array')
    expect(getType({})).toBe('object')
    expect(getType(new Date())).toBe('date')
    expect(getType(/test/)).toBe('regexp')
    expect(getType(new Error())).toBe('error')
    expect(getType(new Map())).toBe('map')
    expect(getType(new Set())).toBe('set')
    expect(getType(new WeakMap())).toBe('weakmap')
    expect(getType(new WeakSet())).toBe('weakset')
    expect(getType(Promise.resolve())).toBe('promise')
    expect(getType({ then() {} })).toBe('promise')
    expect(getType(Object.create(null))).toBe('object')
  })

  it('handles an inaccessible then property conservatively', () => {
    const value = Object.defineProperty({}, 'then', {
      get() {
        throw new Error('then should not escape')
      },
    })

    expect(() => getType(value)).not.toThrow()
    expect(getType(value)).toBe('object')
  })

  it('should return correct type for functions', () => {
    expect(getType(() => {})).toBe('function')
    expect(getType(function () {})).toBe('function')
    expect(getType(async () => {})).toBe('asyncfunction')
    expect(getType(function* () {})).toBe('generatorfunction')
    expect(getType(async function* () {})).toBe('function')

    const alteredAsync = async () => 1
    Object.setPrototypeOf(alteredAsync, Function.prototype)
    expect(getType(alteredAsync)).toBe('asyncfunction')

    const alteredGenerator = function* () {}
    Object.setPrototypeOf(alteredGenerator, Function.prototype)
    expect(getType(alteredGenerator)).toBe('generatorfunction')
  })

  it('should return correct type for typed arrays', () => {
    expect(getType(new Int8Array())).toBe('int8array')
    expect(getType(new Uint8Array())).toBe('uint8array')
    expect(getType(new Float32Array())).toBe('float32array')
    expect(getType(new DataView(new ArrayBuffer(1)))).toBe('object')
  })

  it('returns object quickly for unsupported built-ins and classes', () => {
    class Example {}

    expect(getType(new ArrayBuffer(1))).toBe('object')
    expect(getType(new URL('https://example.com'))).toBe('object')
    expect(getType(new Example())).toBe('object')
  })

  it('keeps structural fallbacks for values with custom prototypes', () => {
    class Thenable {
      then() {}
    }
    class GeneratorLike {
      next() {}
      return() {}
      throw() {}
      [Symbol.iterator]() {
        return this
      }
    }

    expect(getType(new Thenable())).toBe('promise')
    expect(getType(Object.create({ then() {} }))).toBe('promise')
    expect(getType(new GeneratorLike())).toBe('generator')
  })
})
