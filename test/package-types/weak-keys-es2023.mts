/// <reference lib="es2023.collection" />

import { isWeakMap, isWeakSet } from '@lpm.dev/neo.is'

declare const value: unknown

if (isWeakMap(value)) {
  const weakMap: WeakMap<object | symbol, unknown> = value
  weakMap.has(Symbol.for('registered symbols are invalid at runtime'))
}

if (isWeakSet(value)) {
  const weakSet: WeakSet<object | symbol> = value
  weakSet.has(Symbol('valid non-registered symbol'))
}
