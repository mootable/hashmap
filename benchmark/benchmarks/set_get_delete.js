/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.3
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {UNIQUE_KEYS, VALUES} = require('../fetchers/test_data.js');
// BENCH-SETUP-START
const key = UNIQUE_KEYS[0];
const value = VALUES[0];
// BENCH-SETUP-END
const benchmark = new Benchmark('SetGetAndDelete')
    .withTest(({map}) => {
        return function () {
            // BENCH-TEST-START
            map.set(key, value);
            if (!map.get(key)) {
                throw `${key} does not exist`;
            }
            map.delete(key);
            // BENCH-TEST-END
        };
    });

module.exports = suitsForAllImpls(benchmark, false);