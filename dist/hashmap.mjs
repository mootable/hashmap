/**
 * Utils - Utility functions
 * @namespace Mootable.Utils
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * Is the passed value not null and a function
 * @param func
 * @returns {boolean}
 */
function isFunction(func) {
    return !!(func && func.constructor && func.call && func.apply);
}

/**
 * Is the passed object iterable
 * @param iterable
 * @return {boolean}
 */
function isIterable(iterable) {
    return !!(iterable && isFunction(iterable[Symbol.iterator]));
}

/**
 * Is the passed value not null and a string
 * @param str
 * @returns {boolean}
 */
function isString(str) { // jshint ignore:line
    return !!(str && (typeof str === 'string' || str instanceof String));
}

/**
 * sameValueZero is the equality method used by Map, Array, Set etc.
 * The only difference between === and sameValueZero is that NaN counts as equal on sameValueZero
 * @see {@link https://262.ecma-international.org/6.0/#sec-samevaluezero saveValueZero}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to {@link https://262.ecma-international.org/6.0/#sec-samevaluezero ECMA Spec for Same Value Zero}
 */
function sameValueZero(x, y) {
    return x === y || (Number.isNaN(x) && Number.isNaN(y));
}

/**
 * The strict Equals method <code>===</code>.
 * Simply does a strict equality comparison <code>===</code> against 2 values
 * @see {@link https://262.ecma-international.org/6.0/#sec-strict-equality-comparison strictEquals}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to {@link https://262.ecma-international.org/6.0/#sec-strict-equality-comparison ECMA Spec for Strict Equality}
 */
function strictEquals(x, y) {
    return x === y;
}

/**
 * Option - a class to get round nullable fields.
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * A representation of a value, that might be or might not be null.
 * - Options are immutable, once set, it can't be changed.
 * - Options are iterable
 *   - If using a for loop.
 *     - If it has a value the loop will execute just once.
 *     - If it doesn't have a value the loop will not execute
 * @example <caption>iterating over some</caption>
 * const opt = Option.some("hello");
 * for (value of opt) {
 *    // loops once.
 *    console.log(opt);
 * }
 * console.log("world");
 * // logs - hello\nworld
 * @example <caption>iterating over none</caption>
 * const opt = Option.none;
 * for (value of opt) {
 *   // does not loop.
 *    console.log(opt);
 * }
 * console.log("world");
 * // logs - world
 */
class Option {

    /**
     * Usage of this constructor should generally be avoided,
     * - instead use the some or none method on Option,
     * - or the some or none exported functions provided with this javascript file.
     * This constructor makes the Option immutable and inextensible.
     * @see none
     * @see some
     * @param has - whether it contains a value or not.
     * @param value - the value to set
     */
    constructor(has, value) {
        this.has = has;
        this.value = value;
        Object.freeze(this);
    }

    /**
     * A constant representation of an Option with nothing in it:
     * <code>{value:undefined,has:false}</code>
     * @example <caption>create an option using none</caption>
     * const option = Option.none;
     * // option.has === false
     * // option.value === undefined
     * // option.size === 0
     * @type {Option}
     */
    static get none() {
        return none;
    }

    /**
     * Return the size of this option.
     *  - 1 if it has a value
     *  - 0 if it doesn't
     * @return {number}
     */
    get size() {
        return this.has ? 1 : 0;
    }


    /**
     * When called with a value returns an Option object of the form:
     * <code>{value:value,has:true}</code>
     * Even if a value is not provided it still counts as existing, this is different from other libraries,
     * we are effectively saying, null and undefined count as valid values.
     * @example <caption>create an option using some</caption>
     * const myValue = 'hello';
     * const option = Option.some(myValue);
     * // option.has === true
     * // option.value === 'hello'
     * // option.size === 1
     * @param value - the value
     * @return {Option} - the option in the form <code>{value:value,has:true}</code>
     */
    static some(value) {
        return some(value);
    }

    /**
     * Provides an iterable for the Option
     * If using a for loop.
     * - If it has a value the loop will execute just once.
     * - If it doesn't have a value the loop will not execute
     * @example <caption>iterating over some</caption>
     * const opt = Option.some("hello");
     * for (value of opt) {
     *    // loops once.
     *    console.log(opt);
     * }
     * console.log("world");
     * // logs - hello\nworld
     * @example <caption>iterating over none</caption>
     * const opt = Option.none;
     * for (value of opt) {
     *   // does not loop.
     *    console.log(opt);
     * }
     * console.log("world");
     * // logs - world
     * @return {Generator<*, void, *>}
     */
    * [Symbol.iterator]() {
        if (this.has) {
            yield this.value;
        }
    }
}

/**
 * A function that when called with a value returns an Option object of the form:
 * <code>{value:value,has:true}</code>
 * Even if a value is not provided it still counts as existing, this is different from other libraries,
 * we are effectively saying as null and undefined count as valid values.
 * @example  <caption>create an option using some</caption>
 * const myValue = 'hello';
 * const option = some(myValue);
 * // option.has === true
 * // option.value === 'hello'
 * // option.size === 1
 * @type {function(*=): Option}
 */
const some = (value) => new Option(true, value);

/**
 * A constant representation of an Option with nothing in it:
 * <code>{value:undefined,has:false}</code>
 * @example <caption>create an option using none</caption>
 * const option = none;
 * // option.has === false
 * // option.value === undefined
 * // option.size === 0
 * @type {Option}
 */
const none = new Option(false, undefined);

/**
 * Hash - Hash functions
 * @namespace Mootable.Hash
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * Modified Murmur3 hash generator, with capped lengths.
 * This is NOT a cryptographic hash, this hash is designed to create as even a spread across a 32bit integer as is possible.
 * @see {@link https://github.com/aappleby/smhasher|MurmurHash specification on Github}
 * @see {@link https://en.wikipedia.org/wiki/MurmurHash|MurmurHash on Wikipedia}
 * @param key the string being hashed
 * @param len the max limit on the number of characters to hash
 * @param seed an optional random seed, or previous hash value to continue hashing against.
 * @returns {number} the hash
 */
function hash(key, len = 0, seed = 0) {
    len = len > 0 ? Math.min(len, key.length) : key.length;
    seed |= 0;
    const remaining = len & 1;
    const doubleBytes = len - remaining;
    let hash = seed, k = 0, i = 0;

    while (i < doubleBytes) {
        k = (key.charCodeAt(i++) & 0xffff) |
            ((key.charCodeAt(i++) & 0xffff) << 16);
        k *= 0xcc9e2d51;
        k = (k << 15) | (k >>> 17);
        k *= 0x1b873593;
        hash ^= k;
        hash = (hash << 13) | (hash >>> 19);
        hash *= 5;
        hash += 0xe6546b64;
    }
    if (remaining) {
        k ^= (key.charCodeAt(i) & 0xffff);

        k *= 0xcc9e2d51;
        k = (k << 15) | (k >>> 17);
        k *= 0x1b873593;
        hash ^= k;
    }

    hash ^= len;
    hash ^= hash >>> 16;
    hash *= 0x85ebca6b;
    hash ^= hash >>> 13;
    hash *= 0xc2b2ae35;
    hash ^= hash >>> 16;
    return hash | 0;
}

