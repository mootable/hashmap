/* jshint ignore:start */
const chalk = require('chalk')
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const Hash = {hash, hashCodeFor, equalsFor, equalsAndHash} = esmRequire('../../../src/hash')
const {sameValueZero} = esmRequire('../../../src/utils')
const {Option,some,none} = esmRequire('../../../src/option')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('Hash Functions', function () {

    const rand = require('random-seed').create();
    /**
     * we use 32 bit hashes, as numbers go up there is more chance of collision,
     * so this is a sanity check to make sure the hash function spreads properly
     */
    describe('hash()', function () {
        it('no options', function () {
            expect(Hash.hash("helloworld")).to.be.equal(1835528551);
            expect(Hash.hash("HelloWorld")).to.be.equal(82333416);
            expect(Hash.hash("HelloWorle")).to.be.equal(-1277754921);
        });
        it('with length', function () {
            expect(Hash.hash("helloworld", 6)).to.be.equal(-680711315);
            expect(Hash.hash("HelloWorld", 6)).to.be.equal(-378100874);
            expect(Hash.hash("HelloWorle", 6)).to.be.equal(-378100874);
        });
        it('with seed', function () {
            expect(Hash.hash("HelloWorld", 0, 1)).to.be.equal(1505636030);
            expect(Hash.hash("HelloWorld", 0, 2)).to.be.equal(-1781177899);
            expect(Hash.hash("HelloWorld", 0, 3)).to.be.equal(1572924864);
        });
        it('with seed and length', function () {
            expect(Hash.hash("HelloWorld", 6, 1)).to.be.equal(1542308397);
            expect(Hash.hash("HelloWorld", 6, 2)).to.be.equal(95774133);
            expect(Hash.hash("HelloWorld", 6, 3)).to.be.equal(-1419050133);
        });
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
                        const hash = Hash.hash(value);
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
    describe('hashCodeFor()', function () {
        it('undefined', function () {
            expect(Hash.hashCodeFor(undefined)).to.be.equal(0);
        });
        it('null', function () {
            expect(Hash.hashCodeFor(null)).to.be.equal(0);
        });
        it('NaN', function () {
            expect(Hash.hashCodeFor(Math.sqrt(-1))).to.be.equal(0);
        });
        it('+Infinity', function () {
            expect(Hash.hashCodeFor(Number.POSITIVE_INFINITY)).to.be.equal(0);
        });
        it('-Infinity', function () {
            expect(Hash.hashCodeFor(Number.NEGATIVE_INFINITY)).to.be.equal(0);
        });
        it('false', function () {
            expect(Hash.hashCodeFor(false)).to.be.equal(0);
        });
        it('true', function () {
            expect(Hash.hashCodeFor(true)).to.be.equal(1);
        });
        it('string', function () {
            const string = "HelloWorld";
            // Hash checks are already done above.
            expect(Hash.hashCodeFor(string)).to.be.equal(Hash.hash(string));
        });

        it('integer', function () {
            const int = 12;
            // integers are the same value
            expect(Hash.hashCodeFor(int)).to.be.equal(int);
        });

        it('float', function () {
            const float = 1.22;
            // floats are stringified.
            expect(Hash.hashCodeFor(float)).to.be.equal(Hash.hash(float.toString()));
        });

        it('bigint', function () {
            const bigint = 9007199254740934291n;
            // bigints are stringified.
            expect(Hash.hashCodeFor(bigint)).to.be.equal(Hash.hash(bigint.toString()));
        });
        it('symbol', function () {
            const symbol = Symbol.for('HashCodeForTest');
            const symbolAsString = 'Symbol(HashCodeForTest)';
            expect(Hash.hashCodeFor(symbol)).to.be.equal(Hash.hash(symbolAsString));
        });
        it('function', function () {
            const func = (bar, foo) => bar + foo;
            const funcAsString = String(func);
            expect(Hash.hashCodeFor(func)).to.be.equal(Hash.hash(funcAsString));
        });

        it('hashCode as a function', function () {
            const hashCode = () => 37;
            const myObj = {
                hashCode,
                other: 'something else'
            }
            expect(Hash.hashCodeFor(myObj)).to.be.equal(37);
        });

        it('hashCode as a constant', function () {
            const hashCode =  38;
            const myObj = {
                hashCode,
                other: 'something else'
            }
            expect(Hash.hashCodeFor(myObj)).to.be.equal(38);
        });

        it('regex', function () {
            const regex = /ab+c/i;
            // regexs are stringified.
            expect(Hash.hashCodeFor(regex)).to.be.equal(Hash.hash(regex.toString()));
        });
        it('date', function () {
            const date = new Date(123456);
            // date we get the time since epoch
            expect(Hash.hashCodeFor(date)).to.be.equal(date.getTime());
        });
        it('option none', function () {
            const option = none;
            // if it has nothing we treat it like null
            expect(Hash.hashCodeFor(option)).to.be.equal(0);
        });
        it('option some', function () {
            const option = some(new Date(2345));
            // with options we multiply by a prime number. we have to expose it here.
            expect(Hash.hashCodeFor(option)).to.be.equal(2345*31);
        });

        it('no hash available, _mootable_hashCode preset by internal code', function () {
            const _mootable_hashCode =  39;
            const myObj = {
                _mootable_hashCode,
                other: 'something else'
            }
            expect(Hash.hashCodeFor(myObj)).to.be.equal(_mootable_hashCode);
        });

        it('no hash available, _mootable_hashCode preset by a naughty elf', function () {
            const _mootable_hashCode =  `WhoDunnit`;
            const myObj = {
                _mootable_hashCode,
                other: 'something else'
            }
            expect(Hash.hashCodeFor(myObj)).to.be.equal(Hash.hash(_mootable_hashCode));
        });

        it('no hash available, _mootable_hashCode not set by internal code', function () {
            // since another test might of run, we need to get the last mutable hashcode,
            // and then run it again and see if we get a different one..
            const first = {
                other: 'something else'
            }
            const firstHash = Hash.hashCodeFor(first);
            expect(first['_mootable_hashCode']).to.be.equal(firstHash);
            const second = {
                other: 'something else'
            }
            const secondHash = Hash.hashCodeFor(second);
            expect(secondHash ).to.not.be.equal(firstHash);
            expect(second['_mootable_hashCode']).to.be.equal(secondHash);
            // mathematically well duh!
            expect(second['_mootable_hashCode']).to.not.be.equal(firstHash);

            const firstHashAgain = Hash.hashCodeFor(first);
            expect(firstHashAgain ).to.be.equal(firstHash);
        });

    });
    describe('equalsFor()', function () {
        it('undefined', function () {
            expect(Hash.equalsFor(undefined)).to.be.equal(sameValueZero);
        });
        it('null', function () {
            expect(Hash.equalsFor(null)).to.be.equal(sameValueZero);
        });
        it('NaN', function () {
            expect(Hash.equalsFor(Math.sqrt(-1))).to.be.equal(sameValueZero);
        });
        it('+Infinity', function () {
            expect(Hash.equalsFor(Number.POSITIVE_INFINITY)).to.be.equal(sameValueZero);
        });
        it('-Infinity', function () {
            expect(Hash.equalsFor(Number.NEGATIVE_INFINITY)).to.be.equal(sameValueZero);
        });
        it('false', function () {
            expect(Hash.equalsFor(false)).to.be.equal(sameValueZero);
        });
        it('true', function () {
            expect(Hash.equalsFor(true)).to.be.equal(sameValueZero);
        });
        it('string', function () {
            const string = "HelloWorld";

            expect(Hash.equalsFor(string)).to.be.equal(sameValueZero);
        });

        it('integer', function () {
            const int = 12;

            expect(Hash.equalsFor(int)).to.be.equal(sameValueZero);
        });

        it('float', function () {
            const float = 1.22;

            expect(Hash.equalsFor(float)).to.be.equal(sameValueZero);
        });

        it('bigint', function () {
            const bigint = 9007199254740934291n;

            expect(Hash.equalsFor(bigint)).to.be.equal(sameValueZero);
        });
        it('symbol', function () {
            const symbol = Symbol.for('equalsForTest');
            expect(Hash.equalsFor(symbol)).to.be.equal(sameValueZero);
        });
        it('function', function () {
            const func = (bar, foo) => bar + foo;
            expect(Hash.equalsFor(func)).to.be.equal(sameValueZero);
        });

        it('equals as a function', function () {
            const equals = (key1,key2) => key1===key2;
            const myObj = {
                equals,
                other: 'something else'
            }
            const equalsResult = Hash.equalsFor(myObj);
            // we can't just expect a basic function as sameValueZero,
            // so we have to do the check for this in the test,
            expect(equalsResult(myObj,myObj)).to.be.true;

            expect(equalsResult(myObj, {})).to.be.false;
        });

        it('equals as a dud function', function () {
            const equals = (key1,key2) => false;
            const myObj = {
                equals,
                other: 'something else'
            }
            // if the key doesn't equal itself, this function is dud, and ignore it.
            expect(Hash.equalsFor(myObj)).to.be.equal(sameValueZero);
        });


        it('regex', function () {
            const regex = /ab+c/i;
            const equalsResult = Hash.equalsFor(regex);

            expect(equalsResult(regex,regex)).to.be.true;
            expect(equalsResult(regex, /ab+c/i)).to.be.true;

            expect(equalsResult(regex,/xy+z/i)).to.be.false;
            expect(equalsResult(regex, {})).to.be.false;
        });
        it('date', function () {
            const date = new Date(123456);
            const equalsResult = Hash.equalsFor(date);

            expect(equalsResult(date,date)).to.be.true;
            expect(equalsResult(date, new Date(123456))).to.be.true;

            expect(equalsResult(date,new Date(12))).to.be.false;
            expect(equalsResult(date, {})).to.be.false;
        });


        it('option none', function () {
            const option = none;
            const noneResult = Hash.equalsFor(option);

            expect(noneResult(option,option)).to.be.true;
            expect(noneResult(option,none)).to.be.true;

            expect(noneResult(option,some(1))).to.be.false;
        });
        it('option some', function () {
            const option = some(1);
            const someResult = Hash.equalsFor(option);

            expect(someResult(option,option)).to.be.true;
            expect(someResult(option,some(1))).to.be.true;
            expect(someResult(option,none)).to.be.false;
        });
    });
    describe('equalsAndHash()', function () {
        it('just the key', function () {
            const key = 1;
            const equalsAndHash = Hash.equalsAndHash(key);
            expect(equalsAndHash.hash).to.be.equal(1);
            expect(equalsAndHash.equals).to.be.equal(sameValueZero);
        });
        it('just the key and equals', function () {
            const key = 2;
            const equals = (key1,key2) => key1 === key2;
            const equalsAndHash = Hash.equalsAndHash(key, equals);
            expect(equalsAndHash.hash).to.be.equal(2);
            expect(equalsAndHash.equals).to.be.equal(equals);
        });
        it('just the key and hash', function () {
            const key = 3;
            const hash = 23;
            const equalsAndHash = Hash.equalsAndHash(key, undefined, hash);
            expect(equalsAndHash.hash).to.be.equal(hash);
            expect(equalsAndHash.equals).to.be.equal(sameValueZero);
        });
        it('the key, equals and hash', function () {
            const key = 4;
            const hash = 24;
            const equals = (key1,key2) => key1 === key2;
            const equalsAndHash = Hash.equalsAndHash(key, equals, hash);
            expect(equalsAndHash.hash).to.be.equal(hash);
            expect(equalsAndHash.equals).to.be.equal(equals);
        });

        it('just the key and bad equals', function () {
            const key = 5;
            const equals = (key1,key2) => false;
            const equalsAndHash = Hash.equalsAndHash(key, equals);
            expect(equalsAndHash.hash).to.be.equal(5);
            expect(equalsAndHash.equals).to.be.equal(sameValueZero);
        });
        it('the key, equals and bad hash', function () {
            const key = 6;
            const hash = 26.78;
            const equalsAndHash = Hash.equalsAndHash(key, undefined, hash);
            expect(equalsAndHash.hash).to.be.equal(6);
            expect(equalsAndHash.equals).to.be.equal(sameValueZero);
        });
    });
});
/* jshint ignore:end */