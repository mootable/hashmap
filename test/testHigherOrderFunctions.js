/*jshint -W030,-W121 */
const expect = require('chai').expect,
    {LinkedHashMap, Mootable} = require('../hashmap');
let hashmap, mapIterator, setIterator;

/**
 * Map Iterable
 * - Specialist: forEach✓, collect✓, every, some, find, findIndex, indexOf, has✓, get, reduce
 * - Map Iterables: filter,mapKeys,mapValues,mapEntries,concatMap,entries
 * - Set Iterables: map, keys, values,concat
 * - Properties: .size
 * Set Iterable
 * - Specialist: forEach✓, collect✓, reduce, every, some, find, has✓
 * - Set Iterables: filter, map, concat, values
 * - Properties: .size
 */
describe('Higher Order Functions', function () {
    beforeEach(function () {
        hashmap = new LinkedHashMap();
        mapIterator = Mootable.mapIterator(hashmap);
        setIterator = Mootable.setIterator(hashmap);
    });

    describe('high order method chaining', function () {

        it('should return an iterator on MapIterator methods', function () {
            expect(mapIterator.filter()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.mapKeys()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.mapValues()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.mapEntries()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.entries()).is.instanceOf(Mootable.MapIterable);
            expect(mapIterator.concatMap()).is.instanceOf(Mootable.MapIterable);

            expect(mapIterator.concat()).is.instanceOf(Mootable.SetIterable);
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

        it('should not call the callback on delete keys', function () {
            hashmap.set('key', 'value');
            hashmap.delete('key');
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

        it('should not call the callback on delete keys', function () {
            hashmap.set('key', 'value');
            hashmap.delete('key');
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
            expect(collected).to.deep.equal([['key', 'value']]);
            expect(collected).to.deep.equal(ret);
        });
        it('collect on an array with contents', function () {
            hashmap.set('key', 'value');
            const collected = ['other'];
            const ret = mapIterator.collect(collected);
            expect(collected).to.deep.equal(['other',['key', 'value']]);
            expect(collected).to.deep.equal(ret);
        });
        it('collect on an array with multiple', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = ['other'];
            const ret = mapIterator.collect(collected);
            expect(collected).to.deep.equal(['other',['key', 'value'],['key2', 'value2a']]);
            expect(collected).to.deep.equal(ret);
        });

        it('collect on an array with filter', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = mapIterator.filter(value => value !== 'value').collect();
            expect(collected).to.deep.equal([['key2', 'value2a']]);
        });

        it('collect on an array with deleted keys', function () {
            hashmap.set('key', 'value');
            hashmap.delete('key');
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
            expect(values.next().value).to.deep.equal(['key','value']);
            expect(values.next().value).to.deep.equal(['key2','value2']);
        });
        it('collect on an Object', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = mapIterator.collect({});
            expect(collected).to.deep.equal({'key':'value','key2':'value2'});
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
            expect(collected).to.deep.equal([['key', 'value']]);
            expect(collected).to.deep.equal(ret);
        });
        it('collect on an array with contents', function () {
            hashmap.set('key', 'value');
            const collected = ['other'];
            const ret = setIterator.collect(collected);
            expect(collected).to.deep.equal(['other',['key', 'value']]);
            expect(collected).to.deep.equal(ret);
        });
        it('collect on an array with multiple', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = ['other'];
            const ret = setIterator.collect(collected);
            expect(collected).to.deep.equal(['other',['key', 'value'],['key2', 'value2a']]);
            expect(collected).to.deep.equal(ret);
        });
        it('collect on a Set', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = setIterator.collect(new Set());
            expect(collected.size).to.equal(2);
            const values = collected.values();
            expect(values.next().value).to.deep.equal(['key','value']);
            expect(values.next().value).to.deep.equal(['key2','value2']);
        });

        it('collect on an array with filter', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            const collected = setIterator.filter(value => value[1] !== 'value').collect();
            expect(collected).to.deep.equal([['key2', 'value2a']]);
        });

        it('collect on an array with deleted keys', function () {
            hashmap.set('key', 'value');
            hashmap.delete('key');
            const collected = setIterator.collect();
            expect(collected).to.be.empty;
        });
        it('collect on a map', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = setIterator.collect(new Map());
            expect(collected.size).to.equal(2);
            const arr = Array.from(collected.keys());
            expect(arr).to.deep.equal([['key','value'],['key2','value2']]);
        });
        it('collect on a HashMap', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');

            const collected = setIterator.collect(new LinkedHashMap());
            expect(collected.size).to.equal(2);
            const arr = Array.from(collected.keys());
            expect(arr).to.deep.equal([['key','value'],['key2','value2']]);
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
            expect(setIterator.map(entry => entry[0]).has('key')).to.be.false;
        });

        it('should return true when it has an entry with a key', function () {
            hashmap.set('key', 'value');
            expect(setIterator.map(entry => entry[0]).has('key')).to.be.true;
        });
    });
    //*******************************************TO BE DONE******************************
    describe('hashmap.indexOf()', function () {
        it('should return undefined when it does not have an entry with a value', function () {
            expect(hashmap.indexOf('value')).to.be.undefined;
        });

        it('should return key under which a value is stored', function () {
            hashmap.set('key', 'value');
            expect(hashmap.indexOf('value')).to.equal('key');
        });
    });

    describe('hashmap.get()', function () {
        var uid = 1;

        function val() {
            return 'value' + uid++;
        }

        it('should map the same key consistenly to the same hash', function () {
            function check(key) {
                var value = val();
                hashmap.set(key, value);
                expect(hashmap.get(key)).to.equal(value);
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
                expect(hashmap.get(key2)).to.equal(value);
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
                expect(hashmap.get(key2)).not.to.equal(value);
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

    describe('hashmap.forEach()', function () {
        function collect() {
            var pairs = [];
            hashmap.forEach(function (value, key) {
                pairs.push({key: key, value: value});
            });
            return pairs;
        }

        it('should pass the basic test', function () {
            hashmap.set('key', 'value');
            let called = 0;
            hashmap.forEach(function (value, key) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(hashmap);
            });
            expect(called).to.equal(1);
        });

        it('should call the callback once per key', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            expect(collect().length).to.equal(2);
        });

        it('should not call the callback on delete keys', function () {
            hashmap.set('key', 'value');
            hashmap.delete('key');
            expect(collect()).to.be.empty;
        });

        it('should remain consistent among calls', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(collect()).to.deep.equal(collect());
        });

        it('should respect forEach context', function () {
            hashmap.set('key', 'value');
            var ctx = {};
            hashmap.forEach(function (value, key) {
                expect(this).to.equal(ctx);
            }, ctx);
        });
    });

    describe('hashmap.keys()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(hashmap.keys())).to.be.empty;
        });

        it('should return an array with one key once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(hashmap.keys())).to.deep.equal(['key']);
        });

        it('should work for several keys', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(hashmap.keys()).sort()).to.deep.equal(['key', 'key2']);
        });
    });

    describe('hashmap.values()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(hashmap.values())).to.be.empty;
        });

        it('should return an array with one value once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(hashmap.values())).to.deep.equal(['value']);
        });

        it('should work for several values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(hashmap.values()).sort()).to.deep.equal(['value', 'value2']);
        });
    });

    describe('hashmap.entries()', function () {
        it('should return an empty array for an empty hashmap', function () {
            expect(Array.from(hashmap.entries())).to.be.empty;
        });

        it('should return an array with one value once added', function () {
            hashmap.set('key', 'value');
            expect(Array.from(hashmap.entries())).to.deep.equal([['key', 'value']]);
        });

        it('should work for several values', function () {
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(Array.from(hashmap.entries()).sort()).to.deep.equal([['key', 'value'], ['key2', 'value2']]);
        });
    });

    describe('ES6 Iterators', function () {
        it('should do nothing on an empty hashmap', function () {
            var called = false;
            for (var pair of hashmap) { // jshint ignore:line
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
            for (let pair of hashmap) {
                expect(pair[0]).to.equal('key' + pair[1]);
                calls[pair[1]]++;
            }
            expect(calls).to.deep.equal(new Array(numberOfTries).fill(1));
        });
    });

});
