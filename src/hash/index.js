import {sameValueZero, strictEquals, isFunction} from '../utils';
import {Option} from "../option";
/**
 * Hash - Hash functions
 * @namespace Mootable.Hash
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.15.0
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
export function hash(key, len = 0, seed = 0) {
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
            if(key instanceof Option) {
                if(key.has) {
                    return 31 * hashCodeFor(key.value);
                }
                return 0;
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
export function equalsFor(key) {
    // Regexes and Dates we treat like primitives.
    switch(typeof key){
        case 'object':
            if(key) {
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
                                return valueEquals(me.value,them.value);
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
export function equalsAndHash(key, toSetOn = {}) {
    if(toSetOn.hash){
        if(toSetOn.equals) {
            return toSetOn;
        }
        toSetOn.equals = equalsFor(key);
        return toSetOn;
    } else if(toSetOn.equals){
        toSetOn.hash = hashCodeFor(key);
        return toSetOn;
    }
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
            toSetOn.equals =  equalsFor(key);
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
            if(key instanceof Option) {
                if(key.has) {
                    toSetOn.hash = 31 * hashCodeFor(key.value);
                    return toSetOn;
                }
                toSetOn.hash = 0;
                return toSetOn;
            }

            // Hash of Last Resort, ensure we don't consider any objects on the prototype chain.
            if (key.hasOwnProperty('_mootable_hashCode')) {
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
