import {isFunction, isIterable} from '../utils/';
import {equalsAndHash} from '../hash';
import {none} from '../option/';
import {MapIterable} from '../iterable/';
import {Entry} from '../entry/';
import {ArrayContainer} from '../container/';

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
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


    has(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            return this.buckets.has(key, hashEq.equals, hashEq.hash);
        }
        return false;
    }


    get(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            return this.buckets.get(key, hashEq.equals, hashEq.hash);
        }
        return undefined;
    }


    // noinspection JSCheckFunctionSignatures
    optionalGet(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            return this.buckets.optionalGet(key, hashEq.equals, hashEq.hash);
        }
        return none;
    }

    /**
     * Sets a value onto this map, using the key as its reference.
     *
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @return {HashMap}
     */
    set(key, value, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            this.buckets.set(key, value, hashEq.equals, hashEq.hash);
        } else {
            this.buckets = new HashBuckets(Object.assign({}, this.options), this.options.depth);
            this.buckets.prefill(key, value, hashEq.hash);
        }
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
    delete(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            const deleted = this.buckets.delete(key, hashEq.equals, hashEq.hash);
            if (deleted) {
                this.length = this.buckets.size;
            }
        }
        return this;
    }

    /**
     * clears the data from this hashmap.
     * @return {HashMap}
     */
    clear() {
        // we clone the options as its dangerous to modify mid execution.
        this.buckets = undefined;
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

const createEntry = (key, value) => new Entry(key, value);
const overwriteEntry = (key, value, oldEntry) => {
    oldEntry.key = key;
    oldEntry.value = value;
    return oldEntry;
};

/**
 * @private
 * @extends Container
 */
export class HashContainer extends ArrayContainer {
    constructor(hash, options) {
        super(options);
        this.hash = hash;
    }

    set(key, value, equals, hash) {
        if (hash === this.hash) {
            return super.set(key, value, equals);
        }
        // we have not modified
        return undefined;
    }


    emplace(key, handler, equals, hash) {
        if (hash === this.hash) {
            return super.emplace(key, handler, equals);
        }
        // we have not modified
        return undefined;
    }

    get(key, equals, hash) {
        if (hash === this.hash) {
            return super.get(key, equals);
        }
        return undefined;
    }

    optionalGet(key, equals, hash) {
        if (hash === this.hash) {
            return super.optionalGet(key, equals);
        }
        return none;
    }

    has(key, equals, hash) {
        if (hash === this.hash) {
            return super.has(key, equals);
        }
        return false;
    }

    delete(key, equals, hash) {
        if (hash === this.hash) {
            return super.delete(key, equals);
        }
        return false;
    }
}

/**
 * @private
 */
export class HashBuckets {
    constructor(options, depth) {
        this.options = options;
        this.size = 0;
        this.depth = depth;
        this.buckets = new Array(this.options.width);
    }

    set(key, value, equals, hash) {
        const idx = hash & this.options.mask;
        const bucket = this.buckets[idx];
        let resized = true;
        if (this.depth) {
            const newHash = hash >>> this.options.widthAs2sExponent;
            if (bucket) {
                resized = bucket.set(key, value, equals, newHash);
                if (resized === undefined) {
                    // we need to split into more hashbuckets.
                    const newBucket = new HashBuckets(this.options, this.depth - 1)
                        .prefillContainer(bucket)
                        .prefill(key, value, newHash);
                    this.buckets[idx] = newBucket;
                    resized = true;
                }
            } else {
                this.buckets[idx] = new HashContainer(newHash, this.options)
                    .prefill(key, value);
            }
        } else {
            if (bucket) {
                resized = bucket.set(key, value, equals);
            } else {
                this.buckets[idx] = new ArrayContainer(this.options)
                    .prefill(key, value);
            }
        }
        if (resized) {
            this.size += 1;
        }
        return resized;
    }

    prefillContainer(container) {
        // just shift the bucket down a level.
        this.buckets[container.hash & this.options.mask] = container;
        container.hash = container.hash >>> this.options.widthAs2sExponent;
        // create a new container for the  new entry
        this.size += container.size;
        return this;
    }

    prefill(key, value, hash) {
        // create a new container for the  new entry
        // FIXME: We want to do this from hashmap, do we want to bitshift the hash from the set function?
        // I think things are being done at the right levels, but worth checking.
        this.buckets[hash & this.options.mask] = new HashContainer(
            hash >>> this.options.widthAs2sExponent,
            this.options).prefill(key, value);

        this.size += 1;
        return this;
    }


    emplace(key, handler, equals, hash) {
        const idx = hash & this.options.mask;
        let bucket = this.buckets[idx];
        let response;
        if (this.depth) {
            const newHash = hash >>> this.options.widthAs2sExponent;
            if (bucket) {
                response = bucket.emplace(key, handler, equals, newHash);
                if (response.resized === undefined) {
                    // we need to split into more hashbuckets.
                    this.buckets[idx] = bucket = new HashBuckets(this.options, this.depth - 1).prefillContainer(bucket);
                    response = bucket.emplace(key, handler, equals, newHash);
                }
            } else {
                this.buckets[idx] = bucket = new HashContainer(newHash, this.options);
                response = bucket.emplace(key, handler, equals, newHash)
            }
        } else {
            if (!bucket) {
                this.buckets[idx] = bucket = new ArrayContainer(this.options);
            }
            response = bucket.emplace(key, handler, equals);
        }
        if (response.resized) {
            this.size += 1;
        }
        return response;
    }

    delete(key, equals, hash) {
        const idx = hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (bucket) {
            const deleted = bucket.delete(key, equals, hash >>> this.options.widthAs2sExponent);
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

    get(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.get(key, equals, hash >>> this.options.widthAs2sExponent);
        }
        return undefined;
    }

    optionalGet(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.optionalGet(key, equals, hash >>> this.options.widthAs2sExponent);
        }
        return none;
    }

    has(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.has(key, equals, hash >>> this.options.widthAs2sExponent);
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