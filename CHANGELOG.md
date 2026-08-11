# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed

- Added a same-realm prototype fast path to `isPlainObject()` while preserving cross-realm validation.
- Added validated prototype and object-tag hints to `getType()` before its full intrinsic fallback.
- Added an `ArrayBuffer.isView()` prefilter and switch-based typed-array dispatch.
- Removed exception-driven Map/Set selection from `isEmpty()`; the Set path improved from 0.26M to 25.16M ops/s in the local benchmark.
- Added benchmark coverage for branded collections, typed arrays, and collection emptiness.

### Fixed

- Made `getType()` return only `TypeString` values for custom `Symbol.toStringTag` objects.
- Classified `Infinity` as `number` and generator instances as `generator`.
- Replaced spoofable string-tag checks with cross-realm intrinsic brand checks.
- Made `isPlainObject()` work with object literals from other realms.
- Changed collection predicates to narrow unchecked contents to `unknown`.
- Changed `isPromise()` to narrow to the minimal `Thenable` contract.
- Added an LPM lockfile, security audit, verification, and package smoke-test gates.
- Preserved single-predicate tree-shaking with lazy intrinsic setup and bundle-size gates.
- Made public predicates and raw tag utilities return conservative results for hostile proxies and throwing accessors.
- Fixed the lint and coverage commands, and enforced both in the LPM verification gate.
- Added 90% global coverage thresholds and deterministic benchmark execution.
- Restricted published LPM metadata to `.lpm/skills` so local audit and install state cannot enter the package.

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
