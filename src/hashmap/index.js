import {isFunction, isIterable} from '../utils/';
import {hashCodeFor, hammingWeight} from '../hash';
import {none} from '../option/';
import {MapIterable} from '../iterable/';
import {Entry} from '../entry/';
import {ArrayContainer} from '../container/';

const createEntry = (key, value) => new Entry(key, value);

const deleteEntry = (oldEntry) => undefined;

const overwriteEntry = (key, value, oldEntry) => {
    oldEntry.key = key;
    oldEntry.value = value;
    return oldEntry;
};
/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
 * @extends {MapIterable}
 */
export class HashMap extends MapIterable {
    /**
     * @typedef HashMap~ConstructorOptions
     * @property {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>)} [copy] - an object that provides a forEach function with the same signature as`Map.forEach`.
     * such as `Map` or this `HashMap` and `LinkedHashMap`, or any iterable that provides [key,value] pairs such as a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * @property {number} [depth] - how many layers deep our hashtrie goes.
     * - Minimum: `1`
     * - Maximum/Default: `(32/widthAs2sExponent)-1`
     * @property {number} [widthAs2sExponent] - how many buckets in each hashtrie layer we use 2 to the power of widthAs2sExponent, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     * - Minimum: `1`
     * - Maximum: `16`
     * - Default: `6` (64 Buckets)
     */
    /**
     * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
     * - `new HashMap()` creates an empty hashmap
     * - `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * - `new HashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a hashmap with optional `depth` and `widthAs2sExponent`. If `copy` is provided (map, array or iterable), it's keys and values are inserted into this map.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *   2) `depth` is how many layers deep our hashtrie goes.
     *      - Minimum: `1`, Maximum/Default: `(32/widthAs2sExponent)-1`
     *   3) `widthAs2sExponent` is how many buckets in each hashtrie layer we use to the power of 2, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     *      - Minimum: `1`, Maximum: `16`, Default: `6` (64 Buckets)
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
     */
    constructor(args = {copy: undefined, depth: undefined, widthAs2sExponent: undefined, hamt: false, compress: false}) {
        super();
        const {depth, widthAs2sExponent, copy, hamt, compress} = args;
        if (!(Number.isFinite(widthAs2sExponent) || widthAs2sExponent < 1)) {
            this.widthAs2sExponent = hamt ? 5 : 8; // 2^5 = 32 buckets // 2^8 = 256
            this.depth = depth && depth > 0 ? Math.min(depth - 1, (hamt ? 5 : 3)) : (hamt ? 5 : 3);
        } else {
            this.widthAs2sExponent = Math.max(1, Math.min((hamt ? 5 : 16), widthAs2sExponent));
            const defaultDepth = ((32 / this.widthAs2sExponent) >> 0) - 1;
            this.depth = depth && depth > 0 ? Math.min(depth - 1, defaultDepth) : defaultDepth;
        }
        // 0 indexed so 3 is a depth of 4.
        const width = 1 << this.widthAs2sExponent; // 2 ^ widthAs2sExponent
        this.width = width;
        this.mask = width - 1;
        this.hamt = hamt;
        this.compress = compress;
        this.createEntry = createEntry;
        this.overwriteEntry = overwriteEntry;
        this.deleteEntry = deleteEntry;
        this.clear();
        if (args.forEach || (copy && copy.forEach)) {
            this.copy(args.forEach ? args : copy);
        }
    }

    get size() {
        return this.length;
    }


    has(key, options = {}) {
        setHashIfMissing(key, options);
        return this.buckets.has(key, options);
    }


    get(key, options = {}) {
        setHashIfMissing(key, options);
        return this.buckets.get(key, options);
    }


    // noinspection JSCheckFunctionSignatures
    optionalGet(key, options = {}) {
        setHashIfMissing(key, options);
        return this.buckets.optionalGet(key, options);
    }

    /**
     * Sets a value onto this map, using the key as its reference.
     *
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @return {HashMap}
     */
    set(key, value, options = {}) {
        setHashIfMissing(key, options);
        this.buckets.set(key, value, options);
        this.length = this.buckets.size;
        return this;
    }

    // emplace(key, handler) {
    //     const hash = hashCodeFor(key);
    //     if (this.buckets) {
    //         const {value, container} = this.buckets.emplace(key, handler, hash);
    //         this.buckets = container;
    //         this.length = this.buckets.size;
    //         return value;
    //     } else {
    //         // this.buckets = new HashContainer(entry, hashEq.hash, Object.assign({}, this.options), this.options.depth);
    //         // this.length = 1;
    //     }
    // }


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
        return new HashMap({
            copy: this,
            depth: this.depth,
            widthAs2sExponent: this.widthAs2sExponent,
            hamt: this.hamt,
            compress: this.compress,
        });
    }

    /**
     * Deletes an entry from this hashmap, using the provided key
     * @param key
     * @return {HashMap}
     */
    delete(key, options = {}) {
        setHashIfMissing(key, options);
        if (this.buckets.delete(key, options)) {
            this.length = this.buckets.size;
        }
        return this;
    }

    /**
     * clears the data from this hashmap.
     * @return {HashMap}
     */
    clear() {

        this.buckets = this.hamt ? new HamtBuckets(this, this.depth) : new HashBuckets(this, this.depth);
        this.length = 0;
        return this;
    }


    * [Symbol.iterator]() {
        if (this.buckets) {
            for (const entry of this.buckets) {
                yield entry;
            }
        }
    }
}

