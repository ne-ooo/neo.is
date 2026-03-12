---
name: anti-patterns
description: Common mistakes when using neo.is — isNumber excludes NaN and Infinity, isNumber vs isNumeric on form input (no coercion vs coercion), isPromise matches thenables not just Promise, isPlainObject rejects class instances, isEmpty treats null/undefined as empty, isArrayLike matches strings, isZero matches negative zero, isObject includes arrays, isNumeric is not a type guard
version: "1.0.0"
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---

# Anti-Patterns for @lpm.dev/neo.is

### [CRITICAL] `isNumber` excludes NaN and Infinity — by design

Wrong:

```typescript
// AI expects isNumber to behave like typeof === 'number'
isNumber(NaN)       // false — NaN is excluded!
isNumber(Infinity)  // false — Infinity is excluded!
isNumber(-Infinity) // false

// Using isNumber to check "is this the number type"
if (!isNumber(value)) {
  throw new Error('Expected a number')
}
// Throws for NaN and Infinity — may not be intended
```

Correct:

```typescript
// isNumber means "is this a finite, usable number"
isNumber(42)        // true
isNumber(0)         // true
isNumber(-3.14)     // true

// To check for the number type including NaN/Infinity:
typeof value === 'number'

// To specifically detect NaN or Infinity:
import { isNaN, isFinite } from '@lpm.dev/neo.is'
isNaN(NaN)          // true
isFinite(42)        // true (excludes NaN and Infinity)
isFinite(Infinity)  // false
```

`isNumber` uses the trick `value - value === 0` which is false for NaN (`NaN - NaN = NaN`) and Infinity (`Infinity - Infinity = NaN`). This is intentional — NaN and Infinity are rarely "usable" numbers. Use `isNaN()` or `isFinite()` when you need to detect these specifically.

Source: `src/primitives/number.ts` — `value - value === 0`

### [CRITICAL] `isNumber` vs `isNumeric` — wrong one on form input

Wrong:

```typescript
// AI uses isNumber on string input — always false
const ageInput = document.getElementById('age').value  // always string
if (isNumber(ageInput)) {
  // Never reached! Form values are strings
}

const queryParam = new URLSearchParams(search).get('page')  // string | null
if (isNumber(queryParam)) {
  // Never reached for '3' — it's a string
}
```

Correct:

```typescript
// Use isNumeric for string input (explicit coercion)
import { isNumeric } from '@lpm.dev/neo.is'

const ageInput = document.getElementById('age').value
if (isNumeric(ageInput)) {
  const age = Number(ageInput)  // safe to convert
}

// Use isNumber for already-typed data (API responses, DB values)
import { isNumber } from '@lpm.dev/neo.is'

const apiResponse = await fetch('/data').then(r => r.json())
if (isNumber(apiResponse.count)) {
  // TypeScript narrows to number
  console.log(apiResponse.count * 2)
}
```

`isNumber()` returns `value is number` (type guard, no coercion). `isNumeric()` returns `boolean` (coerces strings, trims whitespace). Use `isNumber` for typed data, `isNumeric` for string input.

Source: `src/primitives/number.ts` (isNumber), `src/primitives/string.ts` (isNumeric)

### [HIGH] `isPromise` matches thenables — not just `Promise` instances

Wrong:

```typescript
// AI assumes isPromise only matches actual Promise objects
const thenable = { then: () => {} }
isPromise(thenable)  // true! Duck-typed

// This can cause unexpected behavior:
if (isPromise(value)) {
  const result = await value  // May not behave like a real Promise
}
```

Correct:

```typescript
// isPromise checks for .then method (duck-typing)
isPromise(Promise.resolve())    // true — real Promise
isPromise({ then: () => {} })   // true — thenable
isPromise(async () => {})       // false — async function, not a promise

// If you need to check for actual Promise instances:
value instanceof Promise        // strict, but not cross-realm safe

// For safe "is this awaitable":
if (isPromise(value)) {
  const result = await Promise.resolve(value)  // Wrap in Promise.resolve for safety
}
```

`isPromise` uses duck-typing: it checks if the value is an object with a `.then` method. This matches the Promises/A+ spec where any thenable is interoperable with Promise. If you need strict Promise-only detection, use `instanceof Promise` (but this breaks across realms).

Source: `src/functions/promise.ts` — checks for `.then` method

### [HIGH] `isPlainObject` rejects class instances

Wrong:

```typescript
// AI expects class instances to be "plain objects"
class User {
  constructor(public name: string) {}
}

isPlainObject(new User('Alice'))  // false!
// User prototype !== Object.prototype

class Config {}
isPlainObject(new Config())       // false!
```

Correct:

```typescript
// isPlainObject only accepts {} and Object.create(null)
isPlainObject({})                  // true
isPlainObject({ a: 1, b: 2 })     // true
isPlainObject(Object.create(null)) // true (null prototype)
isPlainObject(new Object())       // true

// For "is this any object", use isObject
import { isObject } from '@lpm.dev/neo.is'
isObject(new User('Alice'))        // true
isObject([])                       // true
isObject(new Date())               // true

// For class instance detection, use instanceof
value instanceof User              // true for User instances
```

`isPlainObject` checks the prototype chain: the prototype must be either `null` or `Object.prototype`. Class instances, arrays, dates, and other built-in objects have different prototypes and return false.

Source: `src/objects/plain-object.ts` — `Object.getPrototypeOf(value)` check

### [HIGH] `isEmpty` treats `null` and `undefined` as empty

