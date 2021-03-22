process.env.UNDER_TEST_NAME = process.env.UNDER_TEST_NAME ||  'umd';
process.env.UNDER_TEST_LOCATION = process.env.UNDER_TEST_LOCATION ||  '../dist/hashmap.umd.js';
process.env.UNDER_TEST_ESM = process.env.UNDER_TEST_ESM ||  'false';
module.exports = {
    reporter: 'spec',
    bail: true,
    sort: true,
    recursive: true,
    "inline-diffs": true,
    timeout: 0,
};