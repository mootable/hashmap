/* jshint ignore:start */

const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {equalsAndHash} = esmRequire("../../../src/hash");
const {Container} = esmRequire('../../../src/hashmap/container')
const {HashBuckets, HamtBuckets, hammingWeight} = esmRequire('../../../src/hashmap/hashbuckets')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('hammingWeight', function () {
    it('zero elements', function () {
        const flags = 0;
        expect(hammingWeight(flags)).to.equal(0);
    });
    it('all elements', function () {
        const flags = 0b11111111111111111111111111111111;
        expect(hammingWeight(flags)).to.equal(32);
    });
    it('first element', function () {
        const flags = 0b1;
        expect(hammingWeight(flags)).to.equal(1);
    });
    it('second element', function () {
        const flags = 0b10;
        expect(hammingWeight(flags)).to.equal(1);
    });
    it('31st element', function () {
        const flags = 0b01000000000000000000000000000000;
        expect(hammingWeight(flags)).to.equal(1);
    });
    it('32nd element', function () {
        const flags = 0b10000000000000000000000000000000;
        expect(hammingWeight(flags)).to.equal(1);
    });
    it('alternate elements', function () {
        const flags = 0b10101010101010101010101010101010;
        expect(hammingWeight(flags)).to.equal(16);
        const flags2 = 0b01010101010101010101010101010101;
        expect(hammingWeight(flags2)).to.equal(16);
    });
    it('two elements', function () {
        const flags = 0b1010;
        expect(hammingWeight(flags)).to.equal(2);
    });
    it('five elements', function () {
        const flags = 0b11000101010;
        expect(hammingWeight(flags)).to.equal(5);
    });
});

/**
 * constructor(map)
 * clear()
 * bucketFor(hash)
 * set(key, value, options)
 * emplace(key, handler, options)
 * delete(key, options)
 * get(key, options)
 * optionalGet(key, options)
 * has(key, options)
 * [Symbol.iterator]()
 * entriesRight()
 * keys()
 * values()
 * keysRight()
 * valuesRight() {
 */
