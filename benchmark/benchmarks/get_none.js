/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.15.0
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {UNIQUE_KEYS} = require('../fetchers/test_data.js');
const key = UNIQUE_KEYS[0];
// test(map, implementation, size)
const benchmark = new Benchmark('GetNone')
    .withTest(({map}) => {
        return function() {
            const value = map.get(key);
            if (value) {
                throw `${key} exists`;
            }
        };
    });

module.exports = suitsForAllImpls(benchmark, false);