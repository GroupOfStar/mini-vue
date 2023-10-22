import { defineConfig } from 'rollup'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
)

export default defineConfig({
  input: './packages/index.ts',
  output: [
    {
      format: 'esm',
      file: pkg.main
    },
    {
      format: 'cjs',
      file: pkg.module
    }
  ],
  plugins: [json(), typescript()]
})
