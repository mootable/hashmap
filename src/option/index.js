/**
 * Option - a class to get round nullable fields.
 * @namespace Mootable.Option
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * A representation of a value, that might be or might not be null.
 * Options are immutable, once set, it can't be changed.
 */
export class Option {
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
     * we are effectively saying as null and undefined count as valid values.
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
     * @example iterating over none
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
export const some = (value) => new Option(true, value);

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
export const none = new Option(false, undefined);
