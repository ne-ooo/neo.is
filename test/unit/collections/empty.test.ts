import { describe, it, expect } from 'vitest'
import { isEmpty } from '../../../src/index.js'

describe('isEmpty', () => {
  describe('strings', () => {
    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })
    it('returns false for non-empty string', () => {
      expect(isEmpty('a')).toBe(false)
    })
    it('returns false for whitespace-only string', () => {
      expect(isEmpty(' ')).toBe(false)
    })
  })

  describe('arrays', () => {
    it('returns true for empty array', () => {
      expect(isEmpty([])).toBe(true)
    })
    it('returns false for array with one element', () => {
      expect(isEmpty([0])).toBe(false)
    })
    it('returns false for array with null element', () => {
      expect(isEmpty([null])).toBe(false)
    })
  })

  describe('objects', () => {
    it('returns true for empty plain object', () => {
      expect(isEmpty({})).toBe(true)
    })
    it('returns false for object with one key', () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })
    it('returns false for object with undefined value', () => {
      expect(isEmpty({ a: undefined })).toBe(false)
    })
  })

  describe('Map', () => {
    it('returns true for empty Map', () => {
      expect(isEmpty(new Map())).toBe(true)
    })
    it('returns false for Map with one entry', () => {
      expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    })
  })

  describe('Set', () => {
    it('returns true for empty Set', () => {
      expect(isEmpty(new Set())).toBe(true)
    })
    it('returns false for Set with one element', () => {
      expect(isEmpty(new Set([1]))).toBe(false)
    })
  })

  describe('null and undefined', () => {
    it('returns true for null', () => {
      expect(isEmpty(null)).toBe(true)
    })
    it('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true)
    })
  })

  describe('numbers and booleans', () => {
    it('returns false for number (not an emptiness-checkable type)', () => {
      expect(isEmpty(0)).toBe(false)
    })
    it('returns false for boolean false', () => {
      expect(isEmpty(false)).toBe(false)
    })
  })
})
