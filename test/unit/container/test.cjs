/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {SingleContainer, ArrayContainer} = esmRequire('../../../src/container')
const {Entry} = esmRequire('../../../src/entry')
const {sameValueZero} = esmRequire('../../../src/utils')

if (process.env.UNDER_TEST_UNIT !== 'true') {
    return 0;
}
/**
 * constructor
 * get
 * optionalGet
 * set
 * has
 * delete
 * [Symbol.iterator]
 */
describe('SingleContainer Class', function () {
    it('constructor', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        expect(container.key).to.equal("key");
        expect(container.value).to.equal("value");
        expect(container.size).to.equal(1);
        expect(container.entry).to.equal(entry);
    });
    it('get has key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const value = container.get("key",sameValueZero);
        expect(value).to.equal("value");
    });
    it('get has not got key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const value = container.get("other",sameValueZero);
        expect(value).to.be.undefined
    });
    it('optionalGet has key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const option = container.optionalGet("key",sameValueZero);
        expect(option.value).to.equal("value");
        expect(option.has).to.be.true;
    });
    it('optionalGet has not got key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const option = container.optionalGet("other",sameValueZero);
        expect(option.has).to.be.false;
    });
    it('set has keyed entry', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key","value2");
        const container = new SingleContainer(entry);
        const ret = container.set(entry2,sameValueZero);
        expect(ret).to.be.instanceOf(SingleContainer);
        const value = ret.get("key",sameValueZero);
        expect(value).to.equal("value2");
    });
    it('set has entry but not keyed', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new SingleContainer(entry);
        const ret = container.set(entry2,sameValueZero);
        expect(ret).to.be.instanceOf(ArrayContainer);
        const value = ret.get("key",sameValueZero);
        expect(value).to.equal("value");
        const value2 = ret.get("key2",sameValueZero);
        expect(value2).to.equal("value2");
    });
    it('has key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const ret = container.has("key",sameValueZero);
        expect(ret).to.be.true;
    });
    it('has not got key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const ret = container.has("other",sameValueZero);
        expect(ret).to.be.false;
    });
    it('delete has key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const ret = container.delete("key",sameValueZero);
        expect(ret).to.be.undefined;
    });
    it('delete has not got key', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        const ret = container.delete("other",sameValueZero);
        expect(ret).to.equal(container);
    });

    it('[Symbol.iterator]', function () {
        const entry = new Entry("key","value");
        const container = new SingleContainer(entry);
        let executedCount = 0;
        for([key,value] of container){
            executedCount++;
            expect(key).to.equal("key");
            expect(value).to.equal("value");
        }
        expect(executedCount).to.equal(1);
    });

});
describe('ArrayContainer Class', function () {
    it('constructor', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        expect(container.size).to.equal(2);
        expect(container.contents).to.deep.equal([entry,entry2]);
    });
    it('get has key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const value = container.get("key",sameValueZero);
        expect(value).to.equal("value");
        const value2 = container.get("key2",sameValueZero);
        expect(value2).to.equal("value2");
    });
    it('get has not got key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const value = container.get("other",sameValueZero);
        expect(value).to.be.undefined
    });
    it('optionalGet has key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const option = container.optionalGet("key",sameValueZero);
        expect(option.value).to.equal("value");
        expect(option.has).to.be.true;
        const option2 = container.optionalGet("key2",sameValueZero);
        expect(option2.value).to.equal("value2");
        expect(option2.has).to.be.true;
    });
    it('optionalGet has not got key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const option = container.optionalGet("other",sameValueZero);
        expect(option.has).to.be.false;
    });
    it('set has keyed entry', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const entryToSet = new Entry("key2","value3");
        const container = new ArrayContainer(entry,entry2);
        const ret = container.set(entryToSet,sameValueZero);
        expect(ret).to.be.instanceOf(ArrayContainer);
        const value = ret.get("key2",sameValueZero);
        expect(value).to.equal("value3");
        expect(container.size).to.equal(2);
    });
    it('set has entry but not keyed', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const entryToSet = new Entry("key3","value3");
        const container = new ArrayContainer(entry,entry2);
        const ret = container.set(entryToSet,sameValueZero);
        expect(ret).to.be.instanceOf(ArrayContainer);
        const value = ret.get("key",sameValueZero);
        expect(value).to.equal("value");
        const value2 = ret.get("key2",sameValueZero);
        expect(value2).to.equal("value2");
        const value3 = ret.get("key3",sameValueZero);
        expect(value3).to.equal("value3");
        expect(container.size).to.equal(3);
    });
    it('has key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const ret = container.has("key",sameValueZero);
        expect(ret).to.be.true;
        const ret2 = container.has("key2",sameValueZero);
        expect(ret2).to.be.true;
    });
    it('has not got key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const ret = container.has("other",sameValueZero);
        expect(ret).to.be.false;
    });
    it('delete has key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const ret = container.delete("key",sameValueZero);
        expect(ret).to.be.instanceOf(SingleContainer);
        expect(ret.size).to.equal(1);
        expect(ret.has("key", sameValueZero)).to.false;
    });
    it('delete has not got key', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        const ret = container.delete("other",sameValueZero);
        expect(ret).to.equal(container);
        expect(ret).to.be.instanceOf(ArrayContainer);
        expect(ret.size).to.equal(2);
    });
    it('delete has got 3 entries', function () {
        const entry = new Entry("key","value");
        const entry2 = new Entry("key2","value2");
        const entry3 = new Entry("key3","value3");
        const container = new ArrayContainer(entry,entry2).set(entry3, sameValueZero);
        expect(container.size).to.equal(3);
        const ret = container.delete("key2",sameValueZero);
        expect(ret).to.be.instanceOf(ArrayContainer);
        expect(ret.size).to.equal(2);
        expect(ret.has("key2", sameValueZero)).to.false;
    });

    it('[Symbol.iterator]', function () {
        const entry = new Entry("key1","value1");
        const entry2 = new Entry("key2","value2");
        const container = new ArrayContainer(entry,entry2);
        let executedCount = 0;
        for([key,value] of container){
            executedCount++;
            expect(key).to.equal("key"+executedCount);
            expect(value).to.equal("value"+executedCount);
        }
        expect(executedCount).to.equal(2);
    });
    it('[Symbol.iterator] size 3', function () {
        const entry = new Entry("key1","value1");
        const entry2 = new Entry("key2","value2");
        const entry3 = new Entry("key3","value3");
        const container = new ArrayContainer(entry,entry2).set(entry3, sameValueZero);
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