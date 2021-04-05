/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const {add, cycle, suite: b_suite,} = require('benny');
const {saves} = require('./saves.js');
const {mapImpls}  = require('../fetchers/impls.js');

const adds = (test) => mapImpls.map((implementation) =>
    add(implementation.implName, test(implementation))
);
const singleSuite = (name, test) => b_suite(
    name,
    ...adds(test),
    cycle(),
    ...saves(name)
);
module.exports = singleSuite;

