/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const {suitsForAllImpls} = require("./handler_many.js");
const {TEST_KV} = require('./fetcher_test_data.js');

// test(map, implementation, size)
const testForSetGetAndDelete = (map) => {
    return () => {
        map.set(TEST_KV[0], TEST_KV[1]);
        if (!map.get(TEST_KV[0])) {
            throw `${TEST_KV[0]} does not exist`;
        }
        map.delete(TEST_KV[0]);
    };
};

module.exports = suitsForAllImpls('SetGetAndDelete', testForSetGetAndDelete, false,256);