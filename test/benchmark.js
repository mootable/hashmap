/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.4.2
 * Homepage: https://github.com/mootable/hashmap
 */
const fs = require('fs');
const _ = require('lodash');
const Benchmark = require('benchmark');
const hashmapImplementations = {
    'mootable-hashmap': '../hashmap',
    'map': null,
    'flesler-hashmap': 'flesler-hashmap',
};

console.log("setup constants");
const ALL_KV = new Array(1048576);
for (let i = 0; i < 1048576; i++) {
    ALL_KV[i] = [makeKey(), makeValue()];
}
// random value
const TEST_KV = [makeKey(), makeValue()];

const HASHMAP_SIZES = [0, 64, 256, 4096, 16384, 65536, 262144, 1048576];

console.log(" constants complete");
let header_markdown
    = '| Hashmap | create |';
let header_seperator_markdown
    = '| ------- | ------ |';
HASHMAP_SIZES.forEach(value => {
    let valueStr = ''+value;
    header_markdown = header_markdown + ' ' + valueStr + ' Entries |';
    header_seperator_markdown = header_seperator_markdown + ' '.padEnd(Math.max(3,valueStr.length+9),'-')+' |';
});
header_markdown = header_markdown +'\n'+header_seperator_markdown+'\n';
console.log("setup benchmark");
let theSuite = new Benchmark.Suite('hashmap benchmarks');
Object.entries(hashmapImplementations)
    .forEach(([version, location]) => benchmarkHashMapImplementation(version, location));


theSuite = theSuite.on('cycle', function (event) {
    console.log(String(event.target));
}).on('complete', function () {
    let table_md = header_markdown;
    let fastestMap = new Map();
    let slowestMap = new Map();
    Object.entries(hashmapImplementations).forEach(([version, location]) =>  {
            table_md = table_md + '| '+version+' |';
            const sorted = _.sortBy(this.filter({'version': version}), 'hashmap-size');
            sorted.forEach(value => {

                const fastest = Benchmark.filter(this.filter({'name': value.name}), 'fastest')[0];
                const slowest = Benchmark.filter(this.filter({'name': value.name}), 'slowest')[0];
                if(fastest.version === version){
                    table_md = table_md + ' **'+ value.hz.toFixed(0).toLocaleString() +'** op/sec |';
                } else {
                    table_md = table_md + ' '+ value.hz.toFixed(0).toLocaleString() +' op/sec |';
                }
                fastestMap.set(value['hashmap-size']+'', fastest);
                slowestMap.set(value['hashmap-size']+'', slowest);
            });
            table_md = table_md +'\n';
            console.log(sorted);
        });
    table_md = table_md + '| **Fastest** |';
    fastestMap.forEach((fastest) => {
        table_md = table_md + ' **'+ fastest.version + '** |';
    });
    table_md = table_md + '\n| Fastest inc % |';
    fastestMap.forEach((fastest, key) => {
        const slowest = slowestMap.get(key);
        if(slowest) {
            const difference = ((fastest.hz - slowest.hz) / slowest.hz);
            const percentageDifference = difference * 100;
            table_md = table_md + ' ' + percentageDifference.toFixed(0) + '% |';
        } else {
            table_md = table_md + ' |';
        }
    });
    table_md = table_md + '\n';
    console.log(table_md);
    _.uniq(this.filter('name').map('name'))
        .forEach((name) => {
                const fastest = Benchmark.filter(this.filter({'name': name}), 'fastest')[0];
                const slowest = Benchmark.filter(this.filter({'name': name}), 'slowest')[0];
                const fastestVersion = fastest.version;
                const difference = ((fastest.hz - slowest.hz) / slowest.hz);
                const percentageDifference = difference * 100;
                console.log(fastestVersion, 'is', (difference + 1).toFixed(2), 'X faster on', name, 'an increase of',
                    percentageDifference.toFixed(2) + '%');
            }
        );

    fs.writeFile("Benchmarks.md", table_md, function (err) {
        if (err) return console.log(err);
        console.log('Written > Benchmarks.md');
    });
}).on('onError', function (err) {
    console.log("Error", err);
});
const RUN_AMOUNTS = 1;
for (let k = 0; k < RUN_AMOUNTS; k++) {
    console.info("Iteration", k);
    theSuite.run();
}

function benchmarkHashMapImplementation(version, location) {
    const HashMap = location ? require(location).HashMap : Map;
    if (location) {
        console.info("Benchmarking:", version, "from:", location);
    } else {
        console.info("Benchmarking:", version, "from: JS");
    }

    theSuite = theSuite
        .add("_create_", function () {
            const map = new HashMap();
            if (!map && map.length !== 0) {
                throw "Map creation issue";
            }
        }, {
            'version': version,
            'hashmap-size': -1,
            'onStart': function () {
                console.info("=============");
                console.info("Testing", version);
                console.info("=============");
            }
        });

    for (let h = 0; h < HASHMAP_SIZES.length; h++) {
        const size = HASHMAP_SIZES[h];
        console.log(size, "size hashmap building");
        const hashmap = new HashMap();
        for (let i = 0; i < size; i++) {
            hashmap.set(ALL_KV[i][0], ALL_KV[i][1]);
        }
        theSuite = theSuite.add("_set,get,delete 1 time to " + size + " sized hashmap_", () => {
            hashmap.set(TEST_KV[0], TEST_KV[1]);
            if (!hashmap.get(TEST_KV[0])) {
                throw TEST_KV[0] + " does not exist";
            }
            hashmap.delete(TEST_KV[0]);
        }, {
            'version': version,
            'hashmap-size': size
        });

        console.log(size, "size hashmap ready");
    }
}

this.max32 = Math.pow(2, 32) - 1;

function makeKey() {
    // return Math.floor(Math.random() * this.max32);
    return makeid(32);
}

function makeValue() {
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