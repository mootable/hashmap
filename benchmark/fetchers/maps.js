/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const {kvStore, MAP_SIZES} = require('./test_data.js');
const {mapImpls} = require('./impls.js');
const cache = {};

function generateForImplAndSize({location, esm, className, implName, Impl}, size, ignoreCache) {
    const ALL_KV = kvStore(size);
    if ((!ignoreCache) && cache[implName] && cache[implName][`${size}`]) {
        console.info(`${implName} : ${size} from cached`);
        return cache[implName][`${size}`];
    }
    const map = new Impl();
    for (let i = 0; i < size; i++) {
        map.set(ALL_KV[i][0], ALL_KV[i][1]);
    }
    if (ignoreCache) {
        console.info(`${implName} : ${size} generated fresh`);
    } else {
        console.info(`${implName} : ${size} generated and cached`);
        if (!cache[implName]) {
            cache[implName] = {};
        }
        cache[implName][`${size}`] = map;
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

module.exports = {mapsForImpl, mapsForSize, generateForImplAndSize, cache};