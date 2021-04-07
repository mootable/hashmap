/* jshint ignore:start */
const expect = require('chai').expect;
if(process.env.UNDER_TEST_SANITY !== 'true'){
    return 0;
}
function underTest() {
    const rootDirectory = '../../';
    const name = process.env.UNDER_TEST_NAME;
    const location = rootDirectory + process.env.UNDER_TEST_LOCATION;
    const esm = process.env.UNDER_TEST_ESM === 'true';
    if (esm) {
        const esmRequire = require("esm")(module/*, options*/);
        const {LinkedHashMap, Mootable} = esmRequire(location);
        return {
            LinkedHashMap,
            Mootable,
            name, location, esm
        };
    } else {
        const {LinkedHashMap, Mootable} = require(location);
        return {
            LinkedHashMap,
            Mootable,
            name, location, esm
        };
    }
}

/**
 *
 * hash,
 * isFunction,
 * isIterable,
 * isString,
 * isFiniteNumber
 */
describe('Util Functions', function () {
    let Mootable, Utils;
    before(function () {
        const UnderTest = underTest();
        Mootable = UnderTest.Mootable;
        Utils = Mootable.Utils;
        console.info(`Testing '${this.test.parent.title}' as '${UnderTest.name}' from '${UnderTest.location}'`);
        // runs once before the first test in this block
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
});
/* jshint ignore:end */