/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const Utils = esmRequire('../../../src/utils')
const {Mootable} = esmRequire('../../../src')

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
describe('Util Functions', function () {
    describe('Option', function () {

        const {Option, some, none} = Utils;
        it('Option.some', function () {
            const opt = Option.some("hello");
            expect(opt.has).to.be.true;
            expect(opt.value).to.be.equal("hello");
        });
        /**
         * Even undefined is a value
         */
        it('Option.some with undefined', function () {
            const opt = Option.some(undefined);
            expect(opt.has).to.be.true;
            expect(opt.value).to.be.undefined;
        });
        it('Option.some with null', function () {
            const opt = Option.some(null);
            expect(opt.has).to.be.true;
            expect(opt.value).to.be.null;
        });

        it('Option.none', function () {
            const opt = Option.none;
            expect(opt.has).to.be.false;
            expect(opt.value).to.be.undefined;
        });

        it('some', function () {
            const opt = some("hello");
            expect(opt.has).to.be.true;
            expect(opt.value).to.be.equal("hello");
        });
        /**
         * Even undefined is a value
         */
        it('some with undefined', function () {
            const opt = some(undefined);
            expect(opt.has).to.be.true;
            expect(opt.value).to.be.undefined;
        });
        it('some with null', function () {
            const opt = some(null);
            expect(opt.has).to.be.true;
            expect(opt.value).to.be.null;
        });

        it('none', function () {
            const opt = none;
            expect(opt.has).to.be.false;
            expect(opt.value).to.be.undefined;
        });
    });
    describe('isIterable()', function () {

        it('takes an array', function () {
            expect(Utils.isIterable([1, 'hello', 1, 'there'])).to.be.true;
        });
        it('takes a HashMap', function () {
            expect(Utils.isIterable(new Mootable.HashMap([[1, 'hello'], [2, 'there']]))).to.be.true;
        });
        it('takes a LinkedHashMap', function () {
            expect(Utils.isIterable(new Mootable.LinkedHashMap([[1, 'hello'], [2, 'there']]))).to.be.true;
        });
        it('takes a set', function () {
            expect(Utils.isIterable(new Set(['hello', 'there']))).to.be.true;
        });
        it('takes a map', function () {
            expect(Utils.isIterable(new Map([[1, 'hello'], [2, 'there']]))).to.be.true;
        });

        it('takes a string', function () {
            expect(Utils.isIterable("hello test")).to.be.true;
        });

        it('doesnt take a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Utils.isIterable(takeFive)).to.be.false;
        });
        it('doesnt take  an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Utils.isIterable(takeFive)).to.be.false;
        });
        it('doesnt take a lambda', function () {
            expect(Utils.isIterable(() => 5)).to.be.false;
        });
        it('doesnt take empty', function () {
            expect(Utils.isIterable()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Utils.isIterable(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Utils.isIterable(undefined)).to.be.false;
        });
        it('doesnt take a number', function () {
            expect(Utils.isIterable(5)).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Utils.isIterable({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Utils.isIterable(myObject)).to.be.false;
        });
    });
    describe('isString()', function () {

        it('takes a string', function () {
            expect(Utils.isString("hello test")).to.be.true;
        });
        it('doesnt take a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Utils.isString(takeFive)).to.be.false;
        });
        it('doesnt take  an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Utils.isString(takeFive)).to.be.false;
        });
        it('doesnt take  a lambda', function () {
            expect(Utils.isString(() => 5)).to.be.false;
        });
        it('doesnt take empty', function () {
            expect(Utils.isString()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Utils.isString(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Utils.isString(undefined)).to.be.false;
        });
        it('doesnt take a number', function () {
            expect(Utils.isString(5)).to.be.false;
        });
        it('doesnt take an array', function () {
            expect(Utils.isString([1, 2, 3, 4])).to.be.false;
        });
        it('doesnt take a function array', function () {
            expect(Utils.isString([() => {
                return 5
            }, () => {
                return 4
            }])).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Utils.isString({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Utils.isString(myObject)).to.be.false;
        });
    });


    describe('isFunction()', function () {

        it('takes a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Utils.isFunction(takeFive)).to.be.true;
        });
        it('takes an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Utils.isFunction(takeFive)).to.be.true;
        });
        it('takes a lambda', function () {
            expect(Utils.isFunction(() => 5)).to.be.true;
        });
        it('doesnt take empty', function () {
            expect(Utils.isFunction()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Utils.isFunction(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Utils.isFunction(undefined)).to.be.false;
        });
        it('doesnt take a number', function () {
            expect(Utils.isFunction(5)).to.be.false;
        });
        it('doesnt take an array', function () {
            expect(Utils.isFunction([1, 2, 3, 4])).to.be.false;
        });
        it('doesnt take a function array', function () {
            expect(Utils.isFunction([() => {
                return 5
            }, () => {
                return 4
            }])).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Utils.isFunction({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Utils.isFunction(myObject)).to.be.false;
        });
        it('doesnt take a string', function () {
            expect(Utils.isFunction("hello test")).to.be.false;
        });
    });

    describe('hash()', function () {
        it('no options', function () {
            expect(Utils.hash("helloworld")).to.be.equal(1933063992);
            expect(Utils.hash("HelloWorld")).to.be.equal(1601418099);
            expect(Utils.hash("HelloWorl")).to.be.equal(138955848);
        });
        it('with length', function () {
            expect(Utils.hash("helloworld", 6)).to.be.equal(-574932549);
            expect(Utils.hash("HelloWorld", 6)).to.be.equal(-336088073);
            expect(Utils.hash("HelloWorl", 6)).to.be.equal(-336088073);
        });
        it('with seed', function () {
            expect(Utils.hash("HelloWorld", 0, 1)).to.be.equal(-484980969);
            expect(Utils.hash("HelloWorld", 0, 2)).to.be.equal(187381547);
            expect(Utils.hash("HelloWorld", 0, 3)).to.be.equal(649577143);
        });
        it('with seed and length', function () {
            expect(Utils.hash("HelloWorld", 6, 1)).to.be.equal(-1651097962);
            expect(Utils.hash("HelloWorld", 6, 2)).to.be.equal(-1535466246);
            expect(Utils.hash("HelloWorld", 6, 3)).to.be.equal(1961415912);
        });
    });
});
/* jshint ignore:end */