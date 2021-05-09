/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * Homepage: https://github.com/mootable/hashmap
 */

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const maxMapSize = argv.maxMapSize ? argv.maxMapSize : -1;
console.info(`maxMapSize is ${maxMapSize}`);

const {cycle, complete, suite: b_suite} = require('benny');
const {saves} = require('./saves.js');
const {mapsForImpl, mapsForSize} = require('../fetchers/maps.js');
const {mapImpls} = require('../fetchers/impls.js');
const {MAP_SIZES} = require('../fetchers/test_data.js');

const testsForImpl = (implementation, benchmark, ignoreCache, maxSize) => mapsForImpl(implementation, ignoreCache, maxSize)
    .flatMap(([size, map]) => benchmark.benchMethods(`${size}`, {size, implementation, map}));

const suiteForImpl = (implementation, benchmark, ignoreCache, maxSize = -1) => b_suite(
    `${benchmark.name}_${implementation.implName}`,
    ...testsForImpl(implementation, benchmark, ignoreCache, maxSize),
    cycle(),
    complete(async () => {
        // console.info(`Finished ${benchmark.name}_${implementation.implName} waiting 5 seconds` );
        // await delay(5);
        // console.info(`Waiting complete` );
    }),
    ...saves(`${benchmark.name}_${implementation.implName}`)
).then(report => {
    return {report, name: implementation.implName, implementation};
});


const testsForSize = (size, benchmark, ignoreCache) => mapsForSize(size, ignoreCache)
    .flatMap(([implementation, map]) => benchmark.benchMethods(implementation.implName, {size, implementation, map}));


const suiteForSize = (size, benchmark, ignoreCache) => b_suite(
    `${benchmark.name}_${size}`,
    ...testsForSize(size, benchmark, ignoreCache),
    cycle(),
    complete(async () => {
        // console.info(`Finished ${benchmark.name}_${size} waiting 5 seconds` );
        // await delay(5);
        // console.info(`Waiting complete` );
    }),
    ...saves(`${benchmark.name}_${size}`)
).then(report => {
    return {report, name: benchmark.name, size};
});
const suitsForAllImpls = (benchmark, ignoreCache, maxSize = -1) => mapImpls
    .map(implementation => suiteForImpl(implementation, benchmark, ignoreCache, maxSize));
const suitsForAllSizes = (benchmark, ignoreCache, maxSize = -1) => MAP_SIZES
    .filter(size => maxSize < 0 || maxSize >= size)
    .map(size => suiteForSize(size, benchmark, ignoreCache));

module.exports = {suiteForImpl, suiteForSize, suitsForAllImpls, suitsForAllSizes};

