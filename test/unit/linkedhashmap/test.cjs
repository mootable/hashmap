/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {LinkedHashMap, LinkedContainer} = esmRequire('../../../src/linkedhashmap/');

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

describe('LinkedHashMap Class', function () {

    context('constructor()', function () {
        it('constructor(), basic', function () {
            // Given & When
            const linkedHashmap = new LinkedHashMap();
            // Then
            expect(linkedHashmap.size).to.equal(0);

            expect(linkedHashmap.start).to.be.undefined;
            expect(linkedHashmap.end).to.be.undefined;
        });

        it('constructor(), copies map', function () {
            // Given
            const map = new Map([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            // When
            const linkedHashmap = new LinkedHashMap(map);
            // Then
            expect(linkedHashmap.size).to.equal(4);
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next.next).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next.next.next).to.deep.equal(["key4", "value4"]);
            expect(linkedHashmap.end).to.deep.equal(linkedHashmap.start.next.next.next);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start.next.next);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(linkedHashmap.start.next);
            expect(linkedHashmap.end.previous.previous.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('constructor(), copies array', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            // When
            const linkedHashmap = new LinkedHashMap(arr);
            // Then
            expect(linkedHashmap.size).to.equal(4);
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next.next).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next.next.next).to.deep.equal(["key4", "value4"]);
            expect(linkedHashmap.end).to.deep.equal(linkedHashmap.start.next.next.next);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start.next.next);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(linkedHashmap.start.next);
            expect(linkedHashmap.end.previous.previous.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('constructor(), copies other LinkedHashMap', function () {
            // Given
            const linkedHashmapOld = new LinkedHashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            // When
            const linkedHashmap = new LinkedHashMap(linkedHashmapOld);
            // Then
            expect(linkedHashmap.size).to.equal(4);
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next.next).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next.next.next).to.deep.equal(["key4", "value4"]);
            expect(linkedHashmap.end).to.deep.equal(linkedHashmap.start.next.next.next);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start.next.next);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(linkedHashmap.start.next);
            expect(linkedHashmap.end.previous.previous.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
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
            const linkedHashmap = new LinkedHashMap(forEachObj);
            // Then
            expect(linkedHashmap.size).to.equal(4);
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next.next).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next.next.next).to.deep.equal(["key4", "value4"]);
            expect(linkedHashmap.end).to.deep.equal(linkedHashmap.start.next.next.next);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start.next.next);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(linkedHashmap.start.next);
            expect(linkedHashmap.end.previous.previous.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
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
            const linkedHashmap = new LinkedHashMap(entriesObj);
            // Then
            expect(linkedHashmap.size).to.equal(4);
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next.next).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next.next.next).to.deep.equal(["key4", "value4"]);
            expect(linkedHashmap.end).to.deep.equal(linkedHashmap.start.next.next.next);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start.next.next);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(linkedHashmap.start.next);
            expect(linkedHashmap.end.previous.previous.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });
    });
    context('size', function () {

        it('size, empty map', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.size).to.equal(0);
        });


        it('size, with entries', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            const linkedHashmap = new LinkedHashMap(arr);
            // When & Then
            expect(linkedHashmap.size).to.equal(4);
        });

    });
    context('length', function () {

        it('length, empty map', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.length).to.equal(0);
        });


        it('length, with entries', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            const linkedHashmap = new LinkedHashMap(arr);
            // When & Then
            expect(linkedHashmap.length).to.equal(4);
        });

    });
    context('createContainer()', function () {
        it('createContainer()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.createContainer(undefined,5)).to.be.instanceOf(LinkedContainer);
            expect(linkedHashmap.createContainer(undefined,5).hash).to.be.equal(5);
            expect(linkedHashmap.createContainer(undefined,5).map).to.be.equal(linkedHashmap);
        });

    });

    context('has()', function () {
        it('has() with key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.has('key')
            //Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.be.true;
        });

        it('has() with no key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.has('key');
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret).to.be.false;
        });

        it('has() with other key', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.has('other');
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.be.false;
        });

    });

    context('get()', function () {
        it('get() with key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.get('key');
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.be.equal('value');
        });

        it('get() with no key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.get('key');
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('get() with other key', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.get('other');
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.be.undefined;
        });

    });
    context('head()', function () {

        it('head() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.head();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('head() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.head();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal('value');
        });

        it('head() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.head();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal('value1');
        });
    });
    context('headKey()', function () {

        it('headKey() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.headKey();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('headKey() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.headKey();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal('key');
        });

        it('headKey() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.headKey();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal('key1');
        });
    });
    context('tail()', function () {

        it('tail() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.tail();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('tail() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.tail();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal('value');
        });

        it('tail() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.tail();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal('value2');
        });
    });
    context('tailKey()', function () {

        it('tailKey() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.tailKey();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret).to.be.undefined;
        });

        it('tailKey() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.tailKey();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal('key');
        });

        it('tailKey() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.tailKey();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal('key2');
        });
    });
    context('optionalGet()', function () {
        it('optionalGet() with key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.optionalGet('key');
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret.value).to.be.equal('value');
            expect(ret.has).to.be.true;
        });

        it('optionalGet() with no key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.optionalGet('key');
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalGet() with other key', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.optionalGet('other');
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret.has).to.be.false;
        });

    });
    context('optionalHead()', function () {
        it('optionalHead() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.optionalHead();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalHead() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.optionalHead();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('value');
        });

        it('optionalHead() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.optionalHead();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('value1');
        });
    });
    context('optionalHeadKey()', function () {

        it('optionalHeadKey() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.optionalHeadKey();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalHeadKey() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.optionalHeadKey();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('key');
        });

        it('optionalHeadKey() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.optionalHeadKey();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('key1');
        });
    });
    context('optionalTail()', function () {

        it('optionalTail() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.optionalTail();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalTail() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.optionalTail();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('value');
        });

        it('optionalTail() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.optionalTail();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('value2');
        });
    });
    context('optionalTailKey()', function () {

        it('optionalTailKey() with no entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When
            const ret = linkedHashmap.optionalTailKey();
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(ret.has).to.be.false;
        });

        it('optionalTailKey() with one entry ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When
            const ret = linkedHashmap.optionalTailKey();
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('key');
        });

        it('optionalTailKey() with two entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When
            const ret = linkedHashmap.optionalTailKey();
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(ret.has).to.be.true;
            expect(ret.value).to.equal('key2');
        });
    });

    context('set()', function () {
        it('set() insert key empty Map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.set('key', 'value')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('set() insert key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.set('key2', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key')).to.be.equal('value');
            expect(linkedHashmap.get('key2')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('set() overwrite key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.set('key', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('setLeft() overwrite key 2 entries (shouldn not move)', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.set('key', 'other')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key')).to.be.equal('other');

            expect(linkedHashmap.start).to.deep.equal(["key", "other"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "value2"]);

            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });
    });
    context('setLeft()', function () {
        it('setLeft() insert key empty Map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.setLeft('key', 'value')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('setLeft() insert second key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.setLeft('key2', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key1')).to.be.equal('value1');
            expect(linkedHashmap.get('key2')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('setLeft() overwrite key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.setLeft('key', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('setLeft() overwrite key 2 entries (shouldn not move)', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.setLeft('key2', 'other')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key2')).to.be.equal('other');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "other"]);

            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

    });
    context('push()', function () {
        it('push() insert key empty Map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.push('key', 'value')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('push() insert key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.push('key2', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key')).to.be.equal('value');
            expect(linkedHashmap.get('key2')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('push() overwrite key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.push('key', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('push() overwrite key 2 entries (should move)', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.push('key', 'other')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key')).to.be.equal('other');

            expect(linkedHashmap.start).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "other"]);

            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });
    });
    context('unshift()', function () {
        it('unshift() insert key empty Map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.unshift('key', 'value')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value');

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('unshift() insert second key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.unshift('key2', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key1')).to.be.equal('value1');
            expect(linkedHashmap.get('key2')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('unshift() overwrite key ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            // When & Then
            expect(linkedHashmap.unshift('key', 'value2')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value2');

            expect(linkedHashmap.start).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value2"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('unshift() overwrite key 2 entries (should move)', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.unshift('key2', 'other')).to.be.equal(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.get('key2')).to.be.equal('other');

            expect(linkedHashmap.start).to.deep.equal(["key2", "other"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value"]);

            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });
    });
    context('emplace()', function () {
        it('emplace(), insert', function () {
            const linkedHashmap = new LinkedHashMap();

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplace('key', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('emplace(), update', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value");
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplace('key', handler)
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('emplace() has keyed entry but no update method', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            let insertCalled = 0;
            const handler = {
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplace("key", handler);
            expect(ret).to.equal("insert");
            expect(insertCalled).to.equal(1);
            const value = linkedHashmap.get("key");
            expect(value).to.equal("insert");
            expect(linkedHashmap.size).to.equal(1);

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('emplace(), insert  2 entries', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key2");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplace('key2', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });
        it('emplace(), update 2 entries (should not move)', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            linkedHashmap.set('key2','value2')
            expect(linkedHashmap.size).to.equal(2);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value1");
                    expect(key).to.equal("key1");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplace('key1', handler)
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key1')).to.be.true;
            expect(linkedHashmap.get('key1')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key1", "update"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });

    });
    context('emplaceLeft()', function () {
        it('emplaceLeft(), insert', function () {
            const linkedHashmap = new LinkedHashMap();

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplaceLeft('key', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('emplaceLeft(), update', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value");
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplaceLeft('key', handler)
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('emplaceLeft() has keyed entry but no update method', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            let insertCalled = 0;
            const handler = {
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplaceLeft("key", handler);
            expect(ret).to.equal("insert");
            expect(insertCalled).to.equal(1);
            const value = linkedHashmap.get("key");
            expect(value).to.equal("insert");
            expect(linkedHashmap.size).to.equal(1);

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('emplaceLeft(), insert  2 entries', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key2");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplaceLeft('key2', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key2", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });
        it('emplaceLeft(), update 2 entries, (should not move)', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            linkedHashmap.set('key2','value2')
            expect(linkedHashmap.size).to.equal(2);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value2");
                    expect(key).to.equal("key2");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.emplaceLeft('key2', handler)
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "update"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });

    });
    context('pushEmplace()', function () {
        it('pushEmplace(), insert', function () {
            const linkedHashmap = new LinkedHashMap();

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.pushEmplace('key', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('pushEmplace(), update', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value");
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.pushEmplace('key', handler)
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('pushEmplace() has keyed entry but no update method', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            let insertCalled = 0;
            const handler = {
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.pushEmplace("key", handler);
            expect(ret).to.equal("insert");
            expect(insertCalled).to.equal(1);
            const value = linkedHashmap.get("key");
            expect(value).to.equal("insert");
            expect(linkedHashmap.size).to.equal(1);

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('pushEmplace(), insert  2 entries', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key2");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.pushEmplace('key2', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });
        it('pushEmplace(), update 2 entries (should move)', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            linkedHashmap.set('key2','value2')
            expect(linkedHashmap.size).to.equal(2);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value1");
                    expect(key).to.equal("key1");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.pushEmplace('key1', handler)
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key1')).to.be.true;
            expect(linkedHashmap.get('key1')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key1", "update"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });

    });
    context('unshiftEmplace()', function () {
        it('unshiftEmplace(), insert', function () {
            const linkedHashmap = new LinkedHashMap();

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.unshiftEmplace('key', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('unshiftEmplace(), update', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value");
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.unshiftEmplace('key', handler)
            expect(linkedHashmap.size).to.equal(1);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.true;
            expect(linkedHashmap.get('key')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "update"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('unshiftEmplace() has keyed entry but no update method', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            let insertCalled = 0;
            const handler = {
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.unshiftEmplace("key", handler);
            expect(ret).to.equal("insert");
            expect(insertCalled).to.equal(1);
            const value = linkedHashmap.get("key");
            expect(value).to.equal("insert");
            expect(linkedHashmap.size).to.equal(1);

            expect(linkedHashmap.start).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "insert"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });

        it('unshiftEmplace(), insert  2 entries', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key2");
                    expect(map).to.equal(linkedHashmap);
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.unshiftEmplace('key2', handler)
            expect(ret).to.equal("insert");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("insert");

            expect(linkedHashmap.start).to.deep.equal(["key2", "insert"]);
            expect(linkedHashmap.end).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });
        it('unshiftEmplace(), update 2 entries, (should move)', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1','value1')
            linkedHashmap.set('key2','value2')
            expect(linkedHashmap.size).to.equal(2);

            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    expect(oldValue).to.equal("value2");
                    expect(key).to.equal("key2");
                    expect(map).to.equal(linkedHashmap);
                    updateCalled++;
                    return "update";
                },
                insert: (key, map) => {
                    insertCalled++;
                    return "insert";
                }
            };
            const ret = linkedHashmap.unshiftEmplace('key2', handler)
            expect(linkedHashmap.size).to.equal(2);
            expect(ret).to.equal("update");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("update");

            expect(linkedHashmap.start).to.deep.equal(["key2", "update"]);
            expect(linkedHashmap.end).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
        });

    });

    context('delete()', function () {
        it('delete() empty map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.delete('key')).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.false;

            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.start).to.be.undefined;
        });

        it('delete() existing key', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            // When & Then
            expect(linkedHashmap.delete('key')).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.false;

            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.start).to.be.undefined;
        });

        it('delete() other key', function () {
            //Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            linkedHashmap.set('key2', 'value2')
            expect(linkedHashmap.get('key')).to.be.equal('value');
            expect(linkedHashmap.get('key2')).to.be.equal('value2');
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.delete('key2')).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.get('key')).to.be.equal('value');
            expect(linkedHashmap.has('key2')).to.be.false;

            expect(linkedHashmap.start).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.end).to.deep.equal(["key", "value"]);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.start.next).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.end.previous).to.be.undefined;
        });


        it('delete with 3 keys, first', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            linkedHashmap.set('key3', 'value3')
            expect(linkedHashmap.size).to.equal(3);
            linkedHashmap.delete('key1')
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key1')).to.be.false;
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("value2");
            expect(linkedHashmap.has('key3')).to.be.true;
            expect(linkedHashmap.get('key3')).to.be.equal("value3");

            expect(linkedHashmap.start).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

        it('delete with 3 keys, second', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            linkedHashmap.set('key3', 'value3')
            expect(linkedHashmap.size).to.equal(3);
            linkedHashmap.delete('key2')
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key1')).to.be.true;
            expect(linkedHashmap.get('key1')).to.be.equal("value1");
            expect(linkedHashmap.has('key2')).to.be.false;
            expect(linkedHashmap.has('key3')).to.be.true;
            expect(linkedHashmap.get('key3')).to.be.equal("value3");

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.end).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });
        it('delete with 3 keys, third', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            linkedHashmap.set('key3', 'value3')
            expect(linkedHashmap.size).to.equal(3);
            linkedHashmap.delete('key3')
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key1')).to.be.true;
            expect(linkedHashmap.get('key1')).to.be.equal("value1");
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("value2");
            expect(linkedHashmap.has('key3')).to.be.false;

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

    });
    context('shift()', function () {
        it('shift() empty map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.shift()).is.undefined;
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.false;

            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.start).to.be.undefined;
        });

        it('shift() existing key', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            // When & Then
            expect(linkedHashmap.shift()).to.deep.equal(['key', 'value']);
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.false;

            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.start).to.be.undefined;
        });

        it('shift with 3 keys', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            linkedHashmap.set('key3', 'value3')
            expect(linkedHashmap.size).to.equal(3);
            // When & Then
            expect(linkedHashmap.shift()).to.deep.equal(['key1', 'value1']);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key1')).to.be.false;
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("value2");
            expect(linkedHashmap.has('key3')).to.be.true;
            expect(linkedHashmap.get('key3')).to.be.equal("value3");

            expect(linkedHashmap.start).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.end).to.deep.equal(["key3", "value3"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

    });
    context('pop()', function () {
        it('pop() empty map ', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            // When & Then
            expect(linkedHashmap.pop()).to.be.undefined;
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.false;

            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.start).to.be.undefined;
        });

        it('pop() existing key', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key', 'value')
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.has('key')).to.be.true;
            // When & Then
            expect(linkedHashmap.pop()).to.deep.equal(['key', 'value']);
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has('key')).to.be.false;

            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.start).to.be.undefined;
        });

        it('pop() with 3 keys', function () {
            //Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', 'value1')
            linkedHashmap.set('key2', 'value2')
            linkedHashmap.set('key3', 'value3')
            expect(linkedHashmap.size).to.equal(3);
            expect(linkedHashmap.size).to.equal(3);
            // When & Then
            expect(linkedHashmap.pop()).to.deep.equal(['key3', 'value3']);
            // Then
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.has('key1')).to.be.true;
            expect(linkedHashmap.get('key1')).to.be.equal("value1");
            expect(linkedHashmap.has('key2')).to.be.true;
            expect(linkedHashmap.get('key2')).to.be.equal("value2");
            expect(linkedHashmap.has('key3')).to.be.false;

            expect(linkedHashmap.start).to.deep.equal(["key1", "value1"]);
            expect(linkedHashmap.end).to.deep.equal(["key2", "value2"]);
            expect(linkedHashmap.start.next).to.deep.equal(linkedHashmap.end);
            expect(linkedHashmap.end.previous).to.deep.equal(linkedHashmap.start);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
        });

    });

    context('copy()', function () {
        it('copy() map', function () {
            // Given
            const map = new Map([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key0', 'value0');
            linkedHashmap.set('key2', 'overwritethis');
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.copy(map)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(5);
            expect(linkedHashmap.get("key0")).equals("value0");
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");
        });

        it('copy() array', function () {
            // Given
            const arr = [["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]];
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key0', 'value0');
            linkedHashmap.set('key2', 'overwritethis');
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.copy(arr)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(5);
            expect(linkedHashmap.get("key0")).equals("value0");
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");
        });

        it('copy() LinkedHashMap', function () {
            // Given
            const linkedHashmapOld = new LinkedHashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key0', 'value0');
            linkedHashmap.set('key2', 'overwritethis');
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.copy(linkedHashmapOld)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(5);
            expect(linkedHashmap.get("key0")).equals("value0");
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");
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
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key0', 'value0');
            linkedHashmap.set('key2', 'overwritethis');
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.copy(forEachObj)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(5);
            expect(linkedHashmap.get("key0")).equals("value0");
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");
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
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key0', 'value0');
            linkedHashmap.set('key2', 'overwritethis');
            expect(linkedHashmap.size).to.equal(2);
            // When & Then
            expect(linkedHashmap.copy(entriesObj)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(5);
            expect(linkedHashmap.get("key0")).equals("value0");
            expect(linkedHashmap.get("key1")).equals("value1");
            expect(linkedHashmap.get("key2")).equals("value2");
            expect(linkedHashmap.get("key3")).equals("value3");
            expect(linkedHashmap.get("key4")).equals("value4");
        });

        it('copy() invalid', function () {
            // Given
            const invalidObj = {}
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key0', 'value0');
            linkedHashmap.set('key2', 'overwritethis');
            expect(linkedHashmap.size).to.equal(2);

            // When
            let errors = false;
            try {
                linkedHashmap.copy(invalidObj);
            } catch (err) {
                errors = true;
            }
            // Then
            expect(errors).to.be.true;
        });

    });
    context('clone()', function () {
        it('clone() LinkedHashMap', function () {
            // Given
            const linkedHashmap = new LinkedHashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            // When
            const linkedHashmapNew = linkedHashmap.clone();
            // Then
            expect(linkedHashmapNew).not.equals(linkedHashmap);
            expect(linkedHashmapNew.get("key1")).equals("value1");
            expect(linkedHashmapNew.get("key2")).equals("value2");
            expect(linkedHashmapNew.get("key3")).equals("value3");
            expect(linkedHashmapNew.get("key4")).equals("value4");
        });

    });
    context('clear()', function () {
        it('clear()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap([["key1", "value1"], ["key2", "value2"], ["key3", "value3"], ["key4", "value4"]]);
            expect(linkedHashmap.size).to.equal(4);
            // When & Then
            expect(linkedHashmap.clear(linkedHashmap)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.has("key1")).to.be.false;
            expect(linkedHashmap.has("key2")).to.be.false;
            expect(linkedHashmap.has("key3")).to.be.false;
            expect(linkedHashmap.has("key4")).to.be.false;
        });

        it('clear() empty', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);
            // When & Then
            expect(linkedHashmap.clear(linkedHashmap)).equals(linkedHashmap);
            // Then
            expect(linkedHashmap.size).to.equal(0);
        });

    });
    context('forEach()', function () {
        it('forEach', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', "value1");
            linkedHashmap.set('key2', "value2");
            linkedHashmap.set('key3', "value3");
            let executedCount = 0;
            const forEachCallback = (value, key, map) => {
                executedCount++;
                // Then
                expect(key).to.equal("key" +executedCount);
                expect(value).to.equal("value" + executedCount);
                expect(map).to.equal(linkedHashmap);
            };
            // When & Then
            expect(linkedHashmap.forEach(forEachCallback)).to.equal(linkedHashmap)

            // Then
            expect(executedCount).to.equal(3);

        });

        it('forEachRight', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', "value1");
            linkedHashmap.set('key2', "value2");
            linkedHashmap.set('key3', "value3");
            let executedCount = 3;
            const forEachCallback = (value, key, map) => {
                // Then
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
                expect(map).to.equal(linkedHashmap);
                executedCount--;
            };
            // When & Then
            expect(linkedHashmap.forEachRight(forEachCallback)).to.equal(linkedHashmap)

            // Then
            expect(executedCount).to.equal(0);

        });

    });
    context('reverse()', function () {
        it('reverse() 0', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            expect(linkedHashmap.size).to.equal(0);

            // When & Then
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            expect(linkedHashmap.size).to.equal(0);
            expect(linkedHashmap.start).to.be.undefined;
            expect(linkedHashmap.end).to.be.undefined;

            // When --- reverse back
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            expect(linkedHashmap.start).to.be.undefined;
            expect(linkedHashmap.end).to.be.undefined;
            expect(linkedHashmap.size).to.equal(0);
        });
        it('reverse() 1', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', "value1");
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;

            // When & Then
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            expect(linkedHashmap.size).to.equal(1);
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;

            // When --- reverse back
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.size).to.equal(1);
        });

        it('reverse() 2', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', "value1");
            linkedHashmap.set('key2', "value2");
            expect(linkedHashmap.size).to.equal(2);
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key2','value2']);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.end.previous).to.deep.equal(['key1','value1']);

            // When & Then
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            expect(linkedHashmap.size).to.equal(2);
            let executedCount = 2;
            const forEachCallbackBackward = (value, key, map) => {
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
                expect(map).to.equal(linkedHashmap);
                executedCount--;
            };
            linkedHashmap.forEach(forEachCallbackBackward);
            expect(linkedHashmap.start).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.end).to.deep.equal(['key1','value1']);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end.previous).to.deep.equal(['key2','value2']);
            expect(executedCount).to.equal(0);

            // When --- reverse back
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            const forEachCallbackForward = (value, key, map) => {
                executedCount++;
                expect(key).to.equal("key" +executedCount);
                expect(value).to.equal("value" + executedCount);
            };
            linkedHashmap.forEach(forEachCallbackForward);
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key2','value2']);
            expect(executedCount).to.equal(2);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.end.previous).to.deep.equal(['key1','value1']);
        });

        it('reverse() 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set('key1', "value1");
            linkedHashmap.set('key2', "value2");
            linkedHashmap.set('key3', "value3");
            expect(linkedHashmap.size).to.equal(3);
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key3','value3']);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.start.next.next).to.deep.equal(['key3','value3']);
            expect(linkedHashmap.end.previous).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(['key1','value1']);

            // When & Then
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            expect(linkedHashmap.size).to.equal(3);
            let executedCount = 3;
            const forEachCallbackBackward = (value, key, map) => {
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
                expect(map).to.equal(linkedHashmap);
                executedCount--;
            };
            linkedHashmap.forEach(forEachCallbackBackward);
            expect(linkedHashmap.start).to.deep.equal(['key3','value3']);
            expect(linkedHashmap.end).to.deep.equal(['key1','value1']);

            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.start.next.next).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end.previous).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(['key3','value3']);
            expect(executedCount).to.equal(0);

            // When --- reverse back
            expect(linkedHashmap.reverse()).to.equal(linkedHashmap)

            // Then
            const forEachCallbackForward = (value, key, map) => {
                executedCount++;
                expect(key).to.equal("key" +executedCount);
                expect(value).to.equal("value" + executedCount);
            };
            linkedHashmap.forEach(forEachCallbackForward);
            expect(linkedHashmap.start).to.deep.equal(['key1','value1']);
            expect(linkedHashmap.end).to.deep.equal(['key3','value3']);
            expect(executedCount).to.equal(3);
            expect(linkedHashmap.start.previous).to.be.undefined;
            expect(linkedHashmap.end.next).to.be.undefined;
            expect(linkedHashmap.start.next).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.start.next.next).to.deep.equal(['key3','value3']);
            expect(linkedHashmap.end.previous).to.deep.equal(['key2','value2']);
            expect(linkedHashmap.end.previous.previous).to.deep.equal(['key1','value1']);

        });

    });

    context('Iterators', function () {
        it('[Symbol.iterator]', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            let executedCount = 0;
            // When & Then
            for ([key, value] of linkedHashmap) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(2);
        });
        it('[Symbol.iterator] size 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            let executedCount = 0;
            // When & Then
            for ([key, value] of linkedHashmap) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(3);
        });
        it('entries', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            let executedCount = 0;
            // When & Then
            for ([key, value] of linkedHashmap) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(2);
        });
        it('entries size 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            let executedCount = 0;
            // When & Then
            for ([key, value] of linkedHashmap) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(3);
        });

        it('entriesRight()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            const forward = [];
            for (const entry of linkedHashmap) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of linkedHashmap.entriesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('entriesRight() size 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            const forward = [];
            for (const entry of linkedHashmap) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of linkedHashmap.entriesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('keys()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            let executedCount = 0;
            // When & Then
            for (const key of linkedHashmap.keys()) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(2);
        });
        it('keys() size 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            let executedCount = 0;
            // When & Then
            for (const key of linkedHashmap.keys()) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(3);
        });

        it('keysRight()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            const forward = [];
            for (const entry of linkedHashmap.keys()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of linkedHashmap.keysRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('keysRight() size 3', function () {
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            const forward = [];
            for (const entry of linkedHashmap.keys()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of linkedHashmap.keysRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('values()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            let executedCount = 0;
            // When & Then
            for (const value of linkedHashmap.values()) {
                executedCount++;
                expect(value).to.equal("value" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(2);
        });
        it('values() size 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            let executedCount = 0;
            // When & Then
            for (const value of linkedHashmap.values()) {
                executedCount++;
                expect(value).to.equal("value" + executedCount);
            }
            // Then
            expect(executedCount).to.equal(3);
        });
        it('valuesRight()', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            const forward = [];
            for (const entry of linkedHashmap.values()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of linkedHashmap.valuesRight()) {
                i -= 1;
                // Then
                expect(entry).to.deep.equal(forward[i]);
            }
            // Then
            expect(i).to.equal(0);
        });
        it('valuesRight() size 3', function () {
            // Given
            const linkedHashmap = new LinkedHashMap();
            linkedHashmap.set("key1", "value1");
            linkedHashmap.set("key2", "value2");
            linkedHashmap.set("key3", "value3");
            const forward = [];
            for (const entry of linkedHashmap.values()) {
                forward.push(entry);
            }
            let i = forward.length;
            // When
            for (const entry of linkedHashmap.valuesRight()) {
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