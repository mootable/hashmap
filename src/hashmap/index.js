import {isFunction, isIterable} from '../utils/';
import {equalsAndHash} from '../hash';
import {none, some} from '../option/';
import {MapIterable} from '../iterable/';
import {Entry} from '../entry/';
import {SingleContainer, ArrayContainer} from '../container/';
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
    constructor(args = {copy: undefined, depth: undefined, widthAs2sExponent: 6}) {
        super();
        let {depth, widthAs2sExponent, copy} = args;
        widthAs2sExponent = Math.max(1, Math.min(16, widthAs2sExponent)); // 2^6 = 64 buckets
        const defaultDepth = ((32 / widthAs2sExponent) >> 0) - 1;
        depth = Math.max(0, Math.min(depth && depth > 0 ? depth - 1 : defaultDepth, defaultDepth)); // 0 indexed so 3 is a depth of 4.
        const width = 1 << widthAs2sExponent; // 2 ^ widthAs2sExponent
        const mask = width - 1;
        this.options = Object.freeze({widthAs2sExponent, width, mask, depth});
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
        this.addEntry(new Entry(key, value), hashEq);
        return this;
    }

    /**
     * @ignore
     * @param entry
     * @return {*}
     */
    addEntry(entry, hashEq) {
        if (this.buckets) {
            this.buckets = this.buckets.set(entry, hashEq.equals, hashEq.hash);
            this.length = this.buckets.size;
        } else {
            this.buckets = new HashContainer(entry, hashEq.hash, Object.assign({}, this.options), this.options.depth);
            this.length = 1;
        }
        return entry;
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
            this.buckets = this.buckets.delete(key, hashEq.equals, hashEq.hash);
            if (this.buckets) {
                this.length = this.buckets.size;
            } else {
                this.length = 0;
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

/**
 * @private
 * @extends Container
 */
export class HashContainer extends SingleContainer {
    constructor(entry, hash, options, depth) {
        super(entry);
        this.hash = hash;
        this.options = options;
        this.depth = depth;
    }

    set(newEntry, equals, hash) {
        if (hash === this.hash && equals(newEntry.key, this.key)) {
            this.entry.overwrite(newEntry);
            return this;
        }
        const bucket = new HashBuckets(this.options, this.depth);
        bucket.prefill(this.entry, this.hash, newEntry, hash);
        return bucket;
    }

    get(key, equals, hash) {
        if (hash === this.hash && equals(key, this.key)) {
            return this.value;
        }
        return undefined;
    }

    optionalGet(key, equals, hash) {
        if (hash === this.hash && equals(key, this.key)) {
            return some(this.value);
        }
        return none;
    }

    has(key, equals, hash) {
        return hash === this.hash && equals(key, this.key);
    }

    delete(key, equals, hash) {
        if (hash === this.hash && equals(key, this.key)) {
            this.entry.delete();
            return undefined;
        }
        return this;
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

    /**
     * A much faster set, of 2 items.
     * @param entry1
     * @param hash1
     * @param entry2
     * @param hash2
     */
    prefill(entry1, hash1, entry2, hash2) {
        const idx1 = hash1 & this.options.mask;
        const idx2 = hash2 & this.options.mask;
        if (idx1 === idx2) {
            if (this.depth) {
                const bucket = new HashBuckets(this.options, this.depth - 1);
                this.buckets[idx1] = bucket;
                bucket.prefill(entry1, hash1 >>> this.options.widthAs2sExponent,
                    entry2, hash2 >>> this.options.widthAs2sExponent);
            } else {
                this.buckets[idx1] = new ArrayContainer(entry1, entry2);
            }
        } else if (this.depth) {
            this.buckets[idx1] = new HashContainer(entry1, hash1 >>> this.options.widthAs2sExponent, this.options, this.depth - 1);
            this.buckets[idx2] = new HashContainer(entry2, hash2 >>> this.options.widthAs2sExponent, this.options, this.depth - 1);

        } else {
            this.buckets[idx1] = new SingleContainer(entry1);
            this.buckets[idx2] = new SingleContainer(entry2);
        }
        this.size += 2;
    }

    set(entry, equals, hash) {
        const idx = hash & this.options.mask;
        const bucket = this.buckets[idx];
        if (bucket) {
            const len = bucket.size;
            this.buckets[idx] = bucket.set(entry, equals, hash >>> this.options.widthAs2sExponent);
            if (this.buckets[idx].size !== len) {
                this.size++;
            }
        } else if (this.depth) {
            this.buckets[idx] = new HashContainer(entry, hash >>> this.options.widthAs2sExponent, this.options, this.depth - 1);
            this.size++;
        } else {
            this.buckets[idx] = new SingleContainer(entry);
            this.size++;
        }
        return this;
    }

    has(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.has(key, equals, hash >>> this.options.widthAs2sExponent);
        }
        return false;
    }

    delete(key, equals, hash) {
        const idx = hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (bucket) {
            bucket = bucket.delete(key, equals, hash >>> this.options.widthAs2sExponent);
            if ((!bucket) || bucket.size === 0) {
                this.buckets[idx] = undefined;
                this.size--;
            }
        }
        return this;
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