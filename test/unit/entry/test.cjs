/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Entry, LinkedEntry} = esmRequire('../../../src/entry')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('Entry Class', function () {
    it('Entry.overwrite', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("something","other");
        entry.overwrite(entry2);
        expect(entry.key).to.equal("something");
        expect(entry.value).to.equal("other");
        expect(entry.deleted).to.be.undefined;
        expect(entry2.deleted).to.be.true;
    });
    it('Entry.delete does nothing on entry', function () {
        const entry = new Entry("key","value");
        entry.delete();
        expect(entry.key).to.equal("key");
        expect(entry.value).to.equal("value");
        expect(entry.deleted).to.be.true;
    });
});

describe('LinkedEntry Class', function () {
    it('LinkedEntry.overwrite', function () {
        const entry = new LinkedEntry("key","value");
        const entry2 = new LinkedEntry("something","other");
        entry.overwrite(entry2);
        expect(entry.key).to.equal("something");
        expect(entry.value).to.equal("other");
        expect(entry.deleted).to.be.undefined;
        expect(entry2.deleted).to.be.true;
    });
    it('LinkedEntry.delete with no previous or next', function () {
        const entry = new LinkedEntry("key","value");
        entry.delete();
        expect(entry.deleted).to.be.true;
    });
    it('LinkedEntry.delete with previous and next', function () {
        const previous = new LinkedEntry("keyP","valueP");
        const entry = new LinkedEntry("key","value");
        const next = new LinkedEntry("keyN","valueN");
        entry.previous = previous;
        previous.next = entry;
        entry.next = next;
        next.previous = entry;
        entry.delete();
        expect(entry.deleted).to.be.true;
        expect(next.deleted).to.be.undefined;
        expect(previous.deleted).to.be.undefined;
        expect(next.previous).to.be.equal(previous);
        expect(previous.next).to.be.equal(next);
    });
});
/* jshint ignore:end */