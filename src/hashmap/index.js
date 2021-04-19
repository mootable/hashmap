import {isFunction, isIterable} from '../utils/';
import {equalsAndHash, equalsFor} from '../hash';
import {Container} from "./container";
import {HashBuckets} from "./hashbuckets";
import {some, none} from "../option";

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
     * Potentially Slow!
     * @param value
     * @return {*}
     */
    keyOf(value, options) {
        const equals = options && isFunction(options.equals) ? options.equals : equalsFor(value);
        for (const entry of this.entries()) {
            if (equals(value, entry[1])) {
                return entry[0];
            }
        }
        return undefined;
    }

    /**
     * Potentially Slow!
     * @param value
     * @return {*}
     */
    lastKeyOf(value, options) {
        const equals = options && isFunction(options.equals) ? options.equals : equalsFor(value);
        for (const entry of this.entriesRight()) {
            if (equals(value, entry[1])) {
                return entry[0];
            }
        }
        return undefined;
    }

    /**
     * Slow!
     * @param value
     * @return {Option}
     */
    optionalKeyOf(value, options) {
        const equals = options && isFunction(options.equals) ? options.equals : equalsFor(value);
        for (const entry of this.entries()) {
            if (equals(value, entry[1])) {
                return some(entry[0]);
            }
        }
        return none;
    }

    /**
     * Slow!
     * @param value
     * @return {Option}
     */
    optionalLastKeyOf(value, options) {
        const equals = options && isFunction(options.equals) ? options.equals : equalsFor(value);
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
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {Option} - an optional result.
     */
    optionalGet(key, options) {
        const op = equalsAndHash(key, options);
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
     * @param {HashMap.methodOptions} [options] - a set of optional options to allow a user to define whether to search in reverse
     * @returns {boolean} - true if all elements match, false if one or more elements fails to match.
     */
    some(somePredicate = () => true, thisArg = undefined, options = undefined) {
        const iterator = options && options.reverse ? this.entriesRight() : this.entries();
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
}
