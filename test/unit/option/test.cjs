/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Mootable:{Option, some, none}} = esmRequire('../../../src/')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

/**
 * hash,
 * isFunction,
 * isIterable,
 * isString,
 * isFiniteNumber
 */
describe('Option Class', function () {
    it('Option.some', function () {
        const opt = Option.some("hello");
        expect(opt.has).to.be.true;
        expect(opt.value).to.be.equal("hello");
        expect(opt.size).to.be.equal(1);
    });
    /**
     * Even undefined is a value
     */
    it('Option.some with undefined', function () {
        const opt = Option.some(undefined);
        expect(opt.has).to.be.true;
        expect(opt.value).to.be.undefined;
        expect(opt.size).to.be.equal(1);
    });
    it('Option.some with null', function () {
        const opt = Option.some(null);
        expect(opt.has).to.be.true;
        expect(opt.value).to.be.null;
        expect(opt.size).to.be.equal(1);
    });

    it('Option.none', function () {
        const opt = Option.none;
        expect(opt.has).to.be.false;
        expect(opt.value).to.be.undefined;
        expect(opt.size).to.be.equal(0);
    });

    it('some', function () {
        const opt = some("hello");
        expect(opt.has).to.be.true;
        expect(opt.value).to.be.equal("hello");
        expect(opt.size).to.be.equal(1);
    });
    /**
     * Even undefined is a value
     */
    it('some with undefined', function () {
        const opt = some(undefined);
        expect(opt.has).to.be.true;
        expect(opt.value).to.be.undefined;
        expect(opt.size).to.be.equal(1);
    });
    it('some with null', function () {
        const opt = some(null);
        expect(opt.has).to.be.true;
        expect(opt.value).to.be.null;
        expect(opt.size).to.be.equal(1);
    });

    it('none', function () {
        const opt = none;
        expect(opt.has).to.be.false;
        expect(opt.value).to.be.undefined;
        expect(opt.size).to.be.equal(0);
    });

    it('Option.iterable some', function () {
        const opt = Option.some("hello");
        let executed = false;
        for (value of opt) {
            executed = true;
            expect(value).to.be.equal("hello");
        }
        expect(executed).to.be.true;
    });

    it('Option.iterable none', function () {
        const opt = Option.none;
        let executed = false;
        for (value of opt) {
            executed = true;
        }
        expect(executed).to.be.false;
    });
});
/* jshint ignore:end */