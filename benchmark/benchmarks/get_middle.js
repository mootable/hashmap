/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const {suitsForAllImpls} = require("../handlers/multiple.js");
const {keyAt} = require('../fetchers/test_data.js');
// test(map, implementation, size)
const benchmark = new Benchmark('GetMiddle')
    .withBefore(({size, implementation}) =>  {
        const key = keyAt(size >>> 1);
        console.log(`GetMiddle using key: ${key} in ${implementation.implName} for size: ${size}`);
        return key;
    })
    .withTest(({map, size, implementation}, key) => {
        return function() {
            const value = map.get(key);
            if (!value) {
                if(size !== 0) {
                    const valueOther = map.get(key);
                    throw `GetMiddle key: ${key} does not exist in ${implementation.implName} for size: ${size}`;
                }
            }
        };
    });

module.exports = suitsForAllImpls(benchmark, false);