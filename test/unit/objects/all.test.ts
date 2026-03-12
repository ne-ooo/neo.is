import { describe, it, expect } from 'vitest'
import { isArray } from '../../../src/objects/array.js'
import { isObject } from '../../../src/objects/object.js'
import { isDate } from '../../../src/objects/date.js'
import { isRegExp } from '../../../src/objects/regexp.js'
import { isError } from '../../../src/objects/error.js'
import { isMap } from '../../../src/objects/map.js'
import { isSet } from '../../../src/objects/set.js'
import { isWeakMap, isWeakSet } from '../../../src/objects/weakmap.js'

describe('isArray', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray(new Array())).toBe(true)
    expect(isArray(Array.from({ length: 3 }))).toBe(true)
  })

  it('should return false for non-arrays', () => {
    expect(isArray({})).toBe(false)
    expect(isArray('[]')).toBe(false)
    expect(isArray({ length: 0 })).toBe(false)
    expect(isArray(null)).toBe(false)
  })
})

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(new Date())).toBe(true)
    expect(isObject(/test/)).toBe(true)
  })

  it('should return false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isObject(42)).toBe(false)
    expect(isObject('test')).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(undefined)).toBe(false)
  })
})

describe('isDate', () => {
  it('should return true for dates', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date(0))).toBe(true)
  })

  it('should return false for non-dates', () => {
    expect(isDate('2024-01-01')).toBe(false)
    expect(isDate(Date.now())).toBe(false)
    expect(isDate({})).toBe(false)
  })
})

describe('isRegExp', () => {
  it('should return true for regexps', () => {
    expect(isRegExp(/test/)).toBe(true)
    expect(isRegExp(new RegExp('test'))).toBe(true)
    expect(isRegExp(/test/gi)).toBe(true)
  })

  it('should return false for non-regexps', () => {
    expect(isRegExp('/test/')).toBe(false)
    expect(isRegExp({})).toBe(false)
  })
})

describe('isError', () => {
  it('should return true for errors', () => {
    expect(isError(new Error())).toBe(true)
    expect(isError(new TypeError())).toBe(true)
    expect(isError(new RangeError())).toBe(true)
  })

  it('should return false for non-errors', () => {
    expect(isError({ message: 'error' })).toBe(false)
    expect(isError('Error')).toBe(false)
  })
})

describe('isMap', () => {
  it('should return true for maps', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap(new Map([['a', 1]]))).toBe(true)
  })

  it('should return false for non-maps', () => {
    expect(isMap({})).toBe(false)
    expect(isMap(new Set())).toBe(false)
  })
})

describe('isSet', () => {
  it('should return true for sets', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new Set([1, 2, 3]))).toBe(true)
  })

  it('should return false for non-sets', () => {
    expect(isSet([])).toBe(false)
    expect(isSet(new Map())).toBe(false)
  })
})

describe('isWeakMap', () => {
  it('should return true for weakmaps', () => {
    expect(isWeakMap(new WeakMap())).toBe(true)
  })

  it('should return false for non-weakmaps', () => {
    expect(isWeakMap(new Map())).toBe(false)
    expect(isWeakMap({})).toBe(false)
  })
})

describe('isWeakSet', () => {
  it('should return true for weaksets', () => {
    expect(isWeakSet(new WeakSet())).toBe(true)
  })

  it('should return false for non-weaksets', () => {
    expect(isWeakSet(new Set())).toBe(false)
    expect(isWeakSet([])).toBe(false)
  })
})
