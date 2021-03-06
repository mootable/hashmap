import {none} from '../option/';
import {hammingWeight} from '../utils/';

const SHIFT = 7;
const WIDTH = 1 << SHIFT;
const MASK = WIDTH - 1;
const DEPTH = 5;

const SHIFT_HAMT = 5;
const WIDTH_HAMT = 1 << SHIFT_HAMT;
const MASK_HAMT = WIDTH_HAMT - 1;
const DEPTH_HAMT = DEPTH - 1;

/**
 * @private
 * @author Jack Moxley
 * @copyright Jack Moxley <https://github.com/jackmoxley>
 * @licence MIT
 */
export class HashBuckets {
    constructor(map) {
        this.map = map;
        this.buckets = [];
        this.size = 0;
    }

    clear() {
        this.buckets = [];
        this.size = 0;
    }

    bucketFor(hash) {
        const idx = hash & MASK;
        if (idx < this.buckets.length) {
            return this.buckets[idx];
        }
        return undefined;
    }

    set(key, value, options) {
        const hash = options.hash;
        const idx = hash & MASK;
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.map.createContainer(this, hash);
            bucket.createEntry(key, value,options);
            this.buckets[idx] = bucket;
            this.size += 1;
            return;
        } else if (bucket.hashConflicts(hash)) {
            bucket = new HamtBuckets(this.map, this, DEPTH_HAMT, SHIFT).replacing(bucket);
            this.buckets[idx] = bucket;
        }
        this.size -= bucket.size;
        bucket.set(key, value, options);
        this.size += bucket.size;
    }

    emplace(key, handler, options) {
        const hash = options.hash;
        const idx = hash & MASK;
        let bucket = this.buckets[idx];
        if (!bucket) {
            bucket = this.map.createContainer(this, hash);
            this.buckets[idx] = bucket;
        } else if (bucket.hashConflicts(hash)) {
            bucket = new HamtBuckets(this.map, this, DEPTH_HAMT, SHIFT).replacing(bucket);
            this.buckets[idx] = bucket;
        }
        this.size -= bucket.size;
        const value = bucket.emplace(key, handler, options);
        this.size += bucket.size;
        return value;
    }

    delete(key, options) {
        const hash = options.hash;
        const idx = hash & MASK;
        const bucket = this.buckets[idx];
        if (bucket) {
            const deleted = bucket.delete(key, options);
            if (deleted) {
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
                yield* bucket;
            }
        }
    }

    * entriesRight() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            const bucket = this.buckets[idx];
            if (bucket) {
                yield* bucket.entriesRight();
            }
        }
    }

    * keys() {
        for (const bucket of this.buckets) {
            if (bucket) {
                yield* bucket.keys();
            }
        }
    }

    * values() {
        for (const bucket of this.buckets) {
            if (bucket) {
                yield* bucket.values();
            }
        }
    }

    * keysRight() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            const bucket = this.buckets[idx];
            if (bucket) {
                yield* bucket.keysRight();
            }
        }
    }

    * valuesRight() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            const bucket = this.buckets[idx];
            if (bucket) {
                yield* bucket.valuesRight();
            }
        }
    }
}

/**
 * @private
 */
export class HamtBuckets {
    constructor(map, parent, depth, shift) {
        this.map = map;
        this.parent = parent;
        this.buckets = [];
        this.size = 0;
        this.idxFlags = 0;
        this.depth = depth;
        this.shift = shift;
    }

    hashConflicts() {
        return false;
    }

    clear() {
        this.size = 0;
        this.buckets = [];
        this.idxFlags = 0;
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

    replacing(oldBucket) {
        const new_flag = 1 << ((oldBucket.hash >>> this.shift) & MASK_HAMT);
        this.idxFlags |= new_flag;
        // shift the old bucket up a level. no need to splice its always going to be the first item.
        this.buckets[0] = oldBucket;
        this.size = oldBucket.size;
        oldBucket.parent = this;
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
                bucket = new HamtBuckets(this.map, this, this.depth - 1, this.shift + SHIFT_HAMT)
                    .replacing(bucket);
                this.buckets[idx] = bucket;
            }
            this.size -= bucket.size;
            bucket.set(key, value, options);
            this.size += bucket.size;
        } else {
            bucket = this.map.createContainer(this, hash);
            bucket.createEntry(key, value,options);
            this.buckets.splice(idx, 0, bucket);
            this.idxFlags |= flag;
            this.size += 1;
        }
    }

    emplace(key, handler, options) {
        const hash = options.hash;
        const idxFlags = this.idxFlags;
        const hashIdx = (hash >>> this.shift) & MASK_HAMT;
        const flag = 1 << hashIdx;
        const idx = hammingWeight(idxFlags & (flag - 1));
        let bucket;
        if (idxFlags & flag) {
            bucket = this.buckets[idx];
            if (this.depth && bucket.hashConflicts(hash)) {
                bucket = new HamtBuckets(this.map, this, this.depth - 1, this.shift + SHIFT_HAMT)
                    .replacing(bucket);
                this.buckets[idx] = bucket;
            }
        } else {
            bucket = this.map.createContainer(this, hash);
            this.buckets.splice(idx, 0, bucket);
            this.idxFlags |= flag;
        }
        this.size -= bucket.size;
        const value = bucket.emplace(key, handler, options);
        this.size += bucket.size;
        return value;
    }

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
                    } else if (this.buckets.length === idx+1) {
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
            yield* bucket;
        }
    }

    * entriesRight() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            yield* this.buckets[idx].entriesRight();
        }
    }

    * keys() {
        for (const bucket of this.buckets) {
            yield* bucket.keys();
        }
    }

    * values() {
        for (const bucket of this.buckets) {
            yield* bucket.values();
        }
    }
    * keysRight() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            yield* this.buckets[idx].keysRight();
        }
    }

    * valuesRight() {
        for (let idx = this.buckets.length - 1; idx >= 0; idx--) {
            yield* this.buckets[idx].valuesRight();
        }
    }
}

