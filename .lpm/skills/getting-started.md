---
name: getting-started
description: How to use neo.is — 46 type guards with TypeScript narrowing, utility functions, subpath imports, cross-realm safety, and neo.is vs Zod positioning
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---

# Getting Started with @lpm.dev/neo.is

## Overview

neo.is contains 46 type guards and a small set of utility functions. The package has zero runtime dependencies and supports tree-shaking.

The package also supports values from other JavaScript realms. The complete package is approximately 3.5 KB after gzip compression.

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

The 46 type guards narrow checked values. `isEmpty()` and the utility functions do not narrow values.

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
| TypeScript narrowing | `isNumber()` | It narrows the value to `number` |
| Math operations | `isNumber()` | Need an actual number |
| CSV/config parsing | `isNumeric()` | Values may be strings |

`isNumber()` narrows a value to `number`. `isNumeric()` narrows a value to `number | string`.

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

`isError()` uses a native Error brand check when the runtime provides one.
Older browsers use `structuredClone()`. This fallback returns `false` when an
Error has a non-cloneable `cause` value.

Browser runtimes compile an expression to distinguish parenthesized async
arrows from methods named `async`. The check returns `false` if CSP blocks the
compilation and no native function-kind check is available.

### Sound Collection Narrowing

```typescript
if (isArray(value) && value.every(isNumber)) {
  // value is number[] only after every element is checked
  value.reduce((sum, item) => sum + item, 0)
}
```

`isArray`, `isMap`, `isSet`, and `isPlainObject` do not accept caller-selected
generic types. They narrow contents and properties to `unknown` because a brand
check cannot validate those values.

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
isPromise({ then: () => {} })  // true (thenable — narrows to Thenable)
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

`getType()` uses current prototype and tag hints. An unrelated replacement
prototype can hide a built-in. Use a dedicated predicate after prototype mutation.

### `getTag()` — Raw Object Tag

```typescript
import { getTag } from '@lpm.dev/neo.is'

getTag([])           // 'Array'
getTag(new Date())   // 'Date'
getTag(null)         // 'Null'
```

`getTag()` is descriptive only. A custom `Symbol.toStringTag` can change its
result. Use `getType()` or a dedicated predicate for untrusted values.

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

Primitive checks are approximately 70 bytes when tree-shaken. Complex checks include only the intrinsic brand logic that they use.

## Cross-Realm Safety

Built-in checks work across iframes, Web Workers, and VM contexts. neo.is uses
realm-independent intrinsic brand checks and `Array.isArray()` instead of
realm-local `instanceof` checks:

```typescript
// instanceof fails across realms
iframeArray instanceof Array  // false!

// neo.is works correctly
isArray(iframeArray)          // true
```

## neo.is vs Zod

neo.is and Zod are **complementary**, not competing:

- **neo.is** — fast type detection: "Is this a number?" (~3.5 KB)
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
