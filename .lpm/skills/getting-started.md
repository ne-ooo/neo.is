---
name: getting-started
description: How to use neo.is — 46+ type guards with TypeScript narrowing organized by category (primitives, objects, functions, collections, typed arrays, number validators), utilities (getType, getTag, createTypeGuard), subpath imports for tree-shaking, cross-realm safety, neo.is vs Zod positioning
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---

# Getting Started with @lpm.dev/neo.is

## Overview

neo.is is a comprehensive type-checking library. 1.65 KB gzipped, 46+ type guards with TypeScript narrowing, zero dependencies, tree-shakeable, cross-realm safe. Replaces 20+ micro-packages (is-number, is-string, kind-of, is-plain-object, etc.) with a single import.

## Quick Start

```typescript
import { isNumber, isString, isPlainObject, isArray, isEmpty } from '@lpm.dev/neo.is'

function processInput(data: unknown) {
  if (isNumber(data)) {
    // TypeScript knows: data is number
    return data * 2
  }
  if (isString(data)) {
    // TypeScript knows: data is string
    return data.toUpperCase()
  }
  if (isPlainObject(data)) {
    // TypeScript knows: data is Record<string, unknown>
    return Object.keys(data)
  }
}
```

Every function is a TypeScript type guard — after the check, the compiler narrows the type automatically.

## Primitives

```typescript
import {
  isNumber,      // Finite numbers only (excludes NaN, Infinity)
  isNaN,         // NaN detection (Number.isNaN)
  isFinite,      // Finite number check
  isInteger,     // Integer check
  isSafeInteger, // Between MIN/MAX_SAFE_INTEGER
  isNumeric,     // Number OR numeric string (with coercion)
  isString,      // String check
  isBoolean,     // Boolean check
  isSymbol,      // Symbol check
  isBigInt,      // BigInt check
  isNull,        // null check
  isUndefined,   // undefined check
  isNil,         // null OR undefined
} from '@lpm.dev/neo.is'

isNumber(42)        // true — narrows to `number`
isNumber(NaN)       // false (NaN excluded)
isNumber(Infinity)  // false (Infinity excluded)
isNumber('42')      // false (no string coercion)

isNumeric('42')     // true (explicit coercion)
isNumeric('  42  ') // true (trims whitespace)
isNumeric('')       // false (empty string rejected)

isNil(null)         // true
isNil(undefined)    // true
isNil(0)            // false
```

### isNumber vs isNumeric

| Scenario | Use | Why |
|----------|-----|-----|
| API response fields | `isNumber()` | JSON numbers are `number` type |
| Form input / query params | `isNumeric()` | Values are always strings |
| TypeScript narrowing | `isNumber()` | Only `isNumber` narrows to `number` |
| Math operations | `isNumber()` | Need an actual number |
| CSV/config parsing | `isNumeric()` | Values may be strings |

