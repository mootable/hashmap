/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Entry, LinkedEntry} = esmRequire('../../../src/entry')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('Entry Class', function () {
    it('Entry', function () {
        const entry = new Entry("key","value");
        expect(entry.key).to.equal("key");
        expect(entry.value).to.equal("value");
    });
});

/* jshint ignore:end */