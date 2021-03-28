/**
 * Option - a class to get round nullable fields.
 * @namespace Mootable.Option
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * A representation of a value, that might be or might not be null.
 */
export class Option {
    /**
     * Usage of this constructor should generally be avoided,
     * - instead use the some or none method on Option,
     * - or the some or none exported functions provided with this javascript file.
     * @see {@link Mootable.Option.none none}
     * @see {@link Mootable.Option.some some}
     * @param has - whether it contains a value or not.
     * @param value - the value to set
     */
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
     * @example iterating over some
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
 * @type {function(*=): Option}
 */
export const some = (value) => new Option(true, value);
/**
 * A constant representation of an Option with nothing in it:
 * <code>{value:undefined,has:false}</code>
 * @type {Option}
 */
export const none = new Option(false, undefined);