/**
 * Given any object return back a hashcode
 * - If the key is undefined, null, false, NaN, infinite etc then it will be assigned a hash of 0.
 * - If it is a primitive such as string, number bigint it either take the numeric value, or the string value, and hash that.
 * - if it is a function, symbol or regex it hashes their string values.
 * - if it is a date, it uses the time value as the hash.
 * Otherwise
 * - If it has a hashCode function it will execute it, passing the key as the first and only argument. It will call this function again on its result.
 * - If it has a hashCode attribute it will call this function on it.
 * - If it can't do any of the above, it will assign a randomly generated hashcode, to the key using a hidden property.
 *
 * As with all hashmaps, there is a contractual equivalence between hashcode and equals methods,
 * in that any object that equals another, should produce the same hashcode.
 *
 * @param {*} key - the key to get the hash code from
 * @return {number} - the hash code.
 */
function hashCodeFor(key) {
    const keyType = typeof key;
    switch (keyType) {
        case 'undefined':
            return 0;
        case 'boolean':
            return key ? 1 : 0;
        case 'string':
            return hash(key);
        case 'number':
            if (!Number.isFinite(key)) {
                return 0;
            }
            if (Number.isSafeInteger(key)) {
                return key | 0;
            }
            return hash(key.toString());
        case 'bigint':
        case 'symbol':
        case 'function':
            return hash(key.toString());
        case 'object':
        default: {
            if (key === null) {
                return 0;
            }
            if (key.hashCode) {
                if (isFunction(key.hashCode)) {
                    return hashCodeFor(key.hashCode(key));
                }
                return hashCodeFor(key.hashCode);
            }


            // Regexes and Dates we treat like primitives.
            if (key instanceof Date) {
                return key.getTime();
            }
            if (key instanceof RegExp) {
                return hash(key.toString());
            }

            // Options we work on the values.
            if (key instanceof Option) {
                if (key.has) {
                    return 31 * hashCodeFor(key.value);
                }
                return 0;
            }

            // Hash of Last Resort, ensure we don't consider any objects on the prototype chain.
            if (Object.prototype.hasOwnProperty.call(key, '_mootable_hashCode')) {
                // its our special number, but just in case someone has done something a bit weird with it.
                // Object equality at this point means that only this key instance can be used to fetch the value.
                return hashCodeFor(key._mootable_hashCode);
            }
            const hashCode = HASH_COUNTER++;
            // unenumerable, unwritable, unconfigurable
            Object.defineProperty(key, '_mootable_hashCode', {
                value: hashCode
            });
            return hashCode;
        }
    }
}

/**
 * an internal counter for managing unhashable objects.
 * @private
 * @ignore
 * @type {number}
 */
let HASH_COUNTER = 0;

/**
 * Given a key, produce an equals method that fits the hashcode contract.
 * - In almost all cases it will return with ECMASpec sameValueZero method. As is the case with native map, set and array.
 * - If it is a regex, it compares the type, and the string values.
 * - If it is a date, it compares the type, and the time values.
 * - If it is an option, it compares if they both have values, and then the values.
 * - If it has an equals function and that equals function when comapring 2 keys, return true. then it will use that.
 *   - The function can either be in the form <code>key.equals(other)</code>, or <code>key.equals(other,key)</code> in the case of static-like functions.
 *
 * The expectation and requirement is this key will always be the first argument to the method, the behaviour maybe unexpected if parameters are reversed.
 *
 * As with all hashmaps, there is a contractual equivalence between hashcode and equals methods,
 * in that any object that equals another, should produce the same hashcode.
 *
 * @param {*} key - the key to get the hash code from
 * @return {(function(*, *): boolean)} - an equals function for 2 keys.
 */
function equalsFor(key) {
    // Regexes and Dates we treat like primitives.
    switch (typeof key) {
        case 'object':
            if (key) {
                if (key instanceof RegExp) {
                    return (me, them) => {
                        if (them instanceof RegExp) {
                            return me.toString() === them.toString();
                        }
                        return false;
                    };
                } else if (key instanceof Date) {
                    return (me, them) => {
                        if (them instanceof Date) {
                            return me.getTime() === them.getTime();
                        }
                        return false;
                    };
                } else if (key instanceof Option) {
                    if (key.has) {
                        const valueEquals = equalsFor(key.value);
                        return (me, them) => {
                            if (them.has) {
                                return valueEquals(me.value, them.value);
                            }
                            return false;
                        };
                    } else {
                        return (me, them) => !them.has;
                    }
                } else if (isFunction(key.equals)) {
                    return (me, them) => me.equals(them, me);
                }
            }
            return strictEquals;
        case 'number':
        case 'bigint':
            return sameValueZero;
        default:
            return strictEquals;
    }
}

/**
 * Given any object return back a hashcode
 * - If the key is undefined, null, false, NaN, infinite etc then it will be assigned a hash of 0.
 * - If it is a primitive such as string, number bigint it either take the numeric value, or the string value, and hash that.
 * - if it is a function, symbol or regex it hashes their string values.
 * - if it is a date, it uses the time value as the hash.
 * Otherwise
 * - If it has a hashCode function it will execute it, passing the key as the first and only argument. It will call this function again on its result.
 * - If it has a hashCode attribute it will call this function on it.
 * - If it can't do any of the above, it will assign a randomly generated hashcode, to the key using a hidden property.
 *
 * As with all hashmaps, there is a contractual equivalence between hashcode and equals methods,
 * in that any object that equals another, should produce the same hashcode.
 *
 * @param {*} key - the key to get the hash code from
 * @return {{hash: number, equals: function}} - the hash code and equals function.
 */
function equalsAndHash(key, options) {
    if (options) {
        let hash = options.hash;
        let equals = options.equals;
        if (isFunction(hash)) {
            hash = hash(key);
        }
        if (!Number.isSafeInteger(hash)) {
            hash = hashCodeFor(key);
        }
        if (!isFunction(equals)) {
            equals = equalsFor(key);
        }
        return {hash, equals};
    }

    const toSetOn = {};
    const keyType = typeof key;
    switch (keyType) {
        case 'undefined':
            toSetOn.hash = 0;
            toSetOn.equals = strictEquals;
            return toSetOn;
        case 'boolean':
            toSetOn.hash = key ? 1 : 0;
            toSetOn.equals = strictEquals;
            return toSetOn;
        case 'string':
            toSetOn.hash = hash(key);
            toSetOn.equals = strictEquals;
            return toSetOn;
        case 'number':
            if (!Number.isFinite(key)) {
                toSetOn.hash = 0;
                toSetOn.equals = sameValueZero;
                return toSetOn;
            }
            if (Number.isSafeInteger(key)) {
                toSetOn.hash = key | 0;
                toSetOn.equals = sameValueZero;
                return toSetOn;
            }
            toSetOn.hash = hash(key.toString());
            toSetOn.equals = sameValueZero;
            return toSetOn;
        case 'bigint':
            toSetOn.hash = hash(key.toString());
            toSetOn.equals = sameValueZero;
            return toSetOn;
        case 'symbol':
        case 'function':
            toSetOn.hash = hash(key.toString());
            toSetOn.equals = strictEquals;
            return toSetOn;
        case 'object':
        default: {
            if (key === null) {
                toSetOn.hash = 0;
                toSetOn.equals = strictEquals;
                return toSetOn;
            }
            toSetOn.equals = equalsFor(key);
            if (key.hashCode) {
                if (isFunction(key.hashCode)) {
                    toSetOn.hash = hashCodeFor(key.hashCode(key));
                    return toSetOn;
                } else {
                    toSetOn.hash = hashCodeFor(key.hashCode);
                    return toSetOn;
                }
            }

            // Regexes and Dates we treat like primitives.
            if (key instanceof Date) {
                toSetOn.hash = key.getTime();
                return toSetOn;
            }
            if (key instanceof RegExp) {
                toSetOn.hash = hash(key.toString());
                return toSetOn;
            }

            // Options we work on the values.
            if (key instanceof Option) {
                if (key.has) {
                    toSetOn.hash = 31 * hashCodeFor(key.value);
                    return toSetOn;
                }
                toSetOn.hash = 0;
                return toSetOn;
            }

            // Hash of Last Resort, ensure we don't consider any objects on the prototype chain.
            if (Object.prototype.hasOwnProperty.call(key, '_mootable_hashCode')) {
                // its our special number, but just in case someone has done something a bit weird with it.
                // Object equality at this point means that only this key instance can be used to fetch the value.
                toSetOn.hash = hashCodeFor(key._mootable_hashCode);
                return toSetOn;
            }
            const hashCode = HASH_COUNTER++;
            // unenumerable, unwritable, unconfigurable
            Object.defineProperty(key, '_mootable_hashCode', {
                value: hashCode
            });
            toSetOn.hash = hashCode;
            return toSetOn;
        }
    }
}

