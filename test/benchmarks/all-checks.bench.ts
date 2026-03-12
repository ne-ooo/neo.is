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

  describe('Objects (toString baseline)', () => {
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

    bench('isEmpty([])', () => {
      isEmpty(emptyArr)
    })

    bench('isEmpty({})', () => {
      isEmpty(emptyObj)
    })
  })
})
