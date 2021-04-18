import {isFunction, isIterable} from '../utils/';
import {equalsAndHash} from '../hash';
import {Container} from "./container";
import {HashBuckets} from "./hashbuckets";

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.15.0
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
 *
 */
export class HashMap {

    /**
     * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
     * - `new HashMap()` creates an empty hashmap
     * - `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>)} [copy]
     */
    constructor(copy) {
        this.buckets = new HashBuckets(this);
        if (copy) {
            this.copy(copy);
        }
    }

    /**
     * Returns the number of elements in this hashmap
     * @return {number}
     */
    get size() {
        return this.buckets.size;
    }

    /**
     * Returns the number of elements in this hashmap
     * @return {number}
     */
    get length() {
        return this.buckets.size;
    }

    /**
     * User Defined Equals Method
     * A user defined function to define an equals method against 2 keys.
     * @callback HashMap.methodOptionsEquals
     * @param {*} firstKey - the first key.
     * @param {*} secondKey - the second key
     * @returns {boolean} is it equal or not
     */
    /**
     * User Defined Hash Method
     * A user defined function to describe how to hash a key.
     * @callback HashMap.methodOptionsHash
     * @param {*} key - the first key.
     * @returns {number} a 32 bit integer as a hash.
     */

    /**
     * User defined hashing and equals methods
     * HashMap will find the best fit for your objects, and if your keys themselves have the appropriate methods,
     * then it will use them. However if you want to override that functionality this options object allows you to do it.
     * @typedef {Object} HashMap.methodOptions
     * @property {number|HashMap.methodOptionsHash} [hash] - The optional hash value, or method to use.
     * @property {HashMap.methodOptionsEquals} [equals] - The optional equals method to use
     */

    /**
     * Create a container for this hashmap, overriden by {@link LinkedHashMap}
     * @package
     * @param hash
     * @return {Container}
     */
    createContainer(parent, hash) {
        return new Container(this, parent, hash);
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
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has|Map.has}
     * @param {*} key - the matching key we use to identify if we have a match.
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {boolean} - if it holds the key or not.
     */
    has(key, options) {
        const op = equalsAndHash(key, options);
        return this.buckets.has(key, op);
    }

    /**
     * Get a value from the map using this key.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches the key.
     * - if no elements match, it returns undefined.
     * - it is legitimate for keys to be null or undefined, and if set, will find a value.
     * - it is also legitimate for values to be null or undefined, as such get should never be used as an existence check. {@see HashMap#optionalGet}
     *
     * Maps typically index keys, and so is generally a fast operation.
     * @example <caption>>What is the value for a key</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.get(1);
     * // getResult === 'value1'
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.get(4);
     * // getResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get|Map.get}
     * @param {*} key - the matching key we use to identify if we have a match.
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {*} - the value of the element that matches.
     */
    get(key, options) {
        const op = equalsAndHash(key, options);
        return this.buckets.get(key, op);
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
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {Option} - an optional result.
     */
    optionalGet(key, options) {
        const op = equalsAndHash(key, options);
        return this.buckets.optionalGet(key, op);
    }

    /**
     * Sets a value onto this map, using the key as its reference.
     *
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {HashMap}
     */
    set(key, value, options) {
        const op = equalsAndHash(key, options);
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param {*} key - the key we want to key our value to
     * @param handler
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {*} the new value
     */
    emplace(key, handler, options) {
        const op = equalsAndHash(key, options);
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
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {HashMap}
     */
    delete(key, options) {
        const op = equalsAndHash(key, options);
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
     * @param {*} [thisArg=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
     * @returns {HashMap} the hashmap you are foreaching on..
     */
    forEach(callback, thisArg = this) {
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
     * @param {*} [thisArg=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
     * @returns {HashMap} the hashmap you are foreaching on..
     */
    forEachRight(callback, thisArg = this) {
        for (const entry of this.entriesRight()) {
            callback.call(thisArg, entry[1], entry[0], this);
        }
        return this;
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @return {Generator<any, void, any>}
     */
    * [Symbol.iterator]() {
        yield* this.entries();
    }

    /**
     * Iterates over all the entries in the map in reverse.
     *
     * @return {Generator<any, void, any>}
     */
    * entriesRight() {
        yield* this.buckets.entriesRight();
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @return {Generator<any, void, any>}
     */
    * entries() {
        yield* this.buckets;
    }

    /**
     * Iterates over all the keys in the map.
     *
     * @return {Generator<any, void, any>}
     */
    * keys() {
        yield* this.buckets.keys();
    }

    /**
     * Iterates over all the values in the map.
     *
     * @return {Generator<any, void, any>}
     */
    * values() {
        yield* this.buckets.values();
    }

    /**
     * Iterates over all the keys in the map in reverse.
     * @return {Generator<any, void, any>}
     */
    * keysRight() {
        yield* this.buckets.keysRight();
    }

    /**
     * Iterates over all the values in the map in reverse.
     * @return {Generator<any, void, any>}
     */
    * valuesRight() {
        yield* this.buckets.valuesRight();
    }

}
