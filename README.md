# @lpm.dev/neo.is

`@lpm.dev/neo.is` provides type predicates and TypeScript type guards for
JavaScript values.

## Features

- **Type predicates:** Checks primitives, objects, functions, collections, typed
  arrays, and number properties.
- **TypeScript support:** Predicates narrow values to the types that their
  runtime checks prove.
- **Cross-realm checks:** Built-in object predicates use intrinsic brand checks
  where the runtime supports them.
- **Entry points:** Provides the complete API and functional category imports.
- **Dependency surface:** The package has no runtime dependencies.

## Install

Install the package with LPM:

```bash
lpm install @lpm.dev/neo.is
```

## Quick start

```typescript
import {
  isArray,
  isNumber,
  isNumeric,
  isPlainObject,
  isString,
} from "@lpm.dev/neo.is";

isNumber(42); // true
isNumber("42"); // false
isNumeric("42"); // true
isString("hello"); // true
isArray([1, 2, 3]); // true
isPlainObject({ name: "Ada" }); // true
```

## API

All predicates accept `unknown`. Each predicate returns a boolean or a
TypeScript type-predicate result.

### Primitive predicates

| Export                 | True for                                                   |
| ---------------------- | ---------------------------------------------------------- |
| `isNumber(value)`      | Finite numbers. This excludes `NaN` and infinities.        |
| `isNaN(value)`         | The numeric `NaN` value.                                   |
| `isFinite(value)`      | Finite numbers without string coercion.                    |
| `isInteger(value)`     | Integers.                                                  |
| `isSafeInteger(value)` | Safe integers.                                             |
| `isString(value)`      | Primitive strings.                                         |
| `isNumeric(value)`     | Finite numbers and strings that convert to finite numbers. |
| `isBoolean(value)`     | Primitive booleans.                                        |
| `isSymbol(value)`      | Symbols.                                                   |
| `isBigInt(value)`      | Big integers.                                              |
| `isNull(value)`        | `null`.                                                    |
| `isUndefined(value)`   | `undefined`.                                               |
| `isNil(value)`         | `null` or `undefined`.                                     |

```typescript
import {
  isBigInt,
  isBoolean,
  isFinite,
  isInteger,
  isNaN,
  isNil,
  isNumber,
  isNumeric,
  isSafeInteger,
  isString,
  isSymbol,
} from "@lpm.dev/neo.is";

isNumber(Infinity); // false
isNaN(NaN); // true
isFinite(42); // true
isInteger(42); // true
isSafeInteger(Number.MAX_SAFE_INTEGER); // true
isNumeric(" 42 "); // true
isString(""); // true
isBoolean(true); // true
isSymbol(Symbol("id")); // true
isBigInt(42n); // true
isNil(null); // true
```

### Object predicates

| Export                 | True for                                                              |
| ---------------------- | --------------------------------------------------------------------- |
| `isArray(value)`       | Arrays.                                                               |
| `isObject(value)`      | Non-null objects, including arrays.                                   |
| `isPlainObject(value)` | Objects with `Object.prototype` or `null` as their current prototype. |
| `isDate(value)`        | Date objects.                                                         |
| `isRegExp(value)`      | Regular expression objects.                                           |
| `isError(value)`       | Error objects that pass the runtime brand check.                      |
| `isMap(value)`         | Map objects.                                                          |
| `isSet(value)`         | Set objects.                                                          |
| `isWeakMap(value)`     | WeakMap objects.                                                      |
| `isWeakSet(value)`     | WeakSet objects.                                                      |

```typescript
import {
  isArray,
  isDate,
  isError,
  isMap,
  isObject,
  isPlainObject,
  isRegExp,
  isSet,
  isWeakMap,
  isWeakSet,
} from "@lpm.dev/neo.is";

isArray([]); // true
isObject([]); // true
isPlainObject(Object.create(null)); // true
isDate(new Date()); // true
isRegExp(/test/); // true
isError(new Error("failed")); // true
isMap(new Map()); // true
isSet(new Set()); // true
isWeakMap(new WeakMap()); // true
isWeakSet(new WeakSet()); // true
```

### Function predicates

| Export                       | True for                |
| ---------------------------- | ----------------------- |
| `isFunction(value)`          | Functions.              |
| `isAsyncFunction(value)`     | Async functions.        |
| `isGeneratorFunction(value)` | Generator functions.    |
| `isGenerator(value)`         | Generator objects.      |
| `isPromise(value)`           | Promises and thenables. |

```typescript
import {
  isAsyncFunction,
  isFunction,
  isGenerator,
  isGeneratorFunction,
  isPromise,
} from "@lpm.dev/neo.is";

function* values() {
  yield 1;
}

isFunction(() => undefined); // true
isAsyncFunction(async () => undefined); // true
isGeneratorFunction(values); // true
isGenerator(values()); // true
isPromise({ then: () => undefined }); // true
```

### Collection predicates

| Export               | True for                                                                  |
| -------------------- | ------------------------------------------------------------------------- |
| `isEmpty(value)`     | Empty arrays, plain objects, strings, maps, sets, `null`, or `undefined`. |
| `isIterable(value)`  | Values with a callable iterator.                                          |
| `isArrayLike(value)` | Strings or values with a nonnegative safe-integer `length`.               |

```typescript
import { isArrayLike, isEmpty, isIterable } from "@lpm.dev/neo.is";

isEmpty({}); // true
isEmpty(new Map()); // true
isIterable(new Set()); // true
isArrayLike({ length: 0 }); // true
```

