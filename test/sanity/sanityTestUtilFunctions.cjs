/* jshint ignore:start */
const expect = require('chai').expect;
const {underTest} = require('./sanitySupport.cjs');

/**
 *
 * hash,
 * isFunction,
 * isIterable,
 * isString,
 * isFiniteNumber
 */
describe('Util Functions @sanity', function () {

    let Mootable;
    before(function () {
        const UnderTest = underTest();
        Mootable = UnderTest.Mootable;
        console.info(`Testing '${this.test.parent.title}' as '${UnderTest.name}' from '${UnderTest.location}'`);
        // runs once before the first test in this block
    });

    describe('isIterable()', function () {

        it('takes an array', function () {
            expect(Mootable.isIterable([1, 'hello', 1, 'there'])).to.be.true;
        });
        it('takes a HashMap', function () {
            expect(Mootable.isIterable(new Mootable.HashMap([[1, 'hello'], [2, 'there']]))).to.be.true;
        });
        it('takes a LinkedHashMap', function () {
            expect(Mootable.isIterable(new Mootable.LinkedHashMap([[1, 'hello'], [2, 'there']]))).to.be.true;
        });
        it('takes a set', function () {
            expect(Mootable.isIterable(new Set(['hello', 'there']))).to.be.true;
        });
        it('takes a map', function () {
            expect(Mootable.isIterable(new Map([[1, 'hello'], [2, 'there']]))).to.be.true;
        });

        it('takes a string', function () {
            expect(Mootable.isIterable("hello test")).to.be.true;
        });

        it('doesnt take a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Mootable.isIterable(takeFive)).to.be.false;
        });
        it('doesnt take  an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Mootable.isIterable(takeFive)).to.be.false;
        });
        it('doesnt take a lambda', function () {
            expect(Mootable.isIterable(() => 5)).to.be.false;
        });
        it('doesnt take empty', function () {
            expect(Mootable.isIterable()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Mootable.isIterable(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Mootable.isIterable(undefined)).to.be.false;
        });
        it('doesnt take a number', function () {
            expect(Mootable.isIterable(5)).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Mootable.isIterable({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Mootable.isIterable(myObject)).to.be.false;
        });
    });
    describe('isString()', function () {

        it('takes a string', function () {
            expect(Mootable.isString("hello test")).to.be.true;
        });
        it('doesnt take a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Mootable.isString(takeFive)).to.be.false;
        });
        it('doesnt take  an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Mootable.isString(takeFive)).to.be.false;
        });
        it('doesnt take  a lambda', function () {
            expect(Mootable.isString(() => 5)).to.be.false;
        });
        it('doesnt take empty', function () {
            expect(Mootable.isString()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Mootable.isString(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Mootable.isString(undefined)).to.be.false;
        });
        it('doesnt take a number', function () {
            expect(Mootable.isString(5)).to.be.false;
        });
        it('doesnt take an array', function () {
            expect(Mootable.isString([1, 2, 3, 4])).to.be.false;
        });
        it('doesnt take a function array', function () {
            expect(Mootable.isString([() => {
                return 5
            }, () => {
                return 4
            }])).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Mootable.isString({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Mootable.isString(myObject)).to.be.false;
        });
    });

    describe('isFunction()', function () {

        it('takes a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Mootable.isFunction(takeFive)).to.be.true;
        });
        it('takes an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Mootable.isFunction(takeFive)).to.be.true;
        });
        it('takes a lambda', function () {
            expect(Mootable.isFunction(() => 5)).to.be.true;
        });
        it('doesnt take empty', function () {
            expect(Mootable.isFunction()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Mootable.isFunction(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Mootable.isFunction(undefined)).to.be.false;
        });
        it('doesnt take a number', function () {
            expect(Mootable.isFunction(5)).to.be.false;
        });
        it('doesnt take an array', function () {
            expect(Mootable.isFunction([1, 2, 3, 4])).to.be.false;
        });
        it('doesnt take a function array', function () {
            expect(Mootable.isFunction([() => {
                return 5
            }, () => {
                return 4
            }])).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Mootable.isFunction({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Mootable.isFunction(myObject)).to.be.false;
        });
        it('doesnt take a string', function () {
            expect(Mootable.isFunction("hello test")).to.be.false;
        });
    });
});
/* jshint ignore:end */