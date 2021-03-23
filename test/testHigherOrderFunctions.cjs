const expect = require('chai').expect;

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
 * Map Iterable
 * - ES6 Symbol.Iterator✓
 * - Specialist: forEach✓, collect✓, every✓, has✓, some✓, find✓, reduce✓, findIndex✓, indexOf✓, get✓
 * - Map Iterables: entries✓, filter✓, concatMap✓, mapEntries✓, mapKeys✓, mapValues✓
 * - Set Iterables:  keys✓, values✓, map✓, concat✓
 * - Properties: .size✓
 * Set Iterable
 * - ES6 Symbol.Iterator✓
 * - Specialist: forEach✓, collect✓, every✓, has✓, some✓, find✓, reduce✓
 * - Set Iterables: values✓, filter✓, map✓, concat✓
 * - Properties: .size✓
 */
describe('Higher Order Functions', function () {
    let LinkedHashMap, Mootable;
    let hashmap, mapIterator, setIterator;
    before(function () {
        const UnderTest = underTest();
        LinkedHashMap = UnderTest.LinkedHashMap;
        Mootable = UnderTest.Mootable;
        console.info(`Testing '${this.test.parent.title}' as '${UnderTest.name}' from '${UnderTest.location}'`);
        // runs once before the first test in this block
    });
    beforeEach(function () {
        hashmap = new LinkedHashMap();
        // you don't need the filter or maps, but showing some method chaining is fun.
        mapIterator = Mootable.MapIterable.from(hashmap).filter(() => true).mapKeys((value, key) => key);
        setIterator = Mootable.SetIterable.from(hashmap).filter(() => true).map((entry) => entry);
    });

    describe('high order method chaining', function () {

        it('should return an iterator on MapIterator methods', function () {
            expect(mapIterator.filter()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.mapKeys()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.mapValues()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.mapEntries()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.entries()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.concatMap()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.concat()).is.instanceOf(Mootable.MapIterable);

            expect(mapIterator.concat([])).is.instanceOf(Mootable.SetIterable);
            expect(mapIterator.map()).is.instanceOf(Mootable.SetIterable);
            expect(mapIterator.keys()).is.instanceOf(Mootable.SetIterable);
            expect(mapIterator.values()).is.instanceOf(Mootable.SetIterable);
        });
        it('should return an iterator on SetIterable methods', function () {
            expect(setIterator.filter()).is.instanceOf(Mootable.SetIterable);
            expect(setIterator.concat()).is.instanceOf(Mootable.SetIterable);
            expect(setIterator.map()).is.instanceOf(Mootable.SetIterable);
            expect(setIterator.values()).is.instanceOf(Mootable.SetIterable);
        });
    });

    describe('ES6 Iterators MapIterable', function () {
        it('should do nothing on an empty hashmap', function () {
            let called = false;
            for (const pair of mapIterator) { // jshint ignore:line
                // (`pair` is not used)
                called = true;
            }
            expect(called).to.be.false;
        });

        it('should iterate over all entries exactly once', function () {
            // Since order of iteration is not guaranteed, we'll keep track of which key-value pair has been checked, and how many times.
            const numberOfTries = 10;
            const calls = new Array(numberOfTries).fill(0);
            // Populate hashmap with ['keyI': I] pairs
            for (let i = 0; i < numberOfTries; i++) {
                hashmap.set('key' + i, i);
            }
            // Perform ES6 iteration
            for (let pair of mapIterator) {
                expect(pair[0]).to.equal('key' + pair[1]);
                calls[pair[1]]++;
            }
            expect(calls).to.deep.equal(new Array(numberOfTries).fill(1));
        });
    });
    describe('ES6 Iterators SetIterable', function () {
        it('should do nothing on an empty hashmap', function () {
            let called = false;
            for (const pair of setIterator) { // jshint ignore:line
                // (`pair` is not used)
                called = true;
            }
            expect(called).to.be.false;
        });

        it('should iterate over all entries exactly once', function () {
            // Since order of iteration is not guaranteed, we'll keep track of which key-value pair has been checked, and how many times.
            const numberOfTries = 10;
            const calls = new Array(numberOfTries).fill(0);
            // Populate hashmap with ['keyI': I] pairs
            for (let i = 0; i < numberOfTries; i++) {
                hashmap.set('key' + i, i);
            }
            // Perform ES6 iteration
            for (let pair of setIterator) {
                expect(pair[0]).to.equal('key' + pair[1]);
                calls[pair[1]]++;
            }
            expect(calls).to.deep.equal(new Array(numberOfTries).fill(1));
        });
    });
    describe('MapIterable.mapValues()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = mapIterator.mapValues(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return value;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should map all to the same value', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapValues(() => true).size).to.equal(2);
            expect(mapIterator.mapValues(() => true).collect()).to.deep.equal([['key', true], ['key2', true]]);
        });

        it('should map all to entry set if no function provided', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapValues().size).to.equal(2);
            expect(mapIterator.mapValues().collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should map all to different values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapValues((value, key) => {
                return value + 'Z';
            }).size)
                .to.equal(2);
            expect(mapIterator.mapValues((value, key) => {
                return value + 'Z';
            }).collect())
                .to.deep.equal([['key', 'valueZ'], ['key2', 'value2aZ']]);
        });


        it('should respect map context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.mapValues(function (value, key) {
                expect(this).to.equal(ctx);
                return [key, value];
            }, ctx).collect();
        });
    });
    describe('MapIterable.mapKeys()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = mapIterator.mapKeys(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return key;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should map all to the same value', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapKeys(() => true).size).to.equal(2);
            expect(mapIterator.mapKeys(() => true).collect()).to.deep.equal([[true, 'value'], [true, 'value2a']]);
        });

        it('should map all to entry set if no function provided', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapKeys().size).to.equal(2);
            expect(mapIterator.mapKeys().collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should map all to different values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapKeys((value, key) => {
                return key + 'Z';
            }).size)
                .to.equal(2);
            expect(mapIterator.mapKeys((value, key) => {
                return key + 'Z';
            }).collect())
                .to.deep.equal([['keyZ', 'value'], ['key2Z', 'value2a']]);
        });


        it('should respect map context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.mapKeys(function (value, key) {
                expect(this).to.equal(ctx);
                return [key, value];
            }, ctx).collect();
        });
    });
    describe('MapIterable.mapEntries()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const newIterator = mapIterator.mapEntries(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return [key, value];
            });
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should pass the basic test Key and Map Function', function () {
            hashmap.set('key', 'value');
            let calledValues = 0;
            let calledKeys = 0;
            const newIterator = mapIterator.mapEntries([function (value, key) {
                calledKeys++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }, function (value, key) {
                calledValues++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }]);
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(calledValues).to.equal(1);
            expect(calledKeys).to.equal(1);
            expect(ret).to.deep.equal([[true, true]]);
        });

        it('should pass the basic test Key Function', function () {
            hashmap.set('key', 'value');
            let calledKeys = 0;
            const newIterator = mapIterator.mapEntries([function (value, key) {
                calledKeys++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }, undefined]);
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(calledKeys).to.equal(1);
            expect(ret).to.deep.equal([[true, 'value']]);
        });
        it('should pass the basic test Value and Map Function', function () {
            hashmap.set('key', 'value');
            let calledValues = 0;
            const newIterator = mapIterator.mapEntries([undefined, function (value, key) {
                calledValues++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }]);
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(calledValues).to.equal(1);
            expect(ret).to.deep.equal([['key', true]]);
        });

        it('should throw a TypeError if I provide an empty array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries.bind(mapIterator, [])).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });

        it('should throw a TypeError if I provide a random non function', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries.bind(mapIterator, 'hi')).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });

        it('should throw a TypeError if I provide an array, with one entry and it is undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries.bind(mapIterator, [undefined])).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });
        it('should throw a TypeError if I provide an array, with two entries and they are undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries.bind(mapIterator, [undefined, undefined])).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });
        it('should map all to the same value', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries(() => [true, true]).size).to.equal(2);
            expect(mapIterator.mapEntries(() => [true, true]).collect()).to.deep.equal([[true, true], [true, true]]);
        });

        it('should map all to entry set if no function provided', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries().size).to.equal(2);
            expect(mapIterator.mapEntries().collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should map all to different values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.mapEntries((value, key) => {
                return [key + 'Z', value + 'Z'];
            }).size)
                .to.equal(2);
            expect(mapIterator.mapEntries((value, key) => {
                return [key + 'Z', value + 'Z'];
            }).collect())
                .to.deep.equal([['keyZ', 'valueZ'], ['key2Z', 'value2aZ']]);
        });


        it('should respect map context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.mapEntries(function (value, key) {
                expect(this).to.equal(ctx);
                return [key, value];
            }, ctx).collect();
        });
    });
    describe('MapIterable.map()', function () {
        it('should pass the basic test singleFunction', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const newIterator = mapIterator.map(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            });
            expect(newIterator).to.be.instanceOf(Mootable.SetIterable);
            const ret = newIterator.collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([true]);
        });
        it('should pass the basic test Key and Map Function', function () {
            hashmap.set('key', 'value');
            let calledValues = 0;
            let calledKeys = 0;
            const newIterator = mapIterator.map([function (value, key) {
                calledKeys++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }, function (value, key) {
                calledValues++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }]);
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(calledValues).to.equal(1);
            expect(calledKeys).to.equal(1);
            expect(ret).to.deep.equal([[true, true]]);
        });

        it('should pass the basic test Key Function', function () {
            hashmap.set('key', 'value');
            let calledKeys = 0;
            const newIterator = mapIterator.map([function (value, key) {
                calledKeys++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }, undefined]);
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(calledKeys).to.equal(1);
            expect(ret).to.deep.equal([[true, 'value']]);
        });
        it('should pass the basic test Value and Map Function', function () {
            hashmap.set('key', 'value');
            let calledValues = 0;
            const newIterator = mapIterator.map([undefined, function (value, key) {
                calledValues++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }]);
            expect(newIterator).to.be.instanceOf(Mootable.MapIterable);
            const ret = newIterator.collect();
            expect(calledValues).to.equal(1);
            expect(ret).to.deep.equal([['key', true]]);
        });

        it('should throw a TypeError if I provide an empty array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map.bind(mapIterator, [])).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });

        it('should throw a TypeError if I provide a random non function', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map.bind(mapIterator, 'hi')).to.throw('MapIterable.map expects a function or an array of functions');
        });

        it('should throw a TypeError if I provide an array, with one entry and it is undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map.bind(mapIterator, [undefined])).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });
        it('should throw a TypeError if I provide an array, with two entries and they are undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map.bind(mapIterator, [undefined, undefined])).to.throw('MapIterable.mapEntries expects a function or an array of functions');
        });

        it('should map all to true', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map(() => true).size).to.equal(2);
            expect(mapIterator.map(() => true).collect()).to.deep.equal([true, true]);

        });

        it('should map all to entry set if no function provided', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map().size).to.equal(2);
            expect(mapIterator.map().collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should map all to different values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map((value, key) => {
                return {v: value + 'Z', k: key + 'Z'};
            }).size)
                .to.equal(2);
            expect(mapIterator.map((value, key) => {
                return {v: value + 'Z', k: key + 'Z'};
            }).collect())
                .to.deep.equal([{k: 'keyZ', v: 'valueZ'}, {k: 'key2Z', v: 'value2aZ'}]);
        });

        it('should map to undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.map((value, key) => undefined).size)
                .to.equal(2);
            expect(mapIterator.map((value, key) => undefined).collect())
                .to.deep.equal([undefined, undefined]);
        });

        it('should respect map context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.map(function () {
                expect(this).to.equal(ctx);
            }, ctx).collect();
        });
    });
    describe('SetIterable.map()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = setIterator.map(function (entry) {
                called++;
                expect(entry[1]).to.equal('value');
                expect(entry[0]).to.equal('key');
                expect(this).to.equal(setIterator);
                return true;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([true]);
        });

        it('should map all to true', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.map(() => true).size).to.equal(2);
            expect(setIterator.map(() => true).collect()).to.deep.equal([true, true]);
        });

        it('should map all to entry set if no function provided', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.map().size).to.equal(2);
            expect(setIterator.map().collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should map all to different values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.map((entry) => {
                return {v: entry[1] + 'Z', k: entry[0] + 'Z'};
            }).size)
                .to.equal(2);
            let ret = setIterator.map((entry) => {
                return {v: entry[1] + 'Z', k: entry[0] + 'Z'};
            }).collect();
            expect(ret[0].k)
                .to.equal('keyZ');
            expect(ret[0].v)
                .to.equal('valueZ');
            expect(ret[1].k)
                .to.equal('key2Z');
            expect(ret[1].v)
                .to.equal('value2aZ');
        });

        it('should map to undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.map((value) => undefined).size)
                .to.equal(2);
            expect(setIterator.map((value) => undefined).collect())
                .to.deep.equal([undefined, undefined]);
        });

        it('should respect map context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.map(function () {
                expect(this).to.equal(ctx);
            }, ctx).collect();
        });
    });
    describe('MapIterable.filter()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = mapIterator.filter(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                return true;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should collect all if filter is true', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.filter(() => true).size).to.equal(2);
            expect(mapIterator.filter(() => true).collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should collect none if filter is false', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.filter(() => false).size).to.equal(0);
            expect(mapIterator.filter(() => false).collect()).to.be.empty;
        });

        it('should filter out all but one', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key3', 'value3');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.filter((value) => value === 'value3').size).to.equal(1);
            expect(mapIterator.filter((value) => value === 'value3').collect()).to.deep.equal([['key3', 'value3']]);
        });

        it('should filter out just one', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key3', 'value3');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.filter((value) => value !== 'value3').size).to.equal(2);
            expect(mapIterator.filter((value) => value !== 'value3').collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should work on empty map', function () {
            expect(mapIterator.filter(() => true).size).to.equal(0);
            expect(mapIterator.filter(() => true).collect()).to.be.empty;
        });

        it('should remain consistent among calls', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.filter(() => true).collect()).to.deep.equal(mapIterator.filter(() => true).collect());
        });

        it('should respect filter context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.filter(function () {
                expect(this).to.equal(ctx);
            }, ctx).collect();
        });
    });

    describe('SetIterable.filter()', function () {

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = setIterator.filter(function (value) {
                called++;
                expect(value).to.deep.equal(['key', 'value']);
                expect(this).to.equal(setIterator);
                return true;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should collect all if filter is true', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.filter(() => true).size).to.equal(2);
            expect(setIterator.filter(() => true).collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should collect none if filter is false', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.filter(() => false).size).to.equal(0);
            expect(setIterator.filter(() => false).collect()).to.be.empty;
        });

        it('should filter out all but one', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key3', 'value3');
            hashmap.set('key2', 'value2a');
            expect(setIterator.filter((entry) => entry[1] === 'value3').size).to.equal(1);
            expect(setIterator.filter((entry) => entry[1] === 'value3').collect()).to.deep.equal([['key3', 'value3']]);
        });

        it('should filter out just one', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key3', 'value3');
            hashmap.set('key2', 'value2a');
            expect(setIterator.filter((entry) => entry[1] !== 'value3').size).to.equal(2);
            expect(setIterator.filter((entry) => entry[1] !== 'value3').collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should work on empty map', function () {
            expect(setIterator.filter(() => true).size).to.equal(0);
            expect(setIterator.filter(() => true).collect()).to.be.empty;
        });

        it('should remain consistent among calls', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.filter(() => true).collect()).to.deep.equal(setIterator.filter(() => true).collect());
        });

        it('should respect filter context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.filter(function () {
                expect(this).to.equal(ctx);
            }, ctx).collect();
        });
    });
    describe('MapIterable.forEach()', function () {
        function collect() {
            let pairs = [];
            mapIterator.forEach(function (value, key) {
                pairs.push({key: key, value: value});
            });
            return pairs;
        }

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            mapIterator.forEach(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
            });
            expect(called).to.equal(1);
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(collect().length).to.equal(2);
        });

        it('should not call the callback on empty map', function () {
            expect(collect()).to.be.empty;
        });

        it('should remain consistent among calls', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(collect()).to.deep.equal(collect());
        });

        it('should respect forEach context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.forEach(function (value, key) {
                expect(this).to.equal(ctx);
            }, ctx);
        });
    });
    describe('SetIterable.forEach()', function () {
        function collect() {
            let entries = [];
            setIterator.forEach(function (value) {
                entries.push(value);
            });
            return entries;
        }

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            setIterator.forEach(function ([key, value]) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(setIterator);
            });
            expect(called).to.equal(1);
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(collect().length).to.equal(2);
        });

        it('should not call the callback on empty map', function () {
            expect(collect()).to.be.empty;
        });

        it('should remain consistent among calls', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(collect()).to.deep.equal(collect());
        });

        it('should respect forEach context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.forEach(function () {
                expect(this).to.equal(ctx);
            }, ctx);
        });
    });

    describe('MapIterable.collect()', function () {

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            const collected = mapIterator.collect();
            expect(collected).to.deep.equal([['key', 'value']]);
        });

        it('collect on an array', function () {
            hashmap.set('key', 'value');
            const collected = [];
            const ret = mapIterator.collect(collected);
            expect(collected).to.deep.equal([]);
            expect(ret).to.deep.equal([['key', 'value']]);
        });
        it('collect on an array with contents', function () {
            hashmap.set('key', 'value');
            const collected = ['other'];
            const ret = mapIterator.collect(collected);
            expect(ret).to.deep.equal(['other', ['key', 'value']]);
            expect(collected).to.deep.equal(['other']);
        });
        it('collect on an array with multiple', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = ['other'];
            const ret = mapIterator.collect(collected);
            expect(ret).to.deep.equal(['other', ['key', 'value'], ['key2', 'value2a']]);
            expect(collected).to.deep.equal(['other']);
        });

        it('collect on an array with filter', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = mapIterator.filter(value => value !== 'value').collect();
            expect(collected).to.deep.equal([['key2', 'value2a']]);
        });

        it('collect on an array with empty map', function () {
            const collected = mapIterator.collect();
            expect(collected).to.be.empty;
        });
        it('collect on a map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = mapIterator.collect(new Map());
            expect(collected.size).to.equal(2);
            expect(collected.get('key')).to.equal('value');
            expect(collected.get('key2')).to.equal('value2');
        });
        it('collect on a HashMap', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = mapIterator.collect(new LinkedHashMap());
            expect(collected.size).to.equal(2);
            expect(collected.get('key')).to.equal('value');
            expect(collected.get('key2')).to.equal('value2');
        });
        it('collect on a Set', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = mapIterator.collect(new Set());
            expect(collected.size).to.equal(2);
            const values = collected.values();
            expect(values.next().value).to.deep.equal(['key', 'value']);
            expect(values.next().value).to.deep.equal(['key2', 'value2']);
        });
        it('collect on an Object', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = mapIterator.collect({});
            expect(collected).to.deep.equal({'key': 'value', 'key2': 'value2'});
        });
    });

    describe('SetIterable.collect()', function () {

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            const collected = setIterator.collect();
            expect(collected).to.deep.equal([['key', 'value']]);
        });

        it('collect on an array', function () {
            hashmap.set('key', 'value');
            const collected = [];
            const ret = setIterator.collect(collected);
            expect(ret).to.deep.equal([['key', 'value']]);
            expect(collected).to.deep.equal([]);
        });
        it('collect on an array with contents', function () {
            hashmap.set('key', 'value');
            const collected = ['other'];
            const ret = setIterator.collect(collected);
            expect(ret).to.deep.equal(['other', ['key', 'value']]);
            expect(collected).to.deep.equal(['other']);
        });
        it('collect on an array with multiple', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = ['other'];
            const ret = setIterator.collect(collected);
            expect(ret).to.deep.equal(['other', ['key', 'value'], ['key2', 'value2a']]);
            expect(collected).to.deep.equal(['other']);
        });
        it('collect on a Set', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = setIterator.collect(new Set());
            expect(collected.size).to.equal(2);
            const values = collected.values();
            expect(values.next().value).to.deep.equal(['key', 'value']);
            expect(values.next().value).to.deep.equal(['key2', 'value2']);
        });

        it('collect on an array with filter', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = setIterator.filter(value => value[1] !== 'value').collect();
            expect(collected).to.deep.equal([['key2', 'value2a']]);
        });

        it('collect on an array with empty map', function () {
            const collected = setIterator.collect();
            expect(collected).to.be.empty;
        });
        it('collect on a map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = setIterator.collect(new Map());
            expect(collected.size).to.equal(2);
            const arr = Array.from(collected.keys());
            expect(arr).to.deep.equal([['key', 'value'], ['key2', 'value2']]);
        });
        it('collect on a HashMap', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = setIterator.collect(new LinkedHashMap());
            expect(collected.size).to.equal(2);
            const arr = Array.from(collected.keys());
            expect(arr).to.deep.equal([['key', 'value'], ['key2', 'value2']]);
        });
    });

    describe('MapIterable.has()', function () {
        it('should return false when it does not have an entry with a key', function () {
            expect(mapIterator.has('key')).to.be.false;
        });

        it('should return true when it has an entry with a key', function () {
            hashmap.set('key', 'value');
            expect(mapIterator.has('key')).to.be.true;
        });
    });
    describe('SetIterable.has()', function () {
        it('should return false when it does not have an entry with a value', function () {
            const myFunc = entry => entry[0];
            const mapped = setIterator.map(myFunc);
            expect(mapped.has('key')).to.be.false;
        });

        it('should return true when it has an entry with a key', function () {
            hashmap.set('key', 'value');
            const myFunc = function (entry) {
                return entry[0];
            };
            const mapped = setIterator.map(myFunc);
            expect(mapped.has('key')).to.be.true;
        });
    });
    describe('MapIterable.every()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const every = mapIterator.every(function (value, key, iterable) {
                called++;
                expect(value).to.be.equal('value');
                expect(key).to.be.equal('key');
                expect(this).to.equal(mapIterator);
                expect(iterable).to.equal(mapIterator);
                return true;
            });
            expect(called).to.equal(1);
            expect(every).to.be.true;
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const every = mapIterator.every(function (value, key) {
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                }
                return true;
            });
            expect(called).to.equal(2);
            expect(every).to.be.true;
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be true on an empty map', function () {
            expect(mapIterator.every(() => false)).to.be.true;
            expect(mapIterator.every(() => true)).to.be.true;
        });

        it('should return false if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.every(() => false)).to.be.false;
        });

        it('should return true if no predicate included', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.every()).to.be.true;
        });

        it('should true false if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.every(() => true)).to.be.true;
        });
        it('should return false if one is wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.every((value) => value !== 'value2')).to.be.false;
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.every(function () {
                expect(this).to.equal(ctx);
            }, ctx);
        });
    });

    describe('SetIterable.every()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const every = setIterator.every(function (value, key, iterable) {
                called++;
                expect(value).to.deep.equal(['key', 'value']);
                expect(key).to.deep.equal(['key', 'value']);
                expect(this).to.equal(setIterator);
                expect(iterable).to.equal(setIterator);
                return true;
            });
            expect(called).to.equal(1);
            expect(every).to.be.true;
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const every = setIterator.every(function (entry) {
                const [key, value] = entry;
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                }
                return true;
            });
            expect(called).to.equal(2);
            expect(every).to.be.true;
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be true on an empty map', function () {
            expect(setIterator.every(() => false)).to.be.true;
            expect(setIterator.every(() => true)).to.be.true;
        });

        it('should return false if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.every(() => false)).to.be.false;
        });

        it('should return true if no predicate included', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.every()).to.be.true;
        });

        it('should true false if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.every(() => true)).to.be.true;
        });
        it('should return false if one is wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.every((entry) => entry[1] !== 'value2')).to.be.false;
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.every(function () {
                expect(this).to.equal(ctx);
            }, ctx);
        });
    });

    describe('MapIterable.some()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const some = mapIterator.some(function (value, key, iterable) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                expect(iterable).to.equal(mapIterator);
                return false;
            });
            expect(called).to.equal(1);
            expect(some).to.be.false;
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const some = mapIterator.some(function (value, key) {
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                }
                return false;
            });
            expect(called).to.equal(2);
            expect(some).to.be.false;
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be false on an empty map', function () {
            expect(mapIterator.some(() => false)).to.be.false;
            expect(mapIterator.some(() => true)).to.be.false;
        });

        it('should return true if no predicate included', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.some()).to.be.true;
        });
        it('should return false if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.some(() => false)).to.be.false;
        });
        it('should return true if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.some(() => true)).to.be.true;
        });

        it('should return true if only one is right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.some((value) => value === 'value2')).to.be.true;
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.some(function () {
                expect(this).to.equal(ctx);
                return true;
            }, ctx);
        });
    });

    describe('SetIterable.some()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const some = setIterator.some(function (entry, iterable) {
                called++;
                const [key, value] = entry;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(setIterator);
                expect(iterable).to.equal(setIterator);
                return false;
            });
            expect(called).to.equal(1);
            expect(some).to.be.false;
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const some = setIterator.some(function (entry) {
                const [key, value] = entry;
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                }
                return false;
            });
            expect(called).to.equal(2);
            expect(some).to.be.false;
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be false on an empty map', function () {
            expect(setIterator.some(() => false)).to.be.false;
            expect(setIterator.some(() => true)).to.be.false;
        });

        it('should return false if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.some(() => false)).to.be.false;
        });

        it('should return true if no predicate included', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.some()).to.be.true;
        });
        it('should return true if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.some(() => true)).to.be.true;
        });

        it('should return true if only one is right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.some((entry) => entry[1] === 'value2')).to.be.true;
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.some(function () {
                expect(this).to.equal(ctx);
                return true;
            }, ctx);
        });
    });
    describe('MapIterable.find()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const find = mapIterator.find(function (value, key, iterable) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                expect(iterable).to.equal(mapIterator);
                return true;
            });
            expect(called).to.equal(1);
            expect(find).to.be.equal('value');
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const find = mapIterator.find(function (value, key) {
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                    return false;
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                    return true;
                }
            });
            expect(called).to.equal(2);
            expect(find).to.be.equal('value2a');
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be undefined on an empty map', function () {
            expect(mapIterator.find(() => false)).to.be.undefined;
            expect(mapIterator.find(() => true)).to.be.undefined;
        });

        it('should return undefined if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.find(() => false)).to.be.undefined;
        });
        it('should return first if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.find(() => true)).to.be.equal('value');
        });

        it('should return true if only one is right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.find((value) => value === 'value2')).to.be.equal('value2');
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.find(function () {
                expect(this).to.equal(ctx);
                return true;
            }, ctx);
        });
    });


    describe('SetIterable.find()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const find = setIterator.find(function (entry, entry2, iterable) {
                const [key, value] = entry;
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(setIterator);
                expect(iterable).to.equal(setIterator);
                return true;
            });
            expect(called).to.equal(1);
            expect(find).to.be.deep.equal(['key', 'value']);
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const find = setIterator.find(function (entry) {
                const [key, value] = entry;
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                    return false;
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                    return true;
                }
            });
            expect(called).to.equal(2);
            expect(find).to.be.deep.equal(['key2', 'value2a']);
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be undefined on an empty map', function () {
            expect(setIterator.find(() => false)).to.be.undefined;
            expect(setIterator.find(() => true)).to.be.undefined;
        });

        it('should return undefined if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.find(() => false)).to.be.undefined;
        });
        it('should return first if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.find(() => true)).to.be.deep.equal(['key', 'value']);
        });

        it('should return true if only one is right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.find((entry) => entry[1] === 'value2')).to.be.deep.equal(['key2', 'value2']);
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.find(function () {
                expect(this).to.equal(ctx);
                return true;
            }, ctx);
        });
    });

    describe('MapIterable.reduce()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            const called = mapIterator.reduce(function (accumulator, value, key, iterable) {
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                expect(iterable).to.equal(mapIterator);
                return accumulator + 1;
            }, 0);
            expect(called).to.equal(1);
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            const calledPlus10 = mapIterator.reduce(function (accumulator, value, key) {
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                }
                return accumulator + 2;
            }, 10);
            expect(calledPlus10).to.be.equal(14);
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be undefined on an empty map', function () {
            expect(mapIterator.reduce(() => false)).to.be.undefined;
            expect(mapIterator.reduce(() => true)).to.be.undefined;
        });

        it('should return new value if intializer is undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.reduce(() => true)).to.be.true;
        });

        it('should accumulate all values', function () {
            hashmap.set('key', 3);
            hashmap.set('key2', 5);
            expect(mapIterator.reduce((accumulator, value) => accumulator + value, 1)).to.be.equal(9);
        });

        it('should accumulate all strings', function () {
            hashmap.set('key', 'one');
            hashmap.set('key2', 4);
            expect(mapIterator.reduce((accumulator, value) => accumulator + value, 'hi')).to.be.equal('hione4');
        });

        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.reduce(function () {
                expect(this).to.equal(ctx);
                return true;
            }, true, ctx);
        });
    });

    describe('SetIterable.reduce()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            const called = setIterator.reduce(function (accumulator, entry, entry2, iterable) {
                const [key, value] = entry;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(setIterator);
                expect(iterable).to.equal(setIterator);
                return accumulator + 1;
            }, 0);
            expect(called).to.equal(1);
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            const calledPlus10 = setIterator.reduce(function (accumulator, entry) {
                const [key, value] = entry;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                }
                return accumulator + 2;
            }, 10);
            expect(calledPlus10).to.be.equal(14);
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be undefined on an empty map', function () {
            expect(setIterator.reduce(() => false)).to.be.undefined;
            expect(setIterator.reduce(() => true)).to.be.undefined;
        });

        it('should return new value if intializer is undefined', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(setIterator.reduce(() => true)).to.be.true;
        });

        it('should accumulate all values', function () {
            hashmap.set('key', 3);
            hashmap.set('key2', 5);
            expect(setIterator.reduce((accumulator, entry) => accumulator + entry[1], 1)).to.be.equal(9);
        });

        it('should accumulate all strings', function () {
            hashmap.set('key', 'one');
            hashmap.set('key2', 4);
            expect(setIterator.reduce((accumulator, entry) => accumulator + entry[1], 'hi')).to.be.equal('hione4');
        });

        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            setIterator.reduce(function () {
                expect(this).to.equal(ctx);
                return true;
            }, true, ctx);
        });
    });
    describe('MapIterable.findIndex()', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const find = mapIterator.findIndex(function (value, key, iterable) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(mapIterator);
                expect(iterable).to.equal(mapIterator);
                return true;
            });
            expect(called).to.equal(1);
            expect(find).to.be.equal('key');
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const find = mapIterator.findIndex(function (value, key) {
                called++;
                if (key === 'key') {
                    called1 = true;
                    expect(value).to.be.equal('value');
                    return false;
                } else if (key === 'key2') {
                    called2 = true;
                    expect(value).to.be.equal('value2a');
                    return true;
                }
            });
            expect(called).to.equal(2);
            expect(find).to.be.equal('key2');
            expect(called1).to.be.true;
            expect(called2).to.be.true;
        });

        it('should be undefined on an empty map', function () {
            expect(mapIterator.findIndex(() => false)).to.be.undefined;
            expect(mapIterator.findIndex(() => true)).to.be.undefined;
        });

        it('should return undefined if all are wrong', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.findIndex(() => false)).to.be.undefined;
        });
        it('should return first if all are right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.findIndex(() => true)).to.be.equal('key');
        });

        it('should return true if only one is right', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(mapIterator.findIndex((value) => value === 'value2')).to.be.equal('key2');
        });
        it('should respect function context', function () {
            hashmap.set('key', 'value');
            let ctx = {};
            mapIterator.findIndex(function () {
                expect(this).to.equal(ctx);
                return true;
            }, ctx);
        });
    });
    describe('MapIterable.indexOf()', function () {
        it('should return undefined when it does not have an entry with a value', function () {
            expect(mapIterator.indexOf('value')).to.be.undefined;
        });

        it('should return key under which a value is stored', function () {
            hashmap.set('key', 'value');
            expect(mapIterator.indexOf('value')).to.equal('key');
        });
    });

    describe('MapIterable.get()', function () {
        var uid = 1;

        function val() {
            return 'value' + uid++;
        }

        it('should map the same key consistently to the same hash', function () {
            function check(key) {
                var value = val();
                hashmap.set(key, value);
                expect(mapIterator.get(key)).to.equal(value);
            }

            check(null);
            check(undefined);
            check(false);
            check(NaN);
            check(1);
            check('Test');
            check(/test/);
            check(new Date(1986, 7, 15, 12, 5, 0, 0));
            check([]);
            check({});
            check(LinkedHashMap);
            check(hashmap);
        });

        it('should map these pair of keys to the same hash', function () {
            function check(key, key2) {
                var value = val();
                hashmap.set(key, value);
                const ret = mapIterator.get(key2);
                expect(ret).to.equal(value);
            }

            check(null, null);
            check(undefined, undefined);
            check(false, false);
            check(NaN, NaN);
            check(1, 1);
            check('Test', 'Test');
            check(/test/, /test/);
            check(new Date(1986, 7, 15, 12, 5, 0, 0), new Date(1986, 7, 15, 12, 5, 0, 0));
            check([], []);
            check([1, 2, 'Q'], [1, 2, 'Q']);
            check([null, /a/, NaN], [null, /a/, NaN]);
        });

        it('should NOT map these pair of keys to the same hash', function () {
            function check(key, key2) {
                var value = val();
                hashmap.set(key, value);
                expect(mapIterator.get(key2)).not.to.equal(value);
            }

            check(null, undefined);
            check(null, false);
            check(false, 0);
            check(false, '');
            check(1, '1');
            check(/test/, /test2/);
            check(/test/, '/test/');
            check(new Date(123456789), new Date(987654321));
            check({}, {});
            check(hashmap, Object.create(hashmap));
        });
    });
    describe('MapIterable.keys()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(mapIterator.keys())).to.be.empty;
        });

        it('should return an array with one key once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(mapIterator.keys())).to.deep.equal(['key']);
        });

        it('should work for several keys', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(mapIterator.keys()).sort()).to.deep.equal(['key', 'key2']);
        });
    });

    describe('MapIterable.values()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(mapIterator.values())).to.be.empty;
        });

        it('should return an array with one value once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(mapIterator.values())).to.deep.equal(['value']);
        });

        it('should work for several values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(mapIterator.values()).sort()).to.deep.equal(['value', 'value2']);
        });
    });

    describe('MapIterable.entries()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(mapIterator.entries())).to.be.empty;
        });

        it('should return an array with one value once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(mapIterator.entries())).to.deep.equal([['key', 'value']]);
        });

        it('should work for several values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(mapIterator.entries()).sort()).to.deep.equal([['key', 'value'], ['key2', 'value2']]);
        });
    });

    describe('SetIterable.values()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(setIterator.values())).to.be.empty;
        });

        it('should return an array with one value once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(setIterator.values())).to.deep.equal([['key', 'value']]);
        });

        it('should work for several values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(setIterator.values()).sort()).to.deep.equal([['key', 'value'], ['key2', 'value2']]);
        });
    });
    describe('MapIterable.size', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let size = mapIterator.size;
            expect(size).to.equal(1);
        });

        it('should return a size even with replaced keys', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const size = mapIterator.size;
            expect(size).to.equal(2);
        });

        it('should be 0 on an  empty map', function () {
            const size = mapIterator.size;
            expect(size).to.equal(0);
        });


        it('should size on an unsized iterable', function () {
            const myIterable = {
                * [Symbol.iterator]() {
                    yield ["key1", "value1"];
                    yield ["key2", "value2"];
                    yield ["key3", "value3"];
                }
            };
            const myMapIterator = Mootable.MapIterable.from(myIterable);
            const size = myMapIterator.size;
            expect(size).to.equal(3);
        });
        it('should not count deleted values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.delete('key2');
            const size = mapIterator.size;
            expect(size).to.equal(1);
        });

        it('should not count filtered values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            const size = mapIterator.filter((value) => (value === 'value2')).size;
            expect(size).to.equal(1);
        });
        it('should count concatenated maps', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            const hashmap2 = [['key3', 'value3']];
            const size = mapIterator.concatMap(hashmap2).size;
            expect(size).to.equal(3);
        });
        it('should count concatenated sets', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            const other = ['somethihng', 'other'];
            const size = mapIterator.concat(other).size;
            expect(size).to.equal(4);
        });
    });
    describe('SetIterable.size', function () {
        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let size = setIterator.size;
            expect(size).to.equal(1);
        });

        it('should return a size even with replaced keys', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const size = setIterator.size;
            expect(size).to.equal(2);
        });

        it('should be 0 on an  empty map', function () {
            const size = setIterator.size;
            expect(size).to.equal(0);
        });

        it('should size on an unsized iterable', function () {
            const myIterable = {
                * [Symbol.iterator]() {
                    yield "value1";
                    yield "value2";
                    yield "value3";
                }
            };
            const mySetIterator = Mootable.SetIterable.from(myIterable);
            const size = mySetIterator.size;
            expect(size).to.equal(3);
        });
        it('should not count deleted values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.delete('key2');
            const size = setIterator.size;
            expect(size).to.equal(1);
        });

        it('should not count filtered values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            const size = setIterator.filter((entry) => (entry[1] === 'value2')).size;
            expect(size).to.equal(1);
        });

        it('should count concatenated sets', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            const other = ['somethihng', 'other'];
            const size = setIterator.concat(other).size;
            expect(size).to.equal(4);
        });
    });
    describe('MapIterable.concat', function () {

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = mapIterator.concat([]).filter(function (value) {
                called++;
                expect(value).to.deep.equal(['key', 'value']);
                expect(this).to.be.instanceOf(Mootable.SetIterable);
                return true;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should concat empty array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.concat([]).filter(() => true).size).to.equal(2);
            expect(mapIterator.concat([]).filter(() => true).collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should concat values from an array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.concat(['other']).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a'], 'other']);
            expect(mapIterator.concat(['other']).size).to.equal(3);
        });

        it('should concat from an empty map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let otherMap = new Map();
            expect(mapIterator.concat(otherMap).filter(() => true).size).to.equal(2);
            expect(mapIterator.concat(otherMap).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should concat from a map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let otherMap = new Map();
            otherMap.set('key3', 'value3');
            otherMap.set('key4', 'value4');
            expect(mapIterator.concat(otherMap).filter(() => true).size).to.equal(4);
            expect(mapIterator.concat(otherMap).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a'], ['key3', 'value3'], ['key4', 'value4']]);
        });
    });
    describe('SetIterable.concat', function () {

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = setIterator.concat([]).filter(function (value) {
                called++;
                expect(value).to.deep.equal(['key', 'value']);
                expect(this).to.be.instanceOf(Mootable.SetIterable);
                return true;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should concat empty array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.concat([]).filter(() => true).size).to.equal(2);
            expect(setIterator.concat([]).filter(() => true).collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should concat values from an array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(setIterator.concat(['other']).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a'], 'other']);
            expect(setIterator.concat(['other']).size).to.equal(3);
        });

        it('should concat from an empty map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let otherMap = new Map();
            expect(setIterator.concat(otherMap).filter(() => true).size).to.equal(2);
            expect(setIterator.concat(otherMap).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should concat from a map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let otherMap = new Map();
            otherMap.set('key3', 'value3');
            otherMap.set('key4', 'value4');
            expect(setIterator.concat(otherMap).filter(() => true).size).to.equal(4);
            expect(setIterator.concat(otherMap).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a'], ['key3', 'value3'], ['key4', 'value4']]);
        });
    });

    describe('MapIterable.concatMap', function () {

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            const ret = mapIterator.concatMap([]).filter(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.be.instanceOf(Mootable.MapIterable);
                return true;
            }).collect();
            expect(called).to.equal(1);
            expect(ret).to.deep.equal([['key', 'value']]);
        });

        it('should concatMap empty array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.concatMap([]).filter(() => true).size).to.equal(2);
            expect(mapIterator.concatMap([]).filter(() => true).collect()).to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should concatMap values from an array', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(mapIterator.concatMap([['key3', 'value3']]).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a'], ['key3', 'value3']]);
            expect(mapIterator.concatMap(['other']).size).to.equal(3);
        });

        it('should concatMap from an empty map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let otherMap = new Map();
            expect(mapIterator.concatMap(otherMap).filter(() => true).size).to.equal(2);
            expect(mapIterator.concatMap(otherMap).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a']]);
        });

        it('should concatMap from a map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let otherMap = new Map();
            otherMap.set('key3', 'value3');
            otherMap.set('key4', 'value4');
            expect(mapIterator.concatMap(otherMap).filter(() => true).size).to.equal(4);
            expect(mapIterator.concatMap(otherMap).filter(() => true).collect())
                .to.deep.equal([['key', 'value'], ['key2', 'value2a'], ['key3', 'value3'], ['key4', 'value4']]);
        });
    });
});