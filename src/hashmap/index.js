import {isFunction, isIterable} from '../utils/';
import {hashCodeFor, hammingWeight, equalsFor} from '../hash';
import {none, some} from '../option/';
import {MapIterable} from '../iterable/';


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
    constructor(args = {
        copy: undefined,
        depth: undefined,
        widthAs2sExponent: undefined,
        hamt: false,
        compress: true
    }) {
        super();
        const {depth, widthAs2sExponent, copy, hamt, compress} = args;
        if (!(Number.isFinite(widthAs2sExponent) || widthAs2sExponent < 1)) {
            this.widthAs2sExponent = hamt ? 5 : 6; // 2^5 = 32 buckets // 2^6 = 64
            this.depth = depth && depth > 0 ? Math.min(depth - 1, (hamt ? 5 : 4)) : (hamt ? 5 : 4);
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
        this.clear();
        if (args.forEach || (copy && copy.forEach)) {
            this.copy(args.forEach ? args : copy);
        }
    }

    __createContainer(hash) {
        return new Container(this,hash);
    }

    get size() {
        return this.length;
    }

    has(key, options = {}) {
        setHashIfMissing(key, options);
        return this.buckets.has(key, options, 0);
    }


    get(key, options = {}) {
        setHashIfMissing(key, options);
        return this.buckets.get(key, options, 0);
    }


    // noinspection JSCheckFunctionSignatures
    optionalGet(key, options = {}) {
        setHashIfMissing(key, options);
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
        setHashIfMissing(key, options);
        this.buckets.set(key, value, options, 0);
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

    * reverse() {
        if (this.buckets) {
            for (const entry of this.buckets.reverse()) {
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
export class HashBuckets {
    constructor(map, depth) {
        this.map = map;
        this.depth = depth;
        this.shift = (map.depth - depth) * map.widthAs2sExponent;
        this.clear();
    }

    hashConflicts() {
        return false;
    }

    clear() {
        this.buckets = this.map.compress ? [] : new Array(this.map.width);
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
        return (hash >>> this.shift) & this.map.mask;
    }

    set(key, value, options) {
        const hash = options.hash;
        const idx = this.indexFor(hash);
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.map.__createContainer(hash);
            this.buckets[idx] = bucket;
        } else if (this.depth && bucket.hashConflicts(hash)) {
            const oldBucket = bucket;
            bucket = new HashBuckets(this.map, this.depth - 1);
            // shift the old bucket up a level.
            bucket.buckets[(oldBucket.hash >>> (this.shift + this.map.widthAs2sExponent)) & this.map.mask] = oldBucket;
            bucket.size = oldBucket.size;
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
            bucket = this.depth ? new HashBuckets(this.map, this.depth - 1) : new Container(this.map);
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
                if (bucket.size === 0) {
                    this.buckets[idx] = undefined;
                }
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
        for(let idx = this.buckets.length-1;idx >= 0;idx--){
            const bucket=this.buckets[idx];
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
    constructor(map, depth) {
        super(map, depth);
    }

    clear() {
        this.size = 0;
        this.buckets = [];
        this.idxFlags = 0;
    }

    indexFor(hash) {
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & this.map.mask;
        const flag = 1 << hashIdx;
        return hammingWeight(idxFlags & (flag - 1));
    }

    bucketFor(hash) {
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & this.map.mask;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));

        if (idxFlags & flag) {
            return this.buckets[idx];
        }
        return undefined;
    }

    set(key, value, options) {
        const hash = options.hash;
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & this.map.mask;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));
        let bucket;
        if (idxFlags & flag) {
            bucket = this.buckets[idx];
            if (this.depth && bucket.hashConflicts(hash)) {
                const oldBucket = bucket;
                bucket = new HamtBuckets(this.map, this.depth - 1);
                this.buckets[idx] = bucket;
                const new_flag = 1 << ((oldBucket.hash >>> (this.shift + this.map.widthAs2sExponent)) & this.map.mask);
                bucket.idxFlags |= new_flag;
                // shift the old bucket up a level. no need to splice its always going to be the first item.
                bucket.buckets[0] = oldBucket;
                bucket.size = oldBucket.size;
            }
        } else {
            bucket = this.map.__createContainer(hash);
            if (idx === 0) {
                this.buckets.unshift(bucket);
            } else if (idx === this.buckets.length) {
                this.buckets.push(bucket);
            } else {
                this.buckets.splice(idx, 0, bucket);
            }
            this.idxFlags |= flag;
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
        const hashIdx = (hash >>> this.shift) & this.map.mask;
        const flag = 1 << hashIdx;
        if (idxFlags & flag) {
            const idx = hammingWeight(idxFlags & (flag - 1));
            const bucket = this.buckets[idx];
            const deleted = bucket.delete(key, options);
            if (deleted) {
                if (bucket.size === 0) {
                    if (idx === 0) {
                        this.buckets.shift();
                    } else if (idx === this.buckets.length - 1) {
                        this.buckets.pop();
                    } else {
                        this.buckets.splice(idx, 1);
                    }
                    this.idxFlags ^= flag;
                }
                this.size -= 1;
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
        for(let idx = this.buckets.length-1;idx >= 0;idx--){
            const bucket=this.buckets[idx];
            for (const entry of bucket.reverse()) {
                yield entry;
            }
        }
    }
}


function equalsForOptions(key, options) {
    if (options.equals === undefined) {
        options.equals = equalsFor(key);
    }
    return options.equals;
}

/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 */
export class Container {

    constructor(map, hash) {
        this.size = 0;
        this.contents = [];
        this.map = map;
        this.hash= hash;
    }

    hashConflicts(hash) {
        return hash !== this.hash;
    }

    prefill(key, value) {
        this.contents[0] = [key, value];
        this.size = 1;
        return this;
    }

    get(key, options) {
        if (this.size !== 0) {
            const equals = equalsForOptions(key, options);
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
            const equals = equalsForOptions(key, options);
            const entry = this.contents.find(entry => equals(key, entry[0]));
            if (entry) {
                return some(entry[1]);
            }
        }
        return none;
    }

    set(key, value, options) {
        const equals = equalsForOptions(key, options);
        for (const entry of this.contents) {
            if (equals(key, entry[0])) {
                this.overwriteValue(entry,value);
                return false;
            }
        }
        this.createEntry(key, value);
        return true;
    }
    createEntry(key,value) {
        const entry = [key,value];
        this.contents.push(entry);
        this.size += 1;
        return entry;
    }
    overwriteValue(entry, value) {
        entry[1] = value;
    }

    deleteEntry(idx){
        this.size -= 1;
        return this.contents.splice(idx,1);
    }

    emplace(key, handler, options) {
        const equals = equalsForOptions(key, options);
        let idx = this.contents.findIndex(entry => equals(key, entry[0]));
        let value;
        if (idx < 0) {
            // we expect an error to be thrown if insert doesn't exist.
            // https://github.com/tc39/proposal-upsert
            value = handler.insert(key, this.map);
            if (this.size === this.contents.length) {
                this.createEntry(key, value);
                return {value, resized: true};
            } else {
                idx = 0;
                for (const entry of this.contents) {
                    if (entry === undefined) {
                        this.contents[idx] = [key, value];
                        this.size++;
                        return {value, resized: true};
                    }
                    idx++;
                }
            }
        } else if (handler.update) {
            const entry = this.contents[idx];
            value = handler.update(entry[1], key, this.map);
            this.overwriteValue(entry,value);
            return {value, resized: false};
        }
    }

    has(key, options) {
        if (this.size !== 0) {
            const equals = equalsForOptions(key, options);
            return this.contents.some(entry => equals(key, entry[0]));
        }
        return false;
    }

    delete(key, options) {
        const equals = equalsForOptions(key, options);
        const idx = this.contents.findIndex(entry => equals(key, entry[0]));

        if (idx === -1) {
            return false;
        }
        this.deleteEntry(idx);
        return true;
    }

    * [Symbol.iterator]() {
        for (const entry of this.contents) {
            if (entry !== undefined) {
                yield entry.slice();
            }
        }
    }

    * reverse() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            const entry = this.contents[idx];
            yield entry.slice();
        }
    }
}