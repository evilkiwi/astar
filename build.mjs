import { build } from 'esbuild';

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: { index: './src/index.ts' },
  sourcemap: false,
  logLevel: 'debug',
  platform: 'node',
  target: 'node18',
  outdir: 'build',
  format: 'esm',
  bundle: true,
  minify: true,
};

await build({
  ...options,
  outExtension: { '.js': '.mjs' },
  format: 'esm',
});