Wrong:

```typescript
// AI uses isEmpty to validate required fields
function processItems(items: unknown) {
  if (isEmpty(items)) {
    return 'No items'
  }
  // items could be null or undefined here — not just empty array!
}

isEmpty(null)      // true
isEmpty(undefined) // true
isEmpty(0)         // false! (0 is not "empty")
isEmpty(false)     // false! (false is not "empty")
```

Correct:

```typescript
// isEmpty works on collections: arrays, strings, objects, Maps, Sets
isEmpty([])           // true
isEmpty({})           // true
isEmpty('')           // true
isEmpty(new Map())    // true
isEmpty(new Set())    // true

// null/undefined are "empty" by convention
isEmpty(null)         // true
isEmpty(undefined)    // true

// To distinguish "missing" from "empty collection":
import { isNil } from '@lpm.dev/neo.is'

if (isNil(items)) {
  return 'Items not provided'
}
if (isEmpty(items)) {
  return 'Items provided but empty'
}
```

`isEmpty` returns true for null, undefined, empty arrays, empty strings, empty objects (no own keys), empty Maps, and empty Sets. It returns false for numbers, booleans, and non-empty collections. If you need to distinguish "not provided" from "provided but empty", check with `isNil` first.

Source: `src/collections/empty.ts` — handles multiple types

### [MEDIUM] `isArrayLike` matches strings

Wrong:

```typescript
// AI uses isArrayLike to filter for array-like collections
const items = ['hello', [1, 2], { length: 3 }]
const arrayLikes = items.filter(isArrayLike)
// Returns all three! Strings have .length

// Processing as numeric array-like
function sum(items: unknown) {
  if (isArrayLike(items)) {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      total += items[i]  // Fails for strings — items[0] is a character
    }
  }
}
```

Correct:

```typescript
// isArrayLike checks for numeric .length — includes strings
isArrayLike([1, 2, 3])       // true
isArrayLike('hello')          // true (strings have .length)
isArrayLike({ length: 5 })   // true
isArrayLike({ length: -1 })  // false (negative)
isArrayLike({ length: 3.5 }) // false (not safe integer)
isArrayLike({})               // false (no .length)

// To exclude strings:
if (isArrayLike(value) && !isString(value)) {
  // Numeric array-like, not a string
}

// Or use isArray for strict array check:
if (isArray(value)) {
  // Definitely an array
}
```

`isArrayLike` checks for a non-negative safe integer `.length` property. Strings satisfy this because they have `.length`. If you want array-like objects without strings, combine with `!isString()`.

Source: `src/collections/array-like.ts` — checks `.length` property

### [MEDIUM] `isObject` includes arrays — use `isPlainObject` for plain objects

Wrong:

```typescript
// AI uses isObject expecting only key-value objects
if (isObject(value)) {
  // value could be an array, Date, RegExp, Map, Set, Error...
  const keys = Object.keys(value)  // Works but misleading intent
}
```

Correct:

```typescript
// isObject = any non-null object (broad)
isObject({})           // true
isObject([])           // true — arrays are objects!
isObject(new Date())   // true
isObject(new Map())    // true
isObject(null)         // false (null excluded)

// isPlainObject = only {} and Object.create(null) (narrow)
isPlainObject({})          // true
isPlainObject([])          // false
isPlainObject(new Date())  // false

// Choose based on intent:
// "Is this any object type?" → isObject
// "Is this a plain key-value object?" → isPlainObject
```

Source: `src/objects/object.ts` (isObject), `src/objects/plain-object.ts` (isPlainObject)

### [MEDIUM] `isZero` matches negative zero (`-0`)

Wrong:

```typescript
// AI expects isZero to only match +0
isZero(-0)   // true!
isZero(0)    // true

// Negative zero can cause subtle bugs in some math
const direction = isZero(value) ? 'neutral' : value > 0 ? 'up' : 'down'
// -0 is treated as 'neutral' even though it came from a negative direction
```

Correct:

```typescript
// isZero treats 0 and -0 as zero (standard equality)
isZero(0)    // true
isZero(-0)   // true

// Related validators:
isPositive(0)   // false (not > 0)
isNegative(-0)  // false (not < 0)

// To distinguish -0 from +0 (rare):
Object.is(value, -0)   // true only for -0
Object.is(value, 0)    // true only for +0
```

JavaScript's `===` operator treats `0` and `-0` as equal, and `isZero` follows this convention. In the rare case you need to distinguish signed zeros, use `Object.is()`.

Source: `src/numbers/validators.ts` — uses equality check

### [MEDIUM] `isNumeric` is NOT a TypeScript type guard

Wrong:

```typescript
// AI expects isNumeric to narrow the type
function double(value: unknown) {
  if (isNumeric(value)) {
    return value * 2  // TypeScript error! value is still `unknown`
  }
}
```

Correct:

```typescript
// isNumeric returns boolean — value could be string or number
function double(value: unknown) {
  if (isNumeric(value)) {
    return Number(value) * 2  // Explicitly convert
  }
}

// isNumber IS a type guard — narrows to number
function double(value: unknown) {
  if (isNumber(value)) {
    return value * 2  // Works — TypeScript knows value is number
  }
}
```

`isNumeric()` can't be a type guard because the value might be either a `string` (`'42'`) or a `number` (`42`) — TypeScript can't narrow to a single type. `isNumber()` returns `value is number` and narrows correctly.

Source: `src/primitives/string.ts` — `isNumeric` return type is `boolean`, not `value is number`
