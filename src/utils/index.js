/**
 * Utils - Utility functions
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */

let HASH_COUNTER = 0;

/**
 * Modified Murmur3 hash generator, with capped lengths.
 * This is NOT a cryptographic hash, this hash is designed to create as even a spread across a 32bit integer as is possible.
 * @see {@link https://github.com/aappleby/smhasher|MurmurHash specification on Github}
 * @see {@link https://en.wikipedia.org/wiki/MurmurHash|MurmurHash on Wikipedia}
 * @param key the string being hashed
 * @param len the max limit on the number of characters to hash
 * @param seed an optional random seed
 * @returns {number} the hash
 */
export function hash(key, len = 0, seed = 0) {
    len = len && len > 0 ? Math.min(len, key.length) : key.length;
    seed = seed | 0;
    const remaining = len & 1;
    const bytes = len - remaining;
    let hash = seed, k = 0, i = 0;

    while (i < bytes) {
        k = (key.charCodeAt(i++) & 0xffff) |
            ((key.charCodeAt(i++) & 0xffff) << 16);

        k *= (k * 0xcc9e2d51) | 0;
        k = (k << 15) | (k >>> 17);
        k = (k * 0x1b873593);

        hash ^= k;
        hash = (hash << 13) | (hash >>> 19);
        hash = (hash * 5 + 0xe6546b64);
    }
    if (remaining) {
        k ^= (key.charCodeAt(i) & 0xffff);

        k = k * 0xcc9e2d51;
        k = (k << 15) | (k >>> 17);
        k = k * 0x1b873593;
        hash ^= k;
    }

    hash ^= len;

    hash ^= hash >>> 16;
    hash = hash * 0x85ebca6b;
    hash ^= hash >>> 13;
    hash = hash * 0xc2b2ae35;
    hash ^= hash >>> 16;
    return hash | 0;
}

/**
 * Is the passed value not null and a function
 * @param func
 * @returns {boolean}
 */
export function isFunction(func) {
    return !!(func && func.constructor && func.call && func.apply);
}

/**
 * Is the passed object iterable
 * @param iterable
 * @return {boolean}
 */
export function isIterable(iterable) {
    return !!(iterable && isFunction(iterable[Symbol.iterator]));
}

/**
 * Is the passed value not null and a string
 * @param str
 * @returns {boolean}
 */
export function isString(str) { // jshint ignore:line
    return !!(str && (typeof str === 'string' || str instanceof String));
}


/**
 * sameValue is the result of Object.is.
 * The only difference between sameValue and sameValueZero is that +0 and -0 are not the same with sameValue buit is with sameValueZero
 * @see {@link https://262.ecma-international.org/6.0/#sec-samevalue saveValue}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to ECMA Spec for Same Value
 */
export const sameValue = Object.is;

/**
 * sameValueZero is the equality method used by Map, Array, Set etc.
 * The only difference between === and sameValueZero is that NaN counts as equal on sameValueZero
 * @see {@link https://262.ecma-international.org/6.0/#sec-samevaluezero saveValueZero}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to ECMA Spec for Same Value Zero
 */
export function sameValueZero(x, y) {
    return x === y || (Number.isNaN(x) && Number.isNaN(y));
}

/**
 * The strict Equals method <code>===</code>.
 * Simply does a strict equality comparison <code>===</code> against 2 values
 * @see {@link https://262.ecma-international.org/6.0/#sec-strict-equality-comparison strictEquals}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to ECMA Spec for Strict Equality
 */
export function strictEquals(x, y) {
    return x === y;
}

/**
 * The abstract Equals method <code>==</code>.
 * Simply does an abstract equality comparison <code>==</code> against 2 values
 * @see {@link https://262.ecma-international.org/6.0/#sec-abstract-equality-comparison abstractEquals}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to ECMA Spec for Abstract Equality
 */
export function abstractEquals(x, y) {
    return x === y;
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
export function hashCodeFor(key) {
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
                    return key.hashCode(key);
                }
                return hashCodeFor(key.hashCode);
            }

            // Regexes and Dates we treat like primitives.
            if (key instanceof RegExp || key instanceof Date) {
                return hash(key.toString());
            }

            // Hash of Last Resort, ensure we don't consider any objects on the prototype chain.
            if (key.hasOwnProperty('_mootable_hashCode')) {
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
 * Given a key, produce an equals method that fits the hashcode contract.
 * - In almost all cases it will return with ECMASpec sameValueZero method. As is the case with native map, set and array.
 * - If it is a regex, it compares the type, and the string values.
 * - If it is a date, it compares the type, and the time values.
 * - If it has an equals function and that equals function when comapring 2 keys, return true. then it will use that.
 *   - The function can either be in the form <code>key.equals(other)</code>, or <code>key.equals(other,key)</code> in the case of static-like functions.
 *
 * As with all hashmaps, there is a contractual equivalence between hashcode and equals methods,
 * in that any object that equals another, should produce the same hashcode.
 *
 * @param {*} key - the key to get the hash code from
 * @return {(function(*, *): boolean)} - an equals function for 2 keys.
 */
export function equalsFor(key) {
    // Regexes and Dates we treat like primitives.
    if (typeof key === 'object') {
        if (key instanceof RegExp) {
            return (me, them) => {
                if (them instanceof RegExp) {
                    return me.toString() === them.toString();
                }
                return false;
            };
        }
        if (key instanceof Date) {
            return (me, them) => {
                if (them instanceof Date) {
                    return me.getTime() === them.getTime();
                }
                return false;
            };
        }
    }

    // do we have an equals method, and is it sane.
    if (key && isFunction(key.equals) && key.equals(key,key)) {
        return (me, them) => me.equals(them,me);
    }
    return sameValueZero;
}

export function hashEquals(key, hash = hashCodeFor(key), equals = equalsFor(key)){
    return {
        hash,
        equals
    };
}

/**
 * A representation of a value, that might be or might not be null.
 */
export class Option {
    constructor(has, value) {
        this.has = has;
        this.value = value;
    }

    /**
     * A constant representation of an Option with nothing in it:
     * <code>{value:undefined,has:false}</code>
     * @type {Option}
     */
    static get none() {
        return none;
    }

    get size() {
        return this.has ? 1 : 0;
    }

    static some(value) {
        return some(value);
    }

    * [Symbol.iterator]() {
        if (this.has) {
            yield this.value;
        }
    }
}

/**
 * A function that when called round a value returns an Option object of the form:
 * <code>{value:value,has:true}</code>
 * @type {function(*=): Option}
 */
export const some = (value) => new Option(true, value);
/**
 * A constant representation of an Option with nothing in it:
 * <code>{value:undefined,has:false}</code>
 * @type {Option}
 */
export const none = new Option(false, undefined);