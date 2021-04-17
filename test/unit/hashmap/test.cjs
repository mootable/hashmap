/* jshint ignore:start */
const expect = require('chai').expect;
const esmRequire = require("esm")(module/*, options*/);
const {Container} = esmRequire('../../../src/hashmap/container')
const {HashMap} = esmRequire('../../../src/hashmap')

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
describe('HashMap Class', function () {
    it('constructor', function () {
        const hashmap = new HashMap();
        expect(hashmap.size).to.equal(0);
    });

    it('constructor, copies map', function () {
        const map = new Map([["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]]);
        const hashmap = new HashMap(map);
        expect(hashmap.size).to.equal(4);
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('constructor, copies array', function () {
        const arr = [["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]];
        const hashmap = new HashMap(arr);
        expect(hashmap.size).to.equal(4);
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('constructor, copies other HashMap', function () {
        const hashmapOld = new HashMap([["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]]);
        const hashmap = new HashMap(hashmapOld);
        expect(hashmap.size).to.equal(4);
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('constructor, uses ForEach', function () {
        const forEachObj = {
            forEach: (callback, ctx) => {
                for(let i =1;i <=4; i++) {
                    callback.call(ctx, 'value'+i, 'key'+i);
                }
            }
        }
        const hashmap = new HashMap(forEachObj);
        expect(hashmap.size).to.equal(4);
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('constructor, uses entries', function () {
        const entriesObj = {
            entries: function*() {
                 yield ["key1","value1"];
                 yield ["key2","value2"];
                 yield ["key3","value3"];
                 yield ["key4","value4"];
            }
        }
        const hashmap = new HashMap(entriesObj);
        expect(hashmap.size).to.equal(4);
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });


    it('createContainer', function () {
        const hashmap = new HashMap();
        expect(hashmap.createContainer(5)).to.be.instanceOf(Container);
        expect(hashmap.createContainer(5).hash).to.be.equal(5);
        expect(hashmap.createContainer(5).map).to.be.equal(hashmap);
    });

    it('has with key ', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        const ret = hashmap.has('key')
        expect(hashmap.size).to.equal(1);
        expect(ret).to.be.true;
    });

    it('has with no key ', function () {
        const hashmap = new HashMap();
        expect(hashmap.size).to.equal(0);
        const ret = hashmap.has('key')
        expect(hashmap.size).to.equal(0);
        expect(ret).to.be.false;
    });

    it('has with other key', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        const ret = hashmap.has('other')
        expect(hashmap.size).to.equal(1);
        expect(ret).to.be.false;
    });

    it('get with key ', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        const ret = hashmap.get('key')
        expect(hashmap.size).to.equal(1);
        expect(ret).to.be.equal('value');
    });

    it('get with no key ', function () {
        const hashmap = new HashMap();
        expect(hashmap.size).to.equal(0);
        const ret = hashmap.get('key')
        expect(hashmap.size).to.equal(0);
        expect(ret).to.be.undefined;
    });

    it('get with other key', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        const ret = hashmap.get('other')
        expect(hashmap.size).to.equal(1);
        expect(ret).to.be.undefined;
    });

    it('optionalGet with key ', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        const ret = hashmap.optionalGet('key')
        expect(hashmap.size).to.equal(1);
        expect(ret.value).to.be.equal('value');
        expect(ret.has).to.be.true;
    });

    it('optionalGet with no key ', function () {
        const hashmap = new HashMap();
        expect(hashmap.size).to.equal(0);
        const ret = hashmap.optionalGet('key')
        expect(hashmap.size).to.equal(0);
        expect(ret.has).to.be.false;
    });

    it('optionalGet with other key', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        const ret = hashmap.optionalGet('other')
        expect(hashmap.size).to.equal(1);
        expect(ret.has).to.be.false;
    });

    it('set insert key ', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        expect(hashmap.get('key')).to.be.equal('value');
    });

    it('set overwrite key ', function () {
        const hashmap = new HashMap();
        hashmap.set('key','value')
        expect(hashmap.size).to.equal(1);
        hashmap.set('key','value2')
        expect(hashmap.size).to.equal(1);
        expect(hashmap.get('key')).to.be.equal('value2');
    });


    it('copy map', function () {
        const map = new Map([["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]]);
        const hashmap = new HashMap();
        hashmap.set('key0','value0');
        hashmap.set('key2','overwritethis');
        expect(hashmap.size).to.equal(2);
        hashmap.copy(map);
        expect(hashmap.size).to.equal(5);
        expect(hashmap.get("key0")).equals("value0");
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('copy array', function () {
        const arr = [["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]];
        const hashmap = new HashMap();
        hashmap.set('key0','value0');
        hashmap.set('key2','overwritethis');
        expect(hashmap.size).to.equal(2);
        hashmap.copy(arr);
        expect(hashmap.size).to.equal(5);
        expect(hashmap.get("key0")).equals("value0");
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('copy HashMap', function () {
        const hashmapOld = new HashMap([["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]]);
        const hashmap = new HashMap();
        hashmap.set('key0','value0');
        hashmap.set('key2','overwritethis');
        expect(hashmap.size).to.equal(2);
        hashmap.copy(hashmapOld);
        expect(hashmap.size).to.equal(5);
        expect(hashmap.get("key0")).equals("value0");
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('copy ForEach', function () {
        const forEachObj = {
            forEach: (callback, ctx) => {
                for(let i =1;i <=4; i++) {
                    callback.call(ctx, 'value'+i, 'key'+i);
                }
            }
        }
        const hashmap = new HashMap();
        hashmap.set('key0','value0');
        hashmap.set('key2','overwritethis');
        expect(hashmap.size).to.equal(2);
        hashmap.copy(forEachObj);
        expect(hashmap.size).to.equal(5);
        expect(hashmap.get("key0")).equals("value0");
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('copy entries', function () {
        const entriesObj = {
            entries: function*() {
                yield ["key1","value1"];
                yield ["key2","value2"];
                yield ["key3","value3"];
                yield ["key4","value4"];
            }
        }
        const hashmap = new HashMap();
        hashmap.set('key0','value0');
        hashmap.set('key2','overwritethis');
        expect(hashmap.size).to.equal(2);
        hashmap.copy(entriesObj);
        expect(hashmap.size).to.equal(5);
        expect(hashmap.get("key0")).equals("value0");
        expect(hashmap.get("key1")).equals("value1");
        expect(hashmap.get("key2")).equals("value2");
        expect(hashmap.get("key3")).equals("value3");
        expect(hashmap.get("key4")).equals("value4");
    });

    it('copy invalid', function () {
        const invalidObj = {}
        const hashmap = new HashMap();
        hashmap.set('key0','value0');
        hashmap.set('key2','overwritethis');
        expect(hashmap.size).to.equal(2);
        let errors = false;
        try {
            hashmap.copy(invalidObj);
        } catch(err){
            errors = true;
        }
        expect(errors).to.be.true;
    });


    it('clone HashMap', function () {
        const hashmap = new HashMap([["key1","value1"],["key2","value2"],["key3","value3"],["key4","value4"]]);
        const hashmapNew = hashmap.clone();
        expect(hashmapNew.get("key1")).equals("value1");
        expect(hashmapNew.get("key2")).equals("value2");
        expect(hashmapNew.get("key3")).equals("value3");
        expect(hashmapNew.get("key4")).equals("value4");
    });
});
/* jshint ignore:end */