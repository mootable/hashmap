/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */
const {kvStore, MAP_SIZES} = require('./test_data.js');
const {mapImpls} = require('./impls.js');
const {hashCodeFor} = require('../../src/hash');
const cachedMemorySizes = {};
const cache = {};

const niceUnitSizes = ['', 'K', 'M', 'G', 'T', 'P'];

const displayUnitNicely = (amount, unit) => {
    let unitSize;
    for (let unitIdx = 0; unitIdx < niceUnitSizes.length; unitIdx++) {
        unitSize = niceUnitSizes[unitIdx];
        if (amount < 1024) {
            if (!Number.isInteger(amount)) {
                amount = amount.toFixed(2);
            }
            return `${amount} ${unitSize}${unit}`;
        }
        amount /= 1024;
    }
    return `${amount} ${unitSize}${unit}`;
};

const memoryUsage = (last) => {
    const memoryUsage = process.memoryUsage();
    return (memoryUsage.external + memoryUsage.heapUsed) - last;
};

function generateForImplAndSize({location, esm, className, implName, Impl, constructorParameters}, size, ignoreCache) {
    const ALL_KV = kvStore(size);
    if ((!ignoreCache) && cache[implName] && cache[implName][`${size}`]) {
        console.info(`${implName} : ${size} from cached`);
        return cache[implName][`${size}`];
    }
    const start = new Date();
    let memory = 0; // so we don't count this variable.
    memory = memoryUsage(memory);
    const map = constructorParameters ? new Impl(constructorParameters) : new Impl();
    for (let i = 0; i < size; i++) {
        map.set(ALL_KV[i][0], ALL_KV[i][1]);
    }
    memory = memoryUsage(memory);
    const end = new Date();
    console.info(`${(end.getTime() - start.getTime()) / 1000} secs to create a ${implName} of size ${size} using ${displayUnitNicely(memory,'bytes')}`);
    const start2 = new Date();
    for (let i = 0; i < size; i++) {
        if (!map.has(ALL_KV[i][0])) {
            console.log(`Sanity Check: Missing key  ${ALL_KV[i][0]} with hash ${hashCodeFor(ALL_KV[i][0])} at ${i}`);
        }
    }
    const end2 = new Date();
    console.info(`${(end2.getTime() - start2.getTime()) / 1000} secs to sanity check a ${implName} of size ${size}`);
    if (ignoreCache) {
        console.info(`${implName} : ${size} generated fresh`);
    } else {
        console.info(`${implName} : ${size} generated and cached`);
        if (!cache[implName]) {
            cache[implName] = {};
            cachedMemorySizes[implName] = {};
        }
        cache[implName][`${size}`] = map;
        cachedMemorySizes[implName][`${size}`] = [memory, displayUnitNicely(memory,'bytes')];
    }
    return map;
}

function mapsForImpl(implementation, ignoreCache, maxSize = -1) {
    return MAP_SIZES.filter(size => maxSize < 0 || maxSize >= size)
        .map((size) =>
            [size, generateForImplAndSize(implementation, size, ignoreCache)]
        );
}

function mapsForSize(size, ignoreCache) {
    return mapImpls.map((implementation) =>
        [implementation, generateForImplAndSize(implementation, size, ignoreCache)]
    );

}

module.exports = {mapsForImpl, mapsForSize, generateForImplAndSize, cache, cachedMemorySizes};