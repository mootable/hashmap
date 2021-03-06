import {isFunction, isIterable} from '../utils/';
import {Container} from "./container";
import {HashBuckets} from "./hashbuckets";
import {some, none} from "../option";
import {equalsAndHash, equalsFor} from './hash';

/**
 * This HashMap is backed by a Hash array mapped trie.
 * @author Jack Moxley
 * @copyright Jack Moxley <https://github.com/jackmoxley>
 * @licence MIT
 */
export class HashMap {

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
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|Object)} [copy]
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
     * Emplace Update Method
     * A user defined method to describe how to update our map.
     * @callback HashMap#emplaceUpdate
     * @param {*} oldValue - the oldValue to update.
     * @param {*} key - the key to the entry.
     * @param {HashMap} map - the hashmap.
     * @returns {*} the new value to update the map with.
     */

    /**
     * Emplace Insert Method
     * A user defined method to describe how to insert into our map.
     * @callback HashMap#emplaceInsert
     * @param {*} key - the key to the entry.
     * @param {HashMap} map - the hashmap.
     * @returns {*} the new value we want to insert.
     */

    /**
     * Emplace handler methods
     * - Let M be this hashmap.
     * - For each Record { [[Key]], [[Value]] } e that is an element of entries, do
     *  - If Equal(e.[[Key]], key) is true, then
     *   - If HasProperty(handler, "update") is true, then
     *     - Let updateFn be ? Get(handler, "update").
     *     - Let updated be ? Call(updateFn, handler, « e.[[Value]], key, M »).
     *     - Set e.[[Value]] to updated.
     *   - Return e.[[Value]].
     * - Let insertFn be ? Get(handler, "insert").
     * - Let inserted be ? Call(insertFn, handler, « e.[[Value]], key, M »).
     * - Set e.[[Value]] to inserted.
     * - Return e.[[Value]].
     * @typedef {Object} HashMap#emplaceHandler
     * @property {HashMap#emplaceUpdate} [update] - The update method to use.
     * @property {HashMap#emplaceInsert} [insert] - The insert method to use
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
     * @example <caption>Does this contain a key that is there</caption>
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
        const op = this.equalsAndHash(key, overrides);
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
     * @example <caption>What is the value for a key</caption>
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
        const op = this.equalsAndHash(key, overrides);
        return this.buckets.get(key, op);
    }

    /**
     * Get the key from the map using the provided value. Since values are not hashed, this has to check each value in the map until a value matches, or the whole map, if none match. As such this is a slow operation.
     * Performance O(n) as we have to iterate over the whole map, to find each value and perform
     * an equality against it.
     * @example <caption>What is the key for a value</caption>
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
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf Array.indexOf}
     * @param {*} value - The value we are searching the map for
     * @param {HashMap#overrides<equals>} [overrides] - an optional override to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {*|undefined} the first key for this value or undefined
     */
    keyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : this.equalsFor(value);
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
     * @example <caption>What is the key for a value</caption>
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
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf Array.lastIndexOf}
     * @param {*} value - The value we are searching the map for, (in reverse)
     * @param {HashMap#overrides<equals>} [overrides] - an optional override to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {*|undefined} the last key for this value or undefined
     */
    lastKeyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : this.equalsFor(value);
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
     * @example <caption>What is the key for a value</caption>
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
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf Array.indexOf}
     * @param {*} value - The value we are searching the map for
     * @param {HashMap#overrides<equals>} [overrides] - an optional overrides to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {Option} the first key for this value or none
     */
    optionalKeyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : this.equalsFor(value);
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
     * @example <caption>What is the key for a value</caption>
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
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf Array.lastIndexOf}
     * @param {*} value - The value we are searching the map for, (in reverse)
     * @param {HashMap#overrides<equals>} [overrides] - an optional overrides to allow a user to
     * define the equals methods, rather than it being looked up on the value.
     * @return {Option} the last key for this value or none
     */
    optionalLastKeyOf(value, overrides) {
        const equals = overrides && isFunction(overrides.equals) ? overrides.equals : this.equalsFor(value);
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
     * @example <caption>What is the value for a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.optionalGet(1);
     * // getResult === Option.some('value1') {value:'value1',has:true}
     * @example <caption>What is the value for a key that isn't there</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.optionalGet(4);
     * // getResult === Option.none {has:false}
     * @example <caption>What is the value for a key with an undefined value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,undefined],[3,'value3']]);
     * const getResult = hashmap.optionalGet(2);
     * // getResult === Option.some(undefined) {value:undefined,has:true}
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
     * const getResult = hashmap.optionalGet(key);
     * // getResult === Option.some('Librarian') {value:'Librarian',has:true}
     * @example <caption>Advanced: using a custom hash and equals, to get the first entry for a specific hash</caption>
     * const myHash = 3;
     * const hashEquals = {hash: myHash, equals: () => true}
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const getResult = hashmap.optionalGet(0, hashEquals);
     * // getResult === Option.some('value3')  {value:'value3',has:true}
     * // the hash of the number 3 is actually also 3. all 32 bit integers have the same hash.
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get|Map.get}
     * @param {*} key - the key we use to identify if we have a match.
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @returns {Option} - an optional result.
     */
    optionalGet(key, overrides) {
        const op = this.equalsAndHash(key, overrides);
        return this.buckets.optionalGet(key, op);
    }

    /**
     * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.startsWith('val'));
     * // findResult === 'value1'
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
     * Find the last value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the last <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the last value it finds. (It does this by iterating over the hashmap in reverse, and returning the first
     * item that matches)
     * @example <caption>Find the last value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findLastResult = hashmap.findLast((value) => value.startsWith('val'));
     * // findLastResult === 'value3'
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findLastResult = hashmap.findLast((value) => value.startsWith('something'));
     * // findLastResult === undefined
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
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches, wrapped in an Option
     * - if no elements match, it returns none.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindResult = hashmap.optionalFind((value) => value.startsWith('val'));
     * // optionalFindResult.value === 'value1'
     * // optionalFindResult.has === true
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindResult = hashmap.optionalFind((value) => value.startsWith('something'));
     * // optionalFindResult.has === false
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {HashMap#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {Option.<*>|Option.none} the value of the element that matches.
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
     * Find the last value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the last <code>value</code> from the <code>[key,value]</code> pair that matches, wrapped in an Option
     * - if no elements match, it returns none.
     * - if no predicate is defined, will return the last value it finds. (It does this by iterating over the hashmap in reverse, and returning the first
     * item that matches)
     * @example <caption>Find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindLastResult = hashmap.optionalFindLast((value) => value.startsWith('val'));
     * // optionalFindLastResult.value === 'value3'
     * // optionalFindLastResult.has === true
     * @example <caption>Can't find a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindLastResult = hashmap.optionalFindLast((value) => value.startsWith('something'));
     * // optionalFindLastResult.has === false
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {HashMap#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {Option.<*>|Option.none} the value of the element that matches.
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
     * Find the first key in the map which passes the provided  <code>MatchesPredicate</code>.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first key it finds.
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findKeyResult = hashmap.findKey((value) => value.startsWith('val'));
     * // findKeyResult === 1
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findKeyResult = hashmap.findKey((value) => value.startsWith('something'));
     * // findKeyResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findKeyPredicate</code>
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
     * Find the last key in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the last <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the last key it finds. (It does this by iterating over the hashmap in reverse, and returning the first
     * item that matches)
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findLastKeyResult = hashmap.findLastKey((value) => value.startsWith('val'));
     * // findLastKeyResult === 3
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findLastKeyResult = hashmap.findLastKey((value) => value.startsWith('something'));
     * // findLastKeyResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.prototype.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findKeyPredicate</code>
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
     * Find the first key in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches, wrapped in an Option
     * - if no elements match, it returns none.
     * - if no predicate is defined, will return the first key it finds.
     *
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindKeyResult = hashmap.optionalFindKey((value) => value.startsWith('val'));
     * // optionalFindKeyResult.value === 1
     * // optionalFindKeyResult.has === true
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindKeyResult = hashmap.optionalFindKey((value) => value.startsWith('something'));
     * // optionalFindKeyResult.has === false
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.prototype.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findKeyPredicate</code>
     * @returns {Option.<*>|Option.none} the key of the element that matches.
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
     * Find the last key in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the last <code>key</code> from the <code>[key,value]</code> pair that matches, wrapped in an Option
     * - if no elements match, it returns none.
     * - if no predicate is defined, will return the last key it finds. (It does this by iterating over the hashmap in reverse, and returning the first
     * item that matches)
     * @example <caption>Find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindLastKeyResult = hashmap.optionalFindLastKey(value) => value.startsWith('val'));
     * // optionalFindLastKeyResult.value === 3
     * // optionalFindLastKeyResult.has === true
     * @example <caption>Can't find a key</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const optionalFindLastKeyResult = hashmap.optionalFindLastKey((value) => value.startsWith('something'));
     * // optionalFindLastKeyResult.has === false
     * @see {@link Option.some}
     * @see {@link Option.none}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.prototype.findIndex}
     * @param {HashMap#MatchesPredicate} [findKeyPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [thisArg] - Value to use as <code>this</code> when executing <code>findKeyPredicate</code>
     * @returns {Option.<*>|Option.none} the key of the element that matches.
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
     *  - If the key already exists, this will overwrite the value with the new value.
     *  - If it doesn't exist it adds the new key value pair to the map.
     *  - NB: Ordering in a HashMap is not defined by insertion order (much), but by hash value (mostly).
     *
     * @example <caption>set a value</caption>
     * const hashmap = new HashMap();
     * hashmap.set(1,'value1');
     * const hasResult = hashmap.has(1);
     * // hasResult === true
     * @example <caption>>overwrite a value</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2']]);
     * hashmap.set(2,'other');
     * const getResult = hashmap.get(2);
     * // getResult === 'other'
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
     * const hashmap = new HashMap();
     * hashmap.set(new NameKey('John','Smith'),'Librarian');
     * const hasResult = hashmap.has(new NameKey('John','Smith'));
     * // hasResult === true
     * @example <caption>Advanced: using a custom hash and equals, to set a value to a specific
     * hash</caption>
     * const hashmap = new HashMap();
     * hashmap.set(1,'value1', {hash: 3});
     * const hasResult = hashmap.has(3, {equals: () => true} );
     * // hasResult === true
     * // the hash of the number 3 is actually also 3. all 32 bit integers have the same hash.
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set|Map.prototype.set}
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {HashMap} this hashmap
     */
    set(key, value, overrides) {
        const op = this.equalsAndHash(key, overrides);
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     * Given a key and a handler object, the emplace method will either remap an existing entry,
     * insert a new entry from a mapping function, or both. emplace will return the updated or
     * inserted value.
     * @example <caption>insert into the map</caption>
     * const hashmap = new HashMap();
     * const handler = {
     *     update: () => {
     *         return 'update';
     *     },
     *     insert: (key, map) => {
     *         return 'insert';
     *     }
     * };
     * const ret = hashmap.emplace('key', handler)
     * // hashmap = [['key', 'insert']]
     * // ret === 'insert'
     * @example <caption>update the map</caption>
     * const hashmap = new HashMap([['key','value']]);
     * const handler = {
     *     update: () => {
     *         return 'update';
     *     },
     *     insert: (key, map) => {
     *         return 'insert';
     *     }
     * };
     * const ret = hashmap.emplace('key', handler)
     * // hashmap = [['key', 'update']]
     * // ret === 'update'
     * @example <caption>insert into the map if the key already exists without an update</caption>
     * const hashmap = new HashMap([['key','value']]);
     * const handler = {
     *     insert: (key, map) => {
     *         return 'insert';
     *     }
     * };
     * const ret = hashmap.emplace('key', handler)
     * // hashmap = [['key', 'value']]
     * // ret === 'value'
     * @example <caption>update into the map without an insert method (throws an error)</caption>
     * const hashmap = new HashMap([['key','value']]);
     * const handler = {
     *     update: (oldValue, key, map) => {
     *         return 'update';
     *     }
     * };
     * hashmap.emplace('key', handler)
     * // throws an Error as insert doesn't exist
     * // hashmap = [['key', 'value']]
     *
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
     * const handler = {
     *     insert: (key, map) => {
     *         return 'Librarian';
     *     }
     * };
     * const hashmap = new HashMap();
     * const ret = hashmap.emplace(new NameKey('John','Smith'),handler);
     * // ret === 'Librarian'
     * @example <caption>Advanced: using a custom hash and equals, to emplace a value to a specific
     * hash</caption>
     * const handler = {
     *     insert: (key, map) => {
     *         return 'value1';
     *     }
     * };
     * const hashmap = new HashMap();
     * const ret = hashmap.emplace(1,handler, {hash: 3});
     * // ret === 'value1'
     * // the hash of the number 3 is actually also 3. all 32 bit integers have the same hash.
     * // 0 doesn't exist in the hashMap, but we are circumventing using the key entirely.
     * @see {@link https://tc39.es/proposal-upsert/ upsert proposal}
     * @see {@link https://github.com/tc39/proposal-upsert|Map.prototype.emplace}
     * @param {*} key - the key we want to key our value to
     * @param {HashMap#emplaceHandler<insert,update>} handler - the insert and update methods we
     * want to use.
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.
     * @return {*} the new value that was set, or overwrote.
     * @throws {Error} if the insert method does not exist, and it can't find the key.
     */
    emplace(key, handler, overrides) {
        const op = this.equalsAndHash(key, overrides);
        return this.buckets.emplace(key, handler, op);
    }

    /**
     * Copies all the entries from the map, array or iterable, into this hashmap.
     *
     * @example <caption>copy into the HashMap from an array of key value pairs</caption>
     * const hashmap = new HashMap([['key0','value0']]);
     * const arr = [[1,'value1'],[2,'value2'],[3,'value3']];
     * hashmap.copy(arr);
     * // hashmap.size === 4;
     * @example <caption>copy into the HashMap from another map</caption>
     * const hashmap = new HashMap([['key0','value0']]);
     * const map = new Map([[1,'value1'],[2,'value2'],[3,'value3']])
     * hashmap.copy(map);
     * // hashmap.size === 4;
     * @example <caption>copy into the HashMap from another HashMap</caption>
     * const first = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']])
     * const hashmap = new HashMap(first);
     * // hashmap.size === 3;
     * @example <caption>copy into the HashMap from a class with symbol iterator</caption>
     * const hashmap = new HashMap([['key0','value0']]);
     * class MyIterable = {
     *     *[Symbol.iterator] () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const iterable = new MyIterable();
     * hashmap.copy(iterable);
     * // hashmap.size === 5;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>copy into the HashMap from an object with an entries generator function</caption>
     * const hashmap = new HashMap([['key0','value0']]);
     * const entriesObj = {
     *     entries: function* () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * hashmap.copy(entriesObj);
     * // hashmap.size === 5;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>copy into the HashMap from an object with a forEach function</caption>
     * const hashmap = new HashMap([['key0','value0']]);
     * const forEachObj = {
     *      forEach: (callback, ctx) => {
     *              for (let i = 1; i <= 4; i++) {
     *                  callback.call(ctx, 'value' + i, 'key' + i);
     *              }
     *      }
     * };
     * hashmap.copy(forEachObj);
     * // hashmap.size === 5;
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|Object)} other - the
     * iterable to copy
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
     * Makes a full copy of this hashmap and returns the clone.
     *
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
        const op = this.equalsAndHash(key, overrides);
        this.buckets.delete(key, op);
        return this;
    }

    /**
     * Clears the data from this hashmap. All data is orphaned, and will be Garbage Collected.
     * @return {HashMap} this hashmap
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
     * @example <caption>Do all values start with 'value'. (yes)</caption>
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
     * @param {HashMap#overrides<reverse>} [overrides] - a set of optional overrides to allow a user to define whether to search in reverse
     * @returns {boolean} true if all elements match, false if one or more elements fails to match.
     */
    every(everyPredicate = () => true, thisArg = undefined, overrides = undefined) {
        const iterator = overrides && overrides.reverse ? this.entriesRight() : this.entries();
        for (const [key, value] of iterator) {
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
     * @example <caption>iterate over the map</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for ([key, value] of hashmap) {
     *     console.log(key,value);
     * }
     * // logs:
     * // 1 value1
     * // 2 value2
     * // 3 value3
     * @yields {Array.<key,value>} each entry in the map
     */
    * [Symbol.iterator]() {
        yield* this.entries();
    }

    /**
     * Iterates over all the entries in the map.
     * @example <caption>iterate over the map</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for ([key, value] of hashmap.entries()) {
     *     console.log(key,value);
     * }
     * // logs:
     * // 1 value1
     * // 2 value2
     * // 3 value3
     *
     * @yields {Array.<key,value>} each entry in the map
     */
    * entries() {
        yield* this.buckets;
    }

    /**
     * Iterates over all the entries in the map in reverse.
     *
     * @example <caption>iterate over the map in reverse</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for ([key, value] of hashmap.entriesRight()) {
     *     console.log(key,value);
     * }
     * // logs:
     * // 3 value3
     * // 2 value2
     * // 1 value1
     * @yields {Array.<key,value>} each entry in the map in reverse order
     */
    * entriesRight() {
        yield* this.buckets.entriesRight();
    }

    /**
     * Iterates over all the keys in the map.
     * @example <caption>iterate over the keys</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for (const key of hashmap.keys()) {
     *     console.log(key);
     * }
     * // logs:
     * // 1
     * // 2
     * // 3
     *
     * @yields {key:any} each key in the map
     */
    * keys() {
        yield* this.buckets.keys();
    }

    /**
     * Iterates over all the values in the map.
     * @example <caption>iterate over the values</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for (const value of hashmap.values()) {
     *     console.log(value);
     * }
     * // logs:
     * // value1
     * // value2
     * // value3
     * @yields {value:any} each value in the map.
     */
    * values() {
        yield* this.buckets.values();
    }

    /**
     * Iterates over all the keys in the map in reverse.
     * @example <caption>iterate over the keys</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for (const key of hashmap.keysRight()) {
     *     console.log(key);
     * }
     * // logs:
     * // 3
     * // 2
     * // 1
     *
     * @yields {key:any} each key in the map in reverse order
     */
    * keysRight() {
        yield* this.buckets.keysRight();
    }

    /**
     * Iterates over all the values in the map in reverse.
     * @example <caption>iterate over the values</caption>
     * const hashmap = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * for (const value of hashmap.valuesRight()) {
     *     console.log(value);
     * }
     * // logs:
     * // value3
     * // value2
     * // value1
     *
     * @yields {value:any} each value in the map in reverse order
     */
    * valuesRight() {
        yield* this.buckets.valuesRight();
    }

}

/*
 * private methods
 */
Object.defineProperty(HashMap.prototype, 'equalsFor', {value: equalsFor, configurable: true});
Object.defineProperty(HashMap.prototype, 'equalsAndHash', {
    value: equalsAndHash,
    configurable: true
});
Object.defineProperty(HashMap.prototype, 'createContainer', {
    value: function createContainer(parent, hash) {
        return new Container(this, parent, hash);
    },
    configurable: true
});