/**
 * HashMap - HashMap Container Implementation for JavaScript
 * @namespace Mootable.HashMap
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * Using an array this container stores key value pairs for our map.
 * This collection of entries is a leaf node of our Hash Array Trie.
 * As such all entries in the container will have the same hash. In most cases this will be single entry.
 * @private
 */
class Container {

    /**
     * Constructs an empty container.
     *
     * @param [HashMap] map - the map this container belongs too.
     * @param hash - the hash code for the keys in this container.
     */
    constructor(map, parent, hash) {
        this.size = 0;
        this.contents = [];
        this.map = map;
        this.parent = parent;
        this.hash = hash;
    }

    /**
     * Does the provided hash conflict with this one, i.e. is it different.
     * This is used for ensuring only the correct keys are added.
     *
     * @param hash
     * @return {boolean}
     */
    hashConflicts(hash) {
        return hash !== this.hash;
    }

    /**
     * Used to fetch the key and value.
     *
     * @param {*} key the key we use to retrieve the value.
     * @param options must contain the equals function for this key.
     * @return {*|undefined} the value for the key, or undefined if none available.
     */
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
                this.updateEntry(entry, value, options);
                return;
            }
        }
        this.createEntry(key, value, options);
    }

    emplace(key, handler, options) {
        const equals = options.equals;
        for (const entry of this.contents) {
            if (equals(key, entry[0])) {
                const value = 'update' in handler ? handler.update(entry[1], key, this.map)
                    : handler.insert(key, this.map);
                this.updateEntry(entry, value, options);
                return value;
            }
        }
        const value = handler.insert(key, this.map);
        this.createEntry(key, value, options);
        return value;
    }

    createEntry(key, value) {
        const entry = [key, value];
        entry.parent = this;
        this.contents.push(entry);
        this.size += 1;
        return entry;
    }

    updateEntry(entry, newValue) {
        entry[1] = newValue;
    }

    deleteEntry(entry) {
        const idx = this.contents.indexOf(entry);
        if (idx !== -1) {
            this.deleteIndex(idx);
            let parent = this.parent;
            while (parent) {
                parent.size -= 1;
                parent = parent.parent;
            }
        }
    }

    deleteIndex(idx) {
        this.size -= 1;
        if (idx === 0) {
            return this.contents.shift();
        } else if (idx === this.size) {
            return this.contents.pop();
        } else {
            return this.contents.splice(idx, 1)[0];
        }
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
        this.deleteIndex(idx);
        return true;
    }

    * [Symbol.iterator]() {
        for (const entry of this.contents) {
            yield entry.slice();
        }
    }

    * entriesRight() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            yield this.contents[idx].slice();
        }
    }

    * keys() {
        for (const entry of this.contents) {
            yield entry[0];
        }
    }

    * values() {
        for (const entry of this.contents) {
            yield entry[1];
        }
    }

    * keysRight() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            yield this.contents[idx][0];
        }
    }

    * valuesRight() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            yield this.contents[idx][1];
        }
    }
}

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
 */
