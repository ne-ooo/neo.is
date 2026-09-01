/// <reference lib="esnext.float16" />

import { isFloat16Array } from '../../src/index.js'
import type { Float16ArrayValue, TypedArray } from '../../src/index.js'

declare const value: unknown

if (isFloat16Array(value)) {
  const float16: Float16Array = value
  void float16
}

const float16Value: Float16ArrayValue = new Float16Array(1)
const typedArray: TypedArray = float16Value
void typedArray
