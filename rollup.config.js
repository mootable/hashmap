import {nodeResolve} from "@rollup/plugin-node-resolve";
import {terser} from "rollup-plugin-terser";
import babel from '@rollup/plugin-babel';

const input = ["src/hashmap.js"];
export default [
    {
        // UMD
        input,
        plugins: [
            nodeResolve(),
            babel({
                babelHelpers: "bundled",
                presets: [["@babel/preset-env", {
                    modules: false,
                    "bugfixes": true,
                    useBuiltIns: "usage",
                    targets: "defaults"
                }]]
            }),
        ],
        output: [{
            file: `dist/hashmap.min.js`,
            format: "umd",
            name: "Mootable", // this is the name of the global object
            esModule: false,
            exports: "named",
            sourcemap: true,
            plugins: [terser()]
        }, {
            file: `dist/hashmap.js`,
            format: "umd",
            name: "Mootable", // this is the name of the global object
            esModule: false,
            exports: "named",
            sourcemap: false,
        },]
    },
    {
        // UMD
        input,
        plugins: [
            nodeResolve(),
            babel({
                babelHelpers: "bundled",
                presets: [["@babel/preset-env", {
                    "bugfixes": true,
                    useBuiltIns: "usage",
                    targets: "last 2 years and supports es6-module, not dead"
                }]]
            }),
        ],
        output: [{
            file: `dist/modern/hashmap.min.js`,
            format: "umd",
            name: "Mootable", // this is the name of the global object
            exports: "named",
            sourcemap: true,
            esModule: true,
            plugins: [terser()]
        }, {
            file: `dist/modern/hashmap.js`,
            format: "umd",
            name: "Mootable", // this is the name of the global object
            exports: "named",
            esModule: true,
            sourcemap: false,
        },]
    },
// ESM and CJS
    {
        input,
        plugins: [nodeResolve()],
        output: [
            {
                dir: "dist/esm",
                format: "esm",
                exports: "named",
                sourcemap: false,
            },
            {
                dir: "dist/cjs",
                format: "cjs",
                exports: "named",
                sourcemap: false,
            },
        ],
    },
];