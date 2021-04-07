/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {UNIQUE_KEYS, VALUES} = require('../fetchers/test_data.js');
const key = UNIQUE_KEYS[0];
const value = VALUES[0];
// test(map, implementation, size)
const benchmark = new Benchmark('SetGetAndDelete')
    .withTest(({map}) => {
        return function() {
            map.set(key, value);
            if (!map.get(key)) {
                throw `${key} does not exist`;
            }
            map.delete(key);
        };
    }).withAfter(({map}) => function() {
        map.delete(key);
    });

module.exports = suitsForAllImpls(benchmark, false);