### Typed-array predicates

`isTypedArray()` accepts all supported typed arrays. The specific predicates
check one typed-array kind.

```typescript
import {
  isBigInt64Array,
  isBigUint64Array,
  isFloat16Array,
  isFloat32Array,
  isFloat64Array,
  isInt16Array,
  isInt32Array,
  isInt8Array,
  isTypedArray,
  isUint16Array,
  isUint32Array,
  isUint8Array,
  isUint8ClampedArray,
} from "@lpm.dev/neo.is";

isTypedArray(new Int8Array()); // true
isUint8Array(new Uint8Array()); // true
isFloat32Array(new Float32Array()); // true

const Float16 = (globalThis as typeof globalThis & {
  Float16Array?: new (length?: number) => unknown;
}).Float16Array;

if (Float16 !== undefined) {
  isFloat16Array(new Float16()); // true
}
```

`isFloat16Array()` returns `false` in runtimes that do not provide
`Float16Array`.

### Number predicates

```typescript
import { isNegative, isPositive, isZero } from "@lpm.dev/neo.is";

isPositive(42); // true
isNegative(-42); // true
isZero(-0); // true
```

### Type utilities

`getType()` returns a lowercase type name. `createTypeGuard()` preserves the
type of a custom guard function.

```typescript
import {
  createTypeGuard,
  getTag,
  getType,
  isNumber,
  toString,
} from "@lpm.dev/neo.is";

getType(new Date()); // "date"
getType(NaN); // "nan"
toString([]); // "[object Array]"
getTag([]); // "Array"

const isPositiveNumber = createTypeGuard<number>(
  (value): value is number => isNumber(value) && value > 0,
);

isPositiveNumber(42); // true
```

## Behavior and limits

- `isPlainObject()` checks the current prototype. Replacing a value's prototype
  can change the result.
- `isPromise()` accepts thenables. It does not wait for them or inspect their
  resolved values.
- Type guards do not check collection contents or object property shapes.
- `toString()` and `getTag()` are descriptive. A custom `Symbol.toStringTag` can
  change their results.
- `getType()` can classify an object from structural contracts and supported
  intrinsic brands.

## Security

Use a dedicated predicate for validation. Do not use `toString()` or `getTag()`
as a security boundary.

When the runtime provides a native Error brand check, `isError()` uses it. Older
browsers use `structuredClone()` to reject forged Errors.

If an Error has a non-cloneable `cause`, the fallback returns `false`. If the
runtime cannot inspect the value, it returns `false`.

Browser runtimes can compile an expression to distinguish parenthesized async
arrows from methods named `async`. If CSP blocks compilation, the check returns
`false`.

## TypeScript type guards

Predicates narrow values only to types that the runtime checks prove.

```typescript
import { isArray, isNumber, isPlainObject } from "@lpm.dev/neo.is";

function processValue(value: unknown): void {
  if (isNumber(value)) {
    console.log(value.toFixed(2));
  }

  if (isArray(value)) {
    console.log(value.length);
  }

  if (isPlainObject(value)) {
    console.log(Object.keys(value));
  }
}
```

The array elements and object property values remain `unknown` until the
application checks them.

## Cross-realm behavior

Built-in predicates do not depend only on local `instanceof` checks.

```typescript
const iframeArray = iframe.contentWindow.Array.of(1, 2, 3);

iframeArray instanceof Array; // false
isArray(iframeArray); // true
```

## Migration from `is-number`

`isNumber()` does not coerce strings. When the application accepts numeric
strings, use `isNumeric()`.

```diff
- import isNumber from "is-number";
+ import { isNumeric as isNumber } from "@lpm.dev/neo.is";
```

Run the application tests after the migration.

## Migration from `kind-of`

Use `getType()` for a descriptive type string. When TypeScript narrowing is
necessary, use a predicate.

```diff
- import kindOf from "kind-of";
- const type = kindOf(value);
+ import { getType } from "@lpm.dev/neo.is";
+ const type = getType(value);
```

Run the application tests after the migration.

## Performance

The repository contains reproducible benchmarks for common predicates and
package comparisons.

See [BENCHMARKS.md](./BENCHMARKS.md) for the environment, method, results, and
limits.

Run the benchmark suite:

```bash
lpm run bench
```

Benchmark results depend on the runtime, computer, predicate, and input data.

## Runtime support

- **Node.js:** 18 or later
- **Browsers:** The latest two Chrome, Firefox, Safari, and Edge versions
- **Other runtimes:** Deno and Bun
- **Module formats:** ESM and CommonJS
- **TypeScript:** Strict type guards and declaration files

Some predicates depend on runtime features. For example, `isFloat16Array()`
requires native `Float16Array` support.

## Package entry points

| Import                        | Purpose                |
| ----------------------------- | ---------------------- |
| `@lpm.dev/neo.is`             | Complete public API.   |
| `@lpm.dev/neo.is/primitives`  | Primitive predicates.  |
| `@lpm.dev/neo.is/objects`     | Object predicates.     |
| `@lpm.dev/neo.is/functions`   | Function predicates.   |
| `@lpm.dev/neo.is/collections` | Collection predicates. |
| `@lpm.dev/neo.is/numbers`     | Number predicates.     |

## License

MIT. See [LICENSE](./LICENSE).
