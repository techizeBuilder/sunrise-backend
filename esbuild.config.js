import { build } from 'esbuild';

build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outdir: 'dist',
    packages: 'external',
}).catch(() => process.exit(1));