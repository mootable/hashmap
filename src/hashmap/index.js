import {isFunction, isIterable} from '../utils/';
import {equalsAndHash} from '../hash';
import {none, some} from '../option/';
import {MapIterable} from '../iterable/';

const SHIFT = 7;
const WIDTH = 1 << SHIFT;
const MASK = WIDTH - 1;
const DEPTH = 5;

const SHIFT_HAMT = 5;
const WIDTH_HAMT = 1 << SHIFT_HAMT;
const MASK_HAMT = WIDTH_HAMT - 1;
const DEPTH_HAMT = DEPTH - 1;
const SHIFT_HAMT_1 = SHIFT_HAMT + SHIFT;

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.15.0
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
 * @extends {MapIterable}
 */
export class HashMap extends MapIterable {

    /**
     * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
     * - `new HashMap()` creates an empty hashmap
     * - `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>)} [copy]
     */
    constructor(copy) {
        super();
        this.clear();
        if (copy && (copy[Symbol.iterator] || copy.forEach)) {
            this.copy(copy);
        }
    }

    get size() {
        return this.length;
    }

    __createContainer(hash) {
        return new Container(this, hash);
    }

    has(key, options = {}) {
        equalsAndHash(key, options);
        return this.buckets.has(key, options, 0);
    }


    get(key, options = {}) {
        equalsAndHash(key, options);
        return this.buckets.get(key, options, 0);
    }


    // noinspection JSCheckFunctionSignatures
    optionalGet(key, options = {}) {
        equalsAndHash(key, options);
        return this.buckets.optionalGet(key, options, 0);
    }

    /**
     * Sets a value onto this map, using the key as its reference.
     *
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @return {HashMap}
     */
    set(key, value, options = {}) {
        equalsAndHash(key, options);
        this.buckets.set(key, value, options, 0);
        this.length = this.buckets.size;
        return this;
    }

    /**
     *
     * @param {Map|HashMap|LinkedHashMap|MapIterable|SetIterable.<Array.<key,value>>|Iterator.<Array.<key,value>>|Array.<Array.<key,value>>} other - the iterable to copy
     * @return {HashMap} this hashmap, with the values copied to it.
     * @throws {TypeError} if the provided object other is null or not iterable.
     */
    copy(other) {
        const map = this;
        if (isIterable(other)) {
            for (const [key, value] of other) {
                map.set(key, value);
            }
            return this;
        } else if (isFunction(other.entries)) {
            for (const [key, value] of other.entries()) {
                map.set(key, value);
            }
            return this;
        } else if (isFunction(other.forEach)) {
            other.forEach(function (value, key) {
                map.set(key, value);
            });
            return this;
        }
        throw new TypeError('HashMap.copy expects an object which is iterable or has a forEach function on it');
    }

    /**
     * Makes a copy of this hashmap and returns a new one.
     * @return {HashMap}
     */
    clone() {
        return new HashMap(this);
    }

    /**
     * Deletes an entry from this hashmap, using the provided key
     * @param key
     * @return {HashMap}
     */
    delete(key, options = {}) {
        equalsAndHash(key, options);
        if (this.buckets.delete(key, options, 0)) {
            this.length = this.buckets.size;
        }
        return this;
    }

    /**
     * clears the data from this hashmap.
     * @return {HashMap}
     */
    clear() {
        this.buckets = new HashBuckets(this);
        this.length = 0;
        return this;
    }


    * [Symbol.iterator]() {
        for (const entry of this.buckets) {
            yield entry;
        }
    }

    * reverse() {
        for (const entry of this.buckets.reverse()) {
            yield entry;
        }
    }
}

/**
 * @private
 */
export class HashBuckets {
    constructor(map) {
        this.map = map;
        this.clear();
    }

    hashConflicts() {
        return false;
    }

    clear() {
        this.buckets = [];
        this.size = 0;
    }

    bucketFor(hash) {
        const idx = this.indexFor(hash);
        if (idx < this.buckets.length) {
            return this.buckets[idx];
        }
        return undefined;
    }

    indexFor(hash) {
        return (hash >>> SHIFT) & MASK;
    }

