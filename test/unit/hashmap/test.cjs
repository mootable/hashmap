/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Container} = esmRequire('../../../src/hashmap/container')
const {HashMap} = esmRequire('../../../src/')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('HashMap Class', function () {
    context('constructor()', function () {
        it('constructor(), basic', function () {
            // Given & When
            const hashmap = new HashMap();
            // Then
            expect(hashmap.size).to.equal(0);
        });

        it('constructor(), copies map', function () {
            // Given
            const map = new Map([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            // When
            const hashmap = new HashMap(map);
            // Then
            expect(hashmap.size).to.equal(4);
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('constructor(), copies array', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            // When
            const hashmap = new HashMap(arr);
            // Then
            expect(hashmap.size).to.equal(4);
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('constructor(), copies other HashMap', function () {
            // Given
            const hashmapOld = new HashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            // When
            const hashmap = new HashMap(hashmapOld);
            // Then
            expect(hashmap.size).to.equal(4);
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('constructor(), uses ForEach', function () {
            // Given
            const forEachObj = {
                forEach: (callback, ctx) => {
                    for (let i = 1; i <= 4; i++) {
                        callback.call(ctx, 'value' + i, 'key' + i);
                    }
                }
            }
            // When
            const hashmap = new HashMap(forEachObj);
            // Then
            expect(hashmap.size).to.equal(4);
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('constructor(), uses entries', function () {
            // Given
            const entriesObj = {
                entries: function* () {
                    yield ["key1", "value1"];
                    yield ["key2", "value2"];
                    yield ["key3", "value3"];
                    yield ["key4", "value4"];
                }
            }
            // When
            const hashmap = new HashMap(entriesObj);
            // Then
            expect(hashmap.size).to.equal(4);
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });
    });
    context('size', function () {

        it('size, empty map', function () {
            // Given
            const hashmap = new HashMap();
            // When & Then
            expect(hashmap.size).to.equal(0);
        });


        it('size, with entries', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            const hashmap = new HashMap(arr);
            // When & Then
            expect(hashmap.size).to.equal(4);
        });

    });
    context('length', function () {

        it('length, empty map', function () {
            // Given
            const hashmap = new HashMap();
            // When & Then
            expect(hashmap.length).to.equal(0);
        });


        it('length, with entries', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            const hashmap = new HashMap(arr);
            // When & Then
            expect(hashmap.length).to.equal(4);
        });

    });
    context('createContainer()', function () {
        it('createContainer()', function () {
            // Given
            const hashmap = new HashMap();
            // When & Then
            expect(hashmap.createContainer(undefined,5)).to.be.instanceOf(Container);
            expect(hashmap.createContainer(undefined,5).hash).to.be.equal(5);
            expect(hashmap.createContainer(undefined,5).map).to.be.equal(hashmap);
        });

    });
    context('has()', function () {
        it('has() with key ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.has('key')
            //Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.true;
        });

        it('has() with no key ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.has('key');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.false;
        });

        it('has() with other key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.has('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.false;
        });

    });
    context('get()', function () {
        it('get() with key ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.get('key');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('value');
        });

        it('get() with no key ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.get('key');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('get() with other key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.get('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });

    });
    context('keyOf()', function () {
        it('keyOf() with value ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.keyOf('value');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('key');
        });

        it('keyOf() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.keyOf('value');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('keyOf() with other value', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.keyOf('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });
        it('keyOf() with 3 values ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.keyOf('value2');
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('key2');
        });
        it('keyOf() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.keyOf('value2',{equals:()=> true});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(1);
        });
        it('keyOf() with 3 values explicit equals', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.keyOf('value2', {equals:(value1,value2)=> value2 === 'value3'});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('key3');
        });

    });
    context('lastKeyOf()', function () {
        it('lastKeyOf() with value ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.lastKeyOf('value');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('key');
        });

        it('lastKeyOf() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.lastKeyOf('value');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('lastKeyOf() with other value', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.lastKeyOf('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });
        it('lastKeyOf() with 3 values ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.lastKeyOf('value2');
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('key2');
        });
        it('lastKeyOf() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.lastKeyOf('value2',{equals:()=> true});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(3);
        });
        it('lastKeyOf() with 3 values explict equals', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.lastKeyOf('value2', {equals:(value1,value2)=> value2 === 'value3'});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('key3');
        });

    });
    context('find()', function () {
        it('find() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.find(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('value');
        });

        it('find() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.find(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('find() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.find(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });
        it('find() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.find(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('value1');
        });
        it('find() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.find(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('value2');
        });
        it('find() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.find();
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('value1');
        });

    });
    context('findLast()', function () {
        it('findLast() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.findLast(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('value');
        });

        it('findLast() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.findLast(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('findLast() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.findLast(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });
        it('findLast() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.findLast(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('value3');
        });
        it('findLast() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.findLast(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('value2');
        });
        it('findLast() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.findLast();
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('value3');
        });

    });
    context('findKey()', function () {
        it('findKey() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.findKey(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('key');
        });

        it('findKey() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.findKey(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('findKey() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.findKey(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });
        it('findKey() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.findKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(1);
        });
        it('findKey() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.findKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(2);
        });
        it('findKey() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.findKey();
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(1);
        });
    });
    context('findLastKey()', function () {
        it('findLastKey() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.findLastKey(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.equal('key');
        });

        it('findLastKey() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.findLastKey(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('findLastKey() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.findLastKey(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });
        it('findLastKey() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.findLastKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(3);
        });
        it('findLastKey() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.findLastKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(2);
        });
        it('findLastKey() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.findLastKey();
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal(3);
        });
    });
    context('optionalGet()', function () {
        it('optionalGet() with key ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalGet('key');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('value');
            expect(ret.has).to.be.true;
        });

        it('optionalGet() with no key ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalGet('key');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalGet() with other key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalGet('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });

    });
    context('optionalKeyOf()', function () {
        it('optionalKeyOf() with value ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalKeyOf('value');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('key');
            expect(ret.has).to.be.true;
        });

        it('optionalKeyOf() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalKeyOf('value');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalKeyOf() with other value', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalKeyOf('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });
        it('optionalKeyOf() with 3 values', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalKeyOf('value2');
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal('key2');
            expect(ret.has).to.be.true;
        });

        it('optionalKeyOf() with 3 values returns first', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalKeyOf('value2',{equals:()=> true});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal(1);
            expect(ret.has).to.be.true;
        });
        it('optionalKeyOf() with 3 values explicit equals', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalKeyOf('value2', {equals:(value1,value2)=> value2 === 'value3'});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal('key3');
            expect(ret.has).to.be.true;
        });
    });
    context('optionalLastKeyOf()', function () {
        it('optionalLastKeyOf() with value ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalLastKeyOf('value');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('key');
            expect(ret.has).to.be.true;
        });

        it('optionalLastKeyOf() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalLastKeyOf('value');
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalLastKeyOf() with other value', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalLastKeyOf('other');
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });
        it('optionalLastKeyOf() with 3 values', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalLastKeyOf('value2');
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal('key2');
            expect(ret.has).to.be.true;
        });

        it('optionalLastKeyOf() with 3 values returns first', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalLastKeyOf('value2',{equals:()=> true});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal(3);
            expect(ret.has).to.be.true;
        });
        it('optionalLastKeyOf() with 3 values explicit equals', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalLastKeyOf('value2', {equals:(value1,value2)=> value2 === 'value3'});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal('key3');
            expect(ret.has).to.be.true;
        });
    });
    context('optionalFind()', function () {
        it('optionalFind() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFind(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('value');
            expect(ret.has).to.be.true;
        });

        it('optionalFind() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalFind(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalFind() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFind(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });
        it('optionalFind() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFind(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal('value1');
            expect(ret.has).to.be.true;
        });
        it('optionalFind() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFind(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal('value2');
            expect(ret.has).to.be.true;
        });
        it('optionalFind() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.optionalFind();
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal('value1');
            expect(ret.has).to.be.true;
        });

    });
    context('optionalFindLast()', function () {
        it('optionalFindLast() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFindLast(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('value');
            expect(ret.has).to.be.true;
        });

        it('optionalFindLast() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalFindLast(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalFindLast() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFindLast(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });
        it('optionalFindLast() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFindLast(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal('value3');
            expect(ret.has).to.be.true;
        });
        it('optionalFindLast() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFindLast(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal('value2');
            expect(ret.has).to.be.true;
        });
        it('optionalFindLast() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.optionalFindLast();
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal('value3');
            expect(ret.has).to.be.true;
        });

    });
    context('optionalFindKey()', function () {
        it('optionalFindKey() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFindKey(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('key');
            expect(ret.has).to.be.true;
        });

        it('optionalFindKey() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalFindKey(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalFindKey() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFindKey(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });
        it('optionalFindKey() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFindKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal(1);
            expect(ret.has).to.be.true;
        });
        it('optionalFindKey() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFindKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal(2);
            expect(ret.has).to.be.true;
        });
        it('optionalFindKey() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.optionalFindKey();
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal(1);
            expect(ret.has).to.be.true;
        });

    });
    context('optionalFindLastKey()', function () {
        it('optionalFindLastKey() with value ', function () {
            // Given
            const myThis = {ctx:'myCtx'};
            const hashmap = new HashMap();
            const callback = function(value, key, map) {
                expect(this).to.deep.equal({ctx:'myCtx'});
                expect(key).to.equal('key');
                expect(value).to.equal('value');
                expect(map).to.equal(hashmap);
                return key === 'key';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFindLastKey(callback,myThis);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('key');
            expect(ret.has).to.be.true;
        });

        it('optionalFindLastKey() with no value ', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function() {
                executionCount++;
                return true;
            }
            expect(hashmap.size).to.equal(0);
            // When
            const ret = hashmap.optionalFindLastKey(callback);
            expect(executionCount).to.equal(0);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalFindLastKey() with other value', function () {
            // Given
            const hashmap = new HashMap();
            let executionCount = 0;
            const callback = function(value) {
                executionCount++;
                return value === 'other';
            }
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When
            const ret = hashmap.optionalFindLastKey(callback);
            // Then
            expect(executionCount).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });
        it('optionalFindLastKey() with 3 values first key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function() {
                return true;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFindLastKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal(3);
            expect(ret.has).to.be.true;
        });
        it('optionalFindLastKey() with 3 values second key', function () {
            // Given
            const hashmap = new HashMap();
            const callback = function(value, key) {
                return key === 2;
            }
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalFindLastKey(callback);
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal(2);
            expect(ret.has).to.be.true;
        });
        it('optionalFindLastKey() with 3 values without callback', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value1')
            hashmap.set(2, 'value2')
            hashmap.set(3, 'value3')
            expect(hashmap.size).to.equal(3, );
            // When
            const ret = hashmap.optionalFindLastKey();
            // Then
            expect(hashmap.size).to.equal(3);

            expect(ret.value).to.be.equal(3);
            expect(ret.has).to.be.true;
        });

    });
    context('set()', function () {
        it('set() insert key empty Map ', function () {
            // Given
            const hashmap = new HashMap();
            // When & Then
            expect(hashmap.set('key', 'value')).to.be.equal(hashmap);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(hashmap.get('key')).to.be.equal('value');
        });

        it('set() insert key ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When & Then
            expect(hashmap.set('key2', 'value2')).to.be.equal(hashmap);
            // Then
            expect(hashmap.size).to.equal(2);
            expect(hashmap.get('key')).to.be.equal('value');
            expect(hashmap.get('key2')).to.be.equal('value2');
        });

        it('set() overwrite key ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            // When & Then
            expect(hashmap.set('key', 'value2')).to.be.equal(hashmap);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(hashmap.get('key')).to.be.equal('value2');
        });

    });
    context('emplace()', function () {
        it('emplace(), insert', function () {
            const hashmap = new HashMap();

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "value3";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(hashmap);
                    insertCalled++;
                    return "value2";
                }
            };
            const ret = hashmap.emplace('key', handler)
            expect(ret).to.equal("value2");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(hashmap.size).to.equal(1);
            expect(hashmap.has('key')).to.be.true;
            expect(hashmap.get('key')).to.be.equal("value2");
        });

        it('emplace(), update', function () {
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value");
                    expect(key).to.equal("key");
                    expect(map).to.equal(hashmap);
                    updateCalled++;
                    return "value3";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "value2";
                }
            };
            const ret = hashmap.emplace('key', handler)
            expect(hashmap.size).to.equal(1);
            expect(ret).to.equal("value3");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(hashmap.has('key')).to.be.true;
            expect(hashmap.get('key')).to.be.equal("value3");
        });

        it('emplace has keyed entry but no update method', function () {
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            let insertCalled = 0;
            const handler = {
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(hashmap);
                    insertCalled++;
                    return "value2";
                }
            };
            const ret = hashmap.emplace("key", handler);
            expect(ret).to.equal("value2");
            expect(insertCalled).to.equal(1);
            const value = hashmap.get("key");
            expect(value).to.equal("value2");
            expect(hashmap.size).to.equal(1);
        });

    });
    context('delete()', function () {
        it('delete() empty map ', function () {
            // Given
            const hashmap = new HashMap();
            // When & Then
            expect(hashmap.delete('key')).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(hashmap.has('key')).to.be.false;
        });

        it('delete() existing key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            expect(hashmap.size).to.equal(1);
            expect(hashmap.has('key')).to.be.true;
            // When & Then
            expect(hashmap.delete('key')).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(hashmap.has('key')).to.be.false;
        });

        it('delete() other key', function () {
            //Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value')
            hashmap.set('key2', 'value2')
            expect(hashmap.get('key')).to.be.equal('value');
            expect(hashmap.get('key2')).to.be.equal('value2');
            expect(hashmap.size).to.equal(2);
            // When & Then
            expect(hashmap.delete('key2')).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(1);
            expect(hashmap.get('key')).to.be.equal('value');
            expect(hashmap.has('key2')).to.be.false;
        });


        it('delete with 3 keys, first', function () {
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            hashmap.delete('key1')
            expect(hashmap.size).to.equal(2);
            expect(hashmap.has('key1')).to.be.false;
            expect(hashmap.has('key2')).to.be.true;
            expect(hashmap.get('key2')).to.be.equal("value2");
            expect(hashmap.has('key3')).to.be.true;
            expect(hashmap.get('key3')).to.be.equal("value3");
        });

        it('delete with 3 keys, second', function () {
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            hashmap.delete('key2')
            expect(hashmap.size).to.equal(2);
            expect(hashmap.has('key1')).to.be.true;
            expect(hashmap.get('key1')).to.be.equal("value1");
            expect(hashmap.has('key2')).to.be.false;
            expect(hashmap.has('key3')).to.be.true;
            expect(hashmap.get('key3')).to.be.equal("value3");
        });
        it('delete with 3 keys, third', function () {
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            hashmap.delete('key3')
            expect(hashmap.size).to.equal(2);
            expect(hashmap.has('key1')).to.be.true;
            expect(hashmap.get('key1')).to.be.equal("value1");
            expect(hashmap.has('key2')).to.be.true;
            expect(hashmap.get('key2')).to.be.equal("value2");
            expect(hashmap.has('key3')).to.be.false;
        });

    });
    context('copy()', function () {
        it('copy() map', function () {
            // Given
            const map = new Map([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            const hashmap = new HashMap();
            hashmap.set('key0', 'value0');
            hashmap.set('key2', 'overwritethis');
            expect(hashmap.size).to.equal(2);
            // When & Then
            expect(hashmap.copy(map)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(5);
            expect(hashmap.get("key0")).equals("value0");
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('copy() array', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            const hashmap = new HashMap();
            hashmap.set('key0', 'value0');
            hashmap.set('key2', 'overwritethis');
            expect(hashmap.size).to.equal(2);
            // When & Then
            expect(hashmap.copy(arr)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(5);
            expect(hashmap.get("key0")).equals("value0");
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('copy() HashMap', function () {
            // Given
            const hashmapOld = new HashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            const hashmap = new HashMap();
            hashmap.set('key0', 'value0');
            hashmap.set('key2', 'overwritethis');
            expect(hashmap.size).to.equal(2);
            // When & Then
            expect(hashmap.copy(hashmapOld)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(5);
            expect(hashmap.get("key0")).equals("value0");
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('copy() ForEach', function () {
            // Given
            const forEachObj = {
                forEach: (callback, ctx) => {
                    for (let i = 1; i <= 4; i++) {
                        callback.call(ctx, 'value' + i, 'key' + i);
                    }
                }
            }
            const hashmap = new HashMap();
            hashmap.set('key0', 'value0');
            hashmap.set('key2', 'overwritethis');
            expect(hashmap.size).to.equal(2);
            // When & Then
            expect(hashmap.copy(forEachObj)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(5);
            expect(hashmap.get("key0")).equals("value0");
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('copy() entries', function () {
            // Given
            const entriesObj = {
                entries: function* () {
                    yield ["key1", "value1"];
                    yield ["key2", "value2"];
                    yield ["key3", "value3"];
                    yield ["key4", "value4"];
                }
            }
            const hashmap = new HashMap();
            hashmap.set('key0', 'value0');
            hashmap.set('key2', 'overwritethis');
            expect(hashmap.size).to.equal(2);
            // When & Then
            expect(hashmap.copy(entriesObj)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(5);
            expect(hashmap.get("key0")).equals("value0");
            expect(hashmap.get("key1")).equals("value1");
            expect(hashmap.get("key2")).equals("value2");
            expect(hashmap.get("key3")).equals("value3");
            expect(hashmap.get("key4")).equals("value4");
        });

        it('copy() invalid', function () {
            // Given
            const invalidObj = {}
            const hashmap = new HashMap();
            hashmap.set('key0', 'value0');
            hashmap.set('key2', 'overwritethis');
            expect(hashmap.size).to.equal(2);

            // When
            let errors = false;
            try {
                hashmap.copy(invalidObj);
            } catch (err) {
                errors = true;
            }
            // Then
            expect(errors).to.be.true;
        });

    });
    context('clone()', function () {
        it('clone() HashMap', function () {
            // Given
            const hashmap = new HashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            // When
            const hashmapNew = hashmap.clone();
            // Then
            expect(hashmapNew).not.equals(hashmap);
            expect(hashmapNew.get("key1")).equals("value1");
            expect(hashmapNew.get("key2")).equals("value2");
            expect(hashmapNew.get("key3")).equals("value3");
            expect(hashmapNew.get("key4")).equals("value4");
        });

    });
    context('clear()', function () {
        it('clear()', function () {
            // Given
            const hashmap = new HashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            expect(hashmap.size).to.equal(4);
            // When & Then
            expect(hashmap.clear(hashmap)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(0);
            expect(hashmap.has("key1")).to.be.false;
            expect(hashmap.has("key2")).to.be.false;
            expect(hashmap.has("key3")).to.be.false;
            expect(hashmap.has("key4")).to.be.false;
        });

        it('clear() empty', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.size).to.equal(0);
            // When & Then
            expect(hashmap.clear(hashmap)).equals(hashmap);
            // Then
            expect(hashmap.size).to.equal(0);
        });

    });
    context('forEach()', function () {
        it('forEach', function () {
            // Given
            const hashmap = new HashMap();
            // numbers are generally ordered in the hashmap
            hashmap.set(1, "value1");
            hashmap.set(2, "value2");
            hashmap.set(3, "value3");
            let executedCount = 0;
            const forEachCallback = (value, key, map) => {
                executedCount++;
                // Then
                expect(key).to.equal(executedCount);
                expect(value).to.equal("value" + executedCount);
                expect(map).to.equal(hashmap);
            };
            // When & Then
            expect(hashmap.forEach(forEachCallback)).to.equal(hashmap)

            // Then
            expect(executedCount).to.equal(3);

        });

        it('forEachRight', function () {
            // Given
            const hashmap = new HashMap();
            // numbers are generally ordered in this hashmap, so taking advantage.
            // If this breaks check for changes to how numbers are hashed, or it maybe a symptom of a bigger issue.
            hashmap.set(1, "value1");
            hashmap.set(2, "value2");
            hashmap.set(3, "value3");
            let executedCount = 3;
            const forEachCallback = (value, key, map) => {
                // Then
                expect(key).to.equal(executedCount);
                expect(value).to.equal("value" + executedCount);
                expect(map).to.equal(hashmap);
                executedCount--;
            };
            // When & Then
            expect(hashmap.forEachRight(forEachCallback)).to.equal(hashmap)

            // Then
            expect(executedCount).to.equal(0);

        });

    });
    context('every()', function () {
        it('every() should pass the basic test', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            let called = 0;
            const every = hashmap.every(function (value, key, iterable) {
                called++;
                expect(value).to.be.equal('value');
                expect(key).to.be.equal('key');
                expect(this).to.equal(hashmap);
                expect(iterable).to.equal(hashmap);
                return true;
            },hashmap);
            expect(called).to.equal(1);
            expect(every).to.be.true;
        });

        it('every() should call the callback once per key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const every = hashmap.every(function (value, key) {
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

        it('every() should be true on an empty map', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.every(() => false)).to.be.true;
            expect(hashmap.every(() => true)).to.be.true;
        });

        it('every() should return false if all are wrong', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.every(() => false)).to.be.false;
        });

        it('every() should return true if no predicate included', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.every()).to.be.true;
        });

        it('every() should true false if all are right', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.every(() => true)).to.be.true;
        });
        it('every() should return false if one is wrong', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.every((value) => value !== 'value2')).to.be.false;
        });
        it('every() should respect function context', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            let ctx = {};
            hashmap.every(function () {
                expect(this).to.equal(ctx);
            }, ctx);
        });
    });
    context('some()', function () {
        it('some() should pass the basic test', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            let called = 0;
            const some = hashmap.some(function (value, key, iterable) {
                called++;
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(hashmap);
                expect(iterable).to.equal(hashmap);
                return false;
            },hashmap);
            expect(called).to.equal(1);
            expect(some).to.be.false;
        });

        it('some() should call the callback once per key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            let called = 0;
            const some = hashmap.some(function (value, key) {
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

        it('some() should return true on first', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value');
            hashmap.set(2, 'value2');
            hashmap.set(3, 'value3');
            let called = 0;
            const some = hashmap.some(function (value, key) {
                called++;
                expect(key).to.be.equal(1);
                expect(value).to.be.equal('value');
                return true;
            });
            expect(called).to.equal(1);
            expect(some).to.be.true;
        });

        it('some() should return true on first in reverse', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value');
            hashmap.set(2, 'value2');
            hashmap.set(3, 'value3');
            let called = 0;
            const some = hashmap.some(function (value, key) {
                called++;
                expect(key).to.be.equal(3);
                expect(value).to.be.equal('value3');
                return true;
            },undefined,{reverse:true});
            expect(called).to.equal(1);
            expect(some).to.be.true;
        });
        it('some() should return true on second', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value');
            hashmap.set(2, 'value2');
            hashmap.set(3, 'value3');
            let called = 0;
            const some = hashmap.some(function (value, key) {
                called++;
                if(key !== 2){
                    return false;
                }
                expect(key).to.be.equal(2);
                expect(value).to.be.equal('value2');
                return true;
            });
            expect(called).to.equal(2);
            expect(some).to.be.true;
        });

        it('some() should return true on second in reverse', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value');
            hashmap.set(2, 'value2');
            hashmap.set(3, 'value3');
            let called = 0;
            const some = hashmap.some(function (value, key) {
                called++;
                if(key !== 2){
                    return false;
                }
                expect(key).to.be.equal(2);
                expect(value).to.be.equal('value2');
                return true;
            },undefined,{reverse:true});
            expect(called).to.equal(2);
            expect(some).to.be.true;
        });
        it('some() should return true on third', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value');
            hashmap.set(2, 'value2');
            hashmap.set(3, 'value3');
            let called = 0;
            const some = hashmap.some(function (value, key) {
                called++;
                if(key !== 3){
                    return false;
                }
                expect(key).to.be.equal(3);
                expect(value).to.be.equal('value3');
                return true;
            });
            expect(called).to.equal(3);
            expect(some).to.be.true;
        });

        it('some() should return true on third in reverse', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set(1, 'value');
            hashmap.set(2, 'value2');
            hashmap.set(3, 'value3');
            let called = 0;
            const some = hashmap.some(function (value, key) {
                called++;
                if(key !== 1){
                    return false;
                }
                expect(key).to.be.equal(1);
                expect(value).to.be.equal('value');
                return true;
            },undefined,{reverse:true});
            expect(called).to.equal(3);
            expect(some).to.be.true;
        });
        it('some() should be false on an empty map', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.some(() => false)).to.be.false;
            expect(hashmap.some(() => true)).to.be.false;
        });

        it('some() should return true if no predicate included', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.some()).to.be.true;
        });
        it('some() should return false if all are wrong', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.some(() => false)).to.be.false;
        });
        it('some() should return true if all are right', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.some(() => true)).to.be.true;
        });

        it('some() should return true if only one is right', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            expect(hashmap.some((value) => value === 'value2')).to.be.true;
        });
        it('some() should respect function context', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            let ctx = {};
            hashmap.some(function () {
                expect(this).to.equal(ctx);
                return true;
            }, ctx);
        });
    });
    context('reduce()', function () {
        it('reduce() should pass the basic test', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            const called = hashmap.reduce(function (accumulator, value, key, iterable) {
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(hashmap);
                expect(iterable).to.equal(hashmap);
                return accumulator + 1;
            }, 0,hashmap);
            expect(called).to.equal(1);
        });

        it('reduce() should call the callback once per key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            const calledPlus10 = hashmap.reduce(function (accumulator, value, key) {
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

        it('reduce() should be undefined on an empty map', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.reduce(() => false)).to.be.undefined;
            expect(hashmap.reduce(() => true)).to.be.undefined;
        });

        it('reduce() should use first value if intializer is undefined', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 3);
            hashmap.set('key2', 5);
            expect(hashmap.reduce((accumulator, value) => accumulator + value)).to.be.equal(8);
        });

        it('reduce() should accumulate all values', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 3);
            hashmap.set('key2', 5);
            expect(hashmap.reduce((accumulator, value) => accumulator + value, 1)).to.be.equal(9);
        });

        it('reduce() should accumulate all strings', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'one');
            hashmap.set('key2', 4);
            expect(hashmap.reduce((accumulator, value) => accumulator + value, 'hi')).to.be.equal('hione4');
        });

        it('reduce() should respect function context', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            let ctx = {};
            hashmap.reduce(function () {
                expect(this).to.equal(ctx);
                return true;
            }, true, ctx);
        });
    });
    context('reduceRight()', function () {
        it('reduceRight() should pass the basic test', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            const called = hashmap.reduceRight(function (accumulator, value, key, iterable) {
                expect(value).to.equal('value');
                expect(key).to.equal('key');
                expect(this).to.equal(hashmap);
                expect(iterable).to.equal(hashmap);
                return accumulator + 1;
            }, 0,hashmap);
            expect(called).to.equal(1);
        });

        it('reduceRight() should call the callback once per key', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            hashmap.set('key2', 'value2');
            hashmap.set('key2', 'value2a');
            let called1 = false;
            let called2 = false;
            const calledPlus10 = hashmap.reduceRight(function (accumulator, value, key) {
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

        it('reduceRight() should be undefined on an empty map', function () {
            // Given
            const hashmap = new HashMap();
            expect(hashmap.reduceRight(() => false)).to.be.undefined;
            expect(hashmap.reduceRight(() => true)).to.be.undefined;
        });

        it('reduceRight() should use first value if intializer is undefined', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 3);
            hashmap.set('key2', 5);
            expect(hashmap.reduceRight((accumulator, value) => accumulator + value)).to.be.equal(8);
        });

        it('reduceRight() should accumulate all values', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 3);
            hashmap.set('key2', 5);
            expect(hashmap.reduceRight((accumulator, value) => accumulator + value, 1)).to.be.equal(9);
        });

        it('reduceRight() should accumulate all strings', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'one');
            hashmap.set('key2', 4);
            expect(hashmap.reduceRight((accumulator, value) => accumulator + value, 'hi')).to.be.equal('hi4one');
        });

        it('reduceRight() should respect function context', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key', 'value');
            let ctx = {};
            hashmap.reduceRight(function () {
                expect(this).to.equal(ctx);
                return true;
            }, true, ctx);
        });
    });
    context('Iterators', function () {
        it('[Symbol.iterator]', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            let executedCount = 0;
            let executedFlags = 0;
            // When & Then
            for ([key, value] of hashmap) {
                switch (key) {
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
            // Then
            expect(executedCount).to.equal(2);
            expect(executedFlags).to.equal(0b11);
        });
        it('[Symbol.iterator] size 3', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            let executedCount = 0;
            let executedFlags = 0;
            // When & Then
            for ([key, value] of hashmap) {
                switch (key) {
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
            // Then
            expect(executedCount).to.equal(3);
            expect(executedFlags).to.equal(0b111);
        });
        it('entries', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            let executedCount = 0;
            let executedFlags = 0;
            // When & Then
            for ([key, value] of hashmap.entries()) {
                switch (key) {
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
            // Then
            expect(executedCount).to.equal(2);
            expect(executedFlags).to.equal(0b11);
        });
        it('entries size 3', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            let executedCount = 0;
            let executedFlags = 0;
            // When & Then
            for ([key, value] of hashmap.entries()) {
                switch (key) {
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
            // Then
            expect(executedCount).to.equal(3);
            expect(executedFlags).to.equal(0b111);
        });

        it('entriesRight()', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            const forward = [];
            for (const entry of hashmap) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of hashmap.entriesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('entriesRight() size 3', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            const forward = [];
            for (const entry of hashmap) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of hashmap.entriesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('keys()', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            let executedCount = 0;
            let executedFlags = 0;
            // When
            for (const key of hashmap.keys()) {
                switch (key) {
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
            // Then
            expect(executedCount).to.equal(2);
            expect(executedFlags).to.equal(0b11);
        });
        it('keys() size 3', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            let executedCount = 0;
            let executedFlags = 0;
            // When
            for (const key of hashmap.keys()) {
                switch (key) {
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
            // Then
            expect(executedCount).to.equal(3);
            expect(executedFlags).to.equal(0b111);
        });

        it('keysRight()', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            const forward = [];
            for (const entry of hashmap.keys()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of hashmap.keysRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('keysRight() size 3', function () {
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            const forward = [];
            for (const entry of hashmap.keys()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of hashmap.keysRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('values()', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            let executedFlags = 0;
            let executedCount = 0;
            // When
            for (const value of hashmap.values()) {
                switch (value) {
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
            // Then
            expect(executedCount).to.equal(2);
            expect(executedFlags).to.equal(0b11);
        });
        it('values() size 3', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            let executedFlags = 0;
            let executedCount = 0;
            // When
            for (const value of hashmap.values()) {
                switch (value) {
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
            // Then
            expect(executedCount).to.equal(3);
            expect(executedFlags).to.equal(0b111);
        });
        it('valuesRight()', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            const forward = [];
            for (const entry of hashmap.values()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of hashmap.valuesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('valuesRight() size 3', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set("key1", "value1");
            hashmap.set("key2", "value2");
            hashmap.set("key3", "value3");
            const forward = [];
            for (const entry of hashmap.values()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of hashmap.valuesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
    });
});
/* jshint ignore:end */