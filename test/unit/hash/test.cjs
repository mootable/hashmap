/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const Hash = {hash, hashCodeFor, equalsFor, equalsAndHash} = esmRequire('../../../src/hash')
const {sameValueZero} = esmRequire('../../../src/utils')
const {Option,some,none} = esmRequire('../../../src/option')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('Hash Functions', function () {
    describe('hash()', function () {
        it('no options', function () {
            expect(Hash.hash("helloworld")).to.be.equal(1933063992);
            expect(Hash.hash("HelloWorld")).to.be.equal(1601418099);
            expect(Hash.hash("HelloWorl")).to.be.equal(138955848);
        });
        it('with length', function () {
            expect(Hash.hash("helloworld", 6)).to.be.equal(-574932549);
            expect(Hash.hash("HelloWorld", 6)).to.be.equal(-336088073);
            expect(Hash.hash("HelloWorl", 6)).to.be.equal(-336088073);
        });
        it('with seed', function () {
            expect(Hash.hash("HelloWorld", 0, 1)).to.be.equal(-484980969);
            expect(Hash.hash("HelloWorld", 0, 2)).to.be.equal(187381547);
            expect(Hash.hash("HelloWorld", 0, 3)).to.be.equal(649577143);
        });
        it('with seed and length', function () {
            expect(Hash.hash("HelloWorld", 6, 1)).to.be.equal(-1651097962);
            expect(Hash.hash("HelloWorld", 6, 2)).to.be.equal(-1535466246);
            expect(Hash.hash("HelloWorld", 6, 3)).to.be.equal(1961415912);
        });
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