class HashBuckets {
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
class HamtBuckets {
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

/**
 * Counts the number of ones in a 32 bit integer.
 *
 * @param {number} flags 32 bit integet
 * @return {number} amount of ones.
 */
const hammingWeight = (flags) => {
    flags -= ((flags >>> 1) & 0x55555555);
    flags = (flags & 0x33333333) + ((flags >>> 2) & 0x33333333);
    return ((flags + (flags >> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
};

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * This HashMap is backed by a Hash array mapped trie.
 *
 */
class HashMap {

    /**
     * This HashMap is backed by a Hash array mapped trie.
     * - `new HashMap()` creates an empty hashmap
     * - `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
     *   - One of
     *      - an object that provides a [Symbol.Iterator] function with the same signature as `Map.[Symbol.Iterator]`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *          - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *      - an object that provides a entries function with the same signature as `Map.entries`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *
     * Although this hashmap has no fixed guarantee on how it orders its elements, it does
     * maintain an order, undecipherable as it maybe, first by hashcode, and then by by order of
     * insertion. As such methods that iterate forwards and the equivalent backwards (Right)
     * methods are correct in the order of which values returned, and are in reverse to one another.
     *
     * However these reverse methods are more valuable when used on an ordered map such as the
     * {@link LinkedHashMap}, which maintains and provides control for the order of insertion.
     *
     * @example <caption>Create an empty HashMap</caption>
     * const hashmap = new HashMap();
     * // hashmap.size === 0;
     * @example <caption>Create HashMap from an array of key value pairs</caption>
     * const arr = [[1,'value1'],[2,'value2'],[3,'value3']];
     * const hashmap = new HashMap(arr);
     * // hashmap.size === 3;
     * @example <caption>Create HashMap from another map</caption>
     * const map = new Map([[1,'value1'],[2,'value2'],[3,'value3']])
     * const hashmap = new HashMap(map);
     * // hashmap.size === 3;
     * @example <caption>Create HashMap from another HashMap</caption>
     * const first = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']])
     * const hashmap = new HashMap(first);
     * // hashmap.size === 3;
     * @example <caption>Create HashMap from a class with symbol iterator</caption>
     * class MyIterable = {
     *     *[Symbol.iterator] () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const iterable = new MyIterable();
     * const hashmap = new HashMap(iterable);
     * // hashmap.size === 4;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>Create HashMap from an object with an entries generator function</caption>
     * const entriesObj = {
     *     entries: function* () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const hashmap = new HashMap(entriesObj);
     * // hashmap.size === 4;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>Create HashMap from an object with a forEach function</caption>
     * const forEachObj = {
     *      forEach: (callback, ctx) => {
     *              for (let i = 1; i <= 4; i++) {
     *                  callback.call(ctx, 'value' + i, 'key' + i);
     *              }
     *      }
     * };
     * const hashmap = new HashMap(forEachObj);
     * // hashmap.size === 4;
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|ObjectWithForEach.<function(function(value, key))>|ObjectWithEntries.<function>)}[copy]
     */
    constructor(copy) {
        this.buckets = new HashBuckets(this);
        if (copy) {
            this.copy(copy);
        }
    }

    /**
     * User Defined Equals Method
     * A user defined function to define an equals method against 2 keys.
     * @callback HashMap#overrideEquals
     * @param {*} firstKey - the first key.
     * @param {*} secondKey - the second key
     * @returns {boolean} is it equal or not
     */

    /**
     * User Defined Hash Method
     * A user defined function to describe how to hash a key.
     * @callback HashMap#overrideHash
     * @param {*} key - the first key.
     * @returns {number} a 32 bit integer as a hash.
     */

    /**
     * User defined hashing and equals methods
     * HashMap will find the best fit for your objects, and if your keys themselves have the appropriate methods,
     * then it will use them. However if you want to override that functionality this object allows you to do it.
     * Not all functions and properties are used in every function, please refer to that function for details.
     * If a function in future chooses to use one of the other properties or functions, it will NOT be marked as a breaking change.
     * So be explicit.
     * @typedef {Object} HashMap#overrides
     * @property {number|HashMap#overrideHash} [hash] - The overriding hash value, or method to use.
     * @property {HashMap#overrideEquals} [equals] - The overriding equals method to use
     * @property {boolean} [reverse] - whether to search in reverse.
     */

    /**
     * For Each Function
     * A callback to execute on every <code>[key,value]</code> pair of this map iterable.
     * @example <caption>log the keys and values</caption>
     * const forEachFunction = (value, key) => console.log(key,value)
     * @callback HashMap#ForEachCallback
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {HashMap} [map] - the calling Map Iterable.
     */

    /**
     * Test each element of the map to see if it matches and return
     *  - true if the key and value match.
     *  - false if it doesn't.
     * @example <caption>Only match keys divisible by 2</caption>
     * const myMatchPredicate = (value, key) => key % 2 === 0;
     * @example <caption>Only match values which are equal to another key in the map</caption>
     * const myMatchPredicate = (value, key, mapIterable) => mapIterable.has(value);
     * @example <caption>An alternative implementation, (but potentially slower, and assumes no undefined value)</caption>
     * const myMatchPredicate = (value, key, mapIterable) => mapIterable.indexOf(key) !== undefined;
     * @callback HashMap#MatchesPredicate
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {HashMap} [iterable] - the HashMap.
     * @return {boolean} a value that coerces to true if it matches, or to false otherwise.
     */

    /**
     * Reduce Function
     * A callback to accumulate values from the HashMap <code>[key,value]</code> into a single value.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
     * @example <caption>add all the keys</caption>
     * const reduceFunction = (accumulator, value, key) => accumulator+key
     * @callback HashMap#ReduceFunction
     * @param {*} [accumulator] - the value from the last execution of this function.
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {HashMap} [hashmap] - the calling HashMap.
     * @return {*} [accumulator] - the value to pass to the next time this function is called or the final return value.
     */

    /**
     * Returns the number of elements in this hashmap.
     *
     * @example
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const size = hashmap.size;
     * console.log(size);
     * // logs: 3
     * @return {number} the number of elements in the array
     */
    get size() {
        return this.buckets.size;
    }

    /**
     * Returns the number of elements in this hashmap.
     *
     * @example
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const length = hashmap.length;
     * console.log(length);
     * // logs: 3
     * @return {number} the number of elements in the array
     */
    get length() {
        return this.buckets.size;
    }

    /**
     * Does the map have this key.
     * - return true if the <code>key</code> is in the map.
     * - if no elements match, it returns false.
     * - it is legitimate for keys to be null or undefined.
     *
     * Maps typically index keys, and so is generally a fast operation.
     * @example <caption>>Does this contain a key that is there</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hasResult = hashmap.has(1);
     * // hasResult === true
     * @example <caption>Does this contain a key that isn't there</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hasResult = hashmap.has(4);
     * // hasResult === false
     * @example <caption>Advanced: using a predefined hashCode and equals on the key</caption>
     * class NameKey {
     *     constructor(firstName, secondName) {
     *         this.firstName = firstName;
     *         this.secondName = secondName;
     *     }
     *     hashCode() {
     *          return (Mootable.hash(firstName) * 31) +Mootable.hash(secondName);
     *     }
     *     equals(other) {
     *          return other && other instanceof NameKey && other.firstName === this.firstName && other.secondName === this.secondName;
     *     }
     * }
     * const hashmap = new HashMap([[new NameKey('John','Smith'),'Librarian'],[new NameKey('Orlando','Keleshian'),'Engineer']]);
     * const key = new NameKey('John','Smith');
     * const hasResult = hashmap.has(key);
     * // hasResult === true
     * @example <caption>Advanced: using a custom hash and equals, to determine if there are entries for a specific hash</caption>
     * const myHash = 3;
     * const hashEquals = {hash: myHash, equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hasResult = hashmap.has(0, hashEquals);
     * // hasResult === true
     * // the hash of the number 3 is actually also 3. all 32 bit integers have the same hash.
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has|Map.has}
     * @param {*} key - the matching key we use to identify if we have a match.
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hash and equals methods, rather than them being looked up.
     * @returns {boolean} - if it holds the key or not.
     */
    has(key, overrides) {
        const op = equalsAndHash(key, overrides);
        return this.buckets.has(key, op);
    }

    /**
     * Get a value from the map using this key.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches the key.
     * - if no elements match, it returns undefined.
     * - it is legitimate for keys to be null or undefined, and if set, will find a value.
     * - it is also legitimate for values to be null or undefined, as such get should never be used as an existence check. {@see HashMap#optionalGet}
     * Also provides a way to override both the equals and the hash
     * Performance:
     *  - will be O(1) approaching O(log n)
     * @example <caption>>What is the value for a key</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.get(1);
     * // getResult === 'value1'
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.get(4);
     * // getResult === undefined
     * @example <caption>Advanced: using a predefined hashCode and equals on the key</caption>
     * class NameKey {
     *     constructor(firstName, secondName) {
     *         this.firstName = firstName;
     *         this.secondName = secondName;
     *     }
     *     hashCode() {
     *          return (Mootable.hash(firstName) * 31) +Mootable.hash(secondName);
     *     }
     *     equals(other) {
     *          return other && other instanceof NameKey && other.firstName === this.firstName && other.secondName === this.secondName;
     *     }
     * }
     * const hashmap = new HashMap([[new NameKey('John','Smith'),'Librarian'],[new NameKey('Orlando','Keleshian'),'Engineer']]);
     * const key = new NameKey('John','Smith');
     * const getResult = hashmap.get(key);
     * // getResult === 'Librarian'
     * @example <caption>Advanced: using a custom hash and equals, to get the first entry for a specific hash</caption>
     * const myHash = 3;
     * const hashEquals = {hash: myHash, equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.get(0, hashEquals);
     * // getResult === 'value3'
     * // the hash of the number 3 is actually also 3. all 32 bit integers have the same hash.
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get|Map.get}
     * @param {*} key - the matching key we use to identify if we have a match.
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {*} - the value of the element that matches.
     */
    get(key, overrides) {
        const op = equalsAndHash(key, overrides);
        return this.buckets.get(key, op);
    }

    /**
     * Get the key from the map using the provided value. Since values are not hashed, this has to check each value in the map until a value matches, or the whole map, if none match. As such this is a slow operation.
     * Performance O(n) as we have to iterate over the whole map, to find each value and perform
     * an equality against it.
     * @example <caption>>What is the key for a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const keyOfResult = hashmap.keyOf('value2');
     * // keyOfResult === 2
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const keyOfResult = hashmap.keyOf('value4');
     * // keyOfResult === undefined
     * @example <caption>Advanced: using a predefined hashCode and equals on the key</caption>
     * class NameKey {
     *     constructor(firstName, secondName) {
     *         this.firstName = firstName;
     *         this.secondName = secondName;
     *     }
     *     hashCode() {
     *          return (Mootable.hash(firstName) * 31) +Mootable.hash(secondName);
     *     }
     *     equals(other) {
     *          return other && other instanceof NameKey && other.firstName === this.firstName && other.secondName === this.secondName;
     *     }
     * }
     * const hashmap = new HashMap([[new NameKey('John','Smith'),'Librarian'],[new NameKey('Orlando','Keleshian'),'Engineer']]);
     * const keyOfResult = hashmap.keyOf('Engineer');
     * // getResult ~ NameKey('Orlando','Keleshian')
     * @example <caption>Advanced: using a custom equals, to get the first key in the
     * hashmap</caption>
     * const myEquals = {equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const keyOfResult = hashmap.keyOf(0, myEquals);
     * // keyOfResult === 1
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @param {*} value - The value we are searching the map for
     * @param {HashMap#overrides<equals>} [overrides] - an optional override to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {*|undefined} the first key for this value or undefined
     */
    keyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : equalsFor(value);
        for (const entry of this.entries()) {
            if (equals(value, entry[1])) {
                return entry[0];
            }
        }
        return undefined;
    }

    /**
     * Get the key from the map using the provided value, searching the map in reverse. Since values
     * are not hashed, this has to check each value in the map until a value matches, or the
     * whole map, if none match. As such this is a slow operation.
     * Performance O(n) as we have to iterate over the whole map, to find each value and perform
     * an equality against it.
     * @example <caption>>What is the key for a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const lastKeyOfResult = hashmap.lastKeyOf('value2');
     * // lastKeyOfResult === 2
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const lastKeyOfResult = hashmap.lastKeyOf('value4');
     * // lastKeyOfResult === undefined
     * @example <caption>Advanced: using a predefined hashCode and equals on the key</caption>
     * class NameKey {
     *     constructor(firstName, secondName) {
     *         this.firstName = firstName;
     *         this.secondName = secondName;
     *     }
     *     hashCode() {
     *          return (Mootable.hash(firstName) * 31) +Mootable.hash(secondName);
     *     }
     *     equals(other) {
     *          return other && other instanceof NameKey && other.firstName === this.firstName && other.secondName === this.secondName;
     *     }
     * }
     * const hashmap = new HashMap([[new NameKey('John','Smith'),'Librarian'],[new NameKey('Orlando','Keleshian'),'Engineer']]);
     * const lastKeyOfResult = hashmap.lastKeyOf('Engineer');
     * // getResult ~ NameKey('Orlando','Keleshian')
     * @example <caption>Advanced: using a custom equals, to get the last key in the
     * hashmap</caption>
     * const myEquals = {equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const lastKeyOfResult = hashmap.lastKeyOf(0, myEquals);
     * // lastKeyOfResult === 3
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @param {*} value - The value we are searching the map for, (in reverse)
     * @param {HashMap#overrides<equals>} [overrides] - an optional override to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {*|undefined} the last key for this value or undefined
     */
    lastKeyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : equalsFor(value);
        for (const entry of this.entriesRight()) {
            if (equals(value, entry[1])) {
                return entry[0];
            }
        }
        return undefined;
    }

    /**
     * Get the key from the map using the provided value, and wrap it in an {@link Option}.
     * Since values are not hashed, this has to check each value in the map until a value
     * matches, or the whole map, if none match. As such this is a slow operation.
     * Performance O(n) as we have to iterate over the whole map, to find each value and perform
     * an equality against it.
     * @example <caption>>What is the key for a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalKeyOfResult = hashmap.optionalKeyOf('value2');
     * // optionalKeyOfResult === Option.some(2)
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalKeyOfResult = hashmap.optionalKeyOf('value4');
     * // optionalKeyOfResult === Option.none
     * @example <caption>Advanced: using a predefined hashCode and equals on the key</caption>
     * class NameKey {
     *     constructor(firstName, secondName) {
     *         this.firstName = firstName;
     *         this.secondName = secondName;
     *     }
     *     hashCode() {
     *          return (Mootable.hash(firstName) * 31) +Mootable.hash(secondName);
     *     }
     *     equals(other) {
     *          return other && other instanceof NameKey && other.firstName === this.firstName && other.secondName === this.secondName;
     *     }
     * }
     * const hashmap = new HashMap([[new NameKey('John','Smith'),'Librarian'],[new NameKey('Orlando','Keleshian'),'Engineer']]);
     * const optionalKeyOfResult = hashmap.optionalKeyOf('Engineer');
     * // getResult ~ Option.some(NameKey('Orlando','Keleshian'))
     * @example <caption>Advanced: using a custom equals, to get the first key in the
     * hashmap</caption>
     * const myEquals = {equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalKeyOfResult = hashmap.optionalKeyOf(0, myEquals);
     * // optionalKeyOfResult === Option.some(1)
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @param {*} value - The value we are searching the map for
     * @param {HashMap#overrides<equals>} [overrides] - an optional overrides to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {Option} the first key for this value or none
     */
    optionalKeyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : equalsFor(value);
        for (const entry of this.entries()) {
            if (equals(value, entry[1])) {
                return some(entry[0]);
            }
        }
        return none;
    }

    /**
     * Get the key from the map using the provided value, searching the map in reverse. Since values
     * are not hashed, this has to check each value in the map until a value matches, or the
     * whole map, if none match. As such this is a slow operation.
     * Performance O(n) as we have to iterate over the whole map, to find each value and perform
     * an equality against it.
     * @example <caption>>What is the key for a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalLastKeyOfResult = hashmap.optionalLastKeyOf('value2');
     * // optionalLastKeyOfResult === Option.some(2)
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalLastKeyOfResult = hashmap.optionalLastKeyOf('value4');
     * // optionalLastKeyOfResult === Option.none
     * @example <caption>Advanced: using a predefined hashCode and equals on the key</caption>
     * class NameKey {
     *     constructor(firstName, secondName) {
     *         this.firstName = firstName;
     *         this.secondName = secondName;
     *     }
     *     hashCode() {
     *          return (Mootable.hash(firstName) * 31) +Mootable.hash(secondName);
     *     }
     *     equals(other) {
     *          return other && other instanceof NameKey && other.firstName === this.firstName && other.secondName === this.secondName;
     *     }
     * }
     * const hashmap = new HashMap([[new NameKey('John','Smith'),'Librarian'],[new NameKey('Orlando','Keleshian'),'Engineer']]);
     * const optionalLastKeyOfResult = hashmap.optionalLastKeyOf('Engineer');
     * // getResult ~ Option.some(NameKey('Orlando','Keleshian'))
     * @example <caption>Advanced: using a custom equals, to get the last key in the
     * hashmap</caption>
     * const myEquals = {equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalLastKeyOfResult = hashmap.optionalLastKeyOf(0, myEquals);
     * // optionalLastKeyOfResult === Option.some(3)
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @param {*} value - The value we are searching the map for, (in reverse)
     * @param {HashMap#overrides<equals>} [overrides] - an optional overrides to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {Option} the last key for this value or none
     */
    optionalLastKeyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : equalsFor(value);
        for (const entry of this.entriesRight()) {
            if (equals(value, entry[1])) {
                return some(entry[0]);
            }
        }
        return none;
    }

