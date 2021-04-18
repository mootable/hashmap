process.env.UNDER_TEST_NAME = process.env.UNDER_TEST_NAME ||  'src';
process.env.UNDER_TEST_LOCATION = process.env.UNDER_TEST_LOCATION ||  'src/';
process.env.UNDER_TEST_ESM = process.env.UNDER_TEST_ESM ||  'true';
process.env.UNDER_TEST_SANITY = process.env.UNDER_TEST_SANITY || 'true';
process.env.UNDER_TEST_UNIT = process.env.UNDER_TEST_UNIT || 'true';
module.exports = {
    reporter: 'spec',
    bail: false,
    sort: true,
    recursive: true,
    "inline-diffs": true,
    timeout: 0,
};
