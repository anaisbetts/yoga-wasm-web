import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { minify, defineRollupSwcMinifyOption } from "rollup-plugin-swc3";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

// copy wasm file
await mkdir("./dist/generated/", { recursive: true });

// Read WASM file and convert to base64
const wasmBuffer = await readFile("./tmp/yoga.wasm");
const base64Wasm = wasmBuffer.toString('base64');
await writeFile("./yoga-wasm.js", `const yogaWasm = "${base64Wasm}";\nexport default yogaWasm;`);

// copy d.ts files
let wrapAsm = await readFile("./yoga/javascript/src_js/wrapAsm.d.ts");
wrapAsm = wrapAsm
  .toString()
  .replace(/\.\/generated\/YGEnums/g, "./generated/YGEnums.js");
await writeFile("./dist/wrapAsm.d.ts", wrapAsm);

await copyFile(
  "./yoga/javascript/src_js/generated/YGEnums.d.ts",
  "./dist/generated/YGEnums.d.ts"
);

export default [
  {
    input: ["yoga-wasm.js", "asm.js", "index.js", "node.js", "browser.js"],
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        esmExternals: true,
        requireReturnsDefault: "auto"
      }),
      minify(
        defineRollupSwcMinifyOption({
          module: true,
          compress: { passes: 2 }
        })
      ),
    ],
  },
];