    /**
     * Get an optional value from the map. This is effectively a more efficent combination of calling has and get at the same time.
     * - return the first <code>some(value)</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns <code>none()</code>.
     * - it is legitimate for keys to be null or undefined, and if set, will still acknowledge it exists, against the key.
     *
     * Maps typically index keys, and so is generally a fast operation.
     * @example <caption>>What is the value for a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.optionalGet(1);
     * // getResult === {value:'value1',has:true}
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.optionalGet(4);
     * // getResult === {has:false}
     * @example <caption>What is the value for a key with an undefined value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,undefined],[3,'value3']]);
     * const getResult = hashmap.optionalGet(2);
     * // getResult === {value:undefined,has:true}
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get|Map.get}
     * @param {*} key - the key we use to identify if we have a match.
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {Option} - an optional result.
     */
    optionalGet(key, overrides) {
        const op = equalsAndHash(key, overrides);
        return this.buckets.optionalGet(key, op);
    }

    /**
     * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.endsWith('ue2'));
     * // findResult === 'value2'
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.startsWith('something'));
     * // findResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {HashMap#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {*} - the value of the element that matches.
     */
    find(findPredicate = () => true, thisArg = undefined) {
        for (const [key, value] of this.entries()) {
            if (findPredicate.call(thisArg, value, key, this)) {
                return value;
            }
        }
        return undefined;
    }