    set(key, value, options) {
        const hash = options.hash;
        const idx = this.indexFor(hash);
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.map.__createContainer(hash);
            bucket.createEntry(key, value);
            this.buckets[idx] = bucket;
            this.size += 1;
            return true;
        } else if (bucket.hashConflicts(hash)) {
            bucket = new HamtBuckets(this.map, DEPTH_HAMT, SHIFT_HAMT_1).replacing(bucket);
            this.buckets[idx] = bucket;
        }
        if (bucket.set(key, value, options)) {
            this.size += 1;
            return true;
        }
        return false;
    }

    emplace(key, handler, options) {
        const hash = options.hash;
        const idx = this.indexFor(hash);
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.map.__createContainer(hash);
            this.buckets[idx] = bucket;
        } else if (bucket.hashConflicts(hash)) {
            bucket = new HamtBuckets(this.map, DEPTH_HAMT, SHIFT_HAMT_1).replacing(bucket);
            this.buckets[idx] = bucket;
        }
        const response = bucket.emplace(key, handler, options);
        if (response.resized) {
            this.size += 1;
        }
        return response;
    }

    delete(key, options) {
        const hash = options.hash;
        const idx = this.indexFor(hash);
        const bucket = this.buckets[idx];
        if (bucket) {
            const deleted = bucket.delete(key, options);
            if (deleted) {
                // if (bucket.size === 0) {
                //     this.buckets[idx] = undefined;
                // }
                this.size -= 1;
                return true;
            }
        }
        return false;
    }

    get(key, options) {
        const hash = options.hash;
        const bucket = this.bucketFor(hash);
        if (bucket) {
            return bucket.get(key, options);
        }
        return undefined;
    }

    optionalGet(key, options) {
        const hash = options.hash;
        const bucket = this.bucketFor(hash);
        if (bucket) {
            return bucket.optionalGet(key, options);
        }
        return none;
    }

    has(key, options) {
        const hash = options.hash;
        const bucket = this.bucketFor(hash);
        if (bucket) {
            return bucket.has(key, options);
        }
        return false;
    }

    * [Symbol.iterator]() {
        for (const bucket of this.buckets) {
            if (bucket) {
                for (const entry of bucket) {
                    yield entry;
                }
            }
        }
    }

    * reverse() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            const bucket = this.buckets[idx];
            if (bucket) {
                for (const entry of bucket.reverse()) {
                    yield entry;
                }
            }
        }
    }
}

/**
 * @private
 */
export class HamtBuckets extends HashBuckets {
    constructor(map, depth, shift) {
        super(map);
        this.depth = depth;
        this.shift = shift;
    }

    clear() {
        this.size = 0;
        this.buckets = [];
        this.idxFlags = 0;
    }

    indexFor(hash) {
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & MASK_HAMT;
        const flag = 1 << hashIdx;
        return hammingWeight(idxFlags & (flag - 1));
    }

