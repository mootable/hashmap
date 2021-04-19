/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Container} = esmRequire('../../../src/hashmap/container')
const {HashMap} = esmRequire('../../../src/hashmap')

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
        it('keyOf() with 3 values reverse search ', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.keyOf('value2', {reverse:true});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret).to.be.equal('key2');
        });
        it('keyOf() with 3 values explict equals', function () {
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

        it('optionalKeyOf() with 3 values reverse search', function () {
            // Given
            const hashmap = new HashMap();
            hashmap.set('key1', 'value1')
            hashmap.set('key2', 'value2')
            hashmap.set('key3', 'value3')
            expect(hashmap.size).to.equal(3);
            // When
            const ret = hashmap.optionalKeyOf('value2',{reverse:true});
            // Then
            expect(hashmap.size).to.equal(3);
            expect(ret.value).to.be.equal('key2');
            expect(ret.has).to.be.true;
        });
        it('optionalKeyOf() with 3 values explict equals', function () {
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