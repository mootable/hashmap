/*
 * Utils - Utility functions
 * @author Jack Moxley
 * @copyright Jack Moxley <https://github.com/jackmoxley>
 * @licence MIT
 */
/**
 * Is the passed value not null and a function
 * @example <caption> test if its a function</caption>
 * const myFunc = () => 1 + 1;
 * Mootable.isFunction(myFunc) === true;
 * @example <caption> test if its not a function</caption>
 * const notAFunction = {};
 * Mootable.isFunction(notAFunction) === false;
 * @example <caption> test if its null</caption>
 * const notAFunction = null;
 * Mootable.isFunction(notAFunction) === false;
 * @param {function|*} func - the function/object to test
 * @returns {boolean} true if this is function and not null.
 */
export function isFunction(func) {
    return !!(func && func.constructor && func.call && func.apply);
}

/**
 * Is the passed object iterable and not null, i.e. it has a function that has a type of
 * [Symbol.iterator]
 * @example <caption> test if its iterable</caption>
 * class MyIterable {
 *     * [Symbol.iterator]() {
 *         yield 1;
 *     }
 * }
 * Mootable.isIterable(new MyIterable()) === true;
 * @example <caption> test if its not an iterable</caption>
 * const notAnIterable = {};
 * Mootable.isIterable(notAnIterable) === false;
 * @example <caption> test if its null</caption>
 * const notAnIterable = null;
 * Mootable.isIterable(notAnIterable) === false;
 * @param {Iterable|*} iterable - the object to test
 * @return {boolean} true if this has a Symbol.iterator function
 */
export function isIterable(iterable) {
    return !!(iterable && isFunction(iterable[Symbol.iterator]));
}

/**
 * Is the passed value is not null and is a string
 * @example <caption> test if its iterable</caption>
 * const myString = "hello world";
 * Mootable.isString(myString) === true;
 * @example <caption> test if its not an iterable</caption>
 * const notAString = {};
 * Mootable.isString(notAString) === false;
 * @example <caption> test if its null</caption>
 * const notAString = null;
 * Mootable.isString(notAString) === false;
 * @param {string|*} str - the string/object to test
 * @returns {boolean} true if this is a string
 */
export function isString(str) { // jshint ignore:line
    return !!(str && (typeof str === 'string' || str instanceof String));
}

/**
 * sameValue is the result of Object.is.
 * The only difference between sameValue and sameValueZero is that +0 and -0 are considered different with sameValue.
 * @see {@link https://262.ecma-international.org/6.0/#sec-samevalue sameValue}
 * @function
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to {@link https://262.ecma-international.org/6.0/#sec-samevalue ECMA Spec for Same Value}
 */
export const sameValue = Object.is;

/**
 * sameValueZero is the equality method used by Map, Array, Set etc.
 * The only difference between === and sameValueZero is that NaN counts as equal on sameValueZero
 * @see {@link https://262.ecma-international.org/6.0/#sec-samevaluezero saveValueZero}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to {@link https://262.ecma-international.org/6.0/#sec-samevaluezero ECMA Spec for Same Value Zero}
 */
export function sameValueZero(x, y) {
    return x === y || (Number.isNaN(x) && Number.isNaN(y));
}

/**
 * The abstract Equals method <code>==</code>.
 * Simply does an abstract equality comparison <code>==</code> against 2 values
 * @see {@link https://262.ecma-international.org/6.0/#sec-abstract-equality-comparison abstractEquals}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to {@link https://262.ecma-international.org/6.0/#sec-abstract-equality-comparison ECMA Spec for Abstract Equality}
 */
export function abstractEquals(x, y) {
    return x == y; // jshint ignore:line
}

/**
 * The strict Equals method <code>===</code>.
 * Simply does a strict equality comparison <code>===</code> against 2 values
 * @see {@link https://262.ecma-international.org/6.0/#sec-strict-equality-comparison strictEquals}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to {@link https://262.ecma-international.org/6.0/#sec-strict-equality-comparison ECMA Spec for Strict Equality}
 */
export function strictEquals(x, y) {
    return x === y;
}

/**
 * Counts the number of ones in a binary representation of a 32 bit integer.
 * @example <caption> count the number of bits set to one for the value 22</caption>
 * const myNumber = 22; // 10110 in binary
 * Mootable.hammingWeight(myNumber) === 3;
 * @example <caption> count the number of bits set to one for the value 12947</caption>
 * const myNumber = 12947; // 11001010010011 in binary
 * Mootable.hammingWeight(myNumber) === 7;
 * @see {@link https://en.wikipedia.org/wiki/Hamming_weight hammingWeight}
 * @param {number} flags 32 bit integer
 * @return {number} amount of ones.
 */
export function hammingWeight (flags) {
    flags -= ((flags >>> 1) & 0x55555555);
    flags = (flags & 0x33333333) + ((flags >>> 2) & 0x33333333);
    return ((flags + (flags >> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
}