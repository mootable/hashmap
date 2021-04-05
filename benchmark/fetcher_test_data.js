/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */


const MAP_SIZES_UNSORTED = [0, 64, 256, 512, 768, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304];
const MAP_SIZES = MAP_SIZES_UNSORTED.sort((left, right) => left - right);

const LARGEST_MAP_SIZE = MAP_SIZES[MAP_SIZES.length - 1];
let filledSoFar = 0;

const ALL_KV = new Array(LARGEST_MAP_SIZE);
// random value
const TEST_KV = [makeKey(), makeValue()];

function makeKey() {
    // return Math.floor(Math.random() * this.max32);
    return makeid(32);
}

function makeValue() {
    return makeid(8);
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

function kvStore(size = -1){
    if(filledSoFar < size){
        console.info(`Generating More Test Key Value Pairs from ${filledSoFar} pairs to ${size} pairs.`);
        const newSize = size <= 0 ? LARGEST_MAP_SIZE : size;
        for (let i = filledSoFar; i < newSize; i++) {
            ALL_KV[i] = [makeKey(), makeValue()];
        }

        console.info(`${size - filledSoFar} Test Key Value Pairs Generated.`);
        filledSoFar = size;
    }
    return ALL_KV;
}

module.exports = {kvStore, TEST_KV, MAP_SIZES};