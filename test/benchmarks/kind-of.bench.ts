import { bench, describe } from 'vitest'
import { getType as neoGetType } from '../../src/index.js'
import kindOf from 'kind-of'

describe('getType vs kind-of Performance', () => {
  const testCases = [
    { value: 42, desc: 'number' },
    { value: 'hello', desc: 'string' },
    { value: true, desc: 'boolean' },
    { value: [], desc: 'array' },
    { value: {}, desc: 'object' },
    { value: new Date(), desc: 'date' },
    { value: /test/, desc: 'regexp' },
    { value: null, desc: 'null' },
    { value: undefined, desc: 'undefined' },
    { value: Symbol('test'), desc: 'symbol' },
    { value: () => {}, desc: 'function' },
    { value: new Map(), desc: 'map' },
    { value: new Set(), desc: 'set' },
  ]

  for (const { value, desc } of testCases) {
    bench(`neo.is getType(${desc})`, () => {
      neoGetType(value)
    })

    bench(`kind-of(${desc})`, () => {
      kindOf(value)
    })
  }
})
