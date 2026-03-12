import { describe, it, expect } from 'vitest'
import {
  isInt8Array,
  isUint8Array,
  isUint8ClampedArray,
  isInt16Array,
  isUint16Array,
  isInt32Array,
  isUint32Array,
  isFloat32Array,
  isFloat64Array,
  isBigInt64Array,
  isBigUint64Array,
  isTypedArray,
} from '../../../src/index.js'

describe('isInt8Array', () => {
  it('accepts Int8Array', () => { expect(isInt8Array(new Int8Array(0))).toBe(true) })
  it('rejects Uint8Array', () => { expect(isInt8Array(new Uint8Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isInt8Array([])).toBe(false) })
  it('rejects null', () => { expect(isInt8Array(null)).toBe(false) })
})

describe('isUint8Array', () => {
  it('accepts Uint8Array', () => { expect(isUint8Array(new Uint8Array(0))).toBe(true) })
  it('rejects Int8Array', () => { expect(isUint8Array(new Int8Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isUint8Array([])).toBe(false) })
  it('rejects null', () => { expect(isUint8Array(null)).toBe(false) })
})

describe('isUint8ClampedArray', () => {
  it('accepts Uint8ClampedArray', () => { expect(isUint8ClampedArray(new Uint8ClampedArray(0))).toBe(true) })
  it('rejects Uint8Array', () => { expect(isUint8ClampedArray(new Uint8Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isUint8ClampedArray([])).toBe(false) })
})

describe('isInt16Array', () => {
  it('accepts Int16Array', () => { expect(isInt16Array(new Int16Array(0))).toBe(true) })
  it('rejects Uint16Array', () => { expect(isInt16Array(new Uint16Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isInt16Array([])).toBe(false) })
})

describe('isUint16Array', () => {
  it('accepts Uint16Array', () => { expect(isUint16Array(new Uint16Array(0))).toBe(true) })
  it('rejects Int16Array', () => { expect(isUint16Array(new Int16Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isUint16Array([])).toBe(false) })
})

describe('isInt32Array', () => {
  it('accepts Int32Array', () => { expect(isInt32Array(new Int32Array(0))).toBe(true) })
  it('rejects Uint32Array', () => { expect(isInt32Array(new Uint32Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isInt32Array([])).toBe(false) })
})

describe('isUint32Array', () => {
  it('accepts Uint32Array', () => { expect(isUint32Array(new Uint32Array(0))).toBe(true) })
  it('rejects Int32Array', () => { expect(isUint32Array(new Int32Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isUint32Array([])).toBe(false) })
})

describe('isFloat32Array', () => {
  it('accepts Float32Array', () => { expect(isFloat32Array(new Float32Array(0))).toBe(true) })
  it('rejects Float64Array', () => { expect(isFloat32Array(new Float64Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isFloat32Array([])).toBe(false) })
})

describe('isFloat64Array', () => {
  it('accepts Float64Array', () => { expect(isFloat64Array(new Float64Array(0))).toBe(true) })
  it('rejects Float32Array', () => { expect(isFloat64Array(new Float32Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isFloat64Array([])).toBe(false) })
})

describe('isBigInt64Array', () => {
  it('accepts BigInt64Array', () => { expect(isBigInt64Array(new BigInt64Array(0))).toBe(true) })
  it('rejects BigUint64Array', () => { expect(isBigInt64Array(new BigUint64Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isBigInt64Array([])).toBe(false) })
})

describe('isBigUint64Array', () => {
  it('accepts BigUint64Array', () => { expect(isBigUint64Array(new BigUint64Array(0))).toBe(true) })
  it('rejects BigInt64Array', () => { expect(isBigUint64Array(new BigInt64Array(0))).toBe(false) })
  it('rejects plain array', () => { expect(isBigUint64Array([])).toBe(false) })
})

describe('isTypedArray (generic check)', () => {
  it('accepts any typed array', () => {
    expect(isTypedArray(new Int8Array(0))).toBe(true)
    expect(isTypedArray(new Uint8Array(0))).toBe(true)
    expect(isTypedArray(new Float64Array(0))).toBe(true)
    expect(isTypedArray(new BigInt64Array(0))).toBe(true)
  })
  it('rejects plain array', () => {
    expect(isTypedArray([])).toBe(false)
  })
  it('rejects null', () => {
    expect(isTypedArray(null)).toBe(false)
  })
  it('rejects plain object', () => {
    expect(isTypedArray({})).toBe(false)
  })
})
