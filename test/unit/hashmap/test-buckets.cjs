/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Container} = esmRequire('../../../src/hashmap/container')
const {sameValueZero} = esmRequire('../../../src/utils')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

/**
 * constructor
 * get
 * optionalGet
 * set
 * has
 * delete
 * [Symbol.iterator]
 */
describe('HashBucket Class', function () {


});
/* jshint ignore:end */