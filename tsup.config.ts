import {defineConfig} from "tsup";

const common = defineConfig({
    entry: ['src/index.ts', 'src/react.ts'],
    external: ['react'],
    clean: true,
})

export default defineConfig([{
    ...common,
    format: ['esm'],
    dts: false,
}, {
    ...common,
    format: ['cjs'],
    dts: true,
}])
