/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.0
 * Homepage: https://github.com/mootable/hashmap
 */
const fs = require('fs');
const _ = require('lodash');
const Benchmark = require('benchmark');
const hashmapImplementations = {
    'mootable-hashmap': '../src/hashmap',
    'map': null,
    'flesler-hashmap': 'flesler-hashmap',
};

const metrics = {benchmarks: {}, fastest: {}, slowest: {}};
let used = 0;

function formatAmount(amount, unit) {
    let reduced = amount / 1024;
    if (reduced < 1024) {
        return `${reduced.toFixed(3)} K${unit}`;
    }
    reduced = reduced / 1024;
    if (reduced < 1024) {
        return `${reduced.toFixed(3)} M${unit}`;
    }
    reduced = reduced / 1024;
    if (reduced < 1024) {
        return `${reduced.toFixed(3)} G${unit}`;
    }
    return `${reduced.toFixed(3)} T${unit}`;
}


function resetMemoryUsed() {
    // if (global.gc) {
    //     global.gc();
    //     sleep(100); // sleep for 100 ms
    // }

    used = process.memoryUsage().heapUsed;
}

function memoryUsage(preText) {
    // if (global.gc) {
    //     global.gc();
    //     sleep(100); // sleep for 100 ms
    // }
    const heap = process.memoryUsage().heapUsed;
    used = heap - used;
    console.info(`Memory used for ${preText} is ${formatAmount(used, 'b')} out of ${formatAmount(heap, 'b')}`);
    return used;
}

memoryUsage("Start");
resetMemoryUsed();
const HASHMAP_SIZES = [0, 64, 256, 512, 768, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304];
const LARGEST_HASHMAP = HASHMAP_SIZES.sort((left, right) => left-right)[HASHMAP_SIZES.length-1];

const ALL_KV = new Array(LARGEST_HASHMAP);
for (let i = 0; i < LARGEST_HASHMAP; i++) {
    ALL_KV[i] = [makeKey(), makeValue()];
}
// random value
const TEST_KV = [makeKey(), makeValue()];
memoryUsage("Key Generation");

metrics.fastest['-1'] = null;
metrics.slowest['-1'] = null;
HASHMAP_SIZES.forEach(value => {
    metrics.fastest[value + ''] = null;
    metrics.slowest[value + ''] = null;
});
let theSuite = new Benchmark.Suite('hashmap benchmarks');
const hashmapsTested = [];
Object.entries(hashmapImplementations)
    .forEach(
        ([version, location]) => {
            if (location) {
                const required = require(location);
                if (required.LinkedHashMap) {
                    const required = require(location);
                    console.info("Benchmarking:", version + ".LinkedHashMap", "from:", location);
                    benchmarkHashMapImplementation(version + ".LinkedHashMap", required.LinkedHashMap);
                }
                if (required.HashMap) {
                    console.info("Benchmarking:", version + ".HashMap", "from:", location);
                    benchmarkHashMapImplementation(version + ".HashMap", required.HashMap);
                }
            } else {
                console.info("Benchmarking:", version, "from: JS");
                benchmarkHashMapImplementation(version, Map);
            }
        }
    );

function writeToFile() {

    let table = "# Benchmarks \n\n" +
        "- Memory Counts are an approximation and do vary depending on garbage collection.\n" +
        "- Operations per second have approximately 10% variance.\n\n" +
        "## Scores\n\n" +
        "<table>\n<thead><tr>" +
        "<th>Version</th><th>Entry Size</th><th>Memory</th><th>Operations</th>" +
        "<th>Memory Raw</th><th>Operations Raw</th><th>Fastest / Slowest</th>" +
        "</tr></thead>\n<tbody>\n";

    Object.entries(metrics.benchmarks).forEach(([version, benchmark]) => {
        table = table + `<tr><td rowspan="${Object.entries(benchmark).length}">${version}</td>`;
        let first = true;
        Object.entries(benchmark).forEach(([size, metrics]) => {
            if(first) {
                first = false;
            } else {
                table = table + "<tr>";
            }
            if(!metrics.memory){
                metrics.memory = '';
                metrics.memoryRaw = '';
            }
            table = table + `<td>${parseInt(metrics.size) < 0 ? 'create' : metrics.size}</td>`;
            table = table + `<td>${metrics.memory}</td><td>${metrics.operations}</td>`;
            table = table + `<td>${metrics.memoryRaw}</td><td>${metrics.operationsRaw.toFixed(0)}</td>`;
            table = table + `<td>${metrics.fastest ? 'fastest' : metrics.slowest ? 'slowest' : ''}</td></tr>`;
        });
        table = table + "\n";
    });
    table = table + "</tbody>\n</table>\n\n" +
        "## Fastest Implementation\n\n" +
        "<table>\n<thead><tr>" +
        "<th>Entry Size</th><th>Fastest Version</th><th>Percentage Faster</th><th>Times Faster</th>" +
        "</tr></thead>\n<tbody>\n";
    Object.entries(metrics.fastest).forEach(([size, fastest]) => {
        table = table + `<tr><td>${parseInt(size) < 0 ? 'create' : size}</td><td>${fastest.version}</td>`;

        const slowest = metrics.slowest[size];
        const difference = ((fastest.operations - slowest.operations) / slowest.operations);
        const percentageDifference = difference * 100;
        table = table + `<td>${percentageDifference.toFixed(0)}%</td>`;
        table = table + `<td>X ${(difference + 1).toFixed(2)}</td></tr>`;
    });
    table = table + "</tbody>\n</table>\n";
    fs.writeFile("Benchmarks.md", table, function (err) {
        if (err) return console.log(err);
        console.log('Written > Benchmarks.md');
    });
}


