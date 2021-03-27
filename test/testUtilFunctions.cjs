/* jshint ignore:start */
const expect = require('chai').expect;
const chalk = require('chalk')

function underTest() {
    const name = process.env.UNDER_TEST_NAME;
    const location = process.env.UNDER_TEST_LOCATION;
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
 * hashCode,
 * isFunction,
 * isIterable,
 * isString,
 * isNumber
 */
describe('Util Functions', function () {
    const rand = require('random-seed').create();
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
    describe('isNumber()', function () {

        it('takes an integer', function () {
            expect(Utils.isNumber(5)).to.be.true;
        });
        it('takes a float', function () {
            expect(Utils.isNumber(1.5)).to.be.true;
        });
        it('takes an exponential', function () {
            expect(Utils.isNumber(5e6)).to.be.true;
        });
        it('doesnt take infinity', function () {
            expect(Utils.isNumber(Number.POSITIVE_INFINITY)).to.be.false;
        });
        it('doesnt take negative infinity', function () {
            expect(Utils.isNumber(Number.NEGATIVE_INFINITY)).to.be.false;
        });
        it('doesnt take NaN', function () {
            expect(Utils.isNumber(Math.sqrt(-1))).to.be.false;
        });
        it('doesnt take a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Utils.isNumber(takeFive)).to.be.false;
        });
        it('doesnt take a function', function () {
            const takeFive = function () {
                return 5;
            }
            expect(Utils.isNumber(takeFive)).to.be.false;
        });
        it('doesnt take an async function', function () {
            const takeFive = async function () {
                return 5;
            }
            expect(Utils.isNumber(takeFive)).to.be.false;
        });
        it('doesnt take a lambda', function () {
            expect(Utils.isNumber(() => 5)).to.be.false;
        });
        it('doesnt take empty', function () {
            expect(Utils.isNumber()).to.be.false;
        });
        it('doesnt take null', function () {
            expect(Utils.isNumber(null)).to.be.false;
        });
        it('doesnt take undefined', function () {
            expect(Utils.isNumber(undefined)).to.be.false;
        });
        it('doesnt take an array', function () {
            expect(Utils.isNumber([1, 2, 3, 4])).to.be.false;
        });
        it('doesnt take a function array', function () {
            expect(Utils.isNumber([() => {
                return 5
            }, () => {
                return 4
            }])).to.be.false;
        });
        it('doesnt take an empty object', function () {
            expect(Utils.isNumber({})).to.be.false;
        });
        it('doesnt take a filled object', function () {
            const myObject = {"one": 1, "two": 2};
            expect(Utils.isNumber(myObject)).to.be.false;
        });
        it('doesnt take a string', function () {
            expect(Utils.isNumber("hello test")).to.be.false;
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
    /**
     * we use 32 bit hashes, as numbers go up there is more chance of collision,
     * so this is a sanity check to make sure the hash function spreads properly
     */
    describe('hashCode()', function () {
        /*
         * higher for slow check, do this manually.
         * Understand that collision percentages go up the more you create,
         * as there is a limited 32 bit range.
         */
        const HASH_AMOUNT = 5000;
        const TEST_CYCLES = 6;
        const valueArray = [];
        const hashArray = [];
        const metricsArray = [];
        const hashMetricsArray = [];
        const HASHED_COUNTS = [0];
        const VALUE_COUNTS = [0, 0];

        const probabilityAtMax = (TOTAL_SIZE) => {
            return 1 - (Math.exp((-0.5 * TOTAL_SIZE * (TOTAL_SIZE - 1))
                / (2 * Math.pow(2, 32))));
        }

        for (let colCount = 1; colCount <= TEST_CYCLES; colCount++) {
            describe(`${HASH_AMOUNT * colCount} Hashes`, function () {
                before(function () {
                    VALUE_COUNTS[0] = HASH_AMOUNT;
                    while (VALUE_COUNTS[0] != 0) {
                        const value = rand.string(64 + rand(64));
                        const hash = Utils.hashCode(value);
                        const value_idx = valueArray.indexOf(value);
                        const hash_idx = hashArray.indexOf(hash);
                        if (value_idx === -1) {
                            valueArray.push(value);
                            metricsArray.push({
                                value,
                                hash,
                                hashIdx: hash_idx === -1 ? hashArray.length : hash_idx,
                                count: 1
                            });
                            VALUE_COUNTS[0]--;
                            VALUE_COUNTS[1]++;
                        } else if (hash_idx === -1) {
                            const metric = metricsArray[value_idx];
                            VALUE_COUNTS[metric.count]--;
                            metric.count = metric.count + 1;
                            if (VALUE_COUNTS[metric.count]) {
                                VALUE_COUNTS[metric.count]++;
                            } else {
                                VALUE_COUNTS[metric.count] = 1;
                            }
                        }

                        if (hash_idx === -1) {
                            hashArray.push(hash);
                            hashMetricsArray.push({
                                value,
                                hash,
                                valueIdx: value_idx === -1 ? valueArray.length : value_idx,
                                count: 0
                            });
                            HASHED_COUNTS[0]++;
                        } else {
                            const metric = hashMetricsArray[hash_idx];
                            HASHED_COUNTS[metric.count]--;
                            metric.count = metric.count + 1;
                            if (HASHED_COUNTS[metric.count]) {
                                HASHED_COUNTS[metric.count]++;
                            } else {
                                HASHED_COUNTS[metric.count] = 1;
                            }
                        }
                    }
                });
                it('Values produce the same hash', function () {
                    expect(VALUE_COUNTS).to.be.deep.equals([0, HASH_AMOUNT * colCount]);
                });

                it('Collisions in 32bit space are low', function () {
                    const collisions = [];
                    for (let i = 0; i < HASHED_COUNTS.length; i++) {

                        const count = HASHED_COUNTS[i] * (i + 1); // if i is 2 we have a collision of 2.
                        const collision = (count * 100) / (HASH_AMOUNT * colCount);
                        collisions.push(collision)
                    }
                    const probability = probabilityAtMax(HASH_AMOUNT * colCount);
                    const probabilityAsPercentage = (probability * 100);
                    // we add 1% to take into account random variance.
                    let expectedCollisions = probabilityAsPercentage + 0.5;

                    console.log(`${chalk.bold(`${HASH_AMOUNT * colCount}:`)}
   Collisions: ${chalk.green((HASH_AMOUNT * colCount) - HASHED_COUNTS[0])}
      ${chalk.gray('-   How many hash collisions did we have.')}
   Unique Hash Count: ${chalk.green(`[${HASHED_COUNTS}]`)}
      ${chalk.gray('-   Unique Hash counts, in order of repeats, index 0 is not repeated')}
   Proportions: ${chalk.green(`[${collisions}]`)}
      ${chalk.gray('-   What is the percentage portions of those hash counts.')}
   Precalculated Probability: ${chalk.green(`${probabilityAsPercentage.toFixed(4)}%`)}
      ${chalk.gray('-   Mathematical likelyhood of an entry colliding, with the perfect hashing algorithim.')}
   Test Collision Ceiling: ${chalk.green(`${expectedCollisions.toFixed(4)}%`)}
      ${chalk.gray('-   The value we use for testing to cater for random variation (0.5% higher)')}`);

                    expect(collisions[0]).to.be.greaterThan(100 - expectedCollisions);
                    for (let i = 1; i < collisions.length; i++) {
                        expect(collisions[i]).to.be.lessThan(expectedCollisions);
                        // we only need to include the error once.
                        expectedCollisions *= probabilityAsPercentage;
                    }
                });
            });
        }
    });
});
/* jshint ignore:end */