describe('HashBucket Class', function () {
    const defaultMap = {createContainer:  (parent, hash) => new Container(defaultMap, parent, hash)};
    const defaultMethodOptions_key = equalsAndHash('key');
    const defaultMethodOptions_collidingkey = equalsAndHash('colliding_key');
    defaultMethodOptions_collidingkey.hash = defaultMethodOptions_key.hash ^ 0b1000000000000;
    const defaultMethodOptions_other = equalsAndHash('other');

    const defaultMethodOptions_key1 = equalsAndHash('key1');
    const defaultMethodOptions_key2 = equalsAndHash('key2');
    const defaultMethodOptions_key3 = equalsAndHash('key3');

    it('constructor', function () {
        const buckets = new HashBuckets(defaultMap);
        expect(buckets.size).to.equal(0);
        expect(buckets.buckets.length).to.equal(0);
        expect(buckets.map).to.equal(defaultMap);
    });
    it('clear on empty', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.clear();
        expect(buckets.size).to.equal(0);
        expect(buckets.buckets.length).to.equal(0);
    });
    it('clear with data', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.buckets.length).to.not.equal(0); // with hash buckets the array could be quite big, albeit unfilled.
        buckets.clear();
        expect(buckets.size).to.equal(0);
        expect(buckets.buckets.length).to.equal(0);
    });

    it('bucketFor with key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.buckets.length).to.not.equal(0); // with hash buckets the array could be quite big, albeit unfilled.
        const bucket = buckets.bucketFor(defaultMethodOptions_key.hash);
        expect(bucket.size).to.equal(1);
        expect(bucket.has('key',defaultMethodOptions_key)).to.be.true;
    });

    it('bucketFor with other', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.buckets.length).to.not.equal(0); // with hash buckets the array could be quite big, albeit unfilled.
        const bucket = buckets.bucketFor(defaultMethodOptions_other.hash);
        expect(bucket).to.be.undefined;
    });

    it('bucketFor when empty', function () {
        const buckets = new HashBuckets(defaultMap);
        const bucket = buckets.bucketFor(defaultMethodOptions_key.hash);
        expect(bucket).to.be.undefined;
    });

    it('set with key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });

    it('set with key twice', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.set('key','value2',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value2");
    });

    it('set with other key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.set('other','value2',defaultMethodOptions_other)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
        expect(buckets.has('other',defaultMethodOptions_other)).to.be.true;
        expect(buckets.get('other',defaultMethodOptions_other)).to.be.equal("value2");
    });

    it('set with colliding key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.set('colliding_key','value2',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.true;
        expect(buckets.get('colliding_key',defaultMethodOptions_collidingkey)).to.be.equal("value2");
    });

    it('emplace with key', function () {
        const buckets = new HashBuckets(defaultMap);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                expect(key).to.equal("key");
                expect(map).to.equal(defaultMap);
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('key',handler,defaultMethodOptions_key)
        expect(ret).to.equal("value2");
        expect(updateCalled).to.equal(0);
        expect(insertCalled).to.equal(1);
        expect(buckets.size).to.equal(1);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value2");
    });

    it('emplace has keyed entry', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                expect(oldValue).to.equal("value");
                expect(key).to.equal("key");
                expect(map).to.equal(defaultMap);
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('key',handler,defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret).to.equal("value3");
        expect(updateCalled).to.equal(1);
        expect(insertCalled).to.equal(0);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value3");
    });

    it('emplace with colliding key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                expect(key).to.equal("colliding_key");
                expect(map).to.equal(defaultMap);
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('colliding_key',handler,defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret).to.equal("value2");
        expect(updateCalled).to.equal(0);
        expect(insertCalled).to.equal(1);
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.true;
        expect(buckets.get('colliding_key',defaultMethodOptions_collidingkey)).to.be.equal("value2");
    });


    it('emplace with non colliding key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                expect(key).to.equal("other");
                expect(map).to.equal(defaultMap);
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('other',handler,defaultMethodOptions_other)
        expect(buckets.size).to.equal(2);
        expect(ret).to.equal("value2");
        expect(updateCalled).to.equal(0);
        expect(insertCalled).to.equal(1);
        expect(buckets.has('other',defaultMethodOptions_other)).to.be.true;
        expect(buckets.get('other',defaultMethodOptions_other)).to.be.equal("value2");
    });

    it('delete with no key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.delete('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.false;
    });

    it('delete with key ', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.delete('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.false;
    });

    it('delete with other key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.delete('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('other',defaultMethodOptions_other)).to.be.false;
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });
    it('delete with colliding key existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        buckets.delete('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.false;
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });
    it('delete with colliding key not existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.delete('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.false;
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });

    it('delete with 3 keys, first', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key1','value1', defaultMethodOptions_key1)
        buckets.set('key2','value2', defaultMethodOptions_key2)
        buckets.set('key3','value3', defaultMethodOptions_key3)
        expect(buckets.size).to.equal(3);
        buckets.delete('key1',defaultMethodOptions_key1)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key1',defaultMethodOptions_key1)).to.be.false;
        expect(buckets.has('key2',defaultMethodOptions_key2)).to.be.true;
        expect(buckets.get('key2',defaultMethodOptions_key2)).to.be.equal("value2");
        expect(buckets.has('key3',defaultMethodOptions_key3)).to.be.true;
        expect(buckets.get('key3',defaultMethodOptions_key3)).to.be.equal("value3");
    });

    it('delete with 3 keys, second', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key1','value1', defaultMethodOptions_key1)
        buckets.set('key2','value2', defaultMethodOptions_key2)
        buckets.set('key3','value3', defaultMethodOptions_key3)
        expect(buckets.size).to.equal(3);
        buckets.delete('key2',defaultMethodOptions_key2)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key1',defaultMethodOptions_key1)).to.be.true;
        expect(buckets.get('key1',defaultMethodOptions_key1)).to.be.equal("value1");
        expect(buckets.has('key2',defaultMethodOptions_key2)).to.be.false;
        expect(buckets.has('key3',defaultMethodOptions_key3)).to.be.true;
        expect(buckets.get('key3',defaultMethodOptions_key3)).to.be.equal("value3");
    });
    it('delete with 3 keys, third', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key1','value1', defaultMethodOptions_key1)
        buckets.set('key2','value2', defaultMethodOptions_key2)
        buckets.set('key3','value3', defaultMethodOptions_key3)
        expect(buckets.size).to.equal(3);
        buckets.delete('key3',defaultMethodOptions_key3)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key1',defaultMethodOptions_key1)).to.be.true;
        expect(buckets.get('key1',defaultMethodOptions_key1)).to.be.equal("value1");
        expect(buckets.has('key2',defaultMethodOptions_key2)).to.be.true;
        expect(buckets.get('key2',defaultMethodOptions_key2)).to.be.equal("value2");
        expect(buckets.has('key3',defaultMethodOptions_key3)).to.be.false;
    });
    it('get with no key', function () {
        const buckets = new HashBuckets(defaultMap);
        const ret = buckets.get('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(ret).to.be.undefined;
    });

    it('get with key ', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.get('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret).to.equal('value');
    });

    it('get with other key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.get('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.undefined;
    });
    it('get with colliding key existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value2', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        const ret = buckets.get('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret).to.equal('value2');
    });
    it('get with colliding key not existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.get('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.undefined;
    });

    it('has with no key', function () {
        const buckets = new HashBuckets(defaultMap);
        const ret = buckets.has('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(ret).to.be.false;
    });

    it('has with key ', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.has('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.true;
    });

    it('has with other key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.has('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.false;
    });
    it('has with colliding key existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value2', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        const ret = buckets.has('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret).to.be.true;
    });
    it('has with colliding key not existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.has('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.false;
    });

    it('optionalGet with no key', function () {
        const buckets = new HashBuckets(defaultMap);
        const ret = buckets.optionalGet('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(ret.has).to.be.false;
    });

    it('optionalGet with key ', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.optionalGet('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret.value).to.equal('value');
        expect(ret.has).to.be.true;
    });

    it('optionalGet with other key', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.optionalGet('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(ret.has).to.be.false;
    });
    it('optionalGet with colliding key existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value2', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        const ret = buckets.optionalGet('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret.value).to.equal('value2');
        expect(ret.has).to.be.true;
    });
    it('optionalGet with colliding key not existing', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.optionalGet('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(ret.has).to.be.false;
    });
    it('[Symbol.iterator]', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        let executedCount = 0;
        let executedFlags = 0;
        for ([key, value] of buckets) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    expect(value).to.equal("value1");
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    expect(value).to.equal("value2");
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(2);
        expect(executedFlags).to.equal(0b11);
    });
    it('[Symbol.iterator] size 3', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        let executedCount = 0;
        let executedFlags = 0;
        for ([key, value] of buckets) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    expect(value).to.equal("value1");
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    expect(value).to.equal("value2");
                    break;
                case 'key3':
                    executedFlags ^= 0b100;
                    expect(value).to.equal("value3");
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(3);
        expect(executedFlags).to.equal(0b111);
    });

    it('entriesRight()', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        const forward = [];
        for (const entry of buckets) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.entriesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('entriesRight() size 3', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        const forward = [];
        for (const entry of buckets) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.entriesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('keys()', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        let executedCount = 0;
        let executedFlags = 0;
        for (const key of buckets.keys()) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(2);
        expect(executedFlags).to.equal(0b11);
    });
    it('keys() size 3', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        let executedCount = 0;
        let executedFlags = 0;
        for (const key of buckets.keys()) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    break;
                case 'key3':
                    executedFlags ^= 0b100;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(3);
        expect(executedFlags).to.equal(0b111);
    });

    it('keysRight()', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        const forward = [];
        for (const entry of buckets.keys()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.keysRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('keysRight() size 3', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        const forward = [];
        for (const entry of buckets.keys()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.keysRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('values()', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        let executedFlags = 0;
        let executedCount = 0;
        for (const value of buckets.values()) {
            switch(value){
                case 'value1':
                    executedFlags ^= 0b1;
                    break;
                case 'value2':
                    executedFlags ^= 0b10;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(2);
        expect(executedFlags).to.equal(0b11);
    });
    it('values() size 3', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        let executedFlags = 0;
        let executedCount = 0;
        for (const value of buckets.values()) {
            switch(value){
                case 'value1':
                    executedFlags ^= 0b1;
                    break;
                case 'value2':
                    executedFlags ^= 0b10;
                    break;
                case 'value3':
                    executedFlags ^= 0b100;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(3);
        expect(executedFlags).to.equal(0b111);
    });
    it('valuesRight()', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        const forward = [];
        for (const entry of buckets.values()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.valuesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('valuesRight() size 3', function () {
        const buckets = new HashBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        const forward = [];
        for (const entry of buckets.values()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.valuesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
});

/**
 * constructor(map, depth, shift)
 * hashConflicts()
 * indexFor(hash)
 * replacing(oldBucket)
 *
 * clear()
 * bucketFor(hash)
 * set(key, value, options)
 * emplace(key, handler, options)
 * delete(key, options)
 * get(key, options)
 * optionalGet(key, options)
 * has(key, options)
 * [Symbol.iterator]()
 * entriesRight()
 * keys()
 * values()
 * keysRight()
 * valuesRight()
 */
describe('HamtBucket Class', function () {
    const defaultMap = {createContainer:  (parent, hash) => new Container(defaultMap, parent, hash)};
    const defaultMethodOptions_key = equalsAndHash('key');
    const defaultMethodOptions_collidingkey = equalsAndHash('colliding_key');
    defaultMethodOptions_collidingkey.hash = defaultMethodOptions_key.hash ^ 0b1000000000000;
    const defaultMethodOptions_other = equalsAndHash('other');

    const defaultMethodOptions_key1 = equalsAndHash('key1');
    const defaultMethodOptions_key2 = equalsAndHash('key2');
    const defaultMethodOptions_key3 = equalsAndHash('key3');

    it('constructor', function () {
        const buckets = new HamtBuckets(defaultMap);
        expect(buckets.size).to.equal(0);
        expect(buckets.buckets.length).to.equal(0);
        expect(buckets.map).to.equal(defaultMap);
    });
    it('hashConflicts', function () {
        const buckets = new HamtBuckets(defaultMap);
        expect(buckets.hashConflicts()).to.be.false;
        expect(buckets.hashConflicts(1)).to.be.false;
    });
    it('clear on empty', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.clear();
        expect(buckets.size).to.equal(0);
        expect(buckets.buckets.length).to.equal(0);
    });
    it('clear with data', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.buckets.length).to.not.equal(0); // with hash buckets the array could be quite big, albeit unfilled.
        buckets.clear();
        expect(buckets.size).to.equal(0);
        expect(buckets.buckets.length).to.equal(0);
    });

    it('bucketFor with key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.buckets.length).to.not.equal(0); // with hash buckets the array could be quite big, albeit unfilled.
        const bucket = buckets.bucketFor(defaultMethodOptions_key.hash);
        expect(bucket.size).to.equal(1);
        expect(bucket.has('key',defaultMethodOptions_key)).to.be.true;
    });

    it('bucketFor with other', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.buckets.length).to.not.equal(0); // with hash buckets the array could be quite big, albeit unfilled.
        const bucket = buckets.bucketFor(defaultMethodOptions_other.hash);
        expect(bucket).to.be.undefined;
    });

    it('bucketFor when empty', function () {
        const buckets = new HamtBuckets(defaultMap);
        const bucket = buckets.bucketFor(defaultMethodOptions_key.hash);
        expect(bucket).to.be.undefined;
    });

    it('set with key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });

    it('set with key twice', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.set('key','value2',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value2");
    });

    it('set with other key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.set('other','value2',defaultMethodOptions_other)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
        expect(buckets.has('other',defaultMethodOptions_other)).to.be.true;
        expect(buckets.get('other',defaultMethodOptions_other)).to.be.equal("value2");
    });

    it('set with colliding key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.set('colliding_key','value2',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.true;
        expect(buckets.get('colliding_key',defaultMethodOptions_collidingkey)).to.be.equal("value2");
    });

    it('emplace with key', function () {
        const buckets = new HamtBuckets(defaultMap);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                expect(key).to.equal("key");
                expect(map).to.equal(defaultMap);
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('key',handler,defaultMethodOptions_key)
        expect(ret).to.equal("value2");
        expect(updateCalled).to.equal(0);
        expect(insertCalled).to.equal(1);
        expect(buckets.size).to.equal(1);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value2");
    });

    it('emplace has keyed entry', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                expect(oldValue).to.equal("value");
                expect(key).to.equal("key");
                expect(map).to.equal(defaultMap);
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('key',handler,defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret).to.equal("value3");
        expect(updateCalled).to.equal(1);
        expect(insertCalled).to.equal(0);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value3");
    });

    it('emplace with colliding key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                expect(key).to.equal("colliding_key");
                expect(map).to.equal(defaultMap);
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('colliding_key',handler,defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret).to.equal("value2");
        expect(updateCalled).to.equal(0);
        expect(insertCalled).to.equal(1);
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.true;
        expect(buckets.get('colliding_key',defaultMethodOptions_collidingkey)).to.be.equal("value2");
    });


    it('emplace with non colliding key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);

        let updateCalled = 0;
        let insertCalled = 0;
        const handler = {
            update: (oldValue, key, map) => {
                updateCalled++;
                return "value3";
            },
            insert: (key, map) => {
                expect(key).to.equal("other");
                expect(map).to.equal(defaultMap);
                insertCalled++;
                return "value2";
            }
        };
        const ret = buckets.emplace('other',handler,defaultMethodOptions_other)
        expect(buckets.size).to.equal(2);
        expect(ret).to.equal("value2");
        expect(updateCalled).to.equal(0);
        expect(insertCalled).to.equal(1);
        expect(buckets.has('other',defaultMethodOptions_other)).to.be.true;
        expect(buckets.get('other',defaultMethodOptions_other)).to.be.equal("value2");
    });

    it('delete with no key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.delete('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.false;
    });

    it('delete with key ', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.delete('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.false;
    });

    it('delete with other key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.delete('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('other',defaultMethodOptions_other)).to.be.false;
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });

    it('delete with colliding key existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        buckets.delete('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.false;
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });
    it('delete with colliding key not existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        buckets.delete('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(buckets.has('colliding_key',defaultMethodOptions_collidingkey)).to.be.false;
        expect(buckets.has('key',defaultMethodOptions_key)).to.be.true;
        expect(buckets.get('key',defaultMethodOptions_key)).to.be.equal("value");
    });

    it('delete with 3 keys, first', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key1','value1', defaultMethodOptions_key1)
        buckets.set('key2','value2', defaultMethodOptions_key2)
        buckets.set('key3','value3', defaultMethodOptions_key3)
        expect(buckets.size).to.equal(3);
        buckets.delete('key1',defaultMethodOptions_key1)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key1',defaultMethodOptions_key1)).to.be.false;
        expect(buckets.has('key2',defaultMethodOptions_key2)).to.be.true;
        expect(buckets.get('key2',defaultMethodOptions_key2)).to.be.equal("value2");
        expect(buckets.has('key3',defaultMethodOptions_key3)).to.be.true;
        expect(buckets.get('key3',defaultMethodOptions_key3)).to.be.equal("value3");
    });

    it('delete with 3 keys, second', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key1','value1', defaultMethodOptions_key1)
        buckets.set('key2','value2', defaultMethodOptions_key2)
        buckets.set('key3','value3', defaultMethodOptions_key3)
        expect(buckets.size).to.equal(3);
        buckets.delete('key2',defaultMethodOptions_key2)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key1',defaultMethodOptions_key1)).to.be.true;
        expect(buckets.get('key1',defaultMethodOptions_key1)).to.be.equal("value1");
        expect(buckets.has('key2',defaultMethodOptions_key2)).to.be.false;
        expect(buckets.has('key3',defaultMethodOptions_key3)).to.be.true;
        expect(buckets.get('key3',defaultMethodOptions_key3)).to.be.equal("value3");
    });
    it('delete with 3 keys, third', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key1','value1', defaultMethodOptions_key1)
        buckets.set('key2','value2', defaultMethodOptions_key2)
        buckets.set('key3','value3', defaultMethodOptions_key3)
        expect(buckets.size).to.equal(3);
        buckets.delete('key3',defaultMethodOptions_key3)
        expect(buckets.size).to.equal(2);
        expect(buckets.has('key1',defaultMethodOptions_key1)).to.be.true;
        expect(buckets.get('key1',defaultMethodOptions_key1)).to.be.equal("value1");
        expect(buckets.has('key2',defaultMethodOptions_key2)).to.be.true;
        expect(buckets.get('key2',defaultMethodOptions_key2)).to.be.equal("value2");
        expect(buckets.has('key3',defaultMethodOptions_key3)).to.be.false;
    });
    it('get with no key', function () {
        const buckets = new HamtBuckets(defaultMap);
        const ret = buckets.get('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(ret).to.be.undefined;
    });

    it('get with key ', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.get('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret).to.equal('value');
    });

    it('get with other key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.get('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.undefined;
    });
    it('get with colliding key existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value2', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        const ret = buckets.get('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret).to.equal('value2');
    });
    it('get with colliding key not existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.get('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.undefined;
    });

    it('has with no key', function () {
        const buckets = new HamtBuckets(defaultMap);
        const ret = buckets.has('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(ret).to.be.false;
    });

    it('has with key ', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.has('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.true;
    });

    it('has with other key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.has('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.false;
    });
    it('has with colliding key existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value2', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        const ret = buckets.has('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret).to.be.true;
    });
    it('has with colliding key not existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.has('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(ret).to.be.false;
    });

    it('optionalGet with no key', function () {
        const buckets = new HamtBuckets(defaultMap);
        const ret = buckets.optionalGet('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(0);
        expect(ret.has).to.be.false;
    });

    it('optionalGet with key ', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.optionalGet('key',defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        expect(ret.value).to.equal('value');
        expect(ret.has).to.be.true;
    });

    it('optionalGet with other key', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.optionalGet('other',defaultMethodOptions_other)
        expect(buckets.size).to.equal(1);
        expect(ret.has).to.be.false;
    });
    it('optionalGet with colliding key existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        buckets.set('colliding_key','value2', defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        const ret = buckets.optionalGet('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(2);
        expect(ret.value).to.equal('value2');
        expect(ret.has).to.be.true;
    });
    it('optionalGet with colliding key not existing', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set('key','value', defaultMethodOptions_key)
        expect(buckets.size).to.equal(1);
        const ret = buckets.optionalGet('colliding_key',defaultMethodOptions_collidingkey)
        expect(buckets.size).to.equal(1);
        expect(ret.has).to.be.false;
    });
    it('[Symbol.iterator]', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        let executedCount = 0;
        let executedFlags = 0;
        for ([key, value] of buckets) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    expect(value).to.equal("value1");
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    expect(value).to.equal("value2");
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(2);
        expect(executedFlags).to.equal(0b11);
    });
    it('[Symbol.iterator] size 3', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        let executedCount = 0;
        let executedFlags = 0;
        for ([key, value] of buckets) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    expect(value).to.equal("value1");
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    expect(value).to.equal("value2");
                    break;
                case 'key3':
                    executedFlags ^= 0b100;
                    expect(value).to.equal("value3");
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(3);
        expect(executedFlags).to.equal(0b111);
    });

    it('entriesRight()', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        const forward = [];
        for (const entry of buckets) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.entriesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('entriesRight() size 3', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        const forward = [];
        for (const entry of buckets) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.entriesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('keys()', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        let executedCount = 0;
        let executedFlags = 0;
        for (const key of buckets.keys()) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(2);
        expect(executedFlags).to.equal(0b11);
    });
    it('keys() size 3', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        let executedCount = 0;
        let executedFlags = 0;
        for (const key of buckets.keys()) {
            switch(key){
                case 'key1':
                    executedFlags ^= 0b1;
                    break;
                case 'key2':
                    executedFlags ^= 0b10;
                    break;
                case 'key3':
                    executedFlags ^= 0b100;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(3);
        expect(executedFlags).to.equal(0b111);
    });

    it('keysRight()', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        const forward = [];
        for (const entry of buckets.keys()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.keysRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('keysRight() size 3', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        const forward = [];
        for (const entry of buckets.keys()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.keysRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('values()', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        let executedFlags = 0;
        let executedCount = 0;
        for (const value of buckets.values()) {
            switch(value){
                case 'value1':
                    executedFlags ^= 0b1;
                    break;
                case 'value2':
                    executedFlags ^= 0b10;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(2);
        expect(executedFlags).to.equal(0b11);
    });
    it('values() size 3', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        let executedFlags = 0;
        let executedCount = 0;
        for (const value of buckets.values()) {
            switch(value){
                case 'value1':
                    executedFlags ^= 0b1;
                    break;
                case 'value2':
                    executedFlags ^= 0b10;
                    break;
                case 'value3':
                    executedFlags ^= 0b100;
                    break;
                default:
                    throw "We shouldn't see anything else."
            }
            executedCount++;
        }
        expect(executedCount).to.equal(3);
        expect(executedFlags).to.equal(0b111);
    });
    it('valuesRight()', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        const forward = [];
        for (const entry of buckets.values()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.valuesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });
    it('valuesRight() size 3', function () {
        const buckets = new HamtBuckets(defaultMap);
        buckets.set("key1", "value1",defaultMethodOptions_key1);
        buckets.set("key2", "value2", defaultMethodOptions_key2);
        buckets.set("key3", "value3", defaultMethodOptions_key3);
        const forward = [];
        for (const entry of buckets.values()) {
            forward.push(entry);
        }
        let i = forward.length;
        for (const entry of buckets.valuesRight()) {
            i -= 1;
            expect(entry).to.deep.equal(forward[i]);
        }
        expect(i).to.equal(0);
    });

});
/* jshint ignore:end */