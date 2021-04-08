/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const maxMapSize = argv.maxMapSize ? argv.maxMapSize : -1;
console.info(`maxMapSize is ${maxMapSize}`);

const NUMBER_OF_UNIQUE_KEYS = 100;
const MAP_SIZES_UNSORTED = [0, 16, 64, 256, 1024, 4096, 16384, 65536, 262144, 1048576];//, 4194304];
const MAP_SIZES = MAP_SIZES_UNSORTED.filter(size => maxMapSize <= 0 || size <= maxMapSize).sort((left, right) => left - right);

const LARGEST_MAP_SIZE = MAP_SIZES[MAP_SIZES.length - 1];
let filledSoFar = 0;

// random value
const UNIQUE_KEYS = new Array(NUMBER_OF_UNIQUE_KEYS);
const VALUES = new Array(NUMBER_OF_UNIQUE_KEYS);
for(let i = 0;i < NUMBER_OF_UNIQUE_KEYS;i++){
    let key;
    do{
        key  = makeKey();
    }
    while(UNIQUE_KEYS.includes(key));
    UNIQUE_KEYS[i] = key;
    VALUES[i] = makeValue();
}
const ALL_KV = new Array(LARGEST_MAP_SIZE);

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

            let key;
            do{
                key  = makeKey();
            }
            while(UNIQUE_KEYS.includes(key));
            ALL_KV[i] = [key, makeValue()];
        }

        console.info(`${size - filledSoFar} Test Key Value Pairs Generated.`);
        filledSoFar = size;
    }
    return ALL_KV;
}
function keyValueAt(idx) {
    if(idx < 0){
        idx = 0;
    } else if(idx >= LARGEST_MAP_SIZE) {
        idx = LARGEST_MAP_SIZE-1;
    }
    const KVs = kvStore(idx);
    return KVs[idx];
}
function keyAt(idx) {
    return keyValueAt(idx)[0];
}
function valueAt(idx) {
    return keyValueAt(idx)[1];
}

module.exports = {kvStore, keyAt,valueAt, keyValueAt, MAP_SIZES, UNIQUE_KEYS, VALUES, NUMBER_OF_UNIQUE_KEYS};