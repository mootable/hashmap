/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {HashMap, Container} = esmRequire('../../../src/hashmap')
const {sameValueZero} = esmRequire('../../../src/utils')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}

const createEntry = (key, value) => [key, value];
const deleteEntry = (entry) => undefined;

const overwriteEntry = (key, value, oldEntry) => {
    oldEntry[1] = value;
    return oldEntry;
};
/**
 * constructor
 * get
 * optionalGet
 * set
 * has
 * delete
 * [Symbol.iterator]
 */
describe('Container Class', function () {

    const defaultMap = {};
    const defaultMethodOptions = {equals:sameValueZero};
    it('constructor', function () {
        const container = new Container(defaultMap);
        expect(container.size).to.equal(0);
        expect(container.contents.length).to.equal(0);
        expect(container.map).to.equal(defaultMap);
    });
    it('get with prefil', function () {

        const container = new Container(defaultMap);
        container.createEntry("key","value");
        const value = container.get("key",defaultMethodOptions);
        expect(value).to.equal("value");
    });
    it('get has not got key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        const value = container.get("other",defaultMethodOptions);
        expect(value).to.be.undefined
    });
    it('optionalGet has key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        const option = container.optionalGet("key",defaultMethodOptions);
        expect(option.value).to.equal("value");
        expect(option.has).to.be.true;
    });
    it('optionalGet has not got key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        const option = container.optionalGet("other",defaultMethodOptions);
        expect(option.has).to.be.false;
    });
    it('set has keyed entry', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");

        const ret = container.set("key","value3",defaultMethodOptions);
        expect(ret).to.be.false;
        const value = container.get("key",defaultMethodOptions);
        expect(value).to.equal("value3");
        expect(container.size).to.equal(1);
    });
    it('set has entry but not keyed', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        container.set("key2","value2",defaultMethodOptions);
        const ret = container.set("key3","value3",defaultMethodOptions);
        expect(ret).to.be.true;
        const value = container.get("key",defaultMethodOptions);
        expect(value).to.equal("value");
        const value2 = container.get("key2",defaultMethodOptions);
        expect(value2).to.equal("value2");
        const value3 = container.get("key3",defaultMethodOptions);
        expect(value3).to.equal("value3");
        expect(container.size).to.equal(3);
    });
    it('has key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        container.set("key2","value2",defaultMethodOptions);
        const ret = container.has("key",defaultMethodOptions);
        expect(ret).to.be.true;
        const ret2 = container.has("key2",defaultMethodOptions);
        expect(ret2).to.be.true;
    });
    it('has not got key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        container.set("key2","value2",defaultMethodOptions);
        const ret = container.has("other",defaultMethodOptions);
        expect(ret).to.be.false;
    });
    it('delete has key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        container.set("key2","value2",defaultMethodOptions);
        const ret = container.delete("key",defaultMethodOptions);
        expect(ret).to.be.true;
        expect(container.size).to.equal(1);
        expect(container.has("key", defaultMethodOptions)).to.false;
    });
    it('delete has not got key', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        container.set("key2","value2",defaultMethodOptions);
        const ret = container.delete("other",defaultMethodOptions);
        expect(ret).to.be.false;
        expect(container.size).to.equal(2);
    });
    it('delete has got 3 entries', function () {
        const container = new Container(defaultMap);
        container.createEntry("key","value");
        container.set("key2","value2",defaultMethodOptions);
        container.set("key3","value3", defaultMethodOptions);

        expect(container.size).to.equal(3);
        const ret = container.delete("key2",defaultMethodOptions);
        expect(ret).to.be.true;
        expect(container.size).to.equal(2);
        expect(container.has("key2", defaultMethodOptions)).to.false;
    });

    it('[Symbol.iterator]', function () {
        const container = new Container(defaultMap);
        container.createEntry("key1","value1");
        container.set("key2","value2",defaultMethodOptions);
        let executedCount = 0;
        for([key,value] of container){
            executedCount++;
            expect(key).to.equal("key"+executedCount);
            expect(value).to.equal("value"+executedCount);
        }
        expect(executedCount).to.equal(2);
    });
    it('[Symbol.iterator] size 3', function () {
        const container = new Container(defaultMap);
        container.createEntry("key1","value1");
        container.set("key2","value2",defaultMethodOptions);
        container.set("key3","value3",defaultMethodOptions);
        let executedCount = 0;
        for([key,value] of container){
            executedCount++;
            expect(key).to.equal("key"+executedCount);
            expect(value).to.equal("value"+executedCount);
        }
        expect(executedCount).to.equal(3);
    });

});
/* jshint ignore:end */