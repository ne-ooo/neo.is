import { isFloat16Array, isNumber } from '@lpm.dev/neo.is'
import type { Float16ArrayValue } from '@lpm.dev/neo.is'
import { isPlainObject } from '@lpm.dev/neo.is/objects'

declare const value: unknown

if (isNumber(value)) {
  const number: number = value
  void number
}

void isPlainObject(value)

if (isFloat16Array(value)) {
  const float16: Float16ArrayValue = value
  const first: number | undefined = float16[0]
  const length: number = float16.length
  void first
  void length
}
