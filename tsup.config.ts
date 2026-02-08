import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "./src/scripts/deploy.ts",
        "./src/serverless/edgeone.ts",
        "./src/serverless/esa.ts",
        "./src/test.ts"
    ],
    clean: true,
    dts: true,
    loader: {
        ".svg": "text"
    },
    format: ["esm", "cjs"],
    splitting: false,
    bundle: true
});