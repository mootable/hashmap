/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const Utils = esmRequire('../../../src/utils');

/**
 * hash,
 * isFunction,
 * isIterable,
 * isString,
 * isFiniteNumber
 */
describe('Util Functions', function () {

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

    describe('isIterable()', function () {

        it('takes an array', function () {
            expect(Utils.isIterable([1, 'hello', 1, 'there'])).to.be.true;
        });
        it('takes an iterable', function () {
            const myIterable = {
                * [Symbol.iterator]() {
                    yield "value1";
                    yield "value2";
                    yield "value3";
                }
            };
            expect(Utils.isIterable(myIterable)).to.be.true;
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
    describe('sameValue()', function () {

        it('If Type(x) is different from Type(y), return false', function () {
            expect(Utils.sameValue(1, '1')).to.be.false;
        });
        it('If Type(x) is Undefined, return true', function () {
            expect(Utils.sameValue(undefined, undefined)).to.be.true;
        });
        it('If Type(x) is Null, return true.', function () {
            expect(Utils.sameValue(null, null)).to.be.true;
        });
        describe('If Type(x) is Number, then.', function () {
            it('If x is NaN and y is NaN, return true..', function () {
                expect(Utils.sameValue(Math.sqrt(-1), Math.sqrt(-2))).to.be.true;
            });
            it('If x is +0 and y is −0, return false..', function () {
                expect(Utils.sameValue(+0, -0)).to.be.false;
            });
            it('If x is −0 and y is +0, return false..', function () {
                expect(Utils.sameValue(-0, +0)).to.be.false;
            });
            it('If x is the same Number value as y, return true..', function () {
                expect(Utils.sameValue(1, 1)).to.be.true;
                expect(Utils.sameValue(1.2, 1.2)).to.be.true;
                expect(Utils.sameValue(3e4, 3e4)).to.be.true;
                expect(Utils.sameValue(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.be.true;
                expect(Utils.sameValue(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.true;
            });

            it('Otherwise Return false', function () {
                expect(Utils.sameValue(1, 2)).to.be.false;
                expect(Utils.sameValue(1.2, 1.3)).to.be.false;
                expect(Utils.sameValue(3e4, 3e5)).to.be.false;
                expect(Utils.sameValue(1, 2)).to.be.false;
                expect(Utils.sameValue(1, 1.3)).to.be.false;
                expect(Utils.sameValue(3e4, 1)).to.be.false;
                expect(Utils.sameValue(3e4, 1.5)).to.be.false;
                expect(Utils.sameValue(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.false;
                expect(Utils.sameValue(2, Math.sqrt(-2))).to.be.false;
                expect(Utils.sameValue(2, null)).to.be.false;
                expect(Utils.sameValue(2, undefined)).to.be.false;
            });
        });
        describe('If Type(x) is String, then.', function () {

            it('If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices) return true', function () {
                expect(Utils.sameValue("HelloWorld", "HelloWorld")).to.be.true;
            });
            it('otherwise, return false.', function () {
                expect(Utils.sameValue("HelloWorld", "helloWorld")).to.be.false;
                expect(Utils.sameValue("HelloWorld", "HelloWorld ")).to.be.false;
                expect(Utils.sameValue("HelloWorld", undefined)).to.be.false;
                expect(Utils.sameValue("HelloWorld", null)).to.be.false;
            });
        });
        describe('If Type(x) is Boolean, then.', function () {
            it('If x and y are both true or both false, return true', function () {
                expect(Utils.sameValue(true, true)).to.be.true;
                expect(Utils.sameValue(false, false)).to.be.true;

            });
            it('otherwise, return false.', function () {
                expect(Utils.sameValue(true, false)).to.be.false;
                expect(Utils.sameValue(false, true)).to.be.false;
                expect(Utils.sameValue(false, undefined)).to.be.false;
                expect(Utils.sameValue(true, null)).to.be.false;
            });
        });
        it('If Type(x) is Symbol, then.', function () {

            it('If x and y are both the same Symbol value, return true', function () {
                expect(Utils.sameValue(Symbol.for("testSameValue"), Symbol.for("testSameValue"))).to.be.true;
            });

            it('otherwise, return false..', function () {
                expect(Utils.sameValue(Symbol.for("testSameValue"), Symbol.for("notTest"))).to.be.false;
                expect(Utils.sameValue(Symbol.for("testSameValue"), null)).to.be.false;
                expect(Utils.sameValue(Symbol.for("testSameValue"), undefined)).to.be.false;

            });
        });
        it('If Type(x) is an Object, then.', function () {
            it('Return true if x and y are the same Object value.', function () {
                const obj = {a: 1, b: 'str'};
                expect(Utils.sameValue(obj, obj)).to.be.true;

            });
            it('Otherwise, return false.', function () {
                const obj = {a: 1, b: 'str'};
                const objOther = obj.clone();
                expect(Utils.sameValue(obj, objOther)).to.be.false;
                expect(Utils.sameValue(obj, null)).to.be.false;
                expect(Utils.sameValue(obj, undefined)).to.be.false;
            });
        });
    });

    describe('sameValueZero()', function () {

        it('If Type(x) is different from Type(y), return false', function () {
            expect(Utils.sameValueZero(1, '1')).to.be.false;
        });
        it('If Type(x) is Undefined, return true', function () {
            expect(Utils.sameValueZero(undefined, undefined)).to.be.true;
        });
        it('If Type(x) is Null, return true.', function () {
            expect(Utils.sameValueZero(null, null)).to.be.true;
        });
        describe('If Type(x) is Number, then.', function () {
            it('If x is NaN and y is NaN, return true..', function () {
                expect(Utils.sameValueZero(Math.sqrt(-1), Math.sqrt(-2))).to.be.true;
            });
            it('If x is +0 and y is −0, return true.', function () {
                expect(Utils.sameValueZero(+0, -0)).to.be.true;
            });
            it('If x is −0 and y is +0, return true.', function () {
                expect(Utils.sameValueZero(-0, +0)).to.be.true;
            });
            it('If x is the same Number value as y, return true..', function () {
                expect(Utils.sameValueZero(1, 1)).to.be.true;
                expect(Utils.sameValueZero(1.2, 1.2)).to.be.true;
                expect(Utils.sameValueZero(3e4, 3e4)).to.be.true;
                expect(Utils.sameValueZero(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.be.true;
                expect(Utils.sameValueZero(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.true;
            });

            it('Otherwise Return false', function () {
                expect(Utils.sameValueZero(1, 2)).to.be.false;
                expect(Utils.sameValueZero(1.2, 1.3)).to.be.false;
                expect(Utils.sameValueZero(3e4, 3e5)).to.be.false;
                expect(Utils.sameValueZero(1, 2)).to.be.false;
                expect(Utils.sameValueZero(1, 1.3)).to.be.false;
                expect(Utils.sameValueZero(3e4, 1)).to.be.false;
                expect(Utils.sameValueZero(3e4, 1.5)).to.be.false;
                expect(Utils.sameValueZero(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.false;
                expect(Utils.sameValueZero(2, Math.sqrt(-2))).to.be.false;
                expect(Utils.sameValueZero(2, null)).to.be.false;
                expect(Utils.sameValueZero(2, undefined)).to.be.false;
            });
        });
        describe('If Type(x) is String, then.', function () {

            it('If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices) return true', function () {
                expect(Utils.sameValueZero("HelloWorld", "HelloWorld")).to.be.true;
            });
            it('otherwise, return false.', function () {
                expect(Utils.sameValueZero("HelloWorld", "helloWorld")).to.be.false;
                expect(Utils.sameValueZero("HelloWorld", "HelloWorld ")).to.be.false;
                expect(Utils.sameValueZero("HelloWorld", undefined)).to.be.false;
                expect(Utils.sameValueZero("HelloWorld", null)).to.be.false;
            });
        });
        describe('If Type(x) is Boolean, then.', function () {
            it('If x and y are both true or both false, return true', function () {
                expect(Utils.sameValueZero(true, true)).to.be.true;
                expect(Utils.sameValueZero(false, false)).to.be.true;

            });
            it('otherwise, return false.', function () {
                expect(Utils.sameValueZero(true, false)).to.be.false;
                expect(Utils.sameValueZero(false, true)).to.be.false;
                expect(Utils.sameValueZero(false, undefined)).to.be.false;
                expect(Utils.sameValueZero(true, null)).to.be.false;
            });
        });
        it('If Type(x) is Symbol, then.', function () {

            it('If x and y are both the same Symbol value, return true', function () {
                expect(Utils.sameValueZero(Symbol.for("testSameValue"), Symbol.for("testSameValue"))).to.be.true;
            });

            it('otherwise, return false..', function () {
                expect(Utils.sameValueZero(Symbol.for("testSameValue"), Symbol.for("notTest"))).to.be.false;
                expect(Utils.sameValueZero(Symbol.for("testSameValue"), null)).to.be.false;
                expect(Utils.sameValueZero(Symbol.for("testSameValue"), undefined)).to.be.false;

            });
        });
        it('If Type(x) is an Object, then.', function () {
            it('Return true if x and y are the same Object value.', function () {
                const obj = {a: 1, b: 'str'};
                expect(Utils.sameValueZero(obj, obj)).to.be.true;

            });
            it('Otherwise, return false.', function () {
                const obj = {a: 1, b: 'str'};
                const objOther = obj.clone();
                expect(Utils.sameValueZero(obj, objOther)).to.be.false;
                expect(Utils.sameValueZero(obj, null)).to.be.false;
                expect(Utils.sameValueZero(obj, undefined)).to.be.false;
            });
        });
    });

    describe('abstractEquals()', function () {
        describe('If Type(x) is the same as Type(y), then Return the result of performing Strict Equality Comparison x === y.', function () {

            it('If Type(x) is Undefined, return true', function () {
                expect(Utils.abstractEquals(undefined, undefined)).to.be.true;
            });
            it('If Type(x) is Null, return true.', function () {
                expect(Utils.abstractEquals(null, null)).to.be.true;
            });
            describe('If Type(x) is Number, then.', function () {
                it('If x is NaN or y is NaN, return false.', function () {
                    expect(Utils.abstractEquals(Math.sqrt(-1), Math.sqrt(-2))).to.be.false;
                });
                it('If x is +0 and y is −0, return true.', function () {
                    expect(Utils.abstractEquals(+0, -0)).to.be.true;
                });
                it('If x is −0 and y is +0, return true.', function () {
                    expect(Utils.abstractEquals(-0, +0)).to.be.true;
                });
                it('If x is the same Number value as y, return true..', function () {
                    expect(Utils.abstractEquals(1, 1)).to.be.true;
                    expect(Utils.abstractEquals(1.2, 1.2)).to.be.true;
                    expect(Utils.abstractEquals(3e4, 3e4)).to.be.true;
                    expect(Utils.abstractEquals(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.be.true;
                    expect(Utils.abstractEquals(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.true;
                });

                it('Otherwise Return false', function () {
                    expect(Utils.abstractEquals(1, 2)).to.be.false;
                    expect(Utils.abstractEquals(1.2, 1.3)).to.be.false;
                    expect(Utils.abstractEquals(3e4, 3e5)).to.be.false;
                    expect(Utils.abstractEquals(1, 2)).to.be.false;
                    expect(Utils.abstractEquals(1, 1.3)).to.be.false;
                    expect(Utils.abstractEquals(3e4, 1)).to.be.false;
                    expect(Utils.abstractEquals(3e4, 1.5)).to.be.false;
                    expect(Utils.abstractEquals(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.false;
                    expect(Utils.abstractEquals(2, Math.sqrt(-2))).to.be.false;
                });
            });
            describe('If Type(x) is String, then.', function () {

                it('If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices) return true', function () {
                    expect(Utils.abstractEquals("HelloWorld", "HelloWorld")).to.be.true;
                });
                it('otherwise, return false.', function () {
                    expect(Utils.abstractEquals("HelloWorld", "helloWorld")).to.be.false;
                    expect(Utils.abstractEquals("HelloWorld", "HelloWorld ")).to.be.false;
                });
            });
            describe('If Type(x) is Boolean, then.', function () {
                it('If x and y are both true or both false, return true', function () {
                    expect(Utils.abstractEquals(true, true)).to.be.true;
                    expect(Utils.abstractEquals(false, false)).to.be.true;

                });
                it('otherwise, return false.', function () {
                    expect(Utils.abstractEquals(true, false)).to.be.false;
                    expect(Utils.abstractEquals(false, true)).to.be.false;
                });
            });
            it('If Type(x) is Symbol, then.', function () {

                it('If x and y are both the same Symbol value, return true', function () {
                    expect(Utils.abstractEquals(Symbol.for("testSameValue"), Symbol.for("testSameValue"))).to.be.true;
                });

                it('otherwise, return false..', function () {
                    expect(Utils.abstractEquals(Symbol.for("testSameValue"), Symbol.for("notTest"))).to.be.false;
                });
            });
            it('If Type(x) is an Object, then.', function () {
                it('Return true if x and y are the same Object value.', function () {
                    const obj = {a: 1, b: 'str'};
                    expect(Utils.abstractEquals(obj, obj)).to.be.true;

                });
                it('Otherwise, return false.', function () {
                    const obj = {a: 1, b: 'str'};
                    const objOther = obj.clone();
                    expect(Utils.abstractEquals(obj, objOther)).to.be.false;
                });
            });
        });
        it('If x is null and y is undefined, return true.', function () {
            expect(Utils.abstractEquals(null, undefined)).to.be.true;
        });
        it('If x is undefined and y is null, return true.', function () {
            expect(Utils.abstractEquals(undefined, null)).to.be.true;
        });
        it('If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y).', function () {
            expect(Utils.abstractEquals(1, "1")).to.be.true;
            expect(Utils.abstractEquals(1.5, "1.5")).to.be.true;
            expect(Utils.abstractEquals(1, "2")).to.be.false;
            expect(Utils.abstractEquals(1.5, "2.3")).to.be.false;
        });
        it('If Type(x) is String and Type(y) is Number, return the result of the comparison ToNumber(x) == y.', function () {
            expect(Utils.abstractEquals("1", 1)).to.be.true;
            expect(Utils.abstractEquals("1.5", 1.5)).to.be.true;
            expect(Utils.abstractEquals("2", 1)).to.be.false;
            expect(Utils.abstractEquals("2.3", 1.5)).to.be.false;
        });
        it('If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.', function () {
            expect(Utils.abstractEquals(true, 1)).to.be.true;
            expect(Utils.abstractEquals(false, 0)).to.be.true;
            expect(Utils.abstractEquals(false, 1)).to.be.false;
            expect(Utils.abstractEquals(true, 0)).to.be.false;

        });
        it('If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).', function () {
            expect(Utils.abstractEquals(1, true)).to.be.true;
            expect(Utils.abstractEquals(0, false)).to.be.true;
            expect(Utils.abstractEquals(1, false)).to.be.false;
            expect(Utils.abstractEquals(0, true)).to.be.false;
        });
        /*
         * The following are very internal style checks, so will not be tested, as the method uses == anyway, the above will prove the sanity.
         *
         * If Type(x) is either String, Number, or Symbol and Type(y) is Object, then return the result of the comparison x == ToPrimitive(y).
         * If Type(x) is Object and Type(y) is either String, Number, or Symbol, then return the result of the comparison ToPrimitive(x) == y.
         */
    });

    describe('strictEquals()', function () {

        it('If Type(x) is different from Type(y), return false', function () {
            expect(Utils.strictEquals(1, '1')).to.be.false;
        });
        it('If Type(x) is Undefined, return true', function () {
            expect(Utils.strictEquals(undefined, undefined)).to.be.true;
        });
        it('If Type(x) is Null, return true.', function () {
            expect(Utils.strictEquals(null, null)).to.be.true;
        });
        describe('If Type(x) is Number, then.', function () {
            it('If x is NaN or y is NaN, return false.', function () {
                expect(Utils.strictEquals(Math.sqrt(-1), Math.sqrt(-2))).to.be.false;
            });
            it('If x is +0 and y is −0, return true.', function () {
                expect(Utils.strictEquals(+0, -0)).to.be.true;
            });
            it('If x is −0 and y is +0, return true.', function () {
                expect(Utils.strictEquals(-0, +0)).to.be.true;
            });
            it('If x is the same Number value as y, return true..', function () {
                expect(Utils.strictEquals(1, 1)).to.be.true;
                expect(Utils.strictEquals(1.2, 1.2)).to.be.true;
                expect(Utils.strictEquals(3e4, 3e4)).to.be.true;
                expect(Utils.strictEquals(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.be.true;
                expect(Utils.strictEquals(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.true;
            });

            it('Otherwise Return false', function () {
                expect(Utils.strictEquals(1, 2)).to.be.false;
                expect(Utils.strictEquals(1.2, 1.3)).to.be.false;
                expect(Utils.strictEquals(3e4, 3e5)).to.be.false;
                expect(Utils.strictEquals(1, 2)).to.be.false;
                expect(Utils.strictEquals(1, 1.3)).to.be.false;
                expect(Utils.strictEquals(3e4, 1)).to.be.false;
                expect(Utils.strictEquals(3e4, 1.5)).to.be.false;
                expect(Utils.strictEquals(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).to.be.false;
                expect(Utils.strictEquals(2, Math.sqrt(-2))).to.be.false;
                expect(Utils.strictEquals(2, null)).to.be.false;
                expect(Utils.strictEquals(2, undefined)).to.be.false;
            });
        });
        describe('If Type(x) is String, then.', function () {

            it('If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices) return true', function () {
                expect(Utils.strictEquals("HelloWorld", "HelloWorld")).to.be.true;
            });
            it('otherwise, return false.', function () {
                expect(Utils.strictEquals("HelloWorld", "helloWorld")).to.be.false;
                expect(Utils.strictEquals("HelloWorld", "HelloWorld ")).to.be.false;
                expect(Utils.strictEquals("HelloWorld", undefined)).to.be.false;
                expect(Utils.strictEquals("HelloWorld", null)).to.be.false;
            });
        });
        describe('If Type(x) is Boolean, then.', function () {
            it('If x and y are both true or both false, return true', function () {
                expect(Utils.strictEquals(true, true)).to.be.true;
                expect(Utils.strictEquals(false, false)).to.be.true;

            });
            it('otherwise, return false.', function () {
                expect(Utils.strictEquals(true, false)).to.be.false;
                expect(Utils.strictEquals(false, true)).to.be.false;
                expect(Utils.strictEquals(false, undefined)).to.be.false;
                expect(Utils.strictEquals(true, null)).to.be.false;
            });
        });
        it('If Type(x) is Symbol, then.', function () {

            it('If x and y are both the same Symbol value, return true', function () {
                expect(Utils.strictEquals(Symbol.for("testSameValue"), Symbol.for("testSameValue"))).to.be.true;
            });

            it('otherwise, return false..', function () {
                expect(Utils.strictEquals(Symbol.for("testSameValue"), Symbol.for("notTest"))).to.be.false;
                expect(Utils.strictEquals(Symbol.for("testSameValue"), null)).to.be.false;
                expect(Utils.strictEquals(Symbol.for("testSameValue"), undefined)).to.be.false;

            });
        });
        it('If Type(x) is an Object, then.', function () {
            it('Return true if x and y are the same Object value.', function () {
                const obj = {a: 1, b: 'str'};
                expect(Utils.strictEquals(obj, obj)).to.be.true;

            });
            it('Otherwise, return false.', function () {
                const obj = {a: 1, b: 'str'};
                const objOther = obj.clone();
                expect(Utils.strictEquals(obj, objOther)).to.be.false;
                expect(Utils.strictEquals(obj, null)).to.be.false;
                expect(Utils.strictEquals(obj, undefined)).to.be.false;
            });
        });
    });

    describe('hammingWeight', function () {
        it('zero elements', function () {
            const flags = 0;
            expect(Utils.hammingWeight(flags)).to.equal(0);
        });
        it('all elements', function () {
            const flags = 0b11111111111111111111111111111111;
            expect(Utils.hammingWeight(flags)).to.equal(32);
        });
        it('first element', function () {
            const flags = 0b1;
            expect(Utils.hammingWeight(flags)).to.equal(1);
        });
        it('second element', function () {
            const flags = 0b10;
            expect(Utils.hammingWeight(flags)).to.equal(1);
        });
        it('31st element', function () {
            const flags = 0b01000000000000000000000000000000;
            expect(Utils.hammingWeight(flags)).to.equal(1);
        });
        it('32nd element', function () {
            const flags = 0b10000000000000000000000000000000;
            expect(Utils.hammingWeight(flags)).to.equal(1);
        });
        it('alternate elements', function () {
            const flags = 0b10101010101010101010101010101010;
            expect(Utils.hammingWeight(flags)).to.equal(16);
            const flags2 = 0b01010101010101010101010101010101;
            expect(Utils.hammingWeight(flags2)).to.equal(16);
        });
        it('two elements', function () {
            const flags = 0b1010;
            expect(Utils.hammingWeight(flags)).to.equal(2);
        });
        it('five elements', function () {
            const flags = 0b11000101010;
            expect(Utils.hammingWeight(flags)).to.equal(5);
        });
    });

});
/* jshint ignore:end */