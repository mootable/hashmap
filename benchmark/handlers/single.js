/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.15.0
 * Homepage: https://github.com/mootable/hashmap
 */
const {cycle,complete, suite: b_suite,} = require('benny');
const {saves} = require('./saves.js');
const {mapImpls}  = require('../fetchers/impls.js');

const tests = (benchmark) => mapImpls.flatMap((implementation) => benchmark.benchMethods(implementation.implName, implementation));
const singleSuite = (benchmark) => b_suite(
    benchmark.name,
    ...tests(benchmark),
    cycle(),
    complete(),
    ...saves(benchmark.name)
);
module.exports = singleSuite;

