import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { build } from 'vite'

const require = createRequire(import.meta.url)
const packageJson = require('@lpm.dev/neo.is/package.json')
const entries = {
  '@lpm.dev/neo.is': ['getType', 'isNumber', 'isTypedArray'],
  '@lpm.dev/neo.is/primitives': ['isNumber', 'isString'],
  '@lpm.dev/neo.is/objects': ['isArray', 'isPlainObject'],
  '@lpm.dev/neo.is/functions': ['isFunction', 'isPromise'],
  '@lpm.dev/neo.is/collections': ['isEmpty', 'isIterable'],
  '@lpm.dev/neo.is/numbers': ['isNumber', 'isPositive'],
}

for (const [specifier, expectedExports] of Object.entries(entries)) {
  const esm = await import(specifier)
  const cjs = require(specifier)

  for (const expectedExport of expectedExports) {
    assert.equal(typeof esm[expectedExport], 'function', `${specifier} ESM ${expectedExport}`)
    assert.equal(typeof cjs[expectedExport], 'function', `${specifier} CJS ${expectedExport}`)
  }
}

assert.ok(packageJson.files.includes('.lpm/skills'))
assert.ok(!packageJson.files.includes('.lpm'))

const distIndex = fileURLToPath(new URL('../dist/index.js', import.meta.url))

async function bundleVirtual(source) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [{
      name: 'neo-is-package-smoke',
      resolveId(id) {
        return id === 'virtual:neo-is-package-smoke' ? id : undefined
      },
      load(id) {
        return id === 'virtual:neo-is-package-smoke' ? source : undefined
      },
    }],
    build: {
      target: 'es2020',
      minify: 'esbuild',
      write: false,
      rollupOptions: {
        input: 'virtual:neo-is-package-smoke',
      },
    },
  })

  assert.ok(!Array.isArray(result), 'Expected one package-smoke build result')
  return result.output
    .filter((output) => output.type === 'chunk')
    .map((output) => output.code)
    .join('\n')
}

const primitiveBundle = await bundleVirtual(`
  import { isNumber } from ${JSON.stringify(distIndex)}
  globalThis.__neoIsTreeShakeProbe = isNumber(1)
`)
const primitiveBytes = Buffer.byteLength(primitiveBundle)

assert.ok(
  primitiveBytes <= 150,
  `Tree-shaken isNumber bundle grew to ${primitiveBytes} bytes`
)
for (const unusedSetup of [
  'Map.prototype',
  'Set.prototype',
  'Uint8Array.prototype',
  'Reflect.apply',
  'Object.getOwnPropertyDescriptor',
]) {
  assert.ok(
    !primitiveBundle.includes(unusedSetup),
    `Tree-shaken isNumber bundle contains unused setup: ${unusedSetup}`
  )
}

const fullBundle = await bundleVirtual(`
  import * as neo from ${JSON.stringify(distIndex)}
  globalThis.__neoIsFullBundleProbe = neo
`)
const fullGzipBytes = gzipSync(fullBundle, { level: 9 }).byteLength

assert.ok(
  fullGzipBytes <= 3 * 1024,
  `Full bundle grew to ${fullGzipBytes} gzipped bytes`
)

console.log(
  `Package smoke test passed for ${Object.keys(entries).length} public entries ` +
  `(${primitiveBytes} byte primitive bundle, ${fullGzipBytes} byte full gzip).`
)
