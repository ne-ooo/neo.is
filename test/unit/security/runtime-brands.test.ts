import { describe, expect, it } from 'vitest'
import { runInNewContext } from 'node:vm'
import {
  getType,
  isArray,
  isArrayLike,
  isAsyncFunction,
  isDate,
  isEmpty,
  isError,
  isGenerator,
  isGeneratorFunction,
  isIterable,
  isMap,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isTypedArray,
  isUint8Array,
  isWeakMap,
  isWeakSet,
} from '../../../src/index.js'

describe('runtime brand hardening', () => {
  it('keeps getType inside the TypeString contract for forged tags', () => {
    for (const tag of [
      'toString',
      'constructor',
      '__proto__',
      'hasOwnProperty',
      'Map',
      'Uint8Array',
    ]) {
      expect(getType({ [Symbol.toStringTag]: tag })).toBe('object')
    }
  })

  it('distinguishes Infinity, NaN, and generator instances', () => {
    expect(getType(Infinity)).toBe('number')
    expect(getType(-Infinity)).toBe('number')
    expect(getType(NaN)).toBe('nan')
    expect(getType((function* () {})())).toBe('generator')
  })

  it('rejects forged built-in tags', () => {
    expect(isDate({ [Symbol.toStringTag]: 'Date' })).toBe(false)
    expect(isRegExp({ [Symbol.toStringTag]: 'RegExp' })).toBe(false)
    expect(isError({ [Symbol.toStringTag]: 'Error' })).toBe(false)
    expect(isMap({ [Symbol.toStringTag]: 'Map' })).toBe(false)
    expect(isSet({ [Symbol.toStringTag]: 'Set' })).toBe(false)
    expect(isWeakMap({ [Symbol.toStringTag]: 'WeakMap' })).toBe(false)
    expect(isWeakSet({ [Symbol.toStringTag]: 'WeakSet' })).toBe(false)
    expect(isPromise({ [Symbol.toStringTag]: 'Promise' })).toBe(false)
    expect(isTypedArray({ [Symbol.toStringTag]: 'Uint8Array' })).toBe(false)
    expect(isUint8Array({ [Symbol.toStringTag]: 'Uint8Array' })).toBe(false)
    expect(isAsyncFunction({ [Symbol.toStringTag]: 'AsyncFunction' })).toBe(false)
    expect(isGeneratorFunction({ [Symbol.toStringTag]: 'GeneratorFunction' })).toBe(false)
    expect(isGenerator({ [Symbol.toStringTag]: 'Generator' })).toBe(false)

    const regularFunction = Object.assign(function () {}, {
      [Symbol.toStringTag]: 'AsyncFunction',
    })
    expect(isAsyncFunction(regularFunction)).toBe(false)
  })

  it('ignores forged tags placed on real built-ins', () => {
    const typedArray = new Uint8Array(1)
    Object.defineProperty(typedArray, Symbol.toStringTag, { value: 'Map' })

    expect(isUint8Array(typedArray)).toBe(true)
    expect(isTypedArray(typedArray)).toBe(true)
    expect(isMap(typedArray)).toBe(false)
    expect(getType(typedArray)).toBe('uint8array')

    const disguisedBuiltIns: Array<[object, string]> = [
      [new Date(), 'date'],
      [/neo/, 'regexp'],
      [new Error('neo'), 'error'],
      [new Map(), 'map'],
      [new Set(), 'set'],
      [new WeakMap(), 'weakmap'],
      [new WeakSet(), 'weakset'],
      [Promise.resolve(), 'promise'],
      [(function* () {})(), 'generator'],
    ]

    for (const [value, expectedType] of disguisedBuiltIns) {
      Object.defineProperty(value, Symbol.toStringTag, {
        configurable: true,
        value: 'Object',
      })
      expect(getType(value)).toBe(expectedType)
    }
  })

  it('does not invoke a throwing tag beyond the safe fallback', () => {
    class Tagged {}
    Object.defineProperty(Tagged.prototype, Symbol.toStringTag, {
      get() {
        throw new Error('tag should not escape')
      },
    })

    expect(() => getType(new Tagged())).not.toThrow()
    expect(getType(new Tagged())).toBe('object')
  })

  it('accepts cross-realm plain objects and branded built-ins', () => {
    const values = runInNewContext(`({
      plainObject: { id: 1 },
      date: new Date(0),
      regexp: /neo/,
      error: new TypeError('neo'),
      map: new Map([['neo', 1]]),
      set: new Set(['neo']),
      weakMap: new WeakMap(),
      weakSet: new WeakSet(),
      typedArray: new Uint8Array(1),
      asyncFunction: async function () {},
      generatorFunction: function* () {},
      generator: (function* () {})(),
    })`)

    expect(isPlainObject(values.plainObject)).toBe(true)
    expect(isDate(values.date)).toBe(true)
    expect(isRegExp(values.regexp)).toBe(true)
    expect(isError(values.error)).toBe(true)
    expect(isMap(values.map)).toBe(true)
    expect(isSet(values.set)).toBe(true)
    expect(isWeakMap(values.weakMap)).toBe(true)
    expect(isWeakSet(values.weakSet)).toBe(true)
    expect(isUint8Array(values.typedArray)).toBe(true)
    expect(isAsyncFunction(values.asyncFunction)).toBe(true)
    expect(isGeneratorFunction(values.generatorFunction)).toBe(true)
    expect(isGenerator(values.generator)).toBe(true)

    expect(getType(values.date)).toBe('date')
    expect(getType(values.regexp)).toBe('regexp')
    expect(getType(values.error)).toBe('error')
    expect(getType(values.map)).toBe('map')
    expect(getType(values.set)).toBe('set')
    expect(getType(values.weakMap)).toBe('weakmap')
    expect(getType(values.weakSet)).toBe('weakset')
    expect(getType(values.generator)).toBe('generator')
  })

  it('validates same-realm prototype hints', () => {
    const fakeBuiltIns = [
      Object.create(Date.prototype),
      Object.create(RegExp.prototype),
      Object.create(Error.prototype),
      Object.create(Map.prototype),
      Object.create(Set.prototype),
      Object.create(WeakMap.prototype),
      Object.create(WeakSet.prototype),
      Object.create(Promise.prototype, {
        then: { value: undefined },
      }),
    ]

    for (const value of fakeBuiltIns) {
      expect(getType(value)).toBe('object')
    }
  })

  it('validates cross-realm tag hints', () => {
    const forgedTags = [
      'Date',
      'RegExp',
      'Error',
      'Map',
      'Set',
      'WeakMap',
      'WeakSet',
      'Generator',
      'Promise',
    ]

    for (const tag of forgedTags) {
      const value = Object.create({ [Symbol.toStringTag]: tag })
      expect(getType(value)).toBe('object')
    }
  })

  it('uses intrinsic fallbacks for disguised cross-realm built-ins', () => {
    const values = runInNewContext(`(() => {
      const values = {
        date: new Date(0),
        regexp: /neo/,
        error: new TypeError('neo'),
        map: new Map(),
        set: new Set(),
        weakMap: new WeakMap(),
        weakSet: new WeakSet(),
        promise: Promise.resolve(),
        generator: (function* () {})(),
      }
      for (const value of Object.values(values)) {
        Object.defineProperty(value, Symbol.toStringTag, { value: 'Object' })
      }
      return values
    })()`)

    expect(getType(values.date)).toBe('date')
    expect(getType(values.regexp)).toBe('regexp')
    expect(getType(values.error)).toBe('error')
    expect(getType(values.map)).toBe('map')
    expect(getType(values.set)).toBe('set')
    expect(getType(values.weakMap)).toBe('weakmap')
    expect(getType(values.weakSet)).toBe('weakset')
    expect(getType(values.promise)).toBe('promise')
    expect(getType(values.generator)).toBe('generator')
  })

  it('treats thenables as thenables without promising Promise methods', () => {
    expect(isPromise({ then() {} })).toBe(true)
    expect(isPromise(Object.assign(() => {}, { then() {} }))).toBe(true)

    const throwingThen = Object.defineProperty({}, 'then', {
      get() {
        throw new Error('getter should not escape')
      },
    })
    expect(() => isPromise(throwingThen)).not.toThrow()
    expect(isPromise(throwingThen)).toBe(false)
  })

  it('supports bound async and generator functions', () => {
    expect(isAsyncFunction((async function () {}).bind(null))).toBe(true)
    expect(isGeneratorFunction((function* () {}).bind(null))).toBe(true)
  })

  it('does not let forged collection tags bypass isEmpty', () => {
    expect(isEmpty({ [Symbol.toStringTag]: 'Map', size: 0 })).toBe(false)
    expect(isEmpty({ [Symbol('key')]: true })).toBe(false)
  })

  it('keeps disguised and cross-realm collections visible to isEmpty', () => {
    const disguisedMap = new Map()
    const disguisedSet = new Set()
    Object.defineProperty(disguisedMap, Symbol.toStringTag, { value: 'Object' })
    Object.defineProperty(disguisedSet, Symbol.toStringTag, { value: 'Object' })

    expect(isEmpty(disguisedMap)).toBe(true)
    expect(isEmpty(disguisedSet)).toBe(true)

    const values = runInNewContext('({ map: new Map(), set: new Set() })')
    expect(isEmpty(values.map)).toBe(true)
    expect(isEmpty(values.set)).toBe(true)
  })

  it('returns conservative results for uninspectable proxies', () => {
    const revoked = Proxy.revocable({}, {})
    revoked.revoke()

    expect(() => isArray(revoked.proxy)).not.toThrow()
    expect(isArray(revoked.proxy)).toBe(false)
    expect(() => isEmpty(revoked.proxy)).not.toThrow()
    expect(isEmpty(revoked.proxy)).toBe(false)
    expect(getType(revoked.proxy)).toBe('object')
    expect(isPlainObject(revoked.proxy)).toBe(false)

    const throwingOwnKeys = new Proxy({}, {
      ownKeys() {
        throw new Error('ownKeys should not escape')
      },
    })
    expect(() => isEmpty(throwingOwnKeys)).not.toThrow()
    expect(isEmpty(throwingOwnKeys)).toBe(false)

    const throwingIterator = Object.defineProperty({}, Symbol.iterator, {
      get() {
        throw new Error('iterator should not escape')
      },
    })
    const throwingLength = Object.defineProperty({}, 'length', {
      get() {
        throw new Error('length should not escape')
      },
    })
    expect(isIterable(throwingIterator)).toBe(false)
    expect(isArrayLike(throwingLength)).toBe(false)
  })
})
