/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.1.1
 * Homepage: https://github.com/mootable/hashmap
 */

const Benchmark = require('benchmark');
const hashmapImplementations = { 'mootable-hashmap': '../hashmap',/* 'map': null, */'flesler-hashmap': 'flesler-hashmap',};

const array = require('lodash/array');

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
const RUN_AMOUNTS = 1;
for(let k = 0; k < RUN_AMOUNTS; k++){
    console.info("Iteration",k);
    theSuite.run();
}

function benchmarkHashMapImplementation(version, location) {
    var HashMap;
    if(location) {
        console.info("Benchmarking:", version, "from:", location);
        HashMap = require(location).HashMap;
    } else {
        console.info("Benchmarking:", version, "from: JS");
        HashMap = Map;
    }

    let hashmap = new HashMap();
    console.log("setup constants");
    let key = makeid(16);
    let value = makeid(128);

    console.log("1'024 hashmap");
    let hashmap1024 = new HashMap();

    for (let i = 0; i < 1024; i++) {
        hashmap1024.set(makeid(16), makeid(128));
    }
    console.log("131'072 hashmap");
    var hashmap131072 = new HashMap();
    for (var i = 0; i < 131072; i++) {
        hashmap131072.set(makeid(16), makeid(128));
    }
    console.log("define benchmarks");
    theSuite = theSuite
        .add("_create_", function () {
            new HashMap();
        }, {
            'version': version,
            'onStart': function () {
                console.info("=============");
                console.info("Testing", version);
                console.info("=============");
            }
        })
        .add("_singleSet_", function () {
            hashmap.set(key, value);
        }, {
            'onStart': function () {
                key = makeid(16);
                value = makeid(128);
                hashmap.clear();
            },
            'onCycle': function () {
                key = makeid(16);
                value = makeid(128);
                hashmap.clear();
            },
            'version': version
        })
        .add("_singleSet 20_", function () {
            for (let k = 0; k < 20; k++) {
                hashmap.set(key[k], value[k]);
            }
        }, {
            'onStart': function () {
                hashmap.clear();
                key = [];
                value = [];
                for (let k = 0; k < 20; k++) {
                    key.push(makeid(16));
                    value.push(makeid(128));
                }
            },
            'onCycle': function () {
                hashmap.clear();

                key = [];
                value = [];
                for (let k = 0; k < 20; k++) {
                    key.push(makeid(16));
                    value.push(makeid(128));
                }
            },
            'version': version
        })
        .add("_singleReplace_", function () {
            hashmap.set(key, value);
        }, {
            'onStart': function () {
                key = makeid(16);
                value = makeid(128);
            },
            'onCycle': function () {
                key = makeid(16);
                value = makeid(128);
                hashmap.clear();
                hashmap.set(key, makeid(128));
            },
            'version': version
        })
        .add("_setAfter 1,024_", function () {
            hashmap1024.set(key, value);
        }, {
            'onStart': function () {
                key = makeid(16);
                value = makeid(128);
            },
            'onCycle': function () {
                hashmap1024.delete(key);
                key = makeid(16);
                value = makeid(128);
            },
            'version': version
        })
        .add("_set 20 After 1,024_", function () {
            for (let k = 0; k < 20; k++) {
                hashmap1024.set(key[k], value[k]);
            }
        }, {
            'onStart': function () {
                key = [];
                value = [];
                for (let k = 0; k < 20; k++) {
                    key.push(makeid(16));
                    value.push(makeid(128));
                }
            },
            'onCycle': function () {
                if (key && key.length) {
                    for (let k = 0; k < 20; k++) {
                        hashmap1024.delete(key[k]);
                    }
                }
                key = [];
                value = [];
                for (let k = 0; k < 20; k++) {
                    key.push(makeid(16));
                    value.push(makeid(128));
                }
            },
            'version': version
        })
        .add("_setAfter 131'072_", function () {
            hashmap131072.set(key, value);
        }, {
            'onStart': function () {
                key = makeid(16);
                value = makeid(128);
            },
            'onCycle': function () {
                hashmap131072.delete(key);
                key = makeid(16);
                value = makeid(128);
            },
            'version': version
        })
        .add("_set 20 After 131'072_", function () {
            for (let k = 0; k < 20; k++) {
                hashmap131072.set(key[k], value[k]);
            }
        }, {
            'onStart': function () {
                key = [];
                value = [];
                for (let k = 0; k < 20; k++) {
                    key.push(makeid(16));
                    value.push(makeid(128));
                }
            },
            'onCycle': function () {
                if (key && key.length) {
                    for (let k = 0; k < 20; k++) {
                        hashmap131072.delete(key[k]);
                    }
                }

                key = [];
                value = [];
                for (let k = 0; k < 20; k++) {
                    key.push(makeid(16));
                    value.push(makeid(128));
                }
            },
            'version': version
        })
        .add("_singleDelete_", function () {
            hashmap1024.delete(key);
        }, {
            'onStart': function () {
                hashmap.clear();
                key = makeid(16);
                hashmap.set(key, makeid(128));
            },
            'onCycle': function () {
                hashmap.clear();
                key = makeid(16);
                hashmap.set(key, makeid(128));
            },
            'version': version
        })
        .add("_deleteAfter 1'024_", function () {
            hashmap1024.delete(key);
        }, {
            'onStart': function () {
                key = makeid(16);
                hashmap1024.set(key, makeid(128));
            },
            'onCycle': function () {
                key = makeid(16);
                hashmap1024.set(key, makeid(128));
            },
            'version': version
        })
        .add("_deleteAfter 131'072_", function () {
            hashmap131072.delete(key);
        }, {
            'onStart': function () {
                key = makeid(16);
                hashmap131072.set(key, makeid(128));
            },
            'onCycle': function () {
                key = makeid(16);
                hashmap131072.set(key, makeid(128));
            },
            'version': version
        }).add("_singleFetch_", function () {
            hashmap.get(key);
        }, {
            'onStart': function () {
                hashmap.clear();
                key = makeid(16);
                hashmap.set(key, makeid(128));
            },
            'onCycle': function () {
                hashmap.clear();
                key = makeid(16);
                hashmap.set(key, makeid(128));
            },
            'version': version
        })
        .add("_fetchAfter 1'024_", function () {
            hashmap1024.get(key);
        }, {
            'onStart': function () {
                hashmap1024.delete(key);
                key = makeid(16);
                hashmap1024.set(key, makeid(128));
            },
            'onCycle': function () {
                hashmap1024.delete(key);
                key = makeid(16);
                hashmap1024.set(key, makeid(128));
            },
            'version': version
        })
        .add("_fetchAfter 131'072_", function () {
            hashmap131072.get(key);
        }, {
            'onStart': function () {
                hashmap131072.delete(key);
                key = makeid(16);
                hashmap131072.set(key, makeid(128));
            },
            'onCycle': function () {
                hashmap131072.delete(key);
                key = makeid(16);
                hashmap131072.set(key, makeid(128));
            },
            'version': version
        }).add("_singleCombined_", function () {
            hashmap.set(key, value);
            hashmap.get(key);
            hashmap.delete(key);
        }, {
            'onStart': function () {
                hashmap.clear();
                key = makeid(16);
                value = makeid(128);
            },
            'onCycle': function () {
                hashmap.clear();
                key = makeid(16);
                value = makeid(128);
            },
            'version': version
        })
        .add("_combinedAfter 1'024_", function () {
            hashmap.set(key, value);
            hashmap.get(key);
            hashmap.delete(key);
        }, {
            'onStart': function () {
                key = makeid(16);
                value = makeid(128);
            },
            'onCycle': function () {
                key = makeid(16);
                value = makeid(128);
            },
            'version': version
        })
        .add("_combinedAfter 131'072_", function () {
            hashmap.set(key, value);
            hashmap.get(key);
            hashmap.delete(key);
        }, {
            'onStart': function () {
                key = makeid(16);
                value = makeid(128);
            },
            'onCycle': function () {
                key = makeid(16);
                value = makeid(128);
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
        });

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

async function sleep(ms) {
    await sleepPromise(ms);
}

function sleepPromise(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * create x 14,494,621 ops/sec ±3.17% (89 runs sampled)
 singleSet x 3,198,502 ops/sec ±1.52% (85 runs sampled)
 singleReplace x 3,084,387 ops/sec ±1.51% (83 runs sampled)
 setAfter 1,024 x 137,042 ops/sec ±2.51% (59 runs sampled)

 */