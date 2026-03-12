import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    // Main entry
    index: 'src/index.ts',
    // Category entries for subpath imports
    'primitives/index': 'src/primitives/index.ts',
    'objects/index': 'src/objects/index.ts',
    'functions/index': 'src/functions/index.ts',
    'collections/index': 'src/collections/index.ts',
    'numbers/index': 'src/numbers/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false, // Keep readable for debugging, minification happens in user's bundler
  target: 'es2020',
  outDir: 'dist',
})
