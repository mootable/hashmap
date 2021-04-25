/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {UNIQUE_KEYS, VALUES} = require('../fetchers/test_data.js');
// BENCH-SETUP-START
const uniqueLength = 8;
const UNIQUE_KEYS_TO_TEST = UNIQUE_KEYS.slice(0,uniqueLength);
// BENCH-SETUP-END
const benchmark = new Benchmark('SetGetAndDelete')
    .withTest(({map}) => {
        return function () {
            // BENCH-TEST-START
            for (let idx = 0; idx < uniqueLength; idx++) {
                const key = UNIQUE_KEYS_TO_TEST[idx];
                const value = VALUES[idx];
                map.set(key, value);
                if (!map.get(key)) {
                    throw `${key} does not exist`;
                }
                map.delete(key);
            }
            // BENCH-TEST-END
        };
    });

module.exports = suitsForAllImpls(benchmark, false);