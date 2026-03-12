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
  })

  it('should return correct type for functions', () => {
    expect(getType(() => {})).toBe('function')
    expect(getType(function () {})).toBe('function')
    expect(getType(async () => {})).toBe('asyncfunction')
    expect(getType(function* () {})).toBe('generatorfunction')
  })

  it('should return correct type for typed arrays', () => {
    expect(getType(new Int8Array())).toBe('int8array')
    expect(getType(new Uint8Array())).toBe('uint8array')
    expect(getType(new Float32Array())).toBe('float32array')
  })
})
