import { describe, it, expect } from 'vitest'
import { isNumber, isString, isArray, isPlainObject, isDate } from '../../src/index.js'

describe('Real-world use cases', () => {
  it('should validate API response data', () => {
    const response = {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      created: new Date('2024-01-01'),
      tags: ['developer', 'typescript'],
      metadata: { active: true },
    }

    expect(isPlainObject(response)).toBe(true)
    expect(isNumber(response.id)).toBe(true)
    expect(isString(response.name)).toBe(true)
    expect(isString(response.email)).toBe(true)
    expect(isDate(response.created)).toBe(true)
    expect(isArray(response.tags)).toBe(true)
    expect(isPlainObject(response.metadata)).toBe(true)
  })

  it('should validate form inputs', () => {
    const formData = {
      age: '25',
      email: 'test@example.com',
      agreed: 'true',
    }

    // String inputs
    expect(isString(formData.age)).toBe(true)
    expect(isString(formData.email)).toBe(true)
    expect(isString(formData.agreed)).toBe(true)

    // Not coerced types
    expect(isNumber(formData.age)).toBe(false)
  })

  it('should handle mixed data types', () => {
    const data = [
      42,
      'hello',
      true,
      null,
      undefined,
      [],
      {},
      new Date(),
      /test/,
      () => {},
    ]

    expect(data.filter((item) => isNumber(item))).toEqual([42])
    expect(data.filter((item) => isString(item))).toEqual(['hello'])
  })
})
