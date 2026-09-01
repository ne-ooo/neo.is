import { isNumber } from '@lpm.dev/neo.is'
import { isPlainObject } from '@lpm.dev/neo.is/objects'

declare const value: unknown

if (isNumber(value)) {
  const number: number = value
  void number
}

void isPlainObject(value)
