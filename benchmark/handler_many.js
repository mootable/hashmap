/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */

const {add, cycle, suite: b_suite} = require('benny');
const {saves} = require('./handler_saves.js');
const {mapsForImpl, mapsForSize} = require('./fetcher_maps.js');
const {mapImpls} = require('./fetcher_impls.js');
const {MAP_SIZES} = require('./fetcher_test_data.js');

const addsForImpl = (implementation, test, ignoreCache, maxSize) => mapsForImpl(implementation, ignoreCache, maxSize).map(([size, map]) =>
    add(`${size}`, test(map, implementation, size))
);

const suiteForImpl = (name, implementation, test, ignoreCache, maxSize = -1) => b_suite(
    `${name}_${implementation.implName}`,
    ...addsForImpl(implementation, test, ignoreCache, maxSize),
    cycle(),
    ...saves(`${name}_${implementation.implName}`)
).then(report => {
    return {report, name : implementation.implName, classification: implementation.classification};
});

const addsForSize = (size, test, ignoreCache) => mapsForSize(size, ignoreCache).map(([implementation, map]) =>
    add(implementation.implName, test(map, implementation, size))
);

const suiteForSize = (name, size, test, ignoreCache) => b_suite(
    `${name}_${size}`,
    ...addsForSize(size, test, ignoreCache),
    cycle(),
    ...saves(`${name}_${size}`)
).then(report => {
    return {report, name : size};
});
const suitsForAllImpls = (name, test, ignoreCache, maxSize = -1) => mapImpls
    .map(implementation => suiteForImpl(name, implementation, test, ignoreCache, maxSize));
const suitsForAllSizes = (name, test, ignoreCache, maxSize = -1) => MAP_SIZES
    .filter(size => maxSize < 0 || maxSize >= size)
    .map(size => suiteForSize(name, size, test, ignoreCache));

module.exports = {suiteForImpl, suiteForSize, suitsForAllImpls, suitsForAllSizes};

