/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {UNIQUE_KEYS, VALUES} = require('../fetchers/test_data.js');
const uniqueLength = 10;
const UNIQUE_KEYS_TO_TEST = UNIQUE_KEYS.slice(0,uniqueLength);
// test(map, implementation, size)
const benchmark = new Benchmark('SetGetAndDelete')
    .withTest(({map}) => {
        return function () {
            for (let idx = 0; idx < uniqueLength; idx++) {
                const key = UNIQUE_KEYS_TO_TEST[idx];
                const value = VALUES[idx];
                map.set(key, value);
            }

            for (const key of UNIQUE_KEYS_TO_TEST) {
                if (!map.get(key)) {
                    throw `${key} does not exist`;
                }
                map.delete(key);
            }
        };
    });

module.exports = suitsForAllImpls(benchmark, false);