`isNumber()` returns `value is number` (type guard). `isNumeric()` returns `boolean` (can't narrow — value might be string or number).

## Objects

```typescript
import {
  isArray,       // Array check (cross-realm safe via Array.isArray)
  isObject,      // Any object (including arrays, excluding null)
  isPlainObject, // Plain objects only ({}, Object.create(null))
  isDate,        // Date check
  isRegExp,      // RegExp check
  isError,       // Error check (includes DOMException)
  isMap,         // Map check
  isSet,         // Set check
  isWeakMap,     // WeakMap check
  isWeakSet,     // WeakSet check
} from '@lpm.dev/neo.is'

isPlainObject({})                  // true
isPlainObject(Object.create(null)) // true (null prototype ok)
isPlainObject(new Date())          // false (not plain)
isPlainObject([])                  // false (array, not plain object)

isObject([])                       // true (arrays are objects)
isObject(null)                     // false
```

### Generics

```typescript
isArray<number>(value)              // narrows to number[]
isMap<string, number>(value)        // narrows to Map<string, number>
isSet<string>(value)                // narrows to Set<string>
isPlainObject<{ id: number }>(value) // narrows to { id: number }
```

## Functions

```typescript
import {
  isFunction,          // Any function (includes async, generators, classes)
  isAsyncFunction,     // Async functions only
  isGeneratorFunction, // Generator function definition
  isGenerator,         // Generator instance (result of calling generator fn)
  isPromise,           // Promise or thenable (duck-typed)
} from '@lpm.dev/neo.is'

isFunction(() => {})           // true
isFunction(async () => {})     // true (async is still a function)
isAsyncFunction(async () => {})// true
isPromise(Promise.resolve())   // true
isPromise({ then: () => {} })  // true (thenable — duck-typed!)
```

## Collections

```typescript
import {
  isEmpty,     // Works on arrays, strings, objects, Maps, Sets, null, undefined
  isIterable,  // Has Symbol.iterator
  isArrayLike, // Has numeric .length property
} from '@lpm.dev/neo.is'

isEmpty([])           // true
isEmpty({})           // true
isEmpty('')           // true
isEmpty(new Map())    // true
isEmpty(null)         // true
isEmpty(undefined)    // true
isEmpty([0])          // false
isEmpty(' ')          // false (not empty — has a space)

isIterable([])        // true
isIterable('hello')   // true (strings are iterable)
isIterable(new Map()) // true

isArrayLike([])           // true
isArrayLike('hello')      // true (strings have .length)
isArrayLike({ length: 5 })// true
```

## Typed Arrays

```typescript
import {
  isTypedArray,       // Any typed array
  isInt8Array, isUint8Array, isUint8ClampedArray,
  isInt16Array, isUint16Array,
  isInt32Array, isUint32Array,
  isFloat32Array, isFloat64Array,
  isBigInt64Array, isBigUint64Array,
} from '@lpm.dev/neo.is'

isTypedArray(new Uint8Array())  // true
isFloat64Array(new Float64Array()) // true
```

## Number Validators

```typescript
import { isPositive, isNegative, isZero } from '@lpm.dev/neo.is'

isPositive(42)  // true
isPositive(0)   // false (not > 0)
isNegative(-1)  // true
isZero(0)       // true
isZero(-0)      // true
```

## Utilities

### `getType()` — Type Detection (replaces kind-of)

```typescript
import { getType } from '@lpm.dev/neo.is'

getType(42)              // 'number'
getType(NaN)             // 'nan'
getType('hello')         // 'string'
getType([])              // 'array'
getType({})              // 'object'
getType(null)            // 'null'
getType(undefined)       // 'undefined'
getType(new Date())      // 'date'
getType(/regex/)         // 'regexp'
getType(new Map())       // 'map'
getType(Promise.resolve()) // 'promise'
getType(async () => {})  // 'asyncfunction'
```

Returns a `TypeString` union type — all possible values are typed.

### `getTag()` — Raw Object Tag

```typescript
import { getTag } from '@lpm.dev/neo.is'

getTag([])           // 'Array'
getTag(new Date())   // 'Date'
getTag(null)         // 'Null'
```

### `createTypeGuard()` — Custom Type Guards

```typescript
import { createTypeGuard, isPlainObject, isString, isNumber } from '@lpm.dev/neo.is'

interface User {
  name: string
  age: number
}

const isUser = createTypeGuard<User>(
  (v): v is User =>
    isPlainObject(v) &&
    isString((v as any).name) &&
    isNumber((v as any).age)
)

function handle(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows: data is User
    console.log(data.name, data.age)
  }
}
```

## Subpath Imports (Tree-Shaking)

Import by category for minimal bundles:

```typescript
// Only primitive checks (~200 bytes)
import { isNumber, isString } from '@lpm.dev/neo.is/primitives'

// Only object checks
import { isPlainObject, isArray } from '@lpm.dev/neo.is/objects'

// Only function checks
import { isFunction, isPromise } from '@lpm.dev/neo.is/functions'

// Only collection checks
import { isEmpty, isIterable } from '@lpm.dev/neo.is/collections'

// Only number validators
import { isPositive, isNegative } from '@lpm.dev/neo.is/numbers'

// Or import everything from the main entry
import { isNumber, isString, isPlainObject } from '@lpm.dev/neo.is'
```

Each check is ~50-100 bytes when tree-shaken.

## Cross-Realm Safety

All checks work across iframes, Web Workers, and VM contexts. neo.is uses `Object.prototype.toString.call()` and `Array.isArray()` instead of `instanceof`, which breaks across realms:

```typescript
// instanceof fails across realms
iframeArray instanceof Array  // false!

// neo.is works correctly
isArray(iframeArray)          // true
```

## neo.is vs Zod

neo.is and Zod are **complementary**, not competing:

- **neo.is** — fast type detection: "Is this a number?" (1.65 KB, 19M+ ops/sec)
- **Zod** — schema validation: "Does this match my shape with constraints?" (~60 KB)

Use neo.is for guard clauses, type narrowing, and input triage. Use Zod for structured validation with error messages, constraints, and transforms.

```typescript
import { isPlainObject } from '@lpm.dev/neo.is'

function validateResponse(data: unknown) {
  // Fast type check first (< 1μs)
  if (!isPlainObject(data)) {
    throw new Error('Expected object')
  }
  // Full schema validation only if basic type is correct
  return userSchema.parse(data)
}
```

## TypeScript Types

```typescript
import type {
  TypeGuard,   // (value: unknown) => value is T
  TypeString,  // Union of all possible getType() return values
  TypedArray,  // Union of all typed array types
} from '@lpm.dev/neo.is'
```
