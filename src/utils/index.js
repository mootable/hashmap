/**
 * Utils - Utility functions
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */
let uid = 0;

/**
 * Modified Murmur3 HashCode generator, with capped lengths.
 * This is NOT a cryptographic hash, this hash is designed to create as even a spread across a 32bit integer as is possible.
 * @see {@link https://github.com/aappleby/smhasher|MurmurHash specification on Github}
 * @see {@link https://en.wikipedia.org/wiki/MurmurHash|MurmurHash on Wikipedia}
 * @param key the string being hashed
 * @param len the max limit on the number of characters to hash
 * @param seed an optional random seed
 * @returns {number} the hash
 */
export function hashCode(key, len = 0, seed = 0) {
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
 * Is the passed value not null and a finite number.
 * NaN and ±Infinity would return false.
 * @param num
 * @returns {boolean}
 */
export function isNumber(num) { // jshint ignore:line
    return !!(num && ((typeof num === 'number' || num instanceof Number) && isFinite(num)));
}

/**
 * @private
 * The default Equals method we use this in most cases.
 *
 * @param me
 * @param them
 * @returns {boolean}
 */
export function defaultEquals(me, them) {
    return me === them;
}

/**
 * @private
 * Does a wider equals for use with arrays.
 *
 * @param me
 * @param them
 * @param depth
 * @return {boolean}
 */
export function deepEquals(me, them, depth = -1) {
    if (depth !== 0 && (Array.isArray(me) && Array.isArray(them))) {
        return me.length === them.length && me.every((el, ix) => deepEquals(el, them[ix], depth - 1));
    }
    return me === them;
}

/**
 * @private
 * Returns back a pair of equalTo Methods and hash values, for a raft of different objects.
 * TODO: Revisit this at some point.
 * @param key
 * @returns {{equalTo: (function(*, *): boolean), hash: number}}
 */
export function hashEquals(key) {
    switch (typeof key) {
        case 'boolean':
            return {
                equalTo: defaultEquals, hash: key ? 0 : 1
            };
        case 'number':
            if (Number.isNaN(key)) {
                return {
                    equalTo: function (me, them) {
                        return Number.isNaN(them);
                    },
                    hash: 0
                };
            }
            if (!Number.isFinite(key)) {
                return {
                    equalTo: defaultEquals, hash: 0
                };
            }
            if (Number.isInteger(key)) {
                return {
                    equalTo: defaultEquals, hash: key
                };
            }
            return {
                equalTo: defaultEquals, hash: hashCode(key.toString())
            };

        case 'string':
            return {
                equalTo: defaultEquals, hash: hashCode(key)
            };
        case 'undefined':
            return {
                equalTo: defaultEquals, hash: 0
            };
        default: {
            // null
            if (!key) {
                return {
                    equalTo: defaultEquals, hash: 0
                };
            }

            if (key instanceof RegExp) {
                return {
                    equalTo: function (me, them) {
                        if (them && them instanceof RegExp) {
                            return me.toString() === them.toString();
                        }
                        return false;
                    }, hash: hashCode(key.toString())
                };
            }
            if (key instanceof Date) {
                return {
                    equalTo: function (me, them) {
                        if (them instanceof Date) {
                            return me.getTime() === them.getTime();
                        }
                        return false;
                    }, hash: key.getTime() | 0
                };
            }
            if (key instanceof Array) {
                let functions = [];
                let hash_code = key.length;
                for (let i = 0; i < key.length; i++) {
                    const currHE = hashEquals(key[i]);
                    functions.push(currHE.equalTo);
                    hash_code = hash_code + (currHE.hash * 31);
                }
                Object.freeze(functions);
                return {
                    equalTo: function (me, them) {
                        if (them instanceof Array && me.length === them.length) {
                            for (let i = 0; i < me.length; i++) {
                                if (!functions[i](me[i], them[i])) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        return false;
                    },
                    hash: hash_code | 0
                };
            }
            // Ew get rid of this.
            if (!key.hasOwnProperty('_hmuid_')) {
                key._hmuid_ = ++uid;
                // hide(key, '_hmuid_');
            }
            return hashEquals(key._hmuid_);
        }
    }
}

/**
 * to get round the fact gets might be undefined but the value exists,
 * @private
 */
export class Option {
    constructor(has, value) {
        this.has = has;
        this.value = value;
    }

    static some(value) {
        return new Option(true, value);
    }

    static get none() {
        return none;
    }

    get size() {
        return this.has ? 1 : 0;
    }

    * [Symbol.iterator]() {
        if (this.has) {
            yield this.value;
        }
    }
}

export const some = Option.some;
export const none = new Option(false, undefined);