    /**
     * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.endsWith('ue2'));
     * // findResult === 'value2'
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.startsWith('something'));
     * // findResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {HashMap#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {*} - the value of the element that matches.
     */
    findLast(findPredicate = () => true, thisArg = undefined) {
        for (const [key, value] of this.entriesRight()) {
            if (findPredicate.call(thisArg, value, key, this)) {
                return value;
            }
        }
        return undefined;
    }

    /**
     * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.endsWith('ue2'));
     * // findResult === 'value2'
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.startsWith('something'));
     * // findResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {HashMap#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {*} - the value of the element that matches.
     */
    optionalFind(findPredicate = () => true, thisArg = undefined) {
        for (const [key, value] of this.entries()) {
            if (findPredicate.call(thisArg, value, key, this)) {
                return some(value);
            }
        }
        return none;
    }

    /**
     * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.endsWith('ue2'));
     * // findResult === 'value2'
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.startsWith('something'));
     * // findResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {HashMap#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {*} - the value of the element that matches.
     */
    optionalFindLast(findPredicate = () => true, thisArg = undefined) {
        for (const [key, value] of this.entriesRight()) {
            if (findPredicate.call(thisArg, value, key, this)) {
                return some(value);
            }
        }
        return none;
    }

    /**
     * Find the first value in the key which passes the provided  <code>MatchesPredicate</code>.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first key it finds.
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.endsWith('ue2'));
     * // findIndexResult === 2
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.startsWith('something'));
     * // findIndexResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
     * @returns {*} - the key of the element that matches..
     */
    findKey(findKeyPredicate = (value, key) => key, thisArg = undefined) {
        for (const [key, value] of this.entries()) {
            if (findKeyPredicate.call(thisArg, value, key, this)) {
                return key;
            }
        }
        return undefined;
    }

    /**
     * Find the first value in the key which passes the provided  <code>MatchesPredicate</code>.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first key it finds.
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.endsWith('ue2'));
     * // findIndexResult === 2
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.startsWith('something'));
     * // findIndexResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
     * @returns {*} - the key of the element that matches..
     */
    findLastKey(findKeyPredicate = (value, key) => key, thisArg = undefined) {
        for (const [key, value] of this.entriesRight()) {
            if (findKeyPredicate.call(thisArg, value, key, this)) {
                return key;
            }
        }
        return undefined;
    }

    /**
     * Find the first value in the key which passes the provided  <code>MatchesPredicate</code>.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first key it finds.
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.endsWith('ue2'));
     * // findIndexResult === 2
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.startsWith('something'));
     * // findIndexResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
     * @returns {*} - the key of the element that matches..
     */
    optionalFindKey(findKeyPredicate = (value, key) => key, thisArg = undefined) {
        for (const [key, value] of this.entries()) {
            if (findKeyPredicate.call(thisArg, value, key, this)) {
                return some(key);
            }
        }
        return none;
    }

    /**
     * Find the first value in the key which passes the provided  <code>MatchesPredicate</code>.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first key it finds.
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.endsWith('ue2'));
     * // findIndexResult === 2
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.startsWith('something'));
     * // findIndexResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
     * @returns {*} - the key of the element that matches..
     */
    optionalFindLastKey(findKeyPredicate = (value, key) => key, thisArg = undefined) {
        for (const [key, value] of this.entriesRight()) {
            if (findKeyPredicate.call(thisArg, value, key, this)) {
                return some(key);
            }
        }
        return none;
    }

