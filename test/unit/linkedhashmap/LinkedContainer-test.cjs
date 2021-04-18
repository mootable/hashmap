/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {LinkedHashMap, LinkedContainer} = esmRequire('../../../src/linkedhashmap/');
const {sameValueZero} = esmRequire('../../../src/utils')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}
describe('LinkedContainer Class', function () {

    let defaultMap = new LinkedHashMap();
    beforeEach(function() {
        defaultMap = new LinkedHashMap();
    });
    const defaultMethodOptions = {equals: sameValueZero};

    context('constructor()', function () {
        it('constructor', function () {
            const container = new LinkedContainer(defaultMap);
            expect(container.size).to.equal(0);
            expect(container.contents.length).to.equal(0);
            expect(container.map).to.equal(defaultMap);
        });
    });
    context('has()', function () {
        it('has key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            container.set("key2", "value2", defaultMethodOptions);
            const ret = container.has("key", defaultMethodOptions);
            expect(ret).to.be.true;
            const ret2 = container.has("key2", defaultMethodOptions);
            expect(ret2).to.be.true;
        });
        it('has not got key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            container.set("key2", "value2", defaultMethodOptions);
            const ret = container.has("other", defaultMethodOptions);
            expect(ret).to.be.false;
        });
        it('has when empty', function () {
            const container = new LinkedContainer(defaultMap);
            const ret = container.has("key", defaultMethodOptions);
            expect(ret).to.be.false;
        });
    });
    context('get()', function () {
        it('get with prefil', function () {

            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            const value = container.get("key", defaultMethodOptions);
            expect(value).to.equal("value");
        });
        it('get has not got key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            const value = container.get("other", defaultMethodOptions);
            expect(value).to.be.undefined
        });
        it('get is empty', function () {
            const container = new LinkedContainer(defaultMap);
            const value = container.get("other", defaultMethodOptions);
            expect(value).to.be.undefined
        });

    });
    context('optionalGet()', function () {
        it('optionalGet has key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            const option = container.optionalGet("key", defaultMethodOptions);
            expect(option.value).to.equal("value");
            expect(option.has).to.be.true;
        });
        it('optionalGet has not got key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            const option = container.optionalGet("other", defaultMethodOptions);
            expect(option.has).to.be.false;
        });
        it('optionalGet is empty', function () {
            const container = new LinkedContainer(defaultMap);
            const option = container.optionalGet("other", defaultMethodOptions);
            expect(option.has).to.be.false;
        });
    });
    context('set()', function () {
        it('set has keyed entry', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});

            container.set("key", "value3", defaultMethodOptions);
            const value = container.get("key", defaultMethodOptions);
            expect(value).to.equal("value3");
            expect(container.size).to.equal(1);

            expect(defaultMap.start).to.deep.equal(["key", "value3"]);
            expect(defaultMap.end).to.deep.equal(["key", "value3"]);
            expect(defaultMap.start.next).to.be.undefined;
            expect(defaultMap.end.previous).to.be.undefined;
        });
        it('set has entry but not keyed', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            const value = container.get("key", defaultMethodOptions);
            expect(value).to.equal("value");
            const value2 = container.get("key2", defaultMethodOptions);
            expect(value2).to.equal("value2");
            const value3 = container.get("key3", defaultMethodOptions);
            expect(value3).to.equal("value3");
            expect(container.size).to.equal(3);

            expect(defaultMap.start).to.deep.equal(["key", "value"]);
            expect(defaultMap.end).to.deep.equal(["key3", "value3"]);
            expect(defaultMap.start.next).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.end.previous).to.deep.equal(defaultMap.start.next);
            expect(defaultMap.end.previous.previous).to.deep.equal(defaultMap.start);
            expect(defaultMap.start.next.next).to.deep.equal(defaultMap.end);
        });
    });
    context('emplace()', function () {
        it('emplace has keyed entry', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
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
            const ret = container.emplace("key", handler, defaultMethodOptions);
            expect(ret).to.equal("value3");
            expect(updateCalled).to.equal(1);
            expect(insertCalled).to.equal(0);
            const value = container.get("key", defaultMethodOptions);
            expect(value).to.equal("value3");
            expect(container.size).to.equal(1);

            expect(defaultMap.start).to.deep.equal(["key", "value3"]);
            expect(defaultMap.end).to.deep.equal(["key", "value3"]);
            expect(defaultMap.start.next).to.be.undefined;
            expect(defaultMap.end.previous).to.be.undefined;
        });
        it('emplace has keyed entry but no update method', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            let insertCalled = 0;
            const handler = {
                insert: (key, map) => {
                    expect(key).to.equal("key");
                    expect(map).to.equal(defaultMap);
                    insertCalled++;
                    return "value2";
                }
            };
            const ret = container.emplace("key", handler, defaultMethodOptions);
            expect(ret).to.equal("value2");
            expect(insertCalled).to.equal(1);
            const value = container.get("key", defaultMethodOptions);
            expect(value).to.equal("value2");
            expect(container.size).to.equal(1);

            expect(defaultMap.start).to.deep.equal(["key", "value2"]);
            expect(defaultMap.end).to.deep.equal(["key", "value2"]);
            expect(defaultMap.start.next).to.be.undefined;
            expect(defaultMap.end.previous).to.be.undefined;
        });

        it('emplace has entry but not keyed', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            let updateCalled = 0;
            let insertCalled = 0;
            const handler = {
                update: (oldValue, key, map) => {
                    updateCalled++;
                    return "value3";
                },
                insert: (key, map) => {
                    expect(key).to.equal("key2");
                    expect(map).to.equal(defaultMap);
                    insertCalled++;
                    return "value2";
                }
            };
            const ret = container.emplace("key2", handler, defaultMethodOptions);
            expect(ret).to.equal("value2");
            expect(updateCalled).to.equal(0);
            expect(insertCalled).to.equal(1);
            const value = container.get("key", defaultMethodOptions);
            expect(value).to.equal("value");
            const value2 = container.get("key2", defaultMethodOptions);
            expect(value2).to.equal("value2");
            expect(container.size).to.equal(2);

            expect(defaultMap.start).to.deep.equal(["key", "value"]);
            expect(defaultMap.end).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.start.next).to.equal(defaultMap.end);
            expect(defaultMap.end.previous).to.equal(defaultMap.start);
        });

    });
    context('delete()', function () {
        it('delete has key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            container.set("key2", "value2", defaultMethodOptions);
            const ret = container.delete("key", defaultMethodOptions);
            expect(ret).to.be.true;
            expect(container.size).to.equal(1);
            expect(container.has("key", defaultMethodOptions)).to.false;

            expect(defaultMap.start).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.end).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.start.next).to.be.undefined;
            expect(defaultMap.end.previous).to.be.undefined;
        });
        it('delete has not got key', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key", "value", {});
            container.set("key2", "value2", defaultMethodOptions);
            const ret = container.delete("other", defaultMethodOptions);
            expect(ret).to.be.false;
            expect(container.size).to.equal(2);

            expect(defaultMap.start).to.deep.equal(["key", "value"]);
            expect(defaultMap.end).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.start.next).to.equal(defaultMap.end);
            expect(defaultMap.end.previous).to.equal(defaultMap.start);
        });
        it('delete has got 3 entries delete first', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);

            expect(container.size).to.equal(3);
            const ret = container.delete("key1", defaultMethodOptions);
            expect(ret).to.be.true;
            expect(container.size).to.equal(2);
            expect(container.has("key1", defaultMethodOptions)).to.false; // <--
            expect(container.has("key2", defaultMethodOptions)).to.true;
            expect(container.has("key3", defaultMethodOptions)).to.true;

            expect(defaultMap.start).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.end).to.deep.equal(["key3", "value3"]);
            expect(defaultMap.start.next).to.equal(defaultMap.end);
            expect(defaultMap.end.previous).to.equal(defaultMap.start);
        });
        it('delete has got 3 entries delete middle', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);

            expect(container.size).to.equal(3);
            const ret = container.delete("key2", defaultMethodOptions);
            expect(ret).to.be.true;
            expect(container.size).to.equal(2);
            expect(container.has("key1", defaultMethodOptions)).to.true;
            expect(container.has("key2", defaultMethodOptions)).to.false; // <--
            expect(container.has("key3", defaultMethodOptions)).to.true;

            expect(defaultMap.start).to.deep.equal(["key1", "value1"]);
            expect(defaultMap.end).to.deep.equal(["key3", "value3"]);
            expect(defaultMap.start.next).to.equal(defaultMap.end);
            expect(defaultMap.end.previous).to.equal(defaultMap.start);
        });
        it('delete has got 3 entries delete last', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);

            expect(container.size).to.equal(3);
            const ret = container.delete("key3", defaultMethodOptions);
            expect(ret).to.be.true;
            expect(container.size).to.equal(2);
            expect(container.has("key1", defaultMethodOptions)).to.true;
            expect(container.has("key2", defaultMethodOptions)).to.true;
            expect(container.has("key3", defaultMethodOptions)).to.false; // <--

            expect(defaultMap.start).to.deep.equal(["key1", "value1"]);
            expect(defaultMap.end).to.deep.equal(["key2", "value2"]);
            expect(defaultMap.start.next).to.equal(defaultMap.end);
            expect(defaultMap.end.previous).to.equal(defaultMap.start);
        });

    });
    context('Iterators', function () {
        it('[Symbol.iterator]', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            let executedCount = 0;
            for ([key, value] of container) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
            }
            expect(executedCount).to.equal(2);
        });
        it('[Symbol.iterator] size 3', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            let executedCount = 0;
            for ([key, value] of container) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
                expect(value).to.equal("value" + executedCount);
            }
            expect(executedCount).to.equal(3);
        });

        it('entriesRight()', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            let executedCount = 0;
            for ([key, value] of container.entriesRight()) {
                executedCount++;
                expect(key).to.equal("key" + (3 - executedCount)); // Equivalent of counting down.
                expect(value).to.equal("value" + (3 - executedCount)); // 3-1 = 2, 3-2 = 1
            }
            expect(executedCount).to.equal(2);
        });
        it('entriesRight() size 3', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            let executedCount = 0;
            for ([key, value] of container.entriesRight()) {
                executedCount++;
                expect(key).to.equal("key" + (4 - executedCount)); // Equivalent of counting down.
                expect(value).to.equal("value" + (4 - executedCount)); // 4-1 = 3, 4-2 = 2, 4-3 = 1
            }
            expect(executedCount).to.equal(3);
        });

        it('keys', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            let executedCount = 0;
            for (const key of container.keys()) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
            }
            expect(executedCount).to.equal(2);
        });
        it('keys size 3', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            let executedCount = 0;
            for (const key of container.keys()) {
                executedCount++;
                expect(key).to.equal("key" + executedCount);
            }
            expect(executedCount).to.equal(3);
        });


        it('keysRight()', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            let executedCount = 0;
            for (const key of container.keysRight()) {
                executedCount++;
                expect(key).to.equal("key" + (3 - executedCount)); // 3-1 = 2, 3-2 = 1
            }
            expect(executedCount).to.equal(2);
        });
        it('keysRight() size 3', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            let executedCount = 0;
            for (const key of container.keysRight()) {
                executedCount++;
                expect(key).to.equal("key" + (4 - executedCount)); // 4-1 = 3, 4-2 = 2, 4-3 = 1
            }
            expect(executedCount).to.equal(3);
        });

        it('values', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            let executedCount = 0;
            for (const value of container.values()) {
                executedCount++;
                expect(value).to.equal("value" + executedCount);
            }
            expect(executedCount).to.equal(2);
        });
        it('values size 3', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            let executedCount = 0;
            for (const value of container.values()) {
                executedCount++;
                expect(value).to.equal("value" + executedCount);
            }
            expect(executedCount).to.equal(3);
        });


        it('valuesRight()', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            let executedCount = 0;
            for (const value of container.valuesRight()) {
                executedCount++;
                expect(value).to.equal("value" + (3 - executedCount)); // 3-1 = 2, 3-2 = 1
            }
            expect(executedCount).to.equal(2);
        });
        it('valuesRight() size 3', function () {
            const container = new LinkedContainer(defaultMap);
            container.createEntry("key1", "value1", {});
            container.set("key2", "value2", defaultMethodOptions);
            container.set("key3", "value3", defaultMethodOptions);
            let executedCount = 0;
            for (const value of container.valuesRight()) {
                executedCount++;
                expect(value).to.equal("value" + (4 - executedCount)); // 4-1 = 3, 4-2 = 2, 4-3 = 1
            }
            expect(executedCount).to.equal(3);
        });

    });
    context('internals', function () {
        it('hashConflicts', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            // When & Then
            expect(container.hashConflicts(1)).to.be.false;
            expect(container.hashConflicts(2)).to.be.true;
        });
        it('createEntry on empty', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            // When
            const ret = container.createEntry('key','value', {});
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(ret);
            expect(ret).to.deep.equal(['key','value']);
        });
        it('createEntry on has values', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            container.createEntry('key1','value1', {});
            // When
            const ret = container.createEntry('key2','value2', {});
            // Then
            expect(container.size).to.equal(2);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(ret);
            expect(container.contents[0]).to.deep.equal(defaultMap.start);
            expect(container.contents[1]).to.deep.equal(defaultMap.end);
        });

        it('createEntry addToStart on empty', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            // When
            const ret = container.createEntry('key','value', {addToStart:true});
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(ret);
            expect(ret).to.deep.equal(['key','value']);
        });
        it('createEntry addToStart on has values', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {});
            defaultMap.start = first;
            defaultMap.end = first;
            // When
            const ret = container.createEntry('key2','value2', {addToStart:true});
            // Then
            expect(container.size).to.equal(2);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(ret);
            expect(container.contents[0]).to.deep.equal(defaultMap.end);
            expect(container.contents[1]).to.deep.equal(defaultMap.start);
        });
        it('updateEntry', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const entry = container.createEntry('key1','value1', {});
            // When
            container.updateEntry(entry,'value2', {});
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(['key1','value2']);
            expect(container.contents[0]).to.deep.equal(entry);
            expect(defaultMap.start).to.deep.equal(entry);
            expect(defaultMap.end).to.deep.equal(entry);
        });
        it('updateEntry two entries', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            // When
            container.updateEntry(first,'value2', {});
            // Then
            expect(container.size).to.equal(2);
            expect(container.contents[0]).to.deep.equal(['key1','value2']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(second);
        });
        it('updateEntry three entries, update first', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(first,'other', {});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','other']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','value3']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(third);
        });
        it('updateEntry three entries, update second', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(second,'other', {});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','other']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','value3']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(third);
        });
        it('updateEntry three entries, update third', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(third,'other', {});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','other']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(third);
        });
        it('updateEntry moveOnUpdate just one entry', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const entry = container.createEntry('key1','value1', {});
            // When
            container.updateEntry(entry,'value2', {moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(['key1','value2']);
            expect(container.contents[0]).to.deep.equal(entry);
            expect(defaultMap.start).to.deep.equal(entry);
            expect(defaultMap.end).to.deep.equal(entry);
        });
        it('updateEntry moveOnUpdate two entries', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            // When
            container.updateEntry(first,'value2', {moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(2);
            expect(container.contents[0]).to.deep.equal(['key1','value2']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(defaultMap.start).to.deep.equal(second);
            expect(defaultMap.end).to.deep.equal(first);
        });
        it('updateEntry moveOnUpdate three entries, update first', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(first,'other', {moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','other']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','value3']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(second);
            expect(defaultMap.end).to.deep.equal(first);
        });
        it('updateEntry moveOnUpdate three entries, update second', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(second,'other', {moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','other']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','value3']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(second);
        });
        it('updateEntry moveOnUpdate three entries, update third', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(third,'other', {moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','other']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(third);
        });

        it('updateEntry addToStart & moveOnUpdate just one entry', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const entry = container.createEntry('key1','value1', {});
            // When
            container.updateEntry(entry,'value2', {addToStart: true, moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(['key1','value2']);
            expect(container.contents[0]).to.deep.equal(entry);
            expect(defaultMap.start).to.deep.equal(entry);
            expect(defaultMap.end).to.deep.equal(entry);
        });
        it('updateEntry addToStart & moveOnUpdate two entries', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            // When
            container.updateEntry(first,'value2', {addToStart: true, moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(2);
            expect(container.contents[0]).to.deep.equal(['key1','value2']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(second);
        });
        it('updateEntry addToStart &  moveOnUpdate three entries, update first', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(first,'other', {addToStart: true, moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','other']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','value3']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(first);
            expect(defaultMap.end).to.deep.equal(third);
        });
        it('updateEntry addToStart & moveOnUpdate three entries, update second', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(second,'other', {addToStart: true, moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','other']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','value3']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(second);
            expect(defaultMap.end).to.deep.equal(third);
        });
        it('updateEntry addToStart & moveOnUpdate three entries, update third', function () {
            // Given
            const container = new LinkedContainer(defaultMap, undefined, 1);
            const first = container.createEntry('key1','value1', {} );
            const second = container.createEntry('key2','value2', {});
            const third = container.createEntry('key3','value3', {});
            // When
            container.updateEntry(third,'other', {addToStart: true, moveOnUpdate:true});
            // Then
            expect(container.size).to.equal(3);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
            expect(container.contents[0]).to.deep.equal(first);
            expect(container.contents[1]).to.deep.equal(['key2','value2']);
            expect(container.contents[1]).to.deep.equal(second);
            expect(container.contents[2]).to.deep.equal(['key3','other']);
            expect(container.contents[2]).to.deep.equal(third);
            expect(defaultMap.start).to.deep.equal(third);
            expect(defaultMap.end).to.deep.equal(second);
        });

        it('deleteEntry', function () {
            // Given
            const containerGrandParent = new LinkedContainer(defaultMap, undefined, 1);
            containerGrandParent.size=7;
            const containerParent = new LinkedContainer(defaultMap, containerGrandParent, 1);
            containerParent.size=5;
            const container = new LinkedContainer(defaultMap, containerParent, 1);
            const entry = container.createEntry('key1','value1', {});
            // When
            container.deleteEntry(entry);
            // Then
            expect(container.size).to.equal(0);
            expect(containerParent.size).to.equal(4);
            expect(containerGrandParent.size).to.equal(6);
        });
        it('deleteEntry with more than one', function () {
            // Given
            const containerGrandParent = new LinkedContainer(defaultMap, undefined, 1);
            containerGrandParent.size=7;
            const containerParent = new LinkedContainer(defaultMap, containerGrandParent, 1);
            containerParent.size=5;
            const container = new LinkedContainer(defaultMap, containerParent, 1);
            container.createEntry('key1','value1', {});
            const entry = container.createEntry('key2','value2', {});
            // When
            container.deleteEntry(entry);
            // Then
            expect(container.size).to.equal(1);
            expect(containerParent.size).to.equal(4);
            expect(containerGrandParent.size).to.equal(6);
        });
        it('deleteEntry entry not there', function () {
            // Given
            const containerGrandParent = new LinkedContainer(defaultMap, undefined, 1);
            containerGrandParent.size=7;
            const containerParent = new LinkedContainer(defaultMap, containerGrandParent, 1);
            containerParent.size=5;
            const container = new LinkedContainer(defaultMap, containerParent, 1);
            container.createEntry('key1','value1', {});
            // just reusing the parent to create a non existing entry. this will up the size.
            const entry = containerGrandParent.createEntry('key2','value2', {});
            // When
            container.deleteEntry(entry);
            // Then
            expect(container.size).to.equal(1);
            expect(containerParent.size).to.equal(5);
            expect(containerGrandParent.size).to.equal(8);
        });
        it('deleteIndex', function () {
            // Given
            const container = new LinkedContainer(defaultMap, 1);
            container.createEntry('key1','value1', {});
            // When
            container.deleteIndex(0);
            // Then
            expect(container.size).to.equal(0);
        });
        it('deleteIndex last of 2', function () {
            // Given
            const container = new LinkedContainer(defaultMap, 1);
            container.createEntry('key1','value1', {});
            container.createEntry('key2','value2', {});
            // When
            container.deleteIndex(1);
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(['key1','value1']);
        });
        it('deleteIndex first of 2', function () {
            // Given
            const container = new LinkedContainer(defaultMap, 1);
            container.createEntry('key1','value1', {});
            container.createEntry('key2','value2', {});
            // When
            container.deleteIndex(0);
            // Then
            expect(container.size).to.equal(1);
            expect(container.contents[0]).to.deep.equal(['key2','value2']);
        });
    });
});

/* jshint ignore:end */