---
name: migrate-from-micro-packages
description: Migration guide replacing 20+ micro-packages (is-number, is-string, is-plain-object, kind-of, is-promise, isarray, is-date-object, is-regex, is-map, is-set, is-error, is-nan, is-empty) with neo.is — is-number coercion difference, kind-of to getType, TypeScript type guards, tree-shaking, cross-realm safety
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---

# Migrating to @lpm.dev/neo.is from Micro-Packages

## Why Migrate

neo.is replaces 20+ fragmented type-checking packages with a single, tree-shakeable library:

- **1.65 KB gzipped** — smaller than most individual packages combined
- **TypeScript type guards** — every check narrows the type (micro-packages don't)
- **Tree-shakeable** — each check is ~50-100 bytes, import only what you use
- **Zero dependencies** — no transitive dependency chains
- **Cross-realm safe** — works across iframes, workers, VM contexts
- **2x faster** — 19.6M ops/sec vs is-number's 9.6M ops/sec

## Consolidating Imports

```typescript
// Before: 6+ packages, 6+ install targets, 6+ update vectors
import isNumber from 'is-number'
import isString from 'is-string'
import isPlainObject from 'is-plain-object'
import isArray from 'isarray'
import kindOf from 'kind-of'
import isPromise from 'is-promise'

// After: 1 package, tree-shaken to only what you use
import {
  isNumber, isString, isPlainObject,
  isArray, getType, isPromise
} from '@lpm.dev/neo.is'
```

## Complete Package Mapping

| Micro-package | neo.is equivalent | Behavior difference |
|---------------|-------------------|-------------------|
| `is-number` | `isNumber()` / `isNumeric()` | **See section below** — coercion is opt-in |
| `is-string` | `isString()` | Identical behavior |
| `isarray` / `is-array` | `isArray()` | Identical (both use `Array.isArray`) |
| `is-boolean` | `isBoolean()` | Identical behavior |
| `is-symbol` | `isSymbol()` | Identical behavior |
| `is-bigint` | `isBigInt()` | Identical behavior |
| `is-plain-object` | `isPlainObject()` | Identical (prototype chain check) |
| `is-object` | `isObject()` | Identical behavior |
| `is-function` | `isFunction()` | Identical behavior |
| `kind-of` | `getType()` | **See section below** — returns `TypeString` |
| `is-date-object` | `isDate()` | Identical (cross-realm safe) |
| `is-regex` | `isRegExp()` | Identical (cross-realm safe) |
| `is-map` | `isMap()` | Identical behavior |
| `is-set` | `isSet()` | Identical behavior |
| `is-promise` | `isPromise()` | Identical (thenable duck-typing) |
| `is-error` | `isError()` | Identical (includes DOMException) |
| `is-nan` | `isNaN()` | Identical (`Number.isNaN`) |
| `is-undefined` | `isUndefined()` | Identical behavior |
| `is-null` | `isNull()` | Identical behavior |
| `is-empty` | `isEmpty()` | Identical (arrays, strings, objects, Maps, Sets) |

## From is-number (Key Behavioral Difference)

**is-number coerces strings by default. neo.is does not.**

```typescript
// is-number (coerces strings)
import isNumber from 'is-number'
isNumber('42')      // true (implicit coercion)
isNumber('  42  ')  // true
isNumber('')        // false
isNumber(NaN)       // false
isNumber(Infinity)  // true ← note: is-number accepts Infinity

// neo.is — strict by default
import { isNumber } from '@lpm.dev/neo.is'
isNumber('42')      // false (no coercion)
isNumber(42)        // true
isNumber(NaN)       // false
isNumber(Infinity)  // false ← neo.is excludes Infinity

// neo.is — explicit coercion with isNumeric
import { isNumeric } from '@lpm.dev/neo.is'
isNumeric('42')     // true (explicit coercion)
isNumeric('  42  ') // true (trims whitespace)
isNumeric('')       // false
isNumeric(Infinity) // false
```

### Migration decision

| is-number usage | Replace with | Why |
|----------------|-------------|-----|
| Validating form input | `isNumeric()` | Strings need coercion |
| Checking API data types | `isNumber()` | JSON values are typed |
| Config file values | `isNumeric()` | Config values may be strings |
| Guarding math operations | `isNumber()` | Need actual number type |
| Quick search-and-replace | `isNumeric()` | Closest to is-number behavior |

### If you need Infinity to be valid

```typescript
// is-number accepts Infinity. neo.is isNumber does not.
// If you need Infinity to pass:
import { isFinite } from '@lpm.dev/neo.is'

// Option 1: use typeof (no NaN, yes Infinity)
typeof value === 'number' && !Number.isNaN(value)

// Option 2: isNumber covers most cases (finite only)
isNumber(value)  // true for all finite numbers
```

## From kind-of

```typescript
// kind-of
import kindOf from 'kind-of'
kindOf(42)              // 'number'
kindOf(null)            // 'null'
kindOf([])              // 'array'
kindOf(new Date())      // 'date'
kindOf(NaN)             // 'number' ← kind-of doesn't distinguish NaN!

// neo.is — getType()
import { getType } from '@lpm.dev/neo.is'
getType(42)             // 'number'
getType(null)            // 'null'
getType([])              // 'array'
getType(new Date())      // 'date'
getType(NaN)             // 'nan' ← neo.is distinguishes NaN!
getType(async () => {})  // 'asyncfunction'
getType(function*() {})  // 'generatorfunction'
```

### Key differences from kind-of

| Value | kind-of | getType() |
|-------|---------|-----------|
| `NaN` | `'number'` | `'nan'` |
| `async () => {}` | `'function'` | `'asyncfunction'` |
| `function*() {}` | `'generatorfunction'` | `'generatorfunction'` |
| `Promise.resolve()` | `'promise'` | `'promise'` |

`getType()` returns a `TypeString` union type — TypeScript knows all possible return values. kind-of returns `string` with no type narrowing.

### Replacing kind-of switch patterns

```typescript
// kind-of pattern
switch (kindOf(value)) {
  case 'string': /* ... */ break
  case 'number': /* ... */ break
  case 'array': /* ... */ break
}

// neo.is — prefer type guards for TypeScript narrowing
import { isString, isNumber, isArray } from '@lpm.dev/neo.is'

if (isString(value)) {
  // TypeScript knows: value is string
} else if (isNumber(value)) {
  // TypeScript knows: value is number
} else if (isArray(value)) {
  // TypeScript knows: value is unknown[]
}

// Or use getType() if you need the string label
const type = getType(value)  // TypeString union type
```

## TypeScript Type Guards (Major Upgrade)

The biggest advantage over micro-packages: **every neo.is check is a TypeScript type guard**.

```typescript
// Micro-packages: no type narrowing
import isNumber from 'is-number'
if (isNumber(value)) {
  value.toFixed(2)  // TypeScript error! value is still `unknown`
}

// neo.is: automatic type narrowing
import { isNumber } from '@lpm.dev/neo.is'
if (isNumber(value)) {
  value.toFixed(2)  // Works — TypeScript knows value is number
}
```

This works for all checks:

```typescript
import { isString, isArray, isPlainObject, isDate, isMap } from '@lpm.dev/neo.is'

function process(value: unknown) {
  if (isString(value)) {
    value.toUpperCase()        // string methods available
  }
  if (isArray<number>(value)) {
    value.reduce((a, b) => a + b) // number[] methods available
  }
  if (isPlainObject(value)) {
    Object.keys(value)          // Record<string, unknown> methods available
  }
  if (isDate(value)) {
    value.getFullYear()         // Date methods available
  }
  if (isMap<string, number>(value)) {
    value.get('key')            // Map<string, number> methods available
  }
}
```

## Subpath Imports

For maximum tree-shaking, use category subpaths:

```typescript
// Only what you need — each check is ~50-100 bytes
import { isNumber, isString } from '@lpm.dev/neo.is/primitives'
import { isPlainObject, isArray } from '@lpm.dev/neo.is/objects'
import { isFunction, isPromise } from '@lpm.dev/neo.is/functions'
import { isEmpty } from '@lpm.dev/neo.is/collections'
```

## Checklist

- [ ] Replace individual `is-*` package imports with `@lpm.dev/neo.is`
- [ ] Replace `is-number` — use `isNumber()` (strict) or `isNumeric()` (coercion)
- [ ] Replace `kind-of` with `getType()` — note NaN is `'nan'` not `'number'`
- [ ] Remove `@types/is-*` packages — neo.is has built-in types
- [ ] Leverage TypeScript narrowing — remove manual type casts after checks
- [ ] Remove all replaced packages from dependencies
- [ ] Consider subpath imports for maximum tree-shaking
