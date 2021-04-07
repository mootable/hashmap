import {isFunction, isIterable} from '../utils/';
import {hashCodeFor} from '../hash';
import {none} from '../option/';
import {MapIterable} from '../iterable/';
import {Entry} from '../entry/';
import {ArrayContainer} from '../container/';

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
    constructor(args = {copy: undefined, depth: undefined, widthAs2sExponent: undefined}) {
        super();
        let {depth, widthAs2sExponent, copy} = args;
        if (!(Number.isFinite(widthAs2sExponent) || widthAs2sExponent < 1)) {
            widthAs2sExponent = 6; // 2^6 = 64 buckets
            depth = depth && depth > 0 ? Math.min(depth - 1, 4) : 4;
        } else {
            widthAs2sExponent = Math.max(1, Math.min(16, widthAs2sExponent));
            const defaultDepth = ((32 / widthAs2sExponent) >> 0) - 1;
            depth = depth && depth > 0 ? Math.min(depth - 1, defaultDepth) : defaultDepth;
        }
        // 0 indexed so 3 is a depth of 4.
        const width = 1 << widthAs2sExponent; // 2 ^ widthAs2sExponent
        const mask = width - 1;
        this.options = {
            widthAs2sExponent, width, mask, depth, map: this,
            createEntry,
            overwriteEntry
        };
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
            depth: this.options.depth,
            widthAs2sExponent: this.options.widthAs2sExponent
        });
    }

    /**
     * Deletes an entry from this hashmap, using the provided key
     * @param key
     * @return {HashMap}
     */
    delete(key, options = {}) {
        setHashIfMissing(key, options);
        const deleted = this.buckets.delete(key, options);
        if (deleted) {
            this.length = this.buckets.size;
        }
        return this;
    }

    /**
     * clears the data from this hashmap.
     * @return {HashMap}
     */
    clear() {
        this.buckets = new HashBuckets(this.options, this.options.depth);
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
    if (options.hash === undefined) {
        options.hash = hashCodeFor(key);
    }
    return options.hash;
}

const createEntry = (key, value) => new Entry(key, value);
const overwriteEntry = (key, value, oldEntry) => {
    oldEntry.key = key;
    oldEntry.value = value;
    return oldEntry;
};

/**
 * @private
 */
export class HashBuckets {
    constructor(options, depth) {
        this.options = options;
        this.size = 0;
        this.depth = depth;
        this.buckets = [];
    }

    set(key, value, options) {
        const idx = options.hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.depth ? new HashBuckets(this.options, this.depth - 1) : new ArrayContainer(this.options);
            this.buckets[idx] = bucket;
        }
        options.hash >>>= this.options.widthAs2sExponent;
        if (bucket.set(key, value, options)) {
            this.size += 1;
            return true;
        }
        return false;
    }

    emplace(key, handler, options) {
        const idx = options.hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.depth ? new HashBuckets(this.options, this.depth - 1) : new ArrayContainer(this.options);
            this.buckets[idx] = bucket;
        }
        options.hash >>>= this.options.widthAs2sExponent;
        const response = bucket.emplace(key, handler, options);
        if (response.resized) {
            this.size += 1;
        }
        return response;
    }

    delete(key, options) {
        const idx = options.hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (bucket) {
            options.hash >>>= this.options.widthAs2sExponent;
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
        const bucket = this.buckets[options.hash & this.options.mask];
        if (bucket) {
            options.hash >>>= this.options.widthAs2sExponent;
            return bucket.get(key, options);
        }
        return undefined;
    }

    optionalGet(key, options) {
        const bucket = this.buckets[options.hash & this.options.mask];
        if (bucket) {
            options.hash >>>= this.options.widthAs2sExponent;
            return bucket.optionalGet(key, options);
        }
        return none;
    }

    has(key, options) {
        const bucket = this.buckets[options.hash & this.options.mask];
        if (bucket) {
            options.hash >>>= this.options.widthAs2sExponent;
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