theSuite = theSuite.on('cycle', function (event) {
    console.log(String(event.target));
}).on('complete', function () {
    hashmapsTested.forEach(version => {
        const sorted = _.sortBy(this.filter({'version': version}), 'hashmap-size');
        const versionMetrics = metrics.benchmarks[version]  ? metrics.benchmarks[version] : {};
        metrics.benchmarks[version] = versionMetrics;
        sorted.forEach(value => {
            const size = value['hashmap-size'];
            const sizeMetrics = versionMetrics[size + ''] ? versionMetrics[size + ''] : {};
            versionMetrics[size + ''] = sizeMetrics;
            const fastest = Benchmark.filter(this.filter({'name': value.name}), 'fastest')[0];
            const slowest = Benchmark.filter(this.filter({'name': value.name}), 'slowest')[0];
            sizeMetrics.size = size;
            sizeMetrics.fastest = fastest.version === version;
            sizeMetrics.slowest = slowest.version === version;
            sizeMetrics.operationsRaw = value.hz;
            sizeMetrics.operations = formatAmount(value.hz, 'Ops/sec');
            if (sizeMetrics.fastest) {
                metrics.fastest[size + ''] = {version: version, operations: value.hz};
            }
            if (sizeMetrics.slowest) {
                metrics.slowest[size + ''] = {version: version, operations: value.hz};
            }
        });
    });
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

    writeToFile();
}).on('onError', function (err) {
    console.log("Error", err);
});
resetMemoryUsed();
const RUN_AMOUNTS = 1;
for (let k = 0; k < RUN_AMOUNTS; k++) {
    console.info("Iteration", k);
    theSuite.run();
}

function benchmarkHashMapImplementation(version, HashMap) {
    hashmapsTested.push(version);
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

    const versionMetrics = metrics.benchmarks[version] ? metrics.benchmarks[version] : {};
    metrics.benchmarks[version] = versionMetrics;
    console.log("Building " + version + " test hashmaps", HASHMAP_SIZES);
    for (let h = 0; h < HASHMAP_SIZES.length; h++) {
        const size = HASHMAP_SIZES[h];

        const sizeMetrics = versionMetrics[size + ''] ? versionMetrics[size + ''] : {};
        versionMetrics[size + ''] = sizeMetrics;
        resetMemoryUsed();
        const hashmap = new HashMap();
        for (let i = 0; i < size; i++) {
            hashmap.set(ALL_KV[i][0], ALL_KV[i][1]);
        }
        sizeMetrics.memoryRaw = memoryUsage(`${size} ${version}`);
        sizeMetrics.memory = formatAmount(sizeMetrics.memoryRaw, 'b');
        theSuite = theSuite.add("_set,get,delete 1 time to " + size + " sized hashmap_", () => {
            hashmap.set(TEST_KV[0], TEST_KV[1]);
            if (!hashmap.get(TEST_KV[0])) {
                throw `${TEST_KV[0]} does not exist`;
            }
            hashmap.delete(TEST_KV[0]);
        }, {
            'version': version,
            'hashmap-size': size,
        });

    }
    console.log("Built " + version + " test hashmaps", HASHMAP_SIZES);
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
