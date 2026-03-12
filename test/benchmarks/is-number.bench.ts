import { bench, describe } from 'vitest'
import { isNumber as neoIsNumber, isNumeric } from '../../src/index.js'
import isNumberOriginal from 'is-number'

describe('isNumber Performance vs is-number', () => {
  const testCases = [
    { value: 42, desc: 'integer' },
    { value: 42.5, desc: 'float' },
    { value: '42', desc: 'numeric string' },
    { value: '42.5', desc: 'float string' },
    { value: NaN, desc: 'NaN' },
    { value: Infinity, desc: 'Infinity' },
    { value: null, desc: 'null' },
    { value: undefined, desc: 'undefined' },
  ]

  for (const { value, desc } of testCases) {
    bench(`neo.is isNumber(${desc})`, () => {
      neoIsNumber(value)
    })

    bench(`is-number(${desc})`, () => {
      isNumberOriginal(value)
    })
  }
})

describe('isNumeric (string coercion) Performance', () => {
  const testCases = [
    { value: 42, desc: 'number' },
    { value: '42', desc: 'numeric string' },
    { value: '42.5', desc: 'float string' },
    { value: '  42  ', desc: 'with whitespace' },
    { value: 'not a number', desc: 'non-numeric' },
  ]

  for (const { value, desc } of testCases) {
    bench(`neo.is isNumeric(${desc})`, () => {
      isNumeric(value)
    })

    bench(`is-number(${desc})`, () => {
      isNumberOriginal(value)
    })
  }
})
