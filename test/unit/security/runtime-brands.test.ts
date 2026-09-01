import { afterEach, describe, expect, it, vi } from 'vitest'
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
  afterEach(() => {
    vi.resetModules()
  })

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
      promise: Promise.resolve(),
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
    expect(isPromise(values.promise)).toBe(true)

    expect(getType(values.date)).toBe('date')
    expect(getType(values.regexp)).toBe('regexp')
    expect(getType(values.error)).toBe('error')
    expect(getType(values.map)).toBe('map')
    expect(getType(values.set)).toBe('set')
    expect(getType(values.weakMap)).toBe('weakmap')
    expect(getType(values.weakSet)).toBe('weakset')
    expect(getType(values.generator)).toBe('generator')
    expect(getType(values.promise)).toBe('promise')
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

  it('uses the Node Error brand fallback when Error.isError is unavailable', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(Error, 'isError')
    Object.defineProperty(Error, 'isError', {
      configurable: true,
      value: undefined,
    })

    try {
      vi.resetModules()
      const { isError: legacyIsError } = await import('../../../src/objects/error.js')

      expect(legacyIsError(Object.create(Error.prototype))).toBe(false)

      const customPrototypeError = new TypeError('neo', {
        cause: () => {},
      })
      Object.setPrototypeOf(customPrototypeError, {})
      expect(legacyIsError(customPrototypeError)).toBe(true)

      const taggedFake = Object.create(Error.prototype, {
        [Symbol.toStringTag]: { value: 'Error' },
      })
      expect(legacyIsError(taggedFake)).toBe(false)

      const inheritedTaggedFake = Object.create(
        Object.create(Error.prototype, {
          [Symbol.toStringTag]: { value: 'Error' },
        })
      )
      expect(legacyIsError(inheritedTaggedFake)).toBe(false)

      if (typeof DOMException === 'function') {
        expect(legacyIsError(Object.create(DOMException.prototype))).toBe(false)
        expect(legacyIsError(new DOMException('neo'))).toBe(true)
      }

      const taggedBridge = Object.create(Error.prototype, {
        [Symbol.toStringTag]: { value: 'Error' },
      })
      expect(legacyIsError(Object.create(taggedBridge))).toBe(false)

      const taggedProxy = new Proxy({}, {
        get(target, property, receiver) {
          if (property === Symbol.toStringTag) return 'Error'
          return Reflect.get(target, property, receiver)
        },
        getPrototypeOf() {
          return Error.prototype
        },
      })
      expect(legacyIsError(taggedProxy)).toBe(false)

      let calls = 0
      const statefulTag = Object.create(Error.prototype, {
        [Symbol.toStringTag]: {
          get() {
            calls++
            return calls % 2 === 0 ? 'Error' : undefined
          },
        },
      })
      expect(legacyIsError(statefulTag)).toBe(false)

      if (typeof DOMException === 'function') {
        expect(legacyIsError(new DOMException('neo'))).toBe(true)
        expect(legacyIsError(Object.create(DOMException.prototype))).toBe(false)
      }

      const forgedPrototype = Object.create(null) as Record<PropertyKey, unknown>
      Object.defineProperty(forgedPrototype, 'constructor', { value: Error })
      expect(legacyIsError(Object.create(forgedPrototype))).toBe(false)

      const cyclic: object = new Proxy({}, {
        getPrototypeOf() {
          return cyclic
        },
      })
      expect(legacyIsError(cyclic)).toBe(false)
    } finally {
      if (descriptor === undefined) {
        Reflect.deleteProperty(Error, 'isError')
      } else {
        Object.defineProperty(Error, 'isError', descriptor)
      }
    }
  })

  it('uses structured clone as the browser Error brand fallback', async () => {
    const isErrorDescriptor = Object.getOwnPropertyDescriptor(Error, 'isError')
    const processDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'process'
    )
    Object.defineProperty(Error, 'isError', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(globalThis, 'process', {
      configurable: true,
      value: undefined,
    })

    try {
      vi.resetModules()
      const { isError: browserIsError } = await import(
        '../../../src/objects/error.js'
      )

      expect(browserIsError(new Error('neo'))).toBe(true)

      const customPrototypeError = new TypeError('neo')
      Object.setPrototypeOf(customPrototypeError, {})
      expect(browserIsError(customPrototypeError)).toBe(true)

      const nonCloneableError = new Error('neo', { cause: () => {} })
      expect(browserIsError(nonCloneableError)).toBe(false)

      let calls = 0
      const statefulProxy = new Proxy({}, {
        get(target, property, receiver) {
          if (property === Symbol.toStringTag) {
            calls++
            return calls % 2 === 0 ? 'Error' : undefined
          }
          return Reflect.get(target, property, receiver)
        },
        getPrototypeOf() {
          return Error.prototype
        },
      })
      expect(browserIsError(statefulProxy)).toBe(false)

      if (typeof DOMException === 'function') {
        expect(browserIsError(new DOMException('neo'))).toBe(true)
        expect(browserIsError(Object.create(DOMException.prototype))).toBe(false)
      }
    } finally {
      if (isErrorDescriptor === undefined) {
        Reflect.deleteProperty(Error, 'isError')
      } else {
        Object.defineProperty(Error, 'isError', isErrorDescriptor)
      }

      if (processDescriptor === undefined) {
        Reflect.deleteProperty(globalThis, 'process')
      } else {
        Object.defineProperty(globalThis, 'process', processDescriptor)
      }
    }
  })

  it('classifies browser async arrows without invoking them', async () => {
    const processDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'process'
    )
    Object.defineProperty(globalThis, 'process', {
      configurable: true,
      value: undefined,
    })

    try {
      vi.resetModules()
      const { isAsyncFunction: browserIsAsyncFunction } = await import(
        '../../../src/functions/async-function.js'
      )

      for (const source of [
        '(async (value = function () {} / 2) => value)',
        '(async (value = async function () {} / 2) => value)',
        '(async (value = function* () {} / 2) => value)',
        '(async (value = function () { class Neo {} /"/.test("") }) => value)',
      ]) {
        expect(browserIsAsyncFunction(runInNewContext(source))).toBe(true)
      }

      class Base {
        value = 'neo'
      }
      class Derived extends Base {
        #secret = 'neo'
        #π = 'neo'

        createSuperArrow() {
          return async () => [super.value, /\super/u]
        }

        createPrivateArrow() {
          return async () => this.#secret
        }

        createUnicodePrivateArrow() {
          return async () => [this.#π, '#π', /#π/u]
        }
      }
      const derived = new Derived()
      expect(browserIsAsyncFunction(derived.createSuperArrow())).toBe(true)
      expect(browserIsAsyncFunction(derived.createPrivateArrow())).toBe(true)
      expect(
        browserIsAsyncFunction(derived.createUnicodePrivateArrow())
      ).toBe(true)
      expect(
        browserIsAsyncFunction(
          async () => [import.meta.url, 'import.meta', /import.meta/u]
        )
      ).toBe(true)
      expect(
        browserIsAsyncFunction(async () => import/* first */./* second */meta.url)
      ).toBe(true)
      expect(
        browserIsAsyncFunction(async () => import// first
        .// second
        meta.url)
      ).toBe(true)
      const carriageReturnModule = await import(
        /* @vite-ignore */
        `data:text/javascript,${encodeURIComponent(
          'export default async()=>import// first\r.// second\rmeta.url'
        )}`
      )
      expect(browserIsAsyncFunction(carriageReturnModule.default)).toBe(true)
      expect(
        browserIsAsyncFunction(
          runInNewContext(`new (class {
            #\\u03c0
            make() {
              return async () => this.#\\u03c0
            }
          })().make()`)
        )
      ).toBe(true)

      const forged = ({ async() {} }).async
      Object.setPrototypeOf(forged, Object.getPrototypeOf(async () => {}))
      expect(browserIsAsyncFunction(forged)).toBe(false)

      class ContextualMethod extends Base {
        async() {
          return super.value
        }
      }
      const contextualMethod = new ContextualMethod().async
      Object.setPrototypeOf(
        contextualMethod,
        Object.getPrototypeOf(async () => {})
      )
      expect(browserIsAsyncFunction(contextualMethod)).toBe(false)
    } finally {
      if (processDescriptor === undefined) {
        Reflect.deleteProperty(globalThis, 'process')
      } else {
        Object.defineProperty(globalThis, 'process', processDescriptor)
      }
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

  it('uses intrinsic fallbacks for arbitrary cross-realm tags', () => {
    const values = runInNewContext(`(() => {
      const values = {
        date: new Date(0),
        map: new Map(),
        promise: Promise.resolve(),
      }
      for (const value of Object.values(values)) {
        Object.defineProperty(value, Symbol.toStringTag, { value: 'Neo' })
      }
      return values
    })()`)

    expect(getType(values.date)).toBe('date')
    expect(getType(values.map)).toBe('map')
    expect(getType(values.promise)).toBe('promise')
  })

  it('accepts branded values with custom prototypes and inherited tags', () => {
    const values: Array<[object, (value: unknown) => boolean, string]> = [
      [new Date(), isDate, 'date'],
      [/neo/, isRegExp, 'regexp'],
      [new Map(), isMap, 'map'],
      [new Set(), isSet, 'set'],
      [new WeakMap(), isWeakMap, 'weakmap'],
      [new WeakSet(), isWeakSet, 'weakset'],
    ]

    for (const [value, predicate, expectedType] of values) {
      Object.setPrototypeOf(value, {})
      expect(predicate(value)).toBe(true)
      expect(getType(value)).toBe(expectedType)
    }

    class TaggedMap extends Map {
      get [Symbol.toStringTag]() {
        return 'Neo'
      }
    }
    expect(isMap(new TaggedMap())).toBe(true)
    expect(getType(new TaggedMap())).toBe('map')

    class Replacement {}
    const classPrototypeMap = new Map([['neo', 1]])
    Object.setPrototypeOf(classPrototypeMap, Replacement.prototype)
    expect(isMap(classPrototypeMap)).toBe(true)
    expect(getType(classPrototypeMap)).toBe('object')
  })

  it('keeps dedicated predicates authoritative after plain prototype replacement', () => {
    const cases: Array<[() => object, (value: unknown) => boolean]> = [
      [() => new Date(), isDate],
      [() => /neo/, isRegExp],
      [() => new Map(), isMap],
      [() => new Set(), isSet],
      [() => new WeakMap(), isWeakMap],
      [() => new WeakSet(), isWeakSet],
    ]

    for (const [createValue, predicate] of cases) {
      const objectPrototypeValue = createValue()
      Object.setPrototypeOf(objectPrototypeValue, Object.prototype)
      expect(predicate(objectPrototypeValue)).toBe(true)

      const nullPrototypeValue = createValue()
      Object.setPrototypeOf(nullPrototypeValue, null)
      expect(predicate(nullPrototypeValue)).toBe(true)
    }
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

  it('conservatively rejects bound functions with hidden target brands', () => {
    expect(isAsyncFunction((async function () {}).bind(null))).toBe(false)
    expect(isGeneratorFunction((function* () {}).bind(null))).toBe(false)
  })

  it('does not let forged collection tags bypass isEmpty', () => {
    expect(isEmpty({ [Symbol.toStringTag]: 'Map', size: 0 })).toBe(false)
    expect(isEmpty({ [Symbol('key')]: true })).toBe(false)
  })

  it('does not invoke collection tag getters through isEmpty', () => {
    for (const inherited of [false, true]) {
      let calls = 0
      const tagged = Object.create(inherited ? {
        get [Symbol.toStringTag]() {
          calls++
          return 'Map'
        },
      } : Object.prototype)

      if (!inherited) {
        Object.defineProperty(tagged, Symbol.toStringTag, {
          get() {
            calls++
            return 'Map'
          },
        })
      }

      expect(isEmpty(tagged)).toBe(false)
      expect(calls).toBe(0)
    }
  })

  it('does not invoke tag getters through hardened object classification', () => {
    for (const inherited of [false, true]) {
      let calls = 0
      const tagged = Object.create(inherited ? {
        get [Symbol.toStringTag]() {
          calls++
          return 'Map'
        },
      } : Object.prototype)

      if (!inherited) {
        Object.defineProperty(tagged, Symbol.toStringTag, {
          get() {
            calls++
            return 'Map'
          },
        })
      }

      expect(isPlainObject(tagged)).toBe(false)
      expect(getType(tagged)).toBe('object')
      expect(calls).toBe(0)
    }

    const crossRealm = runInNewContext(`(() => {
      let calls = 0
      Object.defineProperty(Object.prototype, Symbol.toStringTag, {
        get() {
          calls++
          return 'Object'
        },
      })
      return { value: {}, calls: () => calls }
    })()`)
    expect(isPlainObject(crossRealm.value)).toBe(false)
    expect(getType(crossRealm.value)).toBe('object')
    expect(crossRealm.calls()).toBe(0)

    const throwingPrototype = new Proxy({}, {
      getPrototypeOf() {
        throw new Error('prototype should not escape')
      },
    })
    expect(getType(throwingPrototype)).toBe('object')
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

  it('keeps branded objects visible with a custom replacement prototype', () => {
    const map = new Map([['neo', 1]])
    Object.setPrototypeOf(map, {})

    expect(isMap(map)).toBe(true)
    expect(isPlainObject(map)).toBe(false)
    expect(getType(map)).toBe('map')
    expect(isEmpty(map)).toBe(false)
  })

  it('does not probe rejected promises by invoking then', async () => {
    const promise = Promise.reject(new Error('expected rejection'))
    await promise.catch(() => {})
    const then = vi.spyOn(Promise.prototype, 'then')

    try {
      expect(getType(promise)).toBe('promise')
      expect(then).not.toHaveBeenCalled()
    } finally {
      then.mockRestore()
    }
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
    expect(isMap(revoked.proxy)).toBe(false)

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
