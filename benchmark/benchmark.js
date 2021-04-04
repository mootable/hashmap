/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const {add, cycle, suite, save} = require('benny');
const esmRequire = require("esm")(module/*, options*/);
const hashmapImplementationMetaData = {
    '@mootable/hashmap.HashMap': {location: '../src/', esm: true, value: 'HashMap'},
    '@mootable/hashmap.LinkedHashMap': {location: '../src/', esm: true, value: 'LinkedHashMap'},
    'map': {location: './nativeMap.js', esm: false, value: 'Map'},
    'flesler-hashmap': {location: 'flesler-hashmap', esm: false, value: 'HashMap'},
};

const HASHMAP_SIZES = [0, 64, 256, 512, 768, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304];

const LARGEST_HASHMAP = HASHMAP_SIZES.sort((left, right) => left - right)[HASHMAP_SIZES.length - 1];

console.info("Generating Test Data");
const ALL_KV = new Array(LARGEST_HASHMAP);
for (let i = 0; i < LARGEST_HASHMAP; i++) {
    ALL_KV[i] = [makeKey(), makeValue()];
}
// random value
const TEST_KV = [makeKey(), makeValue()];
console.info("Test Data Generated");
const hashmapImplementations = Object.entries(hashmapImplementationMetaData)
    .map(
        ([version, {location, esm, value}]) => {
            const required = esm ? esmRequire(location) : require(location);
            return [version, required[value]];
        });

const saves = (name) => [save({
    file: name,
    folder: 'benchmark_results',
    details: false,
    format: 'table.html',
}),
    save({
        file: name,
        folder: 'benchmark_results',
        details: true,
        format: 'chart.html',
    }),
    save({
        file: name,
        folder: 'benchmark_results',
        details: true,
        /**
         * Output format, currently supported:
         *   'json' | 'csv' | 'table.html' | 'chart.html'
         * Default: 'json'
         */
    })];
const addsForSetGetDeleteSize = (size) => hashmapImplementations.map(([name, HashMap]) => {

        const hashmap = new HashMap();
        for (let i = 0; i < size; i++) {
            hashmap.set(ALL_KV[i][0], ALL_KV[i][1]);
        }
        console.log(`Created Hashmap of ${size} for ${name}`);
        return add(name, () => {
            hashmap.set(TEST_KV[0], TEST_KV[1]);
            if (!hashmap.get(TEST_KV[0])) {
                throw `${TEST_KV[0]} does not exist`;
            }
            hashmap.delete(TEST_KV[0]);
        });
    }
);

const suiteForSetGetDeleteSize = (size) => suite(
    `${size}`,
    ...addsForSetGetDeleteSize(size),
    cycle(),
    ...saves(`GetSetDelete_${size}`)
);
const addsForCreate = () => hashmapImplementations.map(([name, HashMap]) =>
    add(name, () => {
        const hashmap = new HashMap();
        if (!hashmap) {
            throw "where is the hashmap?";
        }
    })
);
const suiteForCreate = () => suite(
    `create`,
    ...addsForCreate(),
    cycle(),
    ...saves('create')
);
module.exports = [suiteForCreate(), ...HASHMAP_SIZES.map(size => suiteForSetGetDeleteSize(size))];

function makeKey() {
    // return Math.floor(Math.random() * this.max32);
    return makeid(32);
}

function makeValue() {
    return makeid(8);
}

function makeid(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    let i = 0;
    while (i++ < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
