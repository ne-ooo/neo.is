# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - 2026-03-09

### Added

- **Primitives** — `isNumber()`, `isNaN()`, `isFinite()`, `isInteger()`, `isSafeInteger()`, `isString()`, `isNumeric()`, `isBoolean()`, `isSymbol()`, `isBigInt()`, `isNull()`, `isUndefined()`, `isNil()`
- **Objects** — `isArray()`, `isObject()`, `isPlainObject()`, `isDate()`, `isRegExp()`, `isError()`, `isMap()`, `isSet()`, `isWeakMap()`, `isWeakSet()`
- **Functions** — `isFunction()`, `isAsyncFunction()`, `isGeneratorFunction()`, `isGenerator()`, `isPromise()`
- **Collections** — `isEmpty()`, `isIterable()`, `isArrayLike()`
- **Typed Arrays** — `isTypedArray()`, `isInt8Array()`, `isUint8Array()`, `isUint8ClampedArray()`, `isInt16Array()`, `isUint16Array()`, `isInt32Array()`, `isUint32Array()`, `isFloat32Array()`, `isFloat64Array()`, `isBigInt64Array()`, `isBigUint64Array()`
- **Number validators** — `isPositive()`, `isNegative()`, `isZero()`
- **Utilities** — `toString()`, `getTag()`, `getType()`, `createTypeGuard()`
- Sub-path exports: `/primitives`, `/objects`, `/functions`, `/collections`, `/numbers`
- All functions are TypeScript type guards with proper narrowing
- Cross-realm support (works across iframes and VM contexts)
- Zero runtime dependencies
- ESM + CJS dual output with full TypeScript declaration files
- 120 tests across all checkers
