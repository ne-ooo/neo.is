import assert from 'node:assert/strict'
import process from 'node:process'
import { runInNewContext } from 'node:vm'
import {
  getType,
  isAsyncFunction,
  isError,
  isGeneratorFunction,
} from '../dist/index.js'

const fakeError = Object.create(Error.prototype)
const crossRealmError = runInNewContext("new TypeError('neo')")
const disguisedError = new Error('neo')
Object.defineProperty(disguisedError, Symbol.toStringTag, { value: 'Object' })

const cyclic = new Proxy({}, {
  getPrototypeOf() {
    return cyclic
  },
})

const syncNamedAsync = ({ async() {} }).async
const alteredAsync = () => 1
Object.setPrototypeOf(alteredAsync, Object.getPrototypeOf(async () => {}))
const alteredGenerator = () => 1
Object.setPrototypeOf(alteredGenerator, Object.getPrototypeOf(function* () {}))
const commentedAsync = async /* comment */ function () {}
const commentedGenerator = function /* comment */ * () {}
const boundAsync = (async () => {}).bind(null)

const rejectedPromise = Promise.reject(new Error('expected rejection'))
await rejectedPromise.catch(() => {})
const originalPromiseThen = Promise.prototype.then
let promiseThenCalls = 0
Promise.prototype.then = function (...args) {
  promiseThenCalls++
  return Reflect.apply(originalPromiseThen, this, args)
}
assert.equal(getType(rejectedPromise), 'promise')
assert.equal(promiseThenCalls, 0)
Promise.prototype.then = originalPromiseThen

assert.equal(isError(fakeError), false)
assert.equal(isError(cyclic), false)
assert.equal(isError(new Error('neo')), true)
assert.equal(isError(crossRealmError), true)
assert.equal(isError(disguisedError), true)
assert.equal(isAsyncFunction(syncNamedAsync), false)
assert.equal(isAsyncFunction(alteredAsync), false)
assert.equal(isGeneratorFunction(alteredGenerator), false)
assert.equal(isAsyncFunction(commentedAsync), true)
assert.equal(isGeneratorFunction(commentedGenerator), true)
assert.equal(isAsyncFunction(boundAsync), false)
assert.equal(getType(crossRealmError), 'error')

console.log(`Runtime compatibility checks passed on ${process.version}.`)
