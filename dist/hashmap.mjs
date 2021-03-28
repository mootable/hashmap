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
function isFunction(func) {
    return !!(func && func.constructor && func.call && func.apply);
}

/**
 * Is the passed object iterable
 * @param iterable
 * @return {boolean}
 */
function isIterable(iterable) {
    return !!(iterable && isFunction(iterable[Symbol.iterator]));
}

/**
 * Is the passed value not null and a string
 * @param str
 * @returns {boolean}
 */
function isString(str) { // jshint ignore:line
    return !!(str && (typeof str === 'string' || str instanceof String));
}

/**
 * sameValueZero is the equality method used by Map, Array, Set etc.
 * The only difference between === and sameValueZero is that NaN counts as equal on sameValueZero
 * @see {@link https://262.ecma-international.org/6.0/#sec-samevaluezero saveValueZero}
 * @param x - the first object to compare
 * @param y - the second object to compare
 * @returns {boolean} - if they are equals according to ECMA Spec for Same Value Zero
 */
function sameValueZero(x, y) {
    return x === y || (Number.isNaN(x) && Number.isNaN(y));
}

/**
 * Hash - Hash functions
 * @namespace Mootable.Hash
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */
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
function hash(key, len = 0, seed = 0) {
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
function hashCodeFor(key) {
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
            if (key instanceof Date) {
                return key.getTime();
            }
            if (key instanceof RegExp) {
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
 * @private
 * @ignore
 * @type {number} - an internal counter for managing unhashable objects.
 */
let HASH_COUNTER = 0;

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
function equalsFor(key) {
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
    if (key && isFunction(key.equals) && key.equals(key, key)) {
        return (me, them) => me.equals(them, me);
    }
    return sameValueZero;
}

/**
 * A short cut for determining both the equals function and hashcode value for a given key.
 *
 * @param {*} key - the key we use to identify values.
 * @param {(function(*, *): boolean)} [equals = equalsFor(key)] - an optional function for determinging equality
 * @param {number} [hash = hashCodeFor(key)] - an optional hashcode for the provided key
 * @return {{equals: (function(*, *): boolean), hash: number}} - a tuple that represents a hash and an equals.
 */
function equalsAndHash(key, equals, hash) {
    if (!(isFunction(equals) && equals(key, key))) {
        equals = equalsFor(key);
    }
    if (!Number.isSafeInteger(hash)) {
        hash = hashCodeFor(key);
    }
    return {
        hash,
        equals
    };
}

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
class Option {
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
const some = (value) => new Option(true, value);
/**
 * A constant representation of an Option with nothing in it:
 * <code>{value:undefined,has:false}</code>
 * @type {Option}
 */
const none = new Option(false, undefined);

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * The base class for the Map Implementations, and the Higher Order Functions for Maps
 * @example <caption>Create a MapIterable from a Map.</caption>
 * const myMap = new Map();
 * const mapIterable = MapIterable.from(myMap);
 * @example <caption>Create a MapIterable from a Set.</caption>
 * const mySet = new Set();
 * // sets wrapped in a map iterable must have a value of an Array matching [key,value]
 * mySet.add(["key", "value"]);
 * const mapIterable = MapIterable.from(mySet);
 * @example <caption>Create a MapIterable from an Array.</caption>
 * // arrays wrapped in a map iterable must have be an array of arrays matching [key,value]
 * const myArray = [["key", "value"]];
 * const mapIterable = MapIterable.from(myArray);
 * @example <caption>Create a MapIterable from an Iterable.</caption>
 * // iterables wrapped in a map iterable must yield arrays matching [key,value],
 * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]()
 * // can be used as long as they follow that contract.
 * const myIterable = {
 *     *[Symbol.iterator]() {
 *         yield ["key1", "value1"];
 *         yield ["key2", "value2"];
 *         yield ["key3", "value3"];
 *     }
 * }
 * const mapIterable = MapIterable.from(myIterable);
 * @example <caption>Create a MapIterable from a Mootable HashMap.</caption>
 * // all Mootable HashMaps extend MapIterable, no need to wrap with the MapIterable.from() function.
 * const mapIterable = new HashMap();
 * @example <caption>Create a MapIterable from a Mootable LinkedHashMap.</caption>
 * // all Mootable LinkedHashMaps extend MapIterable, no need to wrap with the MapIterable.from() function.
 * const mapIterable = new LinkedHashMap();
 * @abstract
 */
class MapIterable {

    /**
     * Returns the number of elements returned by this Map Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concatenation, it just queries the base collection size.
     * @example <caption>Return the size of this mapIterable.</caption>
     * const myMap = new Map();
     * // sets 2 values, and replaces 1 of them
     * myMap.set("key1","val1").set("key2","val2").set("key2","val2a");
     * const mapIterable = MapIterable.from(myMap);
     * // returns 2
     * const theSize = mapIterable.size;
     * @returns {number} the total number of elements in this MapIterable
     */
    get size() {
        let accumulator = 0;
        for (const i of this)   // jshint ignore:line
        {
            accumulator++;
        }
        return accumulator;
    }

    /**
     * Wraps any class that iterates with <code>[key,value]</code> pairs and provides higher order chained functions.
     *
     * @example <caption>Create a MapIterable from a Map.</caption>
     * const myMap = new Map();
     * const mapIterable = MapIterable.from(myMap);
     * @example <caption>Create a MapIterable from a Set.</caption>
     * const mySet = new Set();
     * // sets wrapped in a map iterable must have a value of an Array matching [key,value]
     * mySet.add(["key", "value"]);
     * const mapIterable = MapIterable.from(mySet);
     * @example <caption>Create a MapIterable from an Array.</caption>
     * // arrays wrapped in a map iterable must have be an array of arrays matching [key,value]
     * const myArray = [["key", "value"]];
     * const mapIterable = MapIterable.from(myArray);
     * @example <caption>Create a MapIterable from an Iterable.</caption>
     * // iterables wrapped in a map iterable must yield arrays matching [key,value],
     * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]()
     * // can be used as long as they follow that contract.
     * const myIterable = {
     *     *[Symbol.iterator]() {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *     }
     * }
     * const mapIterable = MapIterable.from(myIterable);
     * @example <caption>Create a MapIterable from a Mootable HashMap.</caption>
     * // all Mootable HashMaps extend MapIterable, no need to wrap with the MapIterable.from function. If you do it will just return it back.
     * const mapIterable = new HashMap();
     * @example <caption>Create a MapIterable from a Mootable LinkedHashMap.</caption>
     * // all Mootable LinkedHashMaps extend MapIterable, no need to wrap with the MapIterable.from() function.If you do it will just return it back.
     * const mapIterable = new LinkedHashMap();
     * @param {(Set.<Array.<key,value>>|Map|Array.<Array.<key,value>>|Iterator.<Array.<key,value>>|SetIterable.<Array.<key,value>>)} mapIterable the map to wrap
     * @return {MapIterable} the wrapped Map.
     */
    static from(mapIterable) {
        if (mapIterable instanceof MapIterable) {
            return mapIterable;
        }
        return new MapIterableWrapper(mapIterable);
    }

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
     * @callback MapIterable#MatchesPredicate
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {MapIterable} [iterable] - the calling Map Iterable.
     * @return {boolean} a value that coerces to true if it matches, or to false otherwise.
     */

    /**
     * Test each element of the map and only include entries where the <code>MatchesPredicate</code> returns true.
     * @example <caption>Only match keys which are odd numbered.</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const filteredIterable = hashmap.filter((value,key) => key % 2 !== 0);
     * filteredIterable.forEach((value) => console.log(value));
     * // will log to the console:
     * // value1
     * // value3
     * @param {MapIterable#MatchesPredicate} [filterPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, that entry is excluded.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
     * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
     */
    filter(filterPredicate = () => true, ctx = this) {
        return new MapFilter(this, filterPredicate, ctx);
    }

    /**
     * For Each Function
     * A callback to execute on every <code>[key,value]</code> pair of this map iterable.
     * @example <caption>log the keys and values</caption>
     * const forEachFunction = (value, key) => console.log(key,value)
     * @callback MapIterable#ForEachCallback
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {MapIterable|SetIterable} [iterable] - the calling Map Iterable.
     */

    /**
     * Execute the provided callback on every <code>[key,value]</code> pair of this map iterable.
     * @example <caption>Log all the keys and values.</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * mapIterable.forEach((value) => console.log(key, value));
     * // will log to the console:
     * // 1 value1
     * // 2 value2
     * // 3 value3
     * @param {MapIterable#ForEachCallback} [forEachCallback=(value, key, iterable) => {}]
     * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
     * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
     */
    forEach(forEachCallback = () => {
    }, ctx = this) {
        for (const [key, value] of this) {
            forEachCallback.call(ctx, value, key, this);
        }
        return this;
    }

    /**
     * Fills the provided collector, or an array if none provided, and fills it with the values of this {@link MapIterable}. Then return the collector.
     * The original collector, with the exception of arrays, will be modified as we call functions directly against it.
     *
     * A collector will be resolved in this order:
     *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}
     *    - a new array is created and passed back with the filled values, and the original is not changed.
     *  - Object with a function <code>.set</code>.
     *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}, {@link HashMap} or {@link LinkedHashMap}
     *    - it will call <code>set(key,value)</code> for every entry, if the value already exists for that key it is typically overridden. The original is modified.
     *  - Object with a function <code>.add</code>
     *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}
     *    - it will call <code>add([key,value])</code> for every entry, so that a <code>[key,value]</code> pair is added to the collection. The original is modified.
     *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}
     *    - It will call <code>obj[key] = value</code> for every entry, so that a property of <code>key</code> has a value of <code>value</code> set on it. The original is modified.
     *
     * @example <caption>Collect to a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const myArray = mapIterable.collect();
     * // myArray === [[1,'value1'],[2,'value2'],[3,'value3']]:
     * @example <caption>Collect with an empty existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldArray = [];
     * const newArray = mapIterable.collect(oldArray);
     * // newArray === [[1,'value1'],[2,'value2'],[3,'value3']]
     * // oldArray === []
     * @example <caption>Collect with an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldArray = [[2,'someOtherValue']];
     * const newArray = mapIterable.collect(oldArray);
     * // newArray === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
     * // oldArray === [[2,'someOtherValue']]
     * @example <caption>Collect to an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values, modifying the old array.</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const array  = [[2,'someOtherValue']];
     * array.push(mapIterable.collect())
     * // array === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
     * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldSet = new Set().add('willRemain');
     * const newSet = mapIterable.collect(oldSet);
     * // oldSet === newSet === ['willRemain',[1,'value1'],[2,'value2'],[3,'value3']]
     * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldMap = new Map().set(2,'willBeOverwritten').set(5,'willRemain');
     * const newMap = mapIterable.collect(oldMap);
     * // oldMap === newMap === [[2,'value2'],[5,'willRemain'],[1,'value1'],[3,'value3']]
     * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldObject = {'1','willBeOverridden'};
     * const newObject = mapIterable.collect(oldObject);
     * // oldObject === newObject === {'1': 'value1', '2': 'value2', '3': 'value3'}
     * @param {(Array|Set|Map|HashMap|LinkedHashMap|Object)} [collector=[]] the collection to fill
     * @returns {(Array|Set|Map|HashMap|LinkedHashMap|Object)} The collector that was passed in.
     */
    collect(collector = []) {
        if (Array.isArray(collector)) {
            if (collector.length) {
                return collector.concat(Array.from(this));
            }
            return Array.from(this);
        } else if (isFunction(collector.set)) {
            for (const [key, value] of this) {
                collector.set(key, value);
            }
        } else if (isFunction(collector.add)) {
            for (const entry of this) {
                collector.add(entry);
            }
        } else {
            for (const [key, value] of this) {
                collector[key] = value;
            }
        }
        return collector;
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
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const everyResult = hashmap.every((value) => value.startsWith('value'));
     * // everyResult === true
     * @example <caption>Do all values start with value. (no)</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'doesntStart'],[3,'value3']]);
     * const everyResult = hashmap.every((value) => value.startsWith('value'));
     * // everyResult === false
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every|Array.every}
     * @param {MapIterable#MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
     * @returns {boolean} true if all elements match, false if one or more elements fails to match.
     */
    every(everyPredicate = () => true, ctx = this) {
        for (const [key, value] of this) {
            if (!everyPredicate.call(ctx, value, key, this)) {
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
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const someResult = hashmap.some((value) => value.startsWith('value'));
     * // someResult === true
     * @example <caption>Do any values start with value. (yes 2 of them)</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'doesntStart'],[3,'value3']]);
     * const someResult = hashmap.some((value) => value.startsWith('value'));
     * // someResult === true
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.some}
     * @param {MapIterable#MatchesPredicate} [somePredicate=(value, key, iterable) => true] - the predicate to identify if we have a match.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>somePredicate</code>
     * @returns {boolean} - true if all elements match, false if one or more elements fails to match.
     */
    some(somePredicate = () => true, ctx = this) {
        for (const [key, value] of this) {
            if (somePredicate.call(ctx, value, key, this)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.endsWith('ue2'));
     * // findResult === 'value2'
     * @example <caption>Can't find a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findResult = hashmap.find((value) => value.startsWith('something'));
     * // findResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {MapIterable#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {*} - the value of the element that matches.
     */
    find(findPredicate = () => true, ctx = this) {
        for (const [key, value] of this) {
            if (findPredicate.call(ctx, value, key, this)) {
                return value;
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
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.endsWith('ue2'));
     * // findIndexResult === 2
     * @example <caption>Can't find a key</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const findIndexResult = hashmap.findIndex((value) => value.startsWith('something'));
     * // findIndexResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
     * @param {MapIterable#MatchesPredicate} [findIndexPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
     * @returns {*} - the key of the element that matches..
     */
    findIndex(findIndexPredicate = (value, key) => key, ctx = this) {
        for (const [key, value] of this) {
            if (findIndexPredicate.call(ctx, value, key, this)) {
                return key;
            }
        }
        return undefined;
    }

    /**
     * Find the first key in the map whose value is <code>===</code> to the provided value.
     * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - it is legitimate for values to be null or undefined, and if set, will find a key.
     *
     * Values are not indexed, this is potentially an expensive operation.
     *
     * @example <caption>Find the key for a value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const indexOfResult = hashmap.indexOf('value2');
     * // indexOfResult === 2
     * @example <caption>what is the key of a non existent value</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const indexOfResult = hashmap.indexOf('something');
     * // indexOfResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf|Array.indexOf}
     * @param {*} valueToCheck - the value we use to === against the entries value to identify if we have a match.
     * @returns {*} - the key of the element that matches..
     */
    indexOf(valueToCheck, equals = equalsFor(valueToCheck)) {
        for (const [key, value] of this) {
            if (equals(valueToCheck, value)) {
                return key;
            }
        }
        return undefined;
    }

    /**
     * Does the map have this key.
     * If backed by a Map or HashMap, or in fact any collection that implements the <code>.has(key)</code> function, then it will utilize that, otherwise it will iterate across the collection.
     * - return true if the <code>key</code> matches a <code>[key,value]</code> pair.
     * - if no elements match, it returns false.
     * - it is legitimate for keys to be null or undefined, and if set, will return true
     *
     * Maps typically index keys, and so is generally a fast operation.
     * @example <caption>>Does this contain a key that is there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hasResult = hashmap.has(1);
     * // hasResult === true
     * @example <caption>Does this contain a key that isn't there</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hasResult = hashmap.has(4);
     * // hasResult === false
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has|Map.has}
     * @param {*} key - the key we use to === against the entries key to identify if we have a match.
     * @returns {boolean} - if it holds the key or not.
     */
    has(key, equals = equalsFor(key)) {
        return this.some((_, otherKey) => equals(otherKey, key));
    }

    /**
     * Get a value from the map using this key.
     * If backed by a Map or HashMap, or in fact any collection that implements the <code>.get(key)</code> function, then it will utilize that, otherwise it will iterate across the collection.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - it is legitimate for keys to be null or undefined, and if set, will find a value.
     * - if a map is earlier on in the chain, the value, will be mapped along the way.
     *   - However there is no way to reverse map the key, as we do the fetch, which means the key has to be the same as the one in the original collection.
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
     * @param {*} key - the key we use to === against the entries key to identify if we have a match.
     * @returns {*} - the value of the element that matches.
     */
    get(key, equals = equalsFor(key)) {
        return this.find((value, otherKey) => equals(key, otherKey));
    }

    /**
     * Get a value from the map using this as an optional. This is effectively a combination of calling has and get at the same time.
     * If backed by a Map or HashMap, or in fact any collection that implements the <code>.optionalGet(key)</code> function, then it will utilize that, otherwise depending on the existence of has and get functions it may iterate across the collection.
     * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
     * - if no elements match, it returns undefined.
     * - it is legitimate for keys to be null or undefined, and if set, will find a value.
     * - if a map is earlier on in the chain, the value, will be mapped along the way.
     *   - However there is no way to reverse map the key, as we do the fetch, which means the key has to be the same as the one in the original collection.
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
     * @param {*} key - the key we use to === against the entries key to identify if we have a match.
     * @returns {{has: boolean, value:*}} - an optional result.
     */
    optionalGet(key, equals = equalsFor(key)) {
        let found = false;
        const val = this.find((value, otherKey) => {
            if (equals(key, otherKey)) {
                found = true;
                return true;
            }
            return false;
        });
        if (found) {
            return some(val);
        }
        return none;
    }

    /**
     * Reduce Function
     * A callback to accumulate values from the Map Iterables <code>[key,value]</code> into a single value.
     * if initial value is <code>undefined</code> or <code>null</code>, unlike Array.reduce,
     * no error occurs, and it is imply passed as the accumulator value
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
     * @example <caption>add all the keys</caption>
     * const reduceFunction = (accumulator, value, key) => accumulator+key
     * @callback MapIterable#ReduceFunction
     * @param {*} [accumulator] - the value from the last execution of this function.
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {MapIterable} [iterable] - the calling Map Iterable.
     * @return {*} [accumulator] - the value to pass to the next time this function is called or the final return value.
     */

    /**
     * Iterate through the map iterable reducing it to a single value.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
     * @example <caption>add all the keys</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const reduceResult = hashmap.reduce((accumulator, value, key) => accumulator+key, 0);
     * // reduceResult === 6
     * @example <caption>add all the values into one string in reverse order</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const reduceResult = hashmap.reduce((accumulator, value) => value+accumulator, '');
     * // reduceResult === 'value3value2value1'
     * @param {MapIterable#ReduceFunction} [reduceFunction=(accumulator, value, key, iterable) => true] - the predicate to identify if we have a match.
     * @param {*} [initialValue] the initial value to start on the reduce.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {*} - the final accumulated value.
     */
    reduce(reduceFunction = (accumulator, value) => value, initialValue = undefined, ctx = this) {
        let accumulator = initialValue;
        for (const [key, value] of this) {
            accumulator = reduceFunction.call(ctx, accumulator, value, key, this);
        }
        return accumulator;
    }

    /**
     * Map Function
     * A callback that takes a <code>[key,value]</code> and the current iterable, and returns a mapped value.
     * How this mapped value is used depends on the calling function.
     *  - mapKeys the key is transformed to the returned value
     *  - mapValues the value is transformed to the returned value
     *  - mapEntries the value should be of the form [key, value] and transforms each accordingly
     *  - map the MapIterable is turned into a SetIterable, and this returned value is the resultant entry.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
     * @example <caption>swap key and value</caption>
     * const mapEntriesFunction = ( value, key) => [value, key];
     * // the typical response is [key, value]
     * @callback MapIterable#MapFunction
     * @param {*} [value] - the entry value.
     * @param {*} [key] - the entry key
     * @param {MapIterable} [iterable] - the calling Map Iterable.
     * @return {*} [mappedValue] - the mapped value to return.
     */

    /**
     * For every entry, use the mapKeyFunction to transform the existing key.
     * This does not modify the original collection, and execution is deferred until it is fetched.
     * @example <caption>add one to all the keys and turn them into strings</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const mappedKeysIterable = hashmap.mapKeys((value, key) => 'k'+(key+1));
     * const mappedKeysArray = mappedKeysIterable.collect();
     * // mappedKeysArray === [['k2','value1'],['k3','value2'],['k4','value3']]
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
     * @param {MapIterable#MapFunction} [mapKeyFunction=(value, key, iterable) => key] - the function that transforms the key.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
     */
    mapKeys(mapKeyFunction = (value, key) => key, ctx = this) {
        return new MapKeyMapper(this, mapKeyFunction, ctx);
    }

    /**
     * For every entry, use the mapValueFunction to transform the existing value.
     * This does not modify the original collection, and execution is deferred until it is fetched.
     * @example <caption>prepend the values with the keys</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const mappedValuesIterable = hashmap.mapValues((value, key) => key + value);
     * const mappedValuesArray = mappedValuesIterable.collect();
     * // mappedValuesArray === [['1','1value1'],[2,'2value2'],[3,'3value3']]
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
     * @param {MapIterable#MapFunction} [mapValueFunction=(value, key, iterable) => value] - the function that transforms the value.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
     */
    mapValues(mapValueFunction = (value) => value, ctx = this) {
        return new MapValueMapper(this, mapValueFunction, ctx);
    }

    /**
     * For every entry, use the mapEntryFunction to transform the existing value and existing key.
     * This does not modify the original collection, and execution is deferred until it is fetched.
     * - If one Function is provided
     *   - The function MUST return an array with at least 2 entries, the first entry is the key, the second is the value.
     *   - if the parameter is not an array or a function a TypeError is thrown.
     * - If an array of Functions is provided
     *   - The first function, (if defined), modifies the key. It needs only return the key. see {@link MapIterable#mapKeys mapKeys}
     *   - the second function, (if defined), modifies the value. see {@link MapIterable#mapValues mapValues}
     *   - if both the first and second values in the array are not functions a TypeError is thrown.
     * - In both cases will return {@link MapIterable}
     * @example <caption>swap the keys and the values</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const mapEntriesIterable = hashmap.mapEntries((value, key) => [value,key])
     * const mapEntriesArray = mapEntriesIterable.collect();
     * // mapEntriesArray === [['value1',1],['value2',2],['value3',3]]
     * @example <caption>swap the keys and the values with 2 functions</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const mapEntriesIterable = hashmap.mapEntries([(value) => value,(value, key) => key])
     * const mapEntriesArray = mapEntriesIterable.collect();
     * // mapEntriesArray === [['value1',1],['value2',2],['value3',3]]
     * @example <caption>modify just the keys</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * // Notice we are passing an array of one function.
     * const mapEntriesIterable = hashmap.mapEntries([(value, key) => value])
     * const mapEntriesArray = mapEntriesIterable.collect();
     * // mapEntriesArray === [['value1','value1'],['value2','value2'],['value2','value2']]
     * @example <caption>modify just the values</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * // Notice we are passing an array of two, but have only defined the last as a function.
     * const mapEntriesIterable = hashmap.mapEntries([undefined,(value, key) => key])
     * const mapEntriesArray = mapEntriesIterable.collect();
     * // mapEntriesArray === [[1,1],[2,2],[3,3]]
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
     * @param {MapIterable#MapFunction|Array.<MapIterable#MapFunction,MapIterable#MapFunction>} [mapEntryFunction=(value, key, iterable) => [key, value]] - the function that transforms the key and value.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
     * @throws {TypeError} if at least one function is not provided.
     */
    mapEntries(mapEntryFunction = (value, key) => [key, value], ctx = this) {

        if (Array.isArray(mapEntryFunction)) {
            if (mapEntryFunction.length === 1 && isFunction(mapEntryFunction[0])) {
                // we are just mapping keys
                return this.mapKeys(mapEntryFunction[0], ctx);
            } else if (mapEntryFunction.length > 1) {
                if (isFunction(mapEntryFunction[0])) {
                    if (isFunction(mapEntryFunction[1])) {
                        // We don't chain, as we don't want the transformed value or key, to appear in either functions as arguments.
                        const joinedFunction = (value, key, iterable) => [mapEntryFunction[0].call(ctx, value, key, iterable), mapEntryFunction[1].call(ctx, value, key, iterable)];
                        return new MapEntryMapper(this, joinedFunction, this);
                    } else {
                        // we are just mapping keys
                        return this.mapKeys(mapEntryFunction[0], ctx);
                    }
                } else if (isFunction(mapEntryFunction[1])) {
                    // we are just mapping values
                    return this.mapValues(mapEntryFunction[1], ctx);
                }
            }
        } else if (isFunction(mapEntryFunction)) {
            return new MapEntryMapper(this, mapEntryFunction, ctx);
        }
        // we aren't mapping, lets give the developer a hint as to what the problem is
        throw new TypeError('MapIterable.mapEntries expects a function or an array of functions');
    }

    /**
     * For every entry, use the mapFunction to transform the existing value and existing key.
     * - If one Function is provided, we are transforming the map into a set.
     *   - The function can return any value. This is the equivalent of turning the MapIterable into a SetIterable.
     *   - if the parameter is not an array or a function a TypeError is thrown.
     *   - Will return a {@link SetIterable}
     * - If an array of Functions is provided, we are transforming the map into another map. see {@link MapIterable#mapEntries mapEntries}
     *   - The first function, (if defined), modifies the key. It needs only return the key. see {@link MapIterable#mapKeys mapKeys}
     *   - the second function, (if defined), modifies the value. see {@link MapIterable#mapKeys mapValues}
     *   - if both the first and second values in the array are not functions a TypeError is thrown.
     *   - Will return a {@link MapIterable}.
     * @example <caption>return just values</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const setIterable = hashmap.map((value, key) => value)
     * const mapArray = setIterable.collect();
     * // mapArray === ['value1','value2','value3']
     * // setIterable instanceof SetIterable
     * @example <caption>swap the keys and the values</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const setIterable = hashmap.map((value, key) => [value,key])
     * const mapArray = setIterable.collect();
     * // mapArray === [['value1',1],['value2',2],['value3',3]]
     * // setIterable instanceof SetIterable
     * @example <caption>swap the keys and the values with 2 functions</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const mapIterable = hashmap.map([(value) => value,(value, key) => key])
     * const mapArray = mapIterable.collect();
     * // mapArray === [['value1',1],['value2',2],['value3',3]]
     * // mapIterable instanceof MapIterable
     * @example <caption>modify just the keys</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * // Notice we are passing an array of one function.
     * const mapIterable = hashmap.map([(value, key) => value])
     * const mapArray = mapIterable.collect();
     * // mapArray === [['value1','value1'],['value2','value2'],['value2','value2']]
     * // mapIterable instanceof MapIterable
     * @example <caption>modify just the values</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * // Notice we are passing an array of two, but have only defined the last as a function.
     * const mapIterable = hashmap.map([undefined,(value, key) => key])
     * const mapArray = mapIterable.collect();
     * // mapArray === [[1,1],[2,2],[3,3]]
     * // mapIterable instanceof MapIterable
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
     * @param {MapIterable#MapFunction|Array.<MapIterable#MapFunction,MapIterable#MapFunction>} [mapFunction=(value, key, iterable) => [key, value]] - the function that transforms the key and value.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {SetIterable|MapIterable} an iterable that allows you to iterate single entries in a set, or an iterable that allows you to iterate a map.
     * @throws {TypeError} if at least one function is not provided.
     */
    map(mapFunction = (value, key) => {
        return [key, value];
    }, ctx = this) {
        if (Array.isArray(mapFunction)) {
            return this.mapEntries(mapFunction, ctx);
        }
        if (isFunction(mapFunction)) {
            return new MapMapper(this, mapFunction, ctx);
        }
        throw new TypeError('MapIterable.map expects a function or an array of functions');
    }

    /**
     * Return a SetIterable or MapIterable which is a concatenation of this and the provided iterable.
     * - If the provided value is a MapIterable or a Map then the returned iterable is a MapIterable.
     * - Otherwise since we have no idea if it will return key value pairs we return a SetIterable.
     *   - If you know the container stores [key,value] pairs and want to return a MapIterable, use {@link MapIterable#concatMap concatMap}
     * This is based on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} it does not modify the original iterables, and returns a new one.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat|Array.concat}
     * @example <caption>concatenate 2 maps</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hashmap2 = new LinkedHashMap([[1,'value1a'],[2,'value2a'],[3,'value3a']]);
     * const mapIterable = hashmap.concat(hashmap2);
     * // Notice how the keys are repeated, any unique constraints are gone.
     * // mapIterable === [[1,'value1'],[2,'value2'],[3,'value3'],[1,'value1a'],[2,'value2a'],[3,'value3a']]
     * // mapIterable instanceof MapIterable
     * @example <caption>concatenate an array</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const array = ['hello','world'];
     * const setIterable = hashmap.concat(array);
     * // Notice how we have key value pairs and strings mixed.
     * // setIterable === [[1,'value1'],[2,'value2'],[3,'value3'],'hello','world']
     * // setIterable instanceof SetIterable
     * @param {(Array|Set|Map|HashMap|LinkedHashMap)} otherIterable the iterable to concat to this one.
     * @return {SetIterable|MapIterable} the new iterable to return
     */
    concat(otherIterable) {
        if (otherIterable) {
            if (otherIterable instanceof MapIterable || otherIterable instanceof Map) {
                return this.concatMap(otherIterable);
            }
            return new SetConcat(this, SetIterable.from(otherIterable));
        }
        return this;
    }

    /**
     * Return a MapIterable which is a concatenation of this and the provided iterable.
     * - If the provided value is a MapIterable or a Map then the returned iterable is a MapIterable.
     * - Otherwise the iterable MUST return [key,value] pairs
     *
     * @example <caption>concatenate 2 maps</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const hashmap2 = new LinkedHashMap([[1,'value1a'],[2,'value2a'],[3,'value3a']]);
     * const mapIterable = hashmap.concatMap(hashmap2);
     * // Notice how the keys are repeated, any unique constraints are gone.
     * // mapIterable === [[1,'value1'],[2,'value2'],[3,'value3'],[1,'value1a'],[2,'value2a'],[3,'value3a']]
     * // mapIterable instanceof MapIterable
     * @example <caption>concatenate an array</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const array = [[1,'hello'],[3,'world']];
     * const mapIterable = hashmap.concatMap(array);
     * // Notice how everything is a key value pair.
     * // mapIterable === [[1,'value1'],[2,'value2'],[3,'value3'],[1,'hello'],[3,'world']]
     * // mapIterable instanceof MapIterable
     * @param {(Array.<Array.<key,value>>|Set.<Array.<key,value>>|Map|HashMap|LinkedHashMap)} otherMapIterable the iterable to concat to this one, has to return [key,value] pairs
     * @return {MapIterable} the new iterable to return
     */
    concatMap(otherMapIterable) {
        if (otherMapIterable) {
            return new MapConcat(this, MapIterable.from(otherMapIterable));
        }
        return this;
    }

    /**
     * Return a SetIterable which is just the keys in this map.
     * @example <caption>collect all the keys</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const keysIterable = hashmap.keys();
     * // keysIterable instanceof SetIterable
     * const keys = keysIterable.collect();
     * // keys === [1,2,3]
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys keys}
     * @return {SetIterable} the keys as a set iterable.
     */
    keys() {
        return new EntryToKeyMapper(this);
    }

    /**
     * Return a SetIterable which is just the values in this map.
     * @example <caption>collect all the values</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const valuesIterable = hashmap.values();
     * // valuesIterable instanceof SetIterable
     * const values = valuesIterable.collect();
     * // values === ['value1','value2','value3']
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values values}
     * @return {SetIterable} the values as a set iterable.
     */
    values() {
        return new EntryToValueMapper(this);
    }

    /**
     * Return a MapIterable which is the entries in this map, this is just a short hand for the [Symbol.Iterator]() implementation
     * @example <caption>collect all the entries</caption>
     * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const entriesIterable = hashmap.entries();
     * // entriesIterable instanceof MapIterable
     * const entries = entriesIterable.collect();
     * // entries === [[1,'value1'],[2,'value2'],[3,'value3']]
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries entries}
     * @return {MapIterable}
     */
    entries() {
        return this;
    }
}

/**
 * The base class for the Set Implementations, and the Higher Order Functions for Sets, many Map functions result in SetIterables
 *
 * @example <caption>Create a SetIterable from a Map.</caption>
 * const myMap = new Map();
 * // iterating over a setIterable backed by a map, will yield [key,value] arrays.
 * const setIterable = SetIterable.from(myMap);
 * @example <caption>Create a SetIterable from a Set.</caption>
 * const mySet = new Set();
 * const setIterable = SetIterable.from(mySet);
 * @example <caption>Create a SetIterable from an Array.</caption>
 * const setIterable = SetIterable.from([]);
 * @example <caption>Create a SetIterable from an Iterable.</caption>
 * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]() can be used.
 * const myIterable = {
 *     *[Symbol.iterator]() {
 *         yield "value1";
 *         yield "value2";
 *         yield "value3";
 *     }
 * }
 * const setIterable = SetIterable.from(myIterable);
 * @example <caption>Create a SetIterable from a Mootable HashMap.</caption>
 * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
 * const setIterable =  SetIterable.from(new HashMap());
 * @example <caption>Create a SetIterable from a Mootable LinkedHashMap.</caption>
 * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
 * const setIterable =  SetIterable.from(new LinkedHashMap());
 * @abstract
 */
class SetIterable {

    /**
     * Returns the number of elements returned by this Set Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concatenation, it just queries the base collection size.
     * @returns {number}
     */
    get size() {
        let accumulator = 0;
        for (const i of this)  // jshint ignore:line
        {
            accumulator++;
        }
        return accumulator;
    }

    /**
     * Wraps any class that iterates any value and provides higher order chained functions.

     * @example <caption>Create a SetIterable from a Map.</caption>
     * const myMap = new Map();
     * // iterating over a set, will yield [key,value] arrays.
     * const setIterable = SetIterable.from(myMap);
     * @example <caption>Create a SetIterable from a Set.</caption>
     * const mySet = new Set();
     * const setIterable = SetIterable.from(mySet);
     * @example <caption>Create a SetIterable from an Array.</caption>
     * const setIterable = SetIterable.from([]);
     * @example <caption>Create a SetIterable from an Iterable.</caption>
     * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]() can be used.
     * const myIterable = {
     *     *[Symbol.iterator]() {
     *         yield "value1";
     *         yield "value2";
     *         yield "value3";
     *     }
     * }
     * const setIterable = SetIterable.from(myIterable);
     * @example <caption>Create a SetIterable from a Mootable HashMap.</caption>
     * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
     * const setIterable =  SetIterable.from(new HashMap());
     * @example <caption>Create a SetIterable from a Mootable LinkedHashMap.</caption>
     * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
     * const setIterable =  SetIterable.from(new LinkedHashMap());
     * @param {(Set|Map|Array|Iterator)} setIterable the set to wrap
     * @return {SetIterable} the wrapped Set.
     */
    static from(setIterable) {
        if (setIterable instanceof SetIterable) {
            return setIterable;
        }
        return new SetIterableWrapper(setIterable);
    }

    /**
     * Test each element of the set and only include entries where the <code>MatchesPredicate</code> returns true.
     * @example <caption>Only match values which are odd numbered.</caption>
     * const hashmap = SetIterable.from([1,2,3]);
     * const filteredIterable = hashmap.filter((value) => value % 2 !== 0);
     * filteredIterable.forEach((value) => console.log(value));
     * // will log to the console:
     * // 1
     * // 3
     * @param {MapIterable#MatchesPredicate} [filterPredicate=(value, key, setIterable) => true] - if the provided function returns <code>false</code>, that entry is excluded.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
     * @returns {SetIterable} - an iterable that allows you to iterate values.
     */
    filter(filterPredicate = () => true, ctx = this) {
        return new SetFilter(this, filterPredicate, ctx);
    }

    /**
     * Execute the provided callback on every <code>value</code> of this set iterable.
     * @example <caption>Log all the  values.</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * mapIterable.forEach((value) => console.log(value));
     * // will log to the console:
     * // value1
     * // value2
     * // value3
     * @param {MapIterable#ForEachCallback} [forEachCallback=(value, key, iterable) => {}]
     * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
     * @returns {SetIterable} - an iterable that allows you to iterate on values.
     */
    forEach(forEachCallback = () => {
    }, ctx = this) {
        for (const value of this) {
            forEachCallback.call(ctx, value, value, this);
        }
    }

    /**
     * Fills the provided collector, or an array if none provided, and fills it with the values of this {@link MapIterable}. Then return the collector.
     * The original collector, with the exception of arrays, will be modified as we call functions directly against it.
     *
     * A collector will be resolved in this order:
     *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}
     *    - a new array is created and passed back with the filled values, and the original is not changed.
     *  - Object with a function <code>.set</code>.
     *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}, {@link HashMap} or {@link LinkedHashMap}
     *    - it will call <code>set(key,value)</code> for every entry, if the value already exists for that key it is typically overridden. The original is modified.
     *  - Object with a function <code>.add</code>
     *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}
     *    - it will call <code>add([key,value])</code> for every entry, so that a <code>[key,value]</code> pair is added to the collection. The original is modified.
     *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}
     *    - It will call <code>obj[key] = value</code> for every entry, so that a property of <code>key</code> has a value of <code>value</code> set on it. The original is modified.
     *
     * @example <caption>Collect to a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const myArray = mapIterable.collect();
     * // myArray === [[1,'value1'],[2,'value2'],[3,'value3']]:
     * @example <caption>Collect with an empty existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldArray = [];
     * const newArray = mapIterable.collect(oldArray);
     * // newArray === [[1,'value1'],[2,'value2'],[3,'value3']]
     * // oldArray === []
     * @example <caption>Collect with an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldArray = [[2,'someOtherValue']];
     * const newArray = mapIterable.collect(oldArray);
     * // newArray === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
     * // oldArray === [[2,'someOtherValue']]
     * @example <caption>Collect to an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values, modifying the old array.</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const array  = [[2,'someOtherValue']];
     * array.push(mapIterable.collect())
     * // array === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
     * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldSet = new Set().add('willRemain');
     * const newSet = mapIterable.collect(oldSet);
     * // oldSet === newSet === ['willRemain',[1,'value1'],[2,'value2'],[3,'value3']]
     * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldMap = new Map().set(2,'willBeOverwritten').set(5,'willRemain');
     * const newMap = mapIterable.collect(oldMap);
     * // oldMap === newMap === [[2,'value2'],[5,'willRemain'],[1,'value1'],[3,'value3']]
     * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}</caption>
     * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
     * const oldObject = {'1','willBeOverridden'};
     * const newObject = mapIterable.collect(oldObject);
     * // oldObject === newObject === {'1': 'value1', '2': 'value2', '3': 'value3'}
     * @param {(Array|Set|Map|HashMap|LinkedHashMap|Object)} [collector=[]] the collection to fill
     * @returns {(Array|Set|Map|HashMap|LinkedHashMap|Object)} The collector that was passed in.
     */
    collect(collector = []) {
        if (Array.isArray(collector)) {
            if (collector.length) {
                return collector.concat(Array.from(this));
            }
            return Array.from(this);
        } else if (isFunction(collector.add)) {
            for (const entry of this) {
                collector.add(entry);
            }
        } else if (isFunction(collector.set)) {
            for (const entry of this) {
                collector.set(entry);
            }
        }
        return collector;
    }

    /**
     * Iterate through the set iterable reducing it to a single value.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
     * @example <caption>add all the values</caption>
     * const set = new Set().add(1).add(2).add(3);
     * const setIterable = SetIterable.from(set);
     * const reduceResult = setIterable.reduce((accumulator, value) => accumulator+value, 0);
     * // reduceResult === 6
     * @example <caption>add all the values into one string in reverse order</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const reduceResult = setIterable.reduce((accumulator, value) => value+accumulator, '');
     * // reduceResult === 'value3value2value1'
     * @param {MapIterable#ReduceFunction} [reduceFunction=(accumulator, value, key, iterable) => true] - the predicate to identify if we have a match.
     * @param {*} [initialValue] the initial value to start on the reduce.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {*} - the final accumulated value.
     */
    reduce(reduceFunction = (accumulator, value) => value, initialValue = undefined, ctx = this) {
        let accumulator = initialValue;
        for (const value of this) {
            accumulator = reduceFunction.call(ctx, accumulator, value, value, this);
        }
        return accumulator;
    }

    /**
     * Test to see if ALL values pass the test implemented by the passed <code>MatchesPredicate</code>.
     * - if any value does not match, returns false
     * - if all values match, returns true.
     * - if no values match, returns false.
     * - if the iterable is empty, returns true. (irrespective of the predicate)
     * - if no predicate is provided, returns true.
     *
     * @example <caption>Do all values start with value. (yes)</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const everyResult = setIterable.every((value) => value.startsWith('value'));
     * // everyResult === true
     * @example <caption>Do all values start with value. (no)</caption>
     * const set = new Set().add('value1').add('doesntStart').add('value3');
     * const setIterable = SetIterable.from(set);
     * const everyResult = setIterable.every((value) => value.startsWith('value'));
     * // everyResult === false
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every|Array.every}
     * @param {MapIterable#MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
     * @returns {boolean} true if all elements match, false if one or more elements fails to match.
     */
    every(everyPredicate = () => true, ctx = this) {
        for (const value of this) {
            if (!everyPredicate.call(ctx, value, value, this)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test to see if ANY value pass the test implemented by the passed <code>MatchesPredicate</code>.
     * - if any value matches, returns true.
     * - if all values match returns true.
     * - if no values match returns false.
     * - if the iterable is empty, returns true.
     * - if no predicate is provided, returns true.
     *
     * @example <caption>Do any values start with value. (yes all of them)</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const someResult = setIterable.some((value) => value.startsWith('value'));
     * // someResult === true
     * @example <caption>Do any values start with value. (yes 2 of them)</caption>
     * const set = new Set().add('value1').add('doesntStart').add('value3');
     * const setIterable = SetIterable.from(set);
     * const someResult = setIterable.some((value) => value.startsWith('value'));
     * // someResult === true
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.some}
     * @param {MapIterable#MatchesPredicate} [somePredicate=(value, key, iterable) => true] - the predicate to identify if we have a match.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>somePredicate</code>
     * @returns {boolean} - true if all values match, false if one or more values fails to match.
     */
    some(somePredicate = () => true, ctx = this) {
        for (const value of this) {
            if (somePredicate.call(ctx, value, this)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Does the set have this value.
     * If backed by a Set, or in fact any collection that implements the <code>.has(key)</code> function, then it will utilize that, otherwise it will iterate across the collection.
     * If backed by a Map or HashMap, then it will match [key,value] pairs not keys.
     * - return true if the <code>value</code> matches.
     * - if no values match, it returns false.
     * - it is legitimate for values to be null or undefined, and if added, will return true
     *
     * Sets typically index values, and so is generally a fast operation. However if it backed by a map, then this will be slow as it will be matching entries not keys.
     * @example <caption>Does this contain a value that is there</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const hasResult = setIterable.has('value2');
     * // hasResult === true
     * @example <caption>Does this contain a value that isn't there</caption>
     * const set = new Set().add(1).add(2).add(3);
     * const setIterable = SetIterable.from(set);
     * const hasResult = setIterable.has(4);
     * // hasResult === false
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has|Map.has}
     * @param {*} value - the value we use to === against the entries key to identify if we have a match.
     * @param {function} [equals] - if using an array, marks how deep we go through to test equality.
     * @returns {boolean} - if it holds the key or not.
     */
    has(value, equals = equalsFor(value)) {
        return this.some((otherValue) => equals(otherValue, value));
    }


    /**
     * Find the first value in the set which passes the provided <code>MatchesPredicate</code>.
     * - return the first <code>value</code> that matches
     * - if no value matches, it returns undefined.
     * - if no predicate is defined, will return the first value it finds.
     * @example <caption>Find a value</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const findResult = setIterable.find((value) => value.endsWith('ue2'));
     * // findResult === 'value2'
     * @example <caption>Can't find a value</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const findResult = setIterable.find((value) => value.startsWith('something'));
     * // findResult === undefined
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
     * @param {MapIterable#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findPredicate</code>
     * @returns {*} - the value that matches.
     */
    find(findPredicate = () => true, ctx = this) {
        for (const value of this) {
            if (findPredicate.call(ctx, value, value, this)) {
                return value;
            }
        }
        return undefined;
    }


    /**
     * For every entry, use the mapFunction to transform the existing value.
     *   - Will return a {@link SetIterable}
     * @example <caption>return just values with 'ish' on the end</caption>
     * const set = new Set().add('value1').add('value2').add('value3');
     * const setIterable = SetIterable.from(set);
     * const mapped = setIterable.map((value, key) => value+'ish');
     * const mapArray = mapped.collect();
     * // mapArray === ['value1ish','value2ish','value3ish']
     * // mapped instanceof SetIterable
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
     * @param {MapIterable#MapFunction} [mapFunction=(value, key, iterable) =>value] - the function that transforms the value.
     * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
     * @returns {SetIterable} an iterable that allows you to iterate single entries in the mapped set
     */
    map(mapFunction = (value) => value, ctx = this) {
        return new SetMapper(this, mapFunction, ctx);
    }


    /**
     * Return a SetIterable which is a concatenation of this and the provided iterable.
     * This is based on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} it does not modify the original iterables, and returns a new one.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat|Array.concat}
     * @example <caption>concatenate 2 sets</caption>
     * const set1 = new Set(['value1','value2','value3']);
     * const set2 = new Set(['value1a','value2a','value3a']);
     * const setIterable = SetIterable.from(set1).concat(set2);
     * // Notice how any unique constraints are gone.
     * // setIterable === ['value1','value2','value3','value1a','value2a'],'value3a']
     * // setIterable instanceof SetIterable
     * @example <caption>concatenate an array</caption>
     * const set = new Set(['value1','value2','value3']);
     * const array = ['hello','world'];
     * const setIterable = SetIterable.from(set).concat(array);
     * // setIterable === ['value1','value2','value3','hello','world']
     * // setIterable instanceof SetIterable
     * @param {(Array|Set|Map|HashMap|LinkedHashMap)} otherIterable the iterable to concat to this one.
     * @return {SetIterable} the new iterable to return
     */
    concat(otherIterable = []) {
        return new SetConcat(this, SetIterable.from(otherIterable));
    }

    /**
     * Return a SetIterable which is basically this SetIterable.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values values}
     * @return {SetIterable} the values as a set iterable.
     */
    values() {
        return this;
    }

    /**
     * Return a SetIterable which is basically this SetIterable.
     * Behaves the same way as the JS Set Object in that it just returns values
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/keys keys}
     * @return {SetIterable} the values as a set iterable.
     */
    keys() {
        return this;
    }

    /**
     * Return a MapIterable which are a value pair, returns [value,value]
     * @example <caption>collect all the entries</caption>
     * const set = new Set([1,2,3]);
     * const entriesIterable = SetIterable.from(set).entries();
     * // entriesIterable instanceof MapIterable
     * const entries = entriesIterable.collect();
     * // entries === [[1,1],[2,'2],[3,3]]
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries entries}
     * @return {MapIterable}
     */
    entries() {
        return MapIterable.from(this.map((value) => [value, value]));
    }
}

/**
 * @extends SetIterable
 * @private
 */
class SetIterableWrapper extends SetIterable {
    constructor(iterable, ctx) {
        super();
        this.iterable = iterable;
        this.ctx = ctx ? ctx : iterable;
    }

    get size() {
        return this.iterable.length ? this.iterable.length
            : (this.iterable.size ? this.iterable.size : super.size);
    }

    has(value, equals = equalsFor(value)) {
        // if is a map iterable then we want to return the entry not the key. otherwise we can shortcut
        if (this.iterable instanceof Set || this.iterable instanceof SetIterable) {
            return this.iterable.has(value, equals);
        }
        return super.has(value, equals);
    }

    * [Symbol.iterator]() {
        yield* this.iterable;
    }
}

/**
 * @extends MapIterable
 * @private
 */
class MapIterableWrapper extends MapIterable {
    constructor(iterable, ctx) {
        super();
        this.iterable = iterable;
        this.ctx = ctx ? ctx : iterable;
    }

    get size() {
        return this.iterable.length ? this.iterable.length
            : (this.iterable.size ? this.iterable.size : super.size);
    }

    * [Symbol.iterator]() {
        yield* this.iterable;
    }

    has(key) {
        return this.optionalGet(key).has;
    }

    optionalGet(key) {
        if (isFunction(this.iterable.optionalGet)) {
            return this.iterable.optionalGet(key);
        }
        if (isFunction(this.iterable.has)) {
            if (this.iterable.has(key)) {
                if (isFunction(this.iterable.get)) {
                    some(this.iterable.get(key));
                }
                return some(super.get(key));
            }
            return none;
        }
        return super.optionalGet(key);
    }

    get(key) {
        return this.optionalGet(key).value;
    }
}

/**
 * @extends MapIterableWrapper
 * @private
 */
class MapFilter extends MapIterableWrapper {

    constructor(iterable, filterPredicate, ctx) {
        super(iterable, ctx);
        this.filterPredicate = filterPredicate;
    }

    get size() {
        let accumulator = 0;
        for (const i of this)  // jshint ignore:line
        {
            accumulator++;
        }
        return accumulator;
    }

    * [Symbol.iterator]() {
        for (let [key, value] of this.iterable) {
            if (this.filterPredicate.call(this.ctx, value, key, this)) {
                yield [key, value];
            }
        }
    }

    optionalGet(key) {
        const opt = super.optionalGet(key);
        if (opt.has && !this.filterPredicate.call(this.ctx, opt.value, key, this)) {
            return none;
        }
        return opt;
    }

    has(key) {
        return this.optionalGet(key).has;
    }

    get(key) {
        return this.optionalGet(key).value;
    }
}

/**
 * @extends MapIterableWrapper
 * @private
 */
class MapKeyMapper extends MapIterableWrapper {

    constructor(iterable, mapFunction, ctx) {
        super(iterable, ctx);
        this.mapFunction = mapFunction;
    }

    * [Symbol.iterator]() {
        for (let [key, value] of this.iterable) {
            yield [this.mapFunction.call(this.ctx, value, key, this), value];
        }
    }
}

/**
 * @extends MapIterableWrapper
 * @private
 */
class MapValueMapper extends MapIterableWrapper {

    constructor(iterable, mapFunction, ctx) {
        super(iterable, ctx);
        this.mapFunction = mapFunction;
    }

    * [Symbol.iterator]() {
        for (let [key, value] of this.iterable) {
            yield [key, this.mapFunction.call(this.ctx, value, key, this)];
        }
    }

    optionalGet(key) {
        const opt = super.optionalGet(key);
        if (opt.has) {
            return some(this.mapFunction.call(this.ctx, opt.value, key, this));
        }
        return opt;
    }
}

/**
 * @extends MapIterableWrapper
 * @private
 */
class MapEntryMapper extends MapIterableWrapper {

    constructor(iterable, mapFunction, ctx) {
        super(iterable, ctx);
        this.mapFunction = mapFunction;
    }

    * [Symbol.iterator]() {
        for (let [key, value] of this.iterable) {
            const [newKey, newValue] = this.mapFunction.call(this.ctx, value, key, this);
            yield [newKey, newValue];
        }
    }

    get(key) {
        if (this.iterable.has(key)) {
            const value = this.iterable.get(key);
            return this.mapFunction.call(this.ctx, value, key, this)[1];
        }
        return undefined;
    }
}

/**
 * @extends MapIterable
 * @private
 */
class MapConcat extends MapIterable {
    constructor(iterable, otherIterable) {
        super();
        this.iterable = iterable;
        this.otherIterable = otherIterable;
    }

    get size() {
        return this.iterable.size + this.otherIterable.size;
    }

    * [Symbol.iterator]() {
        yield* this.iterable;
        yield* this.otherIterable;
    }

    optionalGet(key) {
        const opt = this.iterable.optionalGet(key);
        return opt.has ? opt : this.otherIterable.optionalGet(key);
    }

    has(key) {
        return this.optionalGet(key).has;
    }

    get(key) {
        return this.optionalGet(key).value;
    }
}

/**
 * @extends SetIterable
 * @private
 */
class SetConcat extends SetIterable {
    constructor(iterable, otherIterable) {
        super();
        this.iterable = iterable;
        this.otherIterable = otherIterable;
    }

    get size() {
        return this.iterable.size + this.otherIterable.size;
    }

    has(value, equals = equalsFor(value)) {
        return this.iterable.has(value, equals) || this.otherIterable.has(value, equals);
    }

    * [Symbol.iterator]() {
        yield* this.iterable;
        yield* this.otherIterable;
    }
}

/**
 * @extends SetIterableWrapper
 * @private
 */
class EntryToValueMapper extends SetIterableWrapper {

    constructor(iterable) {
        super(iterable);
    }

    * [Symbol.iterator]() {
        for (let [, value] of this.iterable) {
            yield value;
        }
    }


    has(value, equals = equalsFor(value)) {
        if (Array.isArray(value)) {
            return this.iterable.some((otherValue) => equals(value, otherValue));
        } else {
            return this.iterable.some((otherValue) => equals(value, otherValue));
        }
    }
}

/**
 * @extends SetIterableWrapper
 * @private
 */
class EntryToKeyMapper extends SetIterableWrapper {

    constructor(iterable) {
        super(iterable);
    }

    * [Symbol.iterator]() {
        for (let [key,] of this.iterable) {
            yield key;
        }
    }

    has(key) {
        return this.iterable.optionalGet(key).has;
    }
}

/**
 * @extends SetIterableWrapper
 * @private
 */
class MapMapper extends SetIterableWrapper {

    constructor(iterable, mapFunction, ctx) {
        super(iterable, ctx);
        this.mapFunction = mapFunction;
    }

    * [Symbol.iterator]() {
        for (let [key, value] of this.iterable) {
            yield this.mapFunction.call(this.ctx, value, key, this);
        }
    }

    /**
     * Only ever used for the Map function that produces a SetIterable.
     * @param value
     * @param equals
     * @return {boolean}
     */
    has(value, equals = equalsFor(value)) {
        return this.some((otherValue) => equals(value, otherValue));
    }
}

/**
 * @extends SetIterableWrapper
 * @private
 */
class SetMapper extends SetIterableWrapper {

    constructor(iterable, mapFunction, ctx) {
        super(iterable, ctx);
        this.mapFunction = mapFunction;
    }

    * [Symbol.iterator]() {
        for (let value of this.iterable) {
            yield this.mapFunction.call(this.ctx, value, value, this);
        }
    }

    has(value, equals = equalsFor(value)) {
        return this.some((otherValue) => equals(value, otherValue));
    }
}

/**
 * @extends SetIterableWrapper
 * @private
 */
class SetFilter extends SetIterableWrapper {

    constructor(iterable, filterPredicate, ctx) {
        super(iterable, ctx);
        this.filterPredicate = filterPredicate;
    }

    get size() {
        let accumulator = 0;
        for (const i of this)  // jshint ignore:line
        {
            accumulator++;
        }
        return accumulator;
    }

    * [Symbol.iterator]() {
        for (let value of this.iterable) {
            if (this.filterPredicate.call(this.ctx, value, value, this)) {
                yield value;
            }
        }
    }

    has(value, equals = equalsFor(value)) {
        if (this.iterable.has(value, equals)) {
            return this.filterPredicate.call(this.ctx, value, value, this);
        }
        return false;
    }
}

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * @private
 */
class Entry {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    overwrite(oldEntry) {
        oldEntry.value = this.value;
    }

    delete() {
    }
}

/**
 * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
 * @extends {MapIterable}
 */
class HashMap extends MapIterable {
    /**
     * @typedef HashMap~ConstructorOptions
     * @property {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>)} [copy] - an object that provides a forEach function with the same signature as`Map.forEach`.
     * such as `Map` or this `HashMap` and `LinkedHashMap`, or any iterable that provides [key,value] pairs such as a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * @property {number} [depth] - how many layers deep our hashtrie goes.
     * - Minimum: `1`
     * - Maximum/Default: `(32/widthAs2sExponent)-1`
     * @property {number} [widthAs2sExponent] - how many buckets in each hashtrie layer we use 2 to the power of widthAs2sExponent, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     * - Minimum: `1`
     * - Maximum: `16`
     * - Default: `6` (64 Buckets)
     */
    /**
     * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
     * - `new HashMap()` creates an empty hashmap
     * - `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * - `new HashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a hashmap with optional `depth` and `widthAs2sExponent`. If `copy` is provided (map, array or iterable), it's keys and values are inserted into this map.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *   2) `depth` is how many layers deep our hashtrie goes.
     *      - Minimum: `1`, Maximum/Default: `(32/widthAs2sExponent)-1`
     *   3) `widthAs2sExponent` is how many buckets in each hashtrie layer we use to the power of 2, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     *      - Minimum: `1`, Maximum: `16`, Default: `6` (64 Buckets)
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
     */
    constructor(args = {copy: undefined, depth: undefined, widthAs2sExponent: 6}) {
        super();
        let {depth, widthAs2sExponent, copy} = args;
        widthAs2sExponent = Math.max(1, Math.min(16, widthAs2sExponent)); // 2^6 = 64 buckets
        const defaultDepth = ((32 / widthAs2sExponent) >> 0) - 1;
        depth = Math.max(0, Math.min(depth && depth > 0 ? depth - 1 : defaultDepth, defaultDepth)); // 0 indexed so 3 is a depth of 4.
        const width = 1 << widthAs2sExponent; // 2 ^ widthAs2sExponent
        const mask = width - 1;
        this.options = Object.freeze({widthAs2sExponent, width, mask, depth});
        this.clear();
        if (args.forEach || (copy && copy.forEach)) {
            this.copy(args.forEach ? args : copy);
        }
    }

    get size() {
        return this.length;
    }


    has(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            return this.buckets.has(key, hashEq.equals, hashEq.hash);
        }
        return false;
    }


    get(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            return this.buckets.get(key, hashEq.equals, hashEq.hash);
        }
        return undefined;
    }


    // noinspection JSCheckFunctionSignatures
    optionalGet(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            return this.buckets.optionalGet(key, hashEq.equals, hashEq.hash);
        }
        return none;
    }

    /**
     * Sets a value onto this map, using the key as its reference.
     *
     * @param {*} key - the key we want to key our value to
     * @param {*} value - the value we are setting
     * @return {HashMap}
     */
    set(key, value, hashEq = equalsAndHash(key)) {
        this.addEntry(new Entry(key, value),hashEq);
        return this;
    }

    /**
     * @ignore
     * @param entry
     * @return {*}
     */
    addEntry(entry, hashEq) {
        if (this.buckets) {
            this.buckets = this.buckets.set(entry, hashEq.equals, hashEq.hash);
            this.length = this.buckets.length;
        } else {
            this.buckets = new HashContainer(entry, hashEq.hash, Object.assign({}, this.options), this.options.depth);
            this.length = 1;
        }
        return entry;
    }

    /**
     *
     * @param {Map|HashMap|LinkedHashMap|MapIterable|SetIterable.<Array.<key,value>>|Iterator.<Array.<key,value>>|Array.<Array.<key,value>>} other - the iterable to copy
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
        throw new TypeError('HashMap.copy expects an object which is iterable or has a forEach function on it');
    }

    /**
     * Makes a copy of this hashmap and returns a new one.
     * @return {HashMap}
     */
    clone() {
        return new HashMap({
            copy: this,
            depth: this.options.depth,
            widthAs2sExponent: this.options.widthAs2sExponent
        });
    }

    /**
     * Deletes an entry from this hashmap, using the provided key
     * @param key
     * @return {HashMap}
     */
    delete(key, hashEq = equalsAndHash(key)) {
        if (this.buckets) {
            this.buckets = this.buckets.delete(key, hashEq.equals, hashEq.hash);
            if (this.buckets) {
                this.length = this.buckets.length;
            } else {
                this.length = 0;
            }
        }
        return this;
    }

    /**
     * clears the data from this hashmap.
     * @return {HashMap}
     */
    clear() {
        // we clone the options as its dangerous to modify mid execution.
        this.buckets = undefined;
        this.length = 0;
        return this;
    }


    * [Symbol.iterator]() {
        if (this.buckets) {
            for (const entry of this.buckets) {
                yield entry;
            }
        }
    }
}

/**
 * @private
 */
class Container {
    constructor(entry) {
        this.entry = entry;
        this.length = 1;
    }

    get key() {
        return this.entry.key;
    }

    get value() {
        return this.entry.value;
    }

    get(key, equals) {
        if (equals(key, this.key)) {
            return this.entry.value;
        }
        return undefined;
    }

    optionalGet(key, equals) {
        if (equals(key, this.key)) {
            return some(this.entry.value);
        }
        return none;
    }

    set(newEntry, equals) {
        if (equals(newEntry.key, this.key)) {
            newEntry.overwrite(this.entry);
            return this;
        }
        return new LinkedStack(newEntry, this);
    }

    has(key, equals) {
        return equals(key, this.key);
    }

    delete(key, equals) {
        if (equals(key, this.key)) {
            this.entry.delete();
            return undefined;
        }
        return this;
    }

    forEach(func, ctx) {
        func.call(ctx, this.value, this.key);
        return this;
    }

    * [Symbol.iterator]() {
        if (this.length !== 0) {
            yield [this.key, this.value];
        }
    }
}

/**
 * @private
 * @extends Container
 */
class LinkedStack extends Container {
    constructor(entry, next) {
        super(entry);
        this.next = next;
        this.length = next.length + 1;
    }

    get(key, equals) {
        let container = this;
        // avoid recursion
        do {
            if (equals(key, container.key)) {
                return container.value;
            }
            container = container.next;
        }
        while (container);
        return undefined;
    }

    optionalGet(key, equals) {
        let container = this;
        // avoid recursion
        do {
            if (equals(key, container.key)) {
                return some(container.value);
            }
            container = container.next;
        }
        while (container);
        return none;
    }

    set(newEntry, equals) {
        let container = this;
        // avoid recursion
        while (container) {
            if (equals(newEntry.key, container.key)) {
                newEntry.overwrite(this.entry);
                return this;
            }
            container = container.next;
        }
        return new LinkedStack(newEntry, this);
    }

    has(key, equals) {
        let container = this;
        // avoid recursion
        do {
            if (equals(key, container.key)) {
                return true;
            }
            container = container.next;
        }
        while (container);
        return false;
    }

    delete(key, equals) {
        // first on the list.
        if (equals(key, this.key)) {
            this.entry.delete();
            // lengths are not necessarily consistent.
            if (this.next) {
                this.next.length = this.length - 1;
            }
            return this.next;
        }

        let container = this.next;
        let prev = this;
        // avoid recursion
        while (container) {
            if (equals(key, container.key)) {
                container.entry.delete();
                const next = container.next;
                if (next) {
                    container.entry = next.entry;
                    container.next = next.next;
                } else {
                    prev.next = undefined;
                }
                this.length--;
                return this;
            }
            prev = container;
            container = container.next;
        }
        return this;
    }

    * [Symbol.iterator]() {
        let container = this;
        while (container) {
            yield [container.key, container.value];
            container = container.next;
        }
    }

}

/**
 * @private
 * @extends Container
 */
class HashContainer extends Container {
    constructor(entry, hash, options, depth) {
        super(entry);
        this.hash = hash;
        this.options = options;
        this.depth = depth;
    }

    set(newEntry, equals, hash) {
        if (hash === this.hash && equals(newEntry.key, this.key)) {
            newEntry.overwrite(this.entry);
            return this;
        }
        const bucket = new HashBuckets(this.options, this.depth);
        bucket.set(this.entry, () => false, this.hash);
        bucket.set(newEntry, () => false, hash);
        return bucket;
    }

    get(key, equals, hash) {
        if (hash === this.hash && equals(key, this.key)) {
            return this.value;
        }
        return undefined;
    }

    optionalGet(key, equals, hash) {
        if (hash === this.hash && equals(key, this.key)) {
            return some(this.value);
        }
        return none;
    }

    has(key, equals, hash) {
        return hash === this.hash && equals(key, this.key);
    }

    delete(key, equals, hash) {
        if (hash === this.hash && equals(key, this.key)) {
            this.entry.delete();
            return undefined;
        }
        return this;
    }
}

/**
 * @private
 */
class HashBuckets {
    constructor(options, depth) {
        this.options = options;
        this.length = 0;
        this.depth = depth;
        this.buckets = new Array(this.options.width);
    }

    get(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.get(key, equals, hash >>> this.options.widthAs2sExponent);
        }
        return undefined;
    }

    optionalGet(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.optionalGet(key, equals, hash >>> this.options.widthAs2sExponent);
        }
        return none;
    }

    set(entry, equals, hash) {
        const idx = hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (bucket) {
            const len = bucket.length;
            this.buckets[idx] = bucket.set(entry, equals, hash >>> this.options.widthAs2sExponent);
            if (this.buckets[idx].length !== len) {
                this.length++;
            }
        } else if (this.depth) {
            this.buckets[idx] = new HashContainer(entry, hash >>> this.options.widthAs2sExponent, this.options, this.depth - 1);
            this.length++;
        } else {
            this.buckets[idx] = new Container(entry);
            this.length++;
        }
        return this;
    }

    has(key, equals, hash) {
        const bucket = this.buckets[hash & this.options.mask];
        if (bucket) {
            return bucket.has(key, equals, hash >>> this.options.widthAs2sExponent);
        }
        return false;
    }

    delete(key, equals, hash) {
        const idx = hash & this.options.mask;
        let bucket = this.buckets[idx];
        if (bucket) {
            bucket = bucket.delete(key, equals, hash >>> this.options.widthAs2sExponent);
            if ((!bucket) || bucket.length === 0) {
                this.buckets[idx] = undefined;
                this.length--;
            }
        }
        return this;
    }

    * [Symbol.iterator]() {
        for (const bucket of this.buckets) {
            if (bucket) {
                for (const entry of bucket) {
                    yield entry;
                }
            }
        }
    }
}

/**
 * HashMap - LinkedHashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * @private
 * @extends Entry
 */
class LinkedEntry extends Entry {
    constructor(key, value) {
        super(key, value);
        this.previous = undefined;
        this.next = undefined;
    }

    overwrite(oldEntry) {
        oldEntry.value = this.value;
        this.deleted = true;
    }

    delete() {
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
        this.deleted = true;
    }
}

/**
 * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
 * @extends HashMap
 */
class LinkedHashMap extends HashMap {

    /**
     * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
     * - `new LinkedHashMap()` creates an empty linked hashmap
     * - `new LinkedHashMap(copy:Iterable)` creates a linked hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * - `new LinkedHashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a linked hashmap with optional `depth` and `widthAs2sExponent`. If `copy` is provided (map, array or iterable), it's keys and values are inserted into this map.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *   2) `depth` is how many layers deep our hashtrie goes.
     *      - Minimum: `1`, Maximum/Default: `(32/widthAs2sExponent)-1`
     *   3) `widthAs2sExponent` is how many buckets in each hashtrie layer we use to the power of 2, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     *      - Minimum: `2`, Maximum: `16`, Default: `6` (64 Buckets)
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
     */
    constructor(args = {copy: undefined, depth: undefined, widthAs2sExponent: 6}) {
        super(args);
        this.start = undefined;
        this.end = undefined;
    }

    set(key, value, hashEq = equalsAndHash(key)) {
        const entry = this.addEntry(new LinkedEntry(key, value), hashEq);
        // if we added at the end, shift forward one.
        if (this.end) {
            if (!entry.deleted) {
                this.end.next = entry;
                entry.previous = this.end;
                this.end = entry;
            }
        } else {
            this.end = this.start = entry;
        }
        return this;
    }

    delete(key, hashEq = equalsAndHash(key)) {
        super.delete(key, hashEq);
        if (this.start && this.start.deleted) {
            this.start = this.start.next;
        }
        if (this.end && this.end.deleted) {
            this.end = this.end.previous;
        }
        return this;
    }


    /**
     * Makes a copy of this LinkedHashMap
     * @return {LinkedHashMap}
     */
    clone() {
        return new LinkedHashMap({
            copy: this,
            depth: this.options.depth,
            widthAs2sExponent: this.options.widthAs2sExponent
        });
    }

    * [Symbol.iterator]() {
        let entry = this.start;
        while (entry) {
            yield [entry.key, entry.value];
            entry = entry.next;
        }
    }
}

const Mootable = {
    HashMap,
    LinkedHashMap,
    MapIterable,
    SetIterable,
    Utils: {
        hash,
        isFunction,
        isIterable,
        isString,
        equalsAndHash,
        hashCodeFor,
        equalsFor,
        some,
        none,
        Option
    }
};

export default HashMap;
export { HashMap, LinkedHashMap, Mootable };