    bucketFor(hash) {
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & MASK_HAMT;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));

        if (idxFlags & flag) {
            return this.buckets[idx];
        }
        return undefined;
    }

    replacing(oldBucket){
        const new_flag = 1 << ((oldBucket.hash >>> this.shift) & MASK_HAMT);
        this.idxFlags |= new_flag;
        // shift the old bucket up a level. no need to splice its always going to be the first item.
        this.buckets[0] = oldBucket;
        this.size = oldBucket.size;
        return this;
    }

    set(key, value, options) {
        const hash = options.hash;
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & MASK_HAMT;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));
        let bucket;
        if (idxFlags & flag) {
            bucket = this.buckets[idx];
            if (this.depth && bucket.hashConflicts(hash)) {
                bucket = new HamtBuckets(this.map, this.depth - 1, this.shift + SHIFT_HAMT)
                    .replacing(bucket);
                this.buckets[idx] = bucket;
            }
        } else {
            bucket = this.map.__createContainer(hash);
            bucket.createEntry(key, value);
            this.buckets.splice(idx, 0, bucket);
            this.idxFlags |= flag;
            this.size += 1;
            return true;
        }
        if (bucket.set(key, value, options)) {
            this.size += 1;
            return true;
        }
        return false;
    }

    // emplace(key, handler, options) {
    //     const idx = (options.hash >>> this.shift) & this.map.mask;
    //     let bucket = this.buckets[idx];
    //     if (!bucket) {
    //         bucket = this.depth ? new HamtBuckets(this.options, this.depth - 1) : new Container(this.options);
    //         this.buckets[idx] = bucket;
    //     }
    //     options.hash >>>= this.options.widthAs2sExponent;
    //     const response = bucket.emplace(key, handler, options);
    //     if (response.resized) {
    //         this.size += 1;
    //     }
    //     return response;
    // }

    delete(key, options) {
        const hash = options.hash;
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & MASK_HAMT;
        const flag = 1 << hashIdx;
        if (idxFlags & flag) {
            const idx = hammingWeight(idxFlags & (flag - 1));
            const bucket = this.buckets[idx];
            const deleted = bucket.delete(key, options);
            if (deleted) {
                this.size -= 1;
                if (bucket.size === 0) {
                    if (idx === 0) {
                        this.buckets.shift();
                    } else if (this.buckets.size === idx) {
                        this.buckets.pop();
                    } else {
                        this.buckets.splice(idx, 1);
                    }
                    this.idxFlags ^= flag;
                }
                return true;
            }
        }
        return false;
    }

    * [Symbol.iterator]() {
        for (const bucket of this.buckets) {
            for (const entry of bucket) {
                yield entry;
            }
        }
    }

    * reverse() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            const bucket = this.buckets[idx];
            for (const entry of bucket.reverse()) {
                yield entry;
            }
        }
    }
}

/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 */
export class Container {

    constructor(map, hash) {
        this.size = 0;
        this.contents = [];
        this.map = map;
        this.hash = hash;
    }

    hashConflicts(hash) {
        return hash !== this.hash;
    }

    get(key, options) {
        if (this.size !== 0) {
            const equals = options.equals;
            for (const entry of this.contents) {
                if (entry && equals(key, entry[0])) {
                    return entry[1];
                }
            }
        }
        return undefined;
    }

    optionalGet(key, options) {
        if (this.size !== 0) {
            const equals = options.equals;
            const entry = this.contents.find(entry => equals(key, entry[0]));
            if (entry) {
                return some(entry[1]);
            }
        }
        return none;
    }

    set(key, value, options) {
        const equals = options.equals;
        for (const entry of this.contents) {
            if (equals(key, entry[0])) {
                entry[1] = value;
                return false;
            }
        }
        this.createEntry(key, value);
        return true;
    }

    createEntry(key, value) {
        const entry = [key, value];
        this.contents.push(entry);
        this.size += 1;
        return entry;
    }


    deleteEntry(idx) {
        this.size -= 1;
        if (idx === 0) {
            return this.contents.shift();
        } else if (idx === this.size) {
            return this.contents.pop();
        } else {
            return this.contents.splice(idx, 1)[0];
        }
    }

    emplace(key, handler, options) {

        const equals = options.equals;
        for (const entry of this.contents) {
            if (equals(key, entry[0])) {
                const value = handler.update(entry[1], key, this.map);
                entry[1] = value;
                return {value, resized: false};
            }
        }
        const value = handler.insert(key, this.map);
        this.createEntry(key, value);
        return {value, resized: true};
    }

    has(key, options) {
        if (this.size !== 0) {
            const equals = options.equals;
            return this.contents.some(entry => equals(key, entry[0]));
        }
        return false;
    }

    delete(key, options) {
        const equals = options.equals;
        const idx = this.contents.findIndex(entry => equals(key, entry[0]));

        if (idx === -1) {
            return false;
        }
        this.deleteEntry(idx);
        return true;
    }

    * [Symbol.iterator]() {
        for (const entry of this.contents) {
            yield entry.slice();
        }
    }

    * reverse() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            const entry = this.contents[idx];
            yield entry.slice();
        }
    }
}

/**
 * Counts the number of ones in a 32 bit integer.
 *
 * @param {number} flags 32 bit integet
 * @return {number} amount of ones.
 */
export const hammingWeight = (flags) => {
    flags -= ((flags >> 1) & 0x55555555);
    flags = (flags & 0x33333333) + ((flags >> 2) & 0x33333333);
    return ((flags + (flags >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
};