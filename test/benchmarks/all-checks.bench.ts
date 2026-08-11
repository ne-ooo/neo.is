import { bench, describe } from 'vitest'
import {
  isNumber,
  isString,
  isBoolean,
  isArray,
  isPlainObject,
  isDate,
  isFunction,
  isEmpty,
  isMap,
  isSet,
  isTypedArray,
} from '../../src/index.js'

describe('Type Check Performance Baseline', () => {
  describe('Primitives (typeof baseline)', () => {
    bench('isNumber(42)', () => {
      isNumber(42)
    })

    bench('isString("test")', () => {
      isString('test')
    })

    bench('isBoolean(true)', () => {
      isBoolean(true)
    })
  })

  describe('Objects (intrinsic brand baseline)', () => {
    const arr = [1, 2, 3]
    const obj = { a: 1 }
    const date = new Date()

    bench('isArray([])', () => {
      isArray(arr)
    })

    bench('isPlainObject({})', () => {
      isPlainObject(obj)
    })

    bench('isDate(new Date())', () => {
      isDate(date)
    })
  })

  describe('Functions', () => {
    const fn = () => {}

    bench('isFunction(() => {})', () => {
      isFunction(fn)
    })
  })

  describe('Collections', () => {
    const emptyArr: unknown[] = []
    const emptyObj = {}
    const emptyMap = new Map()
    const emptySet = new Set()

    bench('isEmpty([])', () => {
      isEmpty(emptyArr)
    })

    bench('isEmpty({})', () => {
      isEmpty(emptyObj)
    })

    bench('isEmpty(new Map())', () => {
      isEmpty(emptyMap)
    })

    bench('isEmpty(new Set())', () => {
      isEmpty(emptySet)
    })
  })

  describe('Branded objects', () => {
    const map = new Map()
    const set = new Set()
    const typedArray = new Uint8Array(1)
    const plainObject = {}

    bench('isMap(new Map())', () => {
      isMap(map)
    })

    bench('isSet(new Set())', () => {
      isSet(set)
    })

    bench('isTypedArray(new Uint8Array())', () => {
      isTypedArray(typedArray)
    })

    bench('isTypedArray({})', () => {
      isTypedArray(plainObject)
    })
  })
})
