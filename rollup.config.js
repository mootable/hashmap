import {nodeResolve} from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import {terser} from "rollup-plugin-terser";
import cleanup from 'rollup-plugin-cleanup';
import babel from '@rollup/plugin-babel';

const input = ["src/index.js"];
export default [
    {
        // UMD
        input,
        plugins: [
            nodeResolve(),
            commonJs(),
            babel({
                babelHelpers: "bundled",
                exclude: '/node_modules/**',
                babelrc: false,
                presets: [["@babel/preset-env", {
                    corejs: 3,
                    modules: false,
                    useBuiltIns: "usage",
                    targets: "defaults"
                }]]
            }),
            cleanup()
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
            commonJs(),
            babel({
                babelHelpers: "bundled",
                exclude: '/node_modules/**',
                babelrc: false,
                presets: [["@babel/preset-env", {
                    corejs: 3,
                    useBuiltIns: "usage",
                    targets: "last 2 years and supports es6-module, not dead"
                }]]
            }),
            cleanup({comments: 'some'}),
        ],
        output: [{
            file: `dist/hashmap.umd.min.js`,
            format: "umd",
            name: "Mootable", // this is the name of the global object
            exports: "named",
            esModule: true,
            sourcemap: true,
            plugins: [terser()]
        }, {
            file: `dist/hashmap.umd.js`,
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
        plugins: [nodeResolve(), cleanup({comments: 'all'})],
        output: [
            {
                file: `dist/hashmap.mjs`,
                format: "esm",
                exports: "named",
                sourcemap: false,
            },
            {
                file: `dist/hashmap.cjs`,
                format: "cjs",
                exports: "named",
                sourcemap: false,
            },
        ],
    },
];