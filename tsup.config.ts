import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js', 'src/ability.js'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: false,
  clean: true,
  outDir: 'lib',
})
