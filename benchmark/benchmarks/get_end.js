/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {kvStore} = require('../fetchers/test_data.js');
// test(map, implementation, size)
const benchmark = new Benchmark('GetEnd')
    .withBefore(({size}) =>  {
        const key = size === 0 ? kvStore(size)[0][0] : kvStore(size)[size - 1][0];
        console.log('GetEnd', size, key);
        return key;
    })
    .withTest(({map, size, implementation}, key) => {
        return function() {
            const value = map.get(key);
            if (!value) {
                if(size !== 0) {
                    throw `${key} does not exist in ${implementation.implName} for size: ${size}`;
                }
            }
        };
    });

module.exports = suitsForAllImpls(benchmark, false,17000);