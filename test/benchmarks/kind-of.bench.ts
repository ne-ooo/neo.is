import { bench, describe } from 'vitest'
import { getType as neoGetType } from '../../src/index.js'
import kindOf from 'kind-of'

describe('getType vs kind-of Performance', () => {
  class FreshExample {}
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
    { value: new ArrayBuffer(8), desc: 'arraybuffer' },
    { value: new DataView(new ArrayBuffer(8)), desc: 'dataview' },
    { value: new URL('https://example.com'), desc: 'url' },
    { value: new (class Example {})(), desc: 'class instance' },
  ]

  for (const { value, desc } of testCases) {
    bench(`neo.is getType(${desc})`, () => {
      neoGetType(value)
    })

    bench(`kind-of(${desc})`, () => {
      kindOf(value)
    })
  }

  bench('neo.is getType(fresh object)', () => {
    neoGetType({})
  })

  bench('neo.is getType(fresh ArrayBuffer)', () => {
    neoGetType(new ArrayBuffer(8))
  })

  bench('neo.is getType(fresh DataView)', () => {
    neoGetType(new DataView(new ArrayBuffer(8)))
  })

  bench('neo.is getType(fresh URL)', () => {
    neoGetType(new URL('https://example.com'))
  })

  bench('neo.is getType(fresh class instance)', () => {
    neoGetType(new FreshExample())
  })
})
