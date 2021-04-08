/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {keyAt} = require('../fetchers/test_data.js');
// test(map, implementation, size)
const benchmark = new Benchmark('GetStart')
    .withBefore(({size, implementation}) =>  {
        const key = keyAt(0);
        console.log(`GetStart using key: ${key} in ${implementation.implName} for size: ${size}`);
        return key;
    })
    .withTest(({map, size, implementation},key) => {
        return function() {
            const value = map.get(key);
            if (!value) {
                if(size !== 0) {
                    throw `GetStart key: {key} does not exist in ${implementation.implName} for size: ${size}`;
                }
            }
        };
    });

module.exports = suitsForAllImpls(benchmark, false);