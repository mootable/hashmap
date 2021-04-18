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
    context('hashConflicts()', function () {
        it('hashConflicts', function () {
            const container = new LinkedContainer(defaultMap, undefined, 1);

            expect(container.hashConflicts(1)).to.be.false;
            expect(container.hashConflicts(2)).to.be.true;
        });

    });
});

/* jshint ignore:end */