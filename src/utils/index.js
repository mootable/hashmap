/**
 * Utils - Utility functions
 * @namespace Mootable.Utils
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */
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
