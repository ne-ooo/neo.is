import { describe, expect, it } from 'vitest'
import { getTag, toString } from '../../../src/utils/to-string.js'

describe('raw object tags', () => {
  it('returns descriptive tags for ordinary values', () => {
    expect(toString([])).toBe('[object Array]')
    expect(toString(null)).toBe('[object Null]')
    expect(getTag(new Date())).toBe('Date')
  })

  it('preserves custom Symbol.toStringTag values', () => {
    const tagged = { [Symbol.toStringTag]: 'Custom' }
    expect(toString(tagged)).toBe('[object Custom]')
    expect(getTag(tagged)).toBe('Custom')
  })

  it('does not throw when a tag cannot be inspected', () => {
    const throwingTag = Object.defineProperty({}, Symbol.toStringTag, {
      get() {
        throw new Error('tag should not escape')
      },
    })
    const revoked = Proxy.revocable({}, {})
    revoked.revoke()

    expect(toString(throwingTag)).toBe('[object Object]')
    expect(getTag(revoked.proxy)).toBe('Object')
  })
})
