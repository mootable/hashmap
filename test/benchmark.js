/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.4.0
 * Homepage: https://github.com/mootable/hashmap
 */

const Benchmark = require('benchmark');
const hashmapImplementations = { 'mootable-hashmap': '../hashmap', 'map': null , 'flesler-hashmap': 'flesler-hashmap',};

const array = require('lodash/array');

console.log("setup constants");
const ALL_KV = new Array(262144);
for (let i = 0; i < 262144; i++) {
    ALL_KV[i] = [makeKey(), makeValue()];
}
// random values, few will be the same as above.
const TEST_KV = new Array(1024);
for (let i = 0; i < 1024; i++) {
    TEST_KV[i] = [makeKey(), makeValue()];
}
const TEST_SIZE = TEST_KV.length;

console.log(" constants complete");

console.log("setup benchmark");
let theSuite = new Benchmark.Suite('hashmap benchmarks');
Object.entries(hashmapImplementations)
    .forEach(([version, location]) => benchmarkHashMapImplementation(version, location));


theSuite = theSuite.on('cycle', function (event) {
    console.log(String(event.target));
}).on('complete', function () {
    array.uniq(this.filter('name').map('name'))
        .forEach((name) => {
                const fastest = Benchmark.filter(this.filter({'name': name}), 'fastest')[0];
                const slowest = Benchmark.filter(this.filter({'name': name}), 'slowest')[0];
                const fastestVersion = fastest.version;
                const difference = ((fastest.hz - slowest.hz) / slowest.hz);
                const percentageDifference = difference * 100;
                console.log( fastestVersion, 'is', (difference + 1).toFixed(2), 'X faster on', name , 'an increase of',
                    percentageDifference.toFixed(2) + '%');
            }
        );
}).on('onError', function (err) {
    console.log("Error", err);
});
const RUN_AMOUNTS = 3;
for(let k = 0; k < RUN_AMOUNTS; k++){
    console.info("Iteration",k);
    theSuite.run();
}

function benchmarkHashMapImplementation(version, location) {
    const HashMap = location ? require(location).HashMap : Map ;
    if(location) {
        console.info("Benchmarking:", version, "from:", location);
    } else {
        console.info("Benchmarking:", version, "from: JS");
    }

    console.log("empty hashmap");
    let hashmap = new HashMap();

    console.log("1'024 hashmap");
    let hashmap1024 = new HashMap();
    let hashmap262144 = new HashMap();
    for (let i = 0; i < 1024; i++) {
        hashmap1024.set(ALL_KV[i][0], ALL_KV[i][1]);
        hashmap262144.set(ALL_KV[i][0], ALL_KV[i][1]);
    }
    console.log("262'144 hashmap");
    for (let i = 1024; i < 262144; i++) {
        hashmap262144.set(ALL_KV[i][0], ALL_KV[i][1]);
    }
    console.log("define benchmarks");
    theSuite = theSuite
        .add("_create_", function () {
            const map = new HashMap();
            if(!map && map.length !== 0){
                throw "Map creation issue";
            }
        }, {
            'version': version,
            'onStart': function () {
                console.info("=============");
                console.info("Testing", version);
                console.info("=============");
            }
        })
        .add("_set,get,delete 1 op to 0 sized hashmap_", function () {
            hashmap.set(TEST_KV[0][0], TEST_KV[0][1]);
            if(!hashmap.get(TEST_KV[0][0])){
                throw TEST_KV[0][0]+ " does not exist";
            }
            hashmap.delete(TEST_KV[0][0]);
        }, {
            'version': version
        })
        .add("_set,get,delete 1 op to 1'024 sized hashmap_", function () {
            hashmap1024.set(TEST_KV[1][0], TEST_KV[1][1]);
            if(!hashmap1024.get(TEST_KV[1][0])){
                throw TEST_KV[1][0]+ " does not exist";
            }
            hashmap1024.delete(TEST_KV[1][0]);
        }, {
            'version': version
        })
        .add("_set,get,delete 1 op to 262'144 sized hashmap_", function () {
            hashmap262144.set(TEST_KV[2][0], TEST_KV[2][1]);
            if(!hashmap262144.get(TEST_KV[2][0])){
                throw TEST_KV[2][0]+ " does not exist";
            }
            hashmap262144.delete(TEST_KV[2][0]);
        }, {
            'version': version,
            'onComplete':  () => {
                try {
                    if (global && global.gc) {global.gc();}
                } catch (e) {
                    console.log("`node --expose-gc index.js`");
                    process.exit();
                }
            }
        })
        .add("_set,get,delete 1'024 ops to 0 sized hashmap_", function () {
            for(let idx = 0; idx < TEST_SIZE; idx++){
                hashmap.set(TEST_KV[idx][0], TEST_KV[idx][1]);
                if(!hashmap.get(TEST_KV[idx][0])){
                    throw TEST_KV[idx][0]+ " does not exist";
                }
                hashmap.delete(TEST_KV[idx][0]);
            }
        }, {
            'onStart': function () {
                hashmap.clear();
            },
            'version': version,
            'onComplete':  () => {
                try {
                    if (global && global.gc) {global.gc();}
                } catch (e) {
                    console.log("`node --expose-gc index.js`");
                    process.exit();
                }
            }
        })
        .add("_set,get,delete 1'024 ops to 1'024 sized hashmap", function () {
            for(let idx = 0; idx < TEST_SIZE; idx++){
                hashmap1024.set(TEST_KV[idx][0], TEST_KV[idx][1]);
                if(!hashmap1024.get(TEST_KV[idx][0])){
                    throw TEST_KV[idx][0]+ " does not exist";
                }
                hashmap1024.delete(TEST_KV[idx][0]);
            }
        }, {
            'version': version,
            'onComplete':  () => {
                try {
                    if (global && global.gc) {global.gc();}
                } catch (e) {
                    console.log("`node --expose-gc index.js`");
                    process.exit();
                }
            }
        })
        .add("_set,get,delete 1'024 ops to 262'144 sized hashmap_", function () {
            for(let idx = 0; idx < TEST_SIZE; idx++){
                hashmap262144.set(TEST_KV[idx][0], TEST_KV[idx][1]);
                if(!hashmap262144.get(TEST_KV[idx][0])){
                    throw TEST_KV[idx][0]+ " does not exist";
                }
                hashmap262144.delete(TEST_KV[idx][0]);
            }
        }, {
            'version': version,
            'onComplete':  () => {
                try {
                    if (global && global.gc) {global.gc();}
                } catch (e) {
                    console.log("`node --expose-gc index.js`");
                    process.exit();
                }
            }
        });


}
this.max32 = Math.pow(2, 32) - 1;
function makeKey(){
    // return Math.floor(Math.random() * this.max32);
    return makeid(32);
}

function makeValue(){
    return makeid(64);
}
function makeid(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    let i = 0;
    while (i++ < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * create x 14,494,621 ops/sec ±3.17% (89 runs sampled)
 singleSet x 3,198,502 ops/sec ±1.52% (85 runs sampled)
 singleReplace x 3,084,387 ops/sec ±1.51% (83 runs sampled)
 setAfter 1,024 x 137,042 ops/sec ±2.51% (59 runs sampled)

 */