function setHashIfMissing(key, options) {
    let hash = options.hash;
    if (hash === undefined) {
        hash = options.hash = hashCodeFor(key);
    }
    return hash;
}


/**
 * @private
 */
export class HamtBuckets {
    constructor(map, depth) {
        this.map = map;
        this.size = 0;
        this.depth = depth;
        this.buckets = [];
        this.idxFlags = 0;
    }

    bucketForHash(hash) {
        const idxFlags = this.idxFlags;
        const hashIdx = hash & this.map.mask;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));
        if (idxFlags & flag) {
            return this.buckets[idx];
        }
        return undefined;
    }

    set(key, value, options) {
        const idxFlags = this.idxFlags;
        const hashIdx = options.hash & this.map.mask;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));
        let bucket;
        if (idxFlags & flag) {
            bucket = this.buckets[idx];
        } else {
            bucket = this.depth ? new HamtBuckets(this.map, this.depth - 1) : new ArrayContainer(this.map);
            this.buckets.splice(idx, 0, bucket);
            this.idxFlags |= flag;
        }
        options.hash >>>= this.map.widthAs2sExponent;
        if (bucket.set(key, value, options)) {
            this.size += 1;
            return true;
        }
        return false;
    }

    // emplace(key, handler, options) {
    //     const idx = options.hash & this.options.mask;
    //     let bucket = this.buckets[idx];
    //     if (!bucket) {
    //         bucket = this.depth ? new HamtBuckets(this.options, this.depth - 1) : new ArrayContainer(this.options);
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
        const idxFlags = this.idxFlags;
        const hashIdx = options.hash & this.map.mask;
        const flag = 1 << hashIdx;
        if (idxFlags & flag) {
            options.hash >>>= this.map.widthAs2sExponent;
            const idx = hammingWeight(idxFlags & (flag - 1));
            const bucket = this.buckets[idx];
            const deleted = bucket.delete(key, options);
            if (deleted) {
                if (bucket.size === 0) {
                    this.buckets.splice(idx, 1);
                    this.idxFlags ^= flag;
                }
                this.size -= 1;
                return true;
            }
        }
        return false;
    }

    get(key, options) {
        const bucket = this.bucketForHash(options.hash);
        if (bucket !== undefined) {
            options.hash >>>= this.map.widthAs2sExponent;
            return bucket.get(key, options);
        }
        return undefined;
    }

    optionalGet(key, options) {
        const bucket = this.bucketForHash(options.hash);
        if (bucket !== undefined) {
            options.hash >>>= this.map.widthAs2sExponent;
            return bucket.optionalGet(key, options);
        }
        return none;
    }

    has(key, options) {
        const bucket = this.bucketForHash(options.hash);
        if (bucket !== undefined) {
            options.hash >>>= this.map.widthAs2sExponent;
            return bucket.has(key, options);
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
}


/**
 * @private
 */
export class HashBuckets {
    constructor(map, depth) {
        this.map = map;
        this.size = 0;
        this.depth = depth;
        this.buckets = map.compress ? []: new Array(map.width);
    }

    set(key, value, options) {
        const idx = options.hash & this.map.mask;
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.depth ? new HashBuckets(this.map, this.depth - 1) : new ArrayContainer(this.map);
            this.buckets[idx] = bucket;
        }
        options.hash >>>= this.map.widthAs2sExponent;
        if (bucket.set(key, value, options)) {
            this.size += 1;
            return true;
        }
        return false;
    }

    emplace(key, handler, options) {
        const idx = options.hash & this.map.mask;
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.depth ? new HashBuckets(this.map, this.depth - 1) : new ArrayContainer(this.map);
            this.buckets[idx] = bucket;
        }
        options.hash >>>= this.map.widthAs2sExponent;
        const response = bucket.emplace(key, handler, options);
        if (response.resized) {
            this.size += 1;
        }
        return response;
    }

    delete(key, options) {
        const idx = options.hash & this.map.mask;
        let bucket = this.buckets[idx];
        if (bucket) {
            options.hash >>>= this.map.widthAs2sExponent;
            const deleted = bucket.delete(key, options);
            if (deleted) {
                if (bucket.size === 0) {
                    // we could choose to compress instead.
                    this.buckets[idx] = undefined;
                }
                this.size -= 1;
                return true;
            }
        }
        return false;
    }

    get(key, options) {
        const bucket = this.buckets[options.hash & this.map.mask];
        if (bucket) {
            options.hash >>>= this.map.widthAs2sExponent;
            return bucket.get(key, options);
        }
        return undefined;
    }

    optionalGet(key, options) {
        const bucket = this.buckets[options.hash & this.map.mask];
        if (bucket) {
            options.hash >>>= this.map.widthAs2sExponent;
            return bucket.optionalGet(key, options);
        }
        return none;
    }

    has(key, options) {
        const bucket = this.buckets[options.hash & this.map.mask];
        if (bucket) {
            options.hash >>>= this.map.widthAs2sExponent;
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
}