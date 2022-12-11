import { join, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/(.*)/, replacement: `${resolve(__dirname, 'src')}/$1` },
    ],
  },
  build: {
    minify: process.env.NODE_ENV === 'development' ? false : 'terser',
    sourcemap: 'hidden',
    outDir: 'build',
    assetsDir: '.',
    emptyOutDir: true,
    target: ['chrome104', 'node18'],
    assetsInlineLimit: 0,
    lib: {
      entry: join('src', 'index.ts'),
      formats: ['es'],
      fileName: 'index',
      name: 'AStar',
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