    /**
     * Sets a value onto this map, using the key as its reference.
     *
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {HashMap}
     */
    set(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param {*} key - the key we want to key our value to
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {*} the new value
     */
    emplace(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        return this.buckets.emplace(key, handler, op);
    }

    /**
     * Copies the keys and values from the iterable, into this one.
     *
     * @param {Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|Array.<Array.<key,value>>} other - the iterable to copy
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
        throw new TypeError('HashMap.copy expects an object which is iterable, has an entries iterable function, or has a forEach function on it');
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
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     */
    delete(key, overrides) {
        const op = equalsAndHash(key, overrides);
        this.buckets.delete(key, op);
        return this;
    }

    /**
     * clears the data from this hashmap.
     * @return {HashMap}
     */
    clear() {
        this.buckets.clear();
        return this;
    }

    /**
     * Execute the provided callback on every <code>[key,value]</code> pair of this map iterable.
     * @example <caption>Log all the keys and values.</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * mapIterable.forEach((value) => console.log(key, value));
     * // will log to the console:
     * // 1 value1
     * // 2 value2
     * // 3 value3
     * // Ordering is deterministic on paper, but from a usability point of view effectively random
     * // as it is ordered by a mix of the hash of the key, and order of insertion.
     * @param {HashMap#ForEachCallback} [callback=(value, key, map) => {}]
     * @param {*} [thisArg] Value to use as <code>this</code> when executing <code>forEachCallback</code>
     * @returns {HashMap} the hashmap you are foreaching on..
     */
    forEach(callback, thisArg) {
        for (const entry of this.entries()) {
            callback.call(thisArg, entry[1], entry[0], this);
        }
        return this;
    }

    /**
     * Execute the provided callback on every <code>[key,value]</code> pair of this map iterable in reverse.
     * @example <caption>Log all the keys and values.</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * mapIterable.forEachRight((value) => console.log(key, value));
     * // will log to the console:
     * // 3 value3
     * // 2 value2
     * // 1 value1
     * // Ordering is deterministic on paper, but from a usability point of view effectively random
     * // as it is ordered by a mix of the hash of the key, and order of insertion.
     * @param {HashMap#ForEachCallback} [callback=(value, key, map) => {}]
     * @param {*} [thisArg] Value to use as <code>this</code> when executing <code>forEachCallback</code>
     * @returns {HashMap} the hashmap you are foreaching on..
     */
    forEachRight(callback, thisArg) {
        for (const entry of this.entriesRight()) {
            callback.call(thisArg, entry[1], entry[0], this);
        }
        return this;
    }

    /**
     * Test to see if ALL elements pass the test implemented by the passed <code>MatchesPredicate</code>.
     * - if any element does not match, returns false
     * - if all elements match, returns true.
     * - if no elements match, returns false.
     * - if the iterable is empty, returns true. (irrespective of the predicate)
     * - if no predicate is provided, returns true.
     *
     * @example <caption>Do all values start with value. (yes)</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const everyResult = hashmap.every((value) => value.startsWith('value'));
     * // everyResult === true
     * @example <caption>Do all values start with value. (no)</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'doesntStart'],[3,'value3']]);
     * const everyResult = hashmap.every((value) => value.startsWith('value'));
     * // everyResult === false
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every|Array.every}
     * @param {HashMap#MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
     * @returns {boolean} true if all elements match, false if one or more elements fails to match.
     */
    every(everyPredicate = () => true, thisArg = undefined) {
        for (const [key, value] of this.entries()) {
            if (!everyPredicate.call(thisArg, value, key, this)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test to see if ANY element pass the test implemented by the passed <code>MatchesPredicate</code>.
     * - if any element matches, returns true.
     * - if all elements match returns true.
     * - if no elements match returns false.
     * - if the iterable is empty, returns true.
     * - if no predicate is provided, returns true.
     *
     * @example <caption>Do any values start with value. (yes all of them)</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const someResult = hashmap.some((value) => value.startsWith('value'));
     * // someResult === true
     * @example <caption>Do any values start with value. (yes 2 of them)</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'doesntStart'],[3,'value3']]);
     * const someResult = hashmap.some((value) => value.startsWith('value'));
     * // someResult === true
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.some}
     * @param {HashMap#MatchesPredicate} [somePredicate=(value, key, iterable) => true] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>somePredicate</code>
     * @param {HashMap#overrides<reverse>} [overrides] - a set of optional overrides to allow a user to define whether to search in reverse
     * @returns {boolean} - true if all elements match, false if one or more elements fails to match.
     */
    some(somePredicate = () => true, thisArg = undefined, overrides = undefined) {
        const iterator = overrides && overrides.reverse ? this.entriesRight() : this.entries();
        for (const [key, value] of iterator) {
            if (somePredicate.call(thisArg, value, key, this)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Iterate through the map reducing it to a single value.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
     * if initial value is <code>undefined</code> or <code>null</code>, unlike Array.reduce,
     * no error occurs, and it is simply passed as the accumulator value
     * @example <caption>add all the keys</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const reduceResult = hashmap.reduce((accumulator, value, key) => accumulator+key, 0);
     * // reduceResult === 6
     * @example <caption>add all the values into one string in reverse order</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const reduceResult = hashmap.reduce((accumulator, value) => value+accumulator, '');
     * // reduceResult === 'value3value2value1'
     * @param {HashMap#ReduceFunction} reduceFunction - the predicate to identify if we have a match.
     * @param {*} [initialValue] the initial value to start on the reduce.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {*} - the final accumulated value.
     */
    reduce(reduceFunction, initialValue, thisArg) {
        let accumulator = initialValue;
        if (initialValue === undefined) {
            let first = true;
            for (const [key, value] of this.entries()) {
                if (first) {
                    first = false;
                    accumulator = value;
                } else {
                    accumulator = reduceFunction.call(thisArg, accumulator, value, key, this);
                }
            }
        } else {
            for (const [key, value] of this.entries()) {
                accumulator = reduceFunction.call(thisArg, accumulator, value, key, this);
            }
        }
        return accumulator;
    }

    /**
     * Iterate backwards through the map reducing it to a single value.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight|Array.reduceRight}
     * if initial value is <code>undefined</code> or <code>null</code>, unlike Array.reduceRight,
     * no error occurs, and it is simply passed as the accumulator value
     * @example <caption>add all the keys</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const reduceResult = hashmap.reduceRight((accumulator, value, key) => accumulator+key, 0);
     * // reduceResult === 6
     * @example <caption>add all the values into one string in reverse order</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const reduceResult = hashmap.reduceRight((accumulator, value) => value+accumulator, '');
     * // reduceResult === 'value1value2value3'
     * @param {HashMap#ReduceFunction} reduceFunction - the predicate to identify if we have a match.
     * @param {*} [initialValue] the initial value to start on the reduce.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {*} - the final accumulated value.
     */
    reduceRight(reduceFunction, initialValue, thisArg) {
        let accumulator = initialValue;
        if (initialValue === undefined) {
            let first = true;
            for (const [key, value] of this.entriesRight()) {
                if (first) {
                    first = false;
                    accumulator = value;
                } else {
                    accumulator = reduceFunction.call(thisArg, accumulator, value, key, this);
                }
            }
        } else {
            for (const [key, value] of this.entriesRight()) {
                accumulator = reduceFunction.call(thisArg, accumulator, value, key, this);
            }
        }
        return accumulator;
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map
     */
    * [Symbol.iterator]() {
        yield* this.entries();
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map
     */
    * entries() {
        yield* this.buckets;
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map in reverse order
     */
    * entriesRight() {
        yield* this.buckets.entriesRight();
    }

    /**
     * Iterates over all the keys in the map.
     *
     * @yields {key:any} each key in the map
     */
    * keys() {
        yield* this.buckets.keys();
    }

    /**
     * Iterates over all the values in the map.
     *
     * @yields {value:any} each value in the map.
     */
    * values() {
        yield* this.buckets.values();
    }

    /**
     * Iterates over all the keys in the map in reverse.
     *
     * @yields {key:any} each key in the map in reverse order
     */
    * keysRight() {
        yield* this.buckets.keysRight();
    }

    /**
     * Iterates over all the values in the map in reverse.
     *
     * @yields {value:any} each value in the map in reverse order
     */
    * valuesRight() {
        yield* this.buckets.valuesRight();
    }

    // Private

    /**
     * Create a container for this hashmap, overridden by {@link LinkedHashMap}
     * This is an internal method, used for extension of hashmaps.
     * It allows for control of the leaves without having to mess with the hashbuckets and hamtpbuckets.
     * @private
     * @param {*} parent the parent of the container.
     * @param {number} hash the hash we want to assign to the container
     * @return {Container} the created container.
     */
    createContainer(parent, hash) {
        return new Container(this, parent, hash);
    }

}

/**
 * HashMap - LinkedHashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
 * @extends HashMap
 */
class LinkedHashMap extends HashMap {

    /**
     * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
     * - `new LinkedHashMap()` creates an empty linked hashmap
     * - `new LinkedHashMap(copy:Iterable)` creates a linked hashmap which is a copy of the provided iterable.
     *   - One of
     *      - an object that provides a [Symbol.Iterator] function with the same signature as `Map.[Symbol.Iterator]`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *          - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *      - an object that provides a entries function with the same signature as `Map.entries`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *
     * @example <caption>Create an empty LinkedHashMap</caption>
     * const linkedhashmap = new LinkedHashMap();
     * // linkedhashmap.size === 0;
     * @example <caption>Create LinkedHashMap from an array of key value pairs</caption>
     * const arr = [[1,'value1'],[2,'value2'],[3,'value3']];
     * const linkedhashmap = new LinkedHashMap(arr);
     * // linkedhashmap.size === 3;
     * @example <caption>Create LinkedHashMap from another map</caption>
     * const map = new Map([[1,'value1'],[2,'value2'],[3,'value3']])
     * const linkedhashmap = new LinkedHashMap(map);
     * // linkedhashmap.size === 3;
     * @example <caption>Create LinkedHashMap from another HashMap</caption>
     * const first = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']])
     * const linkedhashmap = new LinkedHashMap(first);
     * // linkedhashmap.size === 3;
     * // will accept LinkedHashMap as well
     * @example <caption>Create LinkedHashMap from a class with symbol iterator</caption>
     * class MyIterable = {
     *     *[Symbol.iterator] () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const iterable = new MyIterable();
     * const linkedhashmap = new LinkedHashMap(iterable);
     * // linkedhashmap.size === 4;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>Create LinkedHashMap from an object with an entries generator function</caption>
     * const entriesObj = {
     *     entries: function* () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const linkedhashmap = new LinkedHashMap(entriesObj);
     * // linkedhashmap.size === 4;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>Create LinkedHashMap from an object with a forEach function</caption>
     * const forEachObj = {
     *      forEach: (callback, ctx) => {
     *              for (let i = 1; i <= 4; i++) {
     *                  callback.call(ctx, 'value' + i, 'key' + i);
     *              }
     *      }
     * };
     * const linkedhashmap = new LinkedHashMap(forEachObj);
     * // linkedhashmap.size === 4;
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|ObjectWithForEach.<function(function(value, key))>|ObjectWithEntries.<function>)}[copy]
     */
    constructor(copy) {
        super(copy);
        if (this.size === 0) {
            this.start = undefined;
            this.end = undefined;
        }
    }

    /**
     * @inheritDoc
     * @return {HashMap}
     */
    clear() {
        this.start = undefined;
        this.end = undefined;
        return super.clear();
    }

    /**
     *
     * @param key
     * @param value
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {LinkedHashMap}
     */
    setLeft(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        op.addToStart = true;
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param key
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {*}
     */
    emplaceLeft(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        op.addToStart = true;
        return this.buckets.emplace(key, handler, op);
    }

    /**
     *
     * @param key
     * @param value
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {LinkedHashMap}
     */
    push(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param key
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {*}
     */
    pushEmplace(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        return this.buckets.emplace(key, handler, op);
    }

    /**
     *
     * @param key
     * @param value
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {LinkedHashMap}
     */
    unshift(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        op.addToStart = true;
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param key
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {*}
     */
    unshiftEmplace(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        op.addToStart = true;
        return this.buckets.emplace(key, handler, op);
    }

    /**
     *
     * @return {undefined|*}
     */
    shift() {
        const entry = this.start;
        if (entry) {
            entry.parent.deleteEntry(entry);
            return entry.slice();
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    pop() {
        const entry = this.end;
        if (entry) {
            entry.parent.deleteEntry(entry);
            return entry.slice();
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    head() {
        const entry = this.start;
        if (entry) {
            return entry[1];
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    tail() {
        const entry = this.end;
        if (entry) {
            return entry[1];
        }
        return undefined;
    }

    /**
     *
     * @return {Option}
     */
    optionalHead() {
        const entry = this.start;
        if (entry) {
            return some(entry[1]);
        }
        return none;
    }

    /**
     *
     * @return {Option}
     */
    optionalTail() {
        const entry = this.end;
        if (entry) {
            return some(entry[1]);
        }
        return none;
    }

    /**
     *
     * @return {undefined|*}
     */
    headKey() {
        const entry = this.start;
        if (entry) {
            return entry[0];
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    tailKey() {
        const entry = this.end;
        if (entry) {
            return entry[0];
        }
        return undefined;
    }

    /**
     *
     * @return {Option}
     */
    optionalHeadKey() {
        const entry = this.start;
        if (entry) {
            return some(entry[0]);
        }
        return none;
    }

    /**
     *
     * @return {Option}
     */
    optionalTailKey() {
        const entry = this.end;
        if (entry) {
            return some(entry[0]);
        }
        return none;
    }

    /**
     * @inheritDoc
     * @return {LinkedHashMap}
     */
    reverse(){
        if(this.size > 1){
            let entry = this.start;
            do {
                const previous = entry.previous;
                const next = entry.next;
                entry.previous = next;
                entry.next = previous;
                entry = next;
            } while(entry);
            const start = this.start;
            this.start = this.end;
            this.end = start;
        }
        return this;
    }

    /**
     * Makes a copy of this LinkedHashMap
     * @return {LinkedHashMap}
     */
    clone() {
        return new LinkedHashMap(this);
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map
     */
    * [Symbol.iterator]() {
        yield* this.entries();
    }
    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map
     */
    * entries() {
        let entry = this.start;
        while (entry) {
            yield entry.slice();
            entry = entry.next;
        }
    }

    /**
     * Iterates over all the entries in the map in reverse order.
     *
     * @yields {entries:Array.<key,value>} each entry in the map in reverse order
     */
    * entriesRight() {
        let entry = this.end;
        while (entry) {
            yield entry.slice();
            entry = entry.previous;
        }
    }

    /**
     * Iterates over all the keys in the map.
     *
     * @yields {key:any} each key in the map
     */
    * keys() {
        let entry = this.start;
        while (entry) {
            yield entry[0];
            entry = entry.next;
        }
    }

    /**
     * Iterates over all the values in the map.
     *
     * @yields {value:any} each value in the map
     */
    * values() {
        let entry = this.start;
        while (entry) {
            yield entry[1];
            entry = entry.next;
        }
    }

    /**
     * Iterates over all the keys in the map in reverse.
     * @yields {key:any} each key in the map in reverse order
     */
    * keysRight() {
        let entry = this.end;
        while (entry) {
            yield entry[0];
            entry = entry.previous;
        }
    }

    /**
     * Iterates over all the values in the map in reverse.
     * @yields {value:any} each value in the map in reverse order
     */
    * valuesRight() {
        let entry = this.end;
        while (entry) {
            yield entry[1];
            entry = entry.previous;
        }
    }
// private

    /**
     * @private
     * @param parent
     * @param hash
     * @return {LinkedContainer}
     */
    createContainer(parent, hash) {
        return new LinkedContainer(this, parent, hash);
    }
}


/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 * @private
 */
class LinkedContainer extends Container {

    constructor(map, parent, hash) {
        super(map, parent, hash);
    }

    createEntry(key, value, overrides) {
        const entry = super.createEntry(key, value, overrides);
        const map = this.map;
        if (map.start === undefined) {
            map.end = map.start = entry;
        } else if (overrides.addToStart) {
            map.start.previous = entry;
            entry.next = map.start;
            map.start = entry;
        } else {
            map.end.next = entry;
            entry.previous = map.end;
            map.end = entry;
        }
        return entry;
    }

    updateEntry(entry, newValue, overrides) {
        super.updateEntry(entry, newValue, overrides);
        if (overrides.moveOnUpdate) {
            if (overrides.addToStart) {
                if (entry.previous) {
                    if (entry.next) {
                        entry.next.previous = entry.previous;
                    }
                    entry.previous.next = entry.next;
                    if (entry === this.map.end) {
                        this.map.end = entry.previous;
                    }
                    entry.previous = undefined;
                    this.map.start.previous = entry;
                    entry.next = this.map.start;
                    this.map.start = entry;
                }
            } else if (entry.next) {
                if (entry.previous) {
                    entry.previous.next = entry.next;
                }
                entry.next.previous = entry.previous;
                if (entry === this.map.start) {
                    this.map.start = entry.next;
                }
                entry.next = undefined;
                this.map.end.next = entry;
                entry.previous = this.map.end;
                this.map.end = entry;
            }
        }
    }

    deleteIndex(idx) {
        const oldEntry = super.deleteIndex(idx);
        const map = this.map;
        if (oldEntry.previous) {
            oldEntry.previous.next = oldEntry.next;
        } else {
            map.start = oldEntry.next;
        }
        if (oldEntry.next) {
            oldEntry.next.previous = oldEntry.previous;
        } else {
            map.end = oldEntry.previous;
        }
    }
}

/**
 * @module @mootable/hashmap
 */

const Mootable = {
    HashMap,
    LinkedHashMap,
    hash,
    isFunction,
    isIterable,
    isString,
    equalsAndHash,
    hashCodeFor,
    equalsFor,
    some,
    none,
    Option
};

export default LinkedHashMap;
export { HashMap, LinkedHashMap, Mootable };
