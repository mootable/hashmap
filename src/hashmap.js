/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.7.2
 * Homepage: https://github.com/mootable/hashmap
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object') {
        // Node js environment
        let HashMap = module.exports = factory();
        // Keep it backwards compatible
        HashMap.HashMap = HashMap.HashMap;
        HashMap.LinkedHashMap = HashMap.LinkedHashMap;
        HashMap.Mootable = HashMap.Mootable;
    } else {
        // Browser globals (this is window)
        const defined = factory();
        this.HashMap = defined.HashMap;
        this.LinkedHashMap = defined.LinkedHashMap;
        this.Mootable = this.Mootable ? Object.assign(this.Mootable, defined.Mootable) : defined.Mootable;
    }
}(function () {
    /**
     * @namespace Mootable
     */
    /**
     * Modified Murmur3 HashCode generator, with capped lengths.
     * This is NOT a cryptographic hash, this hash is designed to create as even a spread across a 32bit integer as is possible.
     * @see {@link https://github.com/aappleby/smhasher|MurmurHash specification on Github}
     * @see {@link https://en.wikipedia.org/wiki/MurmurHash|MurmurHash on Wikipedia}
     * @function Mootable.hashCode
     * @param key the string being hashed
     * @param seed an optional random seed
     * @param len the max limit on the number of characters to hash
     * @returns {number} the hash
     */
    const hashCode = function (key, seed = 0, len = 0) {
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
    };

    /**
     * Is the passed value not null and a function
     * @param func
     * @returns {boolean}
     */
    const isFunction = function (func) {
        return !!(func && func.constructor && func.call && func.apply);
    };
    /**
     * Is the passed value not null and a string
     * @param str
     * @returns {boolean}
     */
    const isString = function (str) { // jshint ignore:line
        return !!(str && (typeof str === 'string' || str instanceof String));
    };

    /**
     * Is the passed value not null and a finite number.
     * NaN and ±Infinity would return false.
     * @param num
     * @returns {boolean}
     */
    const isNumber = function (num) { // jshint ignore:line
        return !!(num && ((typeof num === 'number' || num instanceof Number) && isFinite(num)));
    };

    /**
     * The default Equals method we use this in most cases.
     *
     * @param me
     * @param them
     * @returns {boolean}
     */
    const defaultEquals = function (me, them) {
        return me === them;
    };

    /**
     * Returns back a pair of equalTo Methods and hash values, for a raft of different objects.
     * TODO: Revisit this at some point.
     * @param key
     * @returns {{equalTo: (function(*, *): boolean), hash: number}}
     */
    const hashEquals = function (key) {
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
            default:
                // null
                if (!key) {
                    return {
                        equalTo: defaultEquals, hash: 0
                    };
                }

                if (key instanceof RegExp) {
                    return {
                        equalTo: function (me, them) {
                            if (them instanceof RegExp) {
                                return me + '' === them + '';
                            }
                            return false;
                        }, hash: hashCode(key + '')
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
                    key._hmuid_ = ++HashMap.uid;
                    // hide(key, '_hmuid_');
                }

                return hashEquals(key._hmuid_);
        }
    };

    /**
     * A collection of MapIterable Callbacks.
     * @interface MapCallbacks
     */

    /**
     * A collection of MapIterable Callbacks.
     * @interface SetCallbacks
     */

    /**
     * The base class for the Map Implementations, and the Higher Order Functions for Maps
     * @example <caption>Create a MapIterable from a Map.</caption>
     * const myMap = new Map();
     * const mapIterable = Mootable.mapIterable(myMap);
     * @example <caption>Create a MapIterable from a Set.</caption>
     * const mySet = new Set();
     * // sets wrapped in a map iterable must have a value of an Array matching [key,value]
     * mySet.add(["key", "value"]);
     * const mapIterable = Mootable.mapIterable(mySet);
     * @example <caption>Create a MapIterable from an Array.</caption>
     * // arrays wrapped in a map iterable must have be an array of arrays matching [key,value]
     * const myArray = [["key", "value"]];
     * const mapIterable = Mootable.mapIterable(myArray);
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
     * const mapIterable = Mootable.mapIterable(myIterable);
     * @example <caption>Create a MapIterable from a Mootable HashMap.</caption>
     * // all Mootable HashMaps extend Mapiterable, no need to wrap with the Mootable.mapIterable() function.
     * const mapIterable = new HashMap();
     * @example <caption>Create a MapIterable from a Mootable LinkedHashMap.</caption>
     * // all Mootable LinkedHashMaps extend Mapiterable, no need to wrap with the Mootable.mapIterable() function.
     * const mapIterable = new LinkedHashMap();
     * @abstract
     */
    class MapIterable {

        /**
         * Returns the number of elements returned by this Map Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concats, it just queries the base collection size.
         * @example <caption>Return the size of this mapIterable.</caption>
         * const myMap = new Map();
         * // sets 2 values, and replaces 1 of them
         * myMap.set("key1","val1").set("key2","val2").set("key2","val2a");
         * const mapIterable = Mootable.mapIterable(myMap);
         * // returns 2
         * const theSize = mapIterable.size;
         * @returns {number} the total number of elements in this MapIterable
         */
        get size() {
            let accumulator = 0;
            for (const i of this) { // jshint ignore:line
                accumulator++;
            }
            return accumulator;
        }

        /**
         * Test each element of the map to see if it matches and return
         *  - true if the key and value match.
         *  - false if it doesn't.
         * @example <caption>Only match keys divisible by 2</caption>
         * const myMatchPredicate = (value, key) => key % 2 === 0;
         * @example <caption>Only match values which are equal to another key in the map</caption>
         * const myMatchPredicate = (value, key, mapIterable) => mapIterable.has(value);
         * @example <caption>An alternative implementation, (but potentialy slower, and assumes no undefined value)</caption>
         * const myMatchPredicate = (value, key, mapIterable) => mapIterable.indexOf(key) !== undefined;
         * @callback MapCallbacks.MatchesPredicate
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
         * @param {MapCallbacks.MatchesPredicate} [filterPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, that entry is excluded.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
         * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
         */
        filter(filterPredicate = (value, key, iterable) => true, ctx = this) {
            return new MapFilter(this, filterPredicate, ctx);
        }

        /**
         * For Each Function
         * A callback to execute on every <code>[key,value]</code> pair of this map iterable.
         * @example <caption>log the keys and values</caption>
         * const forEachFunction = (value, key) => console.log(key,value)
         * @callback MapCallbacks.ForEachCallback
         * @param {*} [value] - the entry value.
         * @param {*} [key] - the entry key
         * @param {MapIterable} [iterable] - the calling Map Iterable.
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
         * @param {MapCallbacks.ForEachCallback} [forEachCallback=(value, key, iterable) => {}]
         * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
         * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
         */
        forEach(forEachCallback = (value, key, iterable) => {
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
         *    - it will call <code>set(key,value)</code> for every entry, if the value already exists for that key it is typically overriden. The original is modified.
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
         * const oldObject = {'1','willBeOverriden'};
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
         * @param {MapCallbacks.MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
         * @returns {boolean} true if all elements match, false if one or more elements fails to match.
         */
        every(everyPredicate = (value, key, iterable) => true, ctx = this) {
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
         * @param {MapCallbacks.MatchesPredicate} [somePredicate=(value, key, iterable) => true] - the predicate to identify if we have a match.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>somePredicate</code>
         * @returns {boolean} - true if all elements match, false if one or more elements fails to match.
         */
        some(somePredicate = (value, key, iterable) => true, ctx = this) {
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
         * @param {MapCallbacks.MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findPredicate</code>
         * @returns {*} - the value of the element that matches..
         */
        find(findPredicate = (value, key, iterable) => true, ctx = this) {
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
         * @param {MapCallbacks.MatchesPredicate} [findIndexPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
         * @returns {*} - the key of the element that matches..
         */
        findIndex(findIndexPredicate = (value, key, iterable) => key, ctx = this) {
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
        indexOf(valueToCheck) {
            for (const [key, value] of this) {
                if (valueToCheck === value) {
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
        has(key) {
            const equalTo = hashEquals(key).equalTo;
            return this.some((_, otherKey) => equalTo(otherKey, key));
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
         * @returns {*} - the value of the element that matches..
         */
        get(key) {
            const equalTo = hashEquals(key).equalTo;
            return this.find((value, otherKey) => equalTo(key, otherKey));
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
         * @callback MapCallbacks.ReduceFunction
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
         * @param {MapCallbacks.ReduceFunction} [reduceFunction=(accumulator, value, key, iterable) => true] - the predicate to identify if we have a match.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
         * @returns {*} - the final accumulated value.
         */
        reduce(reduceFunction = (accumulator, value, key, iterable) => value, initialValue = undefined, ctx = this) {
            let accumulator = initialValue;
            for (const [key, value] of this) {
                accumulator = reduceFunction.call(ctx, accumulator, value, key, this);
            }
            return accumulator;
        }

        /**
         * Map Function
         * A callback that takes a <code>[key,value]</code> and current iterable, and returns a mapped value.
         * How this maped value is used depends on the calling function.
         *  - mapKeys the key is transformed to the returned value
         *  - mapValues the value is transformed to the returned value
         *  - mapEntries the value should be of the form [key, value] and transforms each accordingly
         *  - map the MapIterable is turned into a SetIterable, and this returned value is the resultant entry.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
         * @example <caption>swap key and value</caption>
         * const mapEntriesFunction = ( value, key) => [value, key];
         * // the typical response is [key, value]
         * @callback MapCallbacks.MapFunction
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
         * @param {MapCallbacks.MapFunction} [mapKeyFunction=(value, key, iterable) => key] - the function that transforms the key.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
         * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
         */
        mapKeys(mapKeyFunction = (value, key, iterable) => key, ctx = this) {
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
         * @param {MapCallbacks.MapFunction} [mapValueFunction=(value, key, iterable) => value] - the function that transforms the value.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
         * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
         */
        mapValues(mapValueFunction = (value, key, iterable) => value, ctx = this) {
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
         * const mapEntriesIterable = hashmap.mapEntries((value, key) => [value,key]]
         * const mapEntriesArray = mapEntriesIterable.collect();
         * // mapEntriesArray === [['value1',1],['value2',2],['value3',3]]
         * @example <caption>swap the keys and the values with 2 functions</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * const mapEntriesIterable = hashmap.mapEntries([(value) => value,(value, key) => key]]
         * const mapEntriesArray = mapEntriesIterable.collect();
         * // mapEntriesArray === [['value1',1],['value2',2],['value3',3]]
         * @example <caption>modify just the keys</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * // Notice we are passing an array of one function.
         * const mapEntriesIterable = hashmap.mapEntries([(value, key) => value]]
         * const mapEntriesArray = mapEntriesIterable.collect();
         * // mapEntriesArray === [['value1','value1'],['value2','value2'],['value2','value2']]
         * @example <caption>modify just the values</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * // Notice we are passing an array of two, but have only defined the last as a function.
         * const mapEntriesIterable = hashmap.mapEntries([undefined,(value, key) => key]]
         * const mapEntriesArray = mapEntriesIterable.collect();
         * // mapEntriesArray === [[1,1],[2,2],[3,3]]
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
         * @param {MapCallbacks.MapFunction|Array.<MapCallbacks.MapFunction,MapCallbacks.MapFunction>} [mapEntryFunction=(value, key, iterable) => [key, value]] - the function that transforms the key and value.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
         * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
         * @throws {TypeError} if at least one function is not provided.
         */
        mapEntries(mapEntryFunction = (value, key, iterable) => [key, value], ctx = this) {

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
         * For every entry, use the mapEntryFunction to transform the existing value and existing key.
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
         * const setIterable = hashmap.map((value, key) => value]
         * const mapArray = setIterable.collect();
         * // mapArray === ['value1','value2','value3']
         * // setIterable instanceof SetIterable
         * @example <caption>swap the keys and the values</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * const setIterable = hashmap.map((value, key) => [value,key]]
         * const mapArray = setIterable.collect();
         * // mapArray === [['value1',1],['value2',2],['value3',3]]
         * // setIterable instanceof SetIterable
         * @example <caption>swap the keys and the values with 2 functions</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * const mapIterable = hashmap.map([(value) => value,(value, key) => key]]
         * const mapArray = mapIterable.collect();
         * // mapArray === [['value1',1],['value2',2],['value3',3]]
         * // mapIterable instanceof MapIterable
         * @example <caption>modify just the keys</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * // Notice we are passing an array of one function.
         * const mapIterable = hashmap.map([(value, key) => value]]
         * const mapArray = mapIterable.collect();
         * // mapArray === [['value1','value1'],['value2','value2'],['value2','value2']]
         * // mapIterable instanceof MapIterable
         * @example <caption>modify just the values</caption>
         * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
         * // Notice we are passing an array of two, but have only defined the last as a function.
         * const mapIterable = hashmap.map([undefined,(value, key) => key]]
         * const mapArray = mapIterable.collect();
         * // mapArray === [[1,1],[2,2],[3,3]]
         * // mapIterable instanceof MapIterable
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
         * @param {MapCallbacks.MapFunction|Array.<MapCallbacks.MapFunction,MapCallbacks.MapFunction>} [mapFunction=(value, key, iterable) => [key, value]] - the function that transforms the key and value.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
         * @returns {SetIterable|MapIterable} an iterable that allows you to iterate single entries in a set, or an iterable that allows you to iterate a map.
         * @throws {TypeError} if at least one function is not provided.
         */
        map(mapFunction = (value, key, map) => {
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
         *
         * @param otherIterable
         * @return {SetIterable}
         */
        concat(otherIterable = []) {
            return new SetConcat(this, otherIterable);
        }

        /**
         *
         * @param otherMapIterable
         * @return {MapIterable}
         */
        concatMap(otherMapIterable = []) {
            return new MapConcat(this, otherMapIterable);
        }

        /**
         *
         * @return {SetIterable}
         */
        keys() {
            return new MapMapper(this, (_, key) => key, this);
        }

        /**
         *
         * @return {SetIterable}
         */
        values() {
            return new MapMapper(this, (value) => value, this);
        }

        /**
         *
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
     * // iterating over a set, will yield [key,value] arrays.
     * const setIterable = Mootable.setIterable(myMap);
     * @example <caption>Create a SetIterable from a Set.</caption>
     * const mySet = new Set();
     * const setIterable = Mootable.setIterable(mySet);
     * @example <caption>Create a SetIterable from an Array.</caption>
     * const setIterable = Mootable.setIterable([]);
     * @example <caption>Create a SetIterable from an Iterable.</caption>
     * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]() can be used.
     * const myIterable = {
     *     *[Symbol.iterator]() {
     *         yield "value1";
     *         yield "value2";
     *         yield "value3";
     *     }
     * }
     * const setIterable = Mootable.setIterable(myIterable);
     * @example <caption>Create a SetIterable from a Mootable HashMap.</caption>
     * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
     * const setIterable =  Mootable.setIterable(new HashMap());
     * @example <caption>Create a SetIterable by using <code>HashMap.map()</code>.</caption>
     * // iterating over any unparameterized MapIterable.map() will yield [key,value] arrays
     * const setIterable =  new HashMap().map();
     * @example <caption>Create a SetIterable from a Mootable LinkedHashMap.</caption>
     * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
     * const setIterable =  Mootable.setIterable(new LinkedHashMap());
     * @example <caption>Create a SetIterable by using <code>LinkedHashMap.map()</code>.</caption>
     * // iterating over any unparameterized MapIterable.map() will yield [key,value] arrays
     * const setIterable =  new LinkedHashMap().map();
     * @abstract
     */
    class SetIterable {

        /**
         * Returns the number of elements returned by this Set Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concats, it just queries the base collection size.
         * @returns {number}
         */
        get size() {
            let accumulator = 0;
            for (const i of this) { // jshint ignore:line
                accumulator++;
            }
            return accumulator;
        }

        /**
         * Test each element of the set to see if it matches and return
         *  - true if the value matches.
         *  - false if it doesn't.
         * @callback SetCallbacks.MatchesPredicate
         * @param {*} [value] - the value.
         * @param {SetIterable} [iterable] - the calling Set Iterable.
         * @return {boolean} - coerces to true if it matches, or to false otherwise.
         */

        /**
         * Test each element of the set and only include entries where the <code>MatchesPredicate</code> returns true.
         *
         * @param {SetCallbacks.MatchesPredicate} [filterPredicate=() => true] - if the provided function returns <code>false</code>, that entry is excluded.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
         * @returns {SetIterable} - an iterable that allows you to iterate values.
         */
        filter(filterPredicate = (value, map) => true, ctx = this) {
            return new SetFilter(this, filterPredicate, ctx);
        }

        /**
         * For Each Function
         * A callback to execute on every <code>value</code> of this set iterable.
         *
         * @callback SetCallbacks.ForEachCallback
         * @param {*} [value] - the entry value.
         * @param {*} [key] - the entry key
         * @param {SetIterable} [iterable] - the calling Map Iterable.
         */

        /**
         * Execute the provided <code>forEachCallback</code> on every <code>value</code> of this set iterable.
         *
         * @param {SetCallbacks.ForEachCallback} [forEachCallback=() => {}]
         * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
         * @returns {SetIterable} - an iterable that allows you to iterate on values.
         */
        forEach(forEachFunc = (value, map) => {
        }, ctx = this) {
            for (const value of this) {
                forEachFunc.call(ctx, value, this);
            }
        }

        /**
         *
         * @param collector
         * @return {*}
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
         *
         * @param reduceFunction
         * @param initialValue
         * @param ctx
         * @return {undefined}
         */
        reduce(reduceFunction = (accumulator, value, iterable) => value, initialValue = undefined, ctx = this) {
            let accumulator = initialValue;
            for (const value of this) {
                accumulator = reduceFunction.call(ctx, accumulator, value, this);
            }
            return accumulator;
        }

        /**
         *
         * @param everyPredicate
         * @param ctx
         * @return {boolean}
         */
        every(everyPredicate = (value, iterable) => true, ctx = this) {
            for (const value of this) {
                if (!everyPredicate.call(ctx, value, this)) {
                    return false;
                }
            }
            return true;
        }

        /**
         *
         * @param somePredicate
         * @param ctx
         * @return {boolean}
         */
        some(somePredicate = (value, iterable) => true, ctx = this) {
            for (const value of this) {
                if (somePredicate.call(ctx, value, this)) {
                    return true;
                }
            }
            return false;
        }

        /**
         *
         * @param value
         * @return {boolean}
         */
        has(value) {
            return this.some((otherValue) => value === otherValue);
        }


        /**
         *
         * @param findPredicate
         * @param ctx
         * @return {any|undefined}
         */
        find(findPredicate = (value, iterable) => true, ctx = this) {
            for (const value of this) {
                if (findPredicate.call(ctx, value, this)) {
                    return value;
                }
            }
            return undefined;
        }

        /**
         *
         * @param mapFunction
         * @param ctx
         * @return {SetMapper}
         */
        map(mapFunction = (value, map) => value, ctx = this) {
            return new SetMapper(this, mapFunction, ctx);
        }

        /**
         *
         * @param otherIterable
         * @return {SetConcat}
         */
        concat(otherIterable = []) {
            return new SetConcat(this, otherIterable);
        }

        /**
         *
         * @return {SetIterable}
         */
        values() {
            return this;
        }
    }

    /**
     * @private
     */
    class Entry {
        constructor(key, value, map) {
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
     * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
     * @extends MapIterable
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
         * - `new HashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a hashmap with optional `depth` and `widthAs2sExponent`.  If `copy` is provided (map,array or iterable),, its keys and values are inserted into this map.
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

        /**
         * @return {number|*}
         */
        get size() {
            return this.length;
        }

        /**
         * @param key
         * @return {boolean|*}
         */
        has(key) {
            if (this.buckets) {
                const currHE = hashEquals(key);
                return this.buckets.has(key, currHE.equalTo, currHE.hash);
            }
            return false;
        }

        /**
         * @param key
         * @return {undefined|*}
         */
        get(key) {
            if (this.buckets) {
                const currHE = hashEquals(key);
                return this.buckets.get(key, currHE.equalTo, currHE.hash);
            }
            return undefined;
        }

        /**
         *
         * @param key
         * @param value
         * @return {HashMap}
         */
        set(key, value) {
            this.addEntry(new Entry(key, value));
            return this;
        }

        /**
         * @ignore
         * @param entry
         * @return {*}
         */
        addEntry(entry) {
            const currHE = hashEquals(entry.key);
            if (this.buckets) {
                this.buckets = this.buckets.set(entry, currHE.equalTo, currHE.hash);
                this.length = this.buckets.length;
            } else {
                this.buckets = new HashContainer(entry, currHE.hash, Object.assign({}, this.options), this.options.depth);
                this.length = 1;
            }
            return entry;
        }

        /**
         *
         * @param other
         * @return {HashMap}
         */
        copy(other) {
            const map = this;
            if (Array.isArray(other)) {
                other.forEach(function (pair) {
                    map.set(pair[0], pair[1]);
                });
            } else {
                other.forEach(function (value, key) {
                    map.set(key, value);
                });
            }
            return this;
        }

        /**
         *
         * @return {HashMap}
         */
        clone() {
            return new HashMap({copy: this, depth: this.options.depth, widthAs2sExponent: this.options.widthAs2sExponent});
        }

        /**
         *
         * @param key
         * @return {HashMap}
         */
        delete(key) {
            if (this.buckets) {
                const currHE = hashEquals(key);
                this.buckets = this.buckets.delete(key, currHE.equalTo, currHE.hash);
                if (this.buckets) {
                    this.length = this.buckets.length;
                } else {
                    this.length = 0;
                }
            }
            return this;
        }

        /**
         *
         * @return {HashMap}
         */
        clear() {
            // we clone the options as its dangerous to modify mid execution.
            this.buckets = undefined;
            this.length = 0;
            return this;
        }

        /**
         * @return {Generator<Array.<key,value>>}
         */
        * [Symbol.iterator]() {
            if (this.buckets) {
                for (const entry of this.buckets) {
                    yield entry;
                }
            }
        }
    }

    HashMap.uid = 0;

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
         * - `new LinkedHashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a linked hashmap with optional `depth` and `widthAs2sExponent`.  If `copy` is provided (map,array or iterable), its keys and values are inserted into this map.
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

        /**
         *
         * @param key
         * @param value
         * @return {LinkedHashMap}
         */
        set(key, value) {
            const entry = this.addEntry(new LinkedEntry(key, value));
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

        /**
         *
         * @param key
         * @return {LinkedHashMap}
         */
        delete(key) {
            super.delete(key);
            if (this.start && this.start.deleted) {
                this.start = this.start.next;
            }
            if (this.end && this.end.deleted) {
                this.end = this.end.previous;
            }
            return this;
        }

        /**
         *
         * @return {LinkedHashMap}
         */
        clone() {
            return new LinkedHashMap({copy: this, depth: this.options.depth, widthAs2sExponent: this.options.widthAs2sExponent});
        }

        /**
         * @return {Generator<Array.<key,value>>}
         */
        * [Symbol.iterator]() {
            let entry = this.start;
            while (entry) {
                yield [entry.key, entry.value];
                entry = entry.next;
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

        get(key, equalTo) {
            if (equalTo(key, this.key)) {
                return this.entry.value;
            }
            return undefined;
        }

        set(newEntry, equalTo) {
            if (equalTo(newEntry.key, this.key)) {
                newEntry.overwrite(this.entry);
                return this;
            }
            return new LinkedStack(newEntry, this);
        }

        has(key, equalTo) {
            return equalTo(key, this.key);
        }

        delete(key, equalTo) {
            if (equalTo(key, this.key)) {
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

        get(key, equalTo) {
            let container = this;
            // avoid recursion
            do {
                if (equalTo(key, container.key)) {
                    return container.value;
                }
                container = container.next;
            }
            while (container);
            return undefined;
        }

        set(newEntry, equalTo) {
            let container = this;
            // avoid recursion
            while (container) {
                if (equalTo(newEntry.key, container.key)) {
                    newEntry.overwrite(this.entry);
                    return this;
                }
                container = container.next;
            }
            return new LinkedStack(newEntry, this);
        }

        has(key, equalTo) {
            let container = this;
            // avoid recursion
            do {
                if (equalTo(key, container.key)) {
                    return true;
                }
                container = container.next;
            }
            while (container);
            return false;
        }

        delete(key, equalTo) {
            // first on the list.
            if (equalTo(key, this.key)) {
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
                if (equalTo(key, container.key)) {
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

        set(newEntry, equalTo, hash) {
            if (hash === this.hash && equalTo(newEntry.key, this.key)) {
                newEntry.overwrite(this.entry);
                return this;
            }
            const bucket = new HashBuckets(this.options, this.depth);
            bucket.set(this.entry, () => false, this.hash);
            bucket.set(newEntry, () => false, hash);
            return bucket;
        }

        get(key, equalTo, hash) {
            if (hash === this.hash && equalTo(key, this.key)) {
                return this.value;
            }
            return undefined;
        }

        has(key, equalTo, hash) {
            return hash === this.hash && equalTo(key, this.key);
        }

        delete(key, equalTo, hash) {
            if (hash === this.hash && equalTo(key, this.key)) {
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

        get(key, equalTo, hash) {
            const bucket = this.buckets[hash & this.options.mask];
            if (bucket) {
                return bucket.get(key, equalTo, hash >>> this.options.widthAs2sExponent);
            }
            return null;
        }

        set(entry, equalTo, hash) {
            const idx = hash & this.options.mask;
            let bucket = this.buckets[idx];
            if (bucket) {
                const len = bucket.length;
                this.buckets[idx] = bucket.set(entry, equalTo, hash >>> this.options.widthAs2sExponent);
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

        has(key, equalTo, hash) {
            const bucket = this.buckets[hash & this.options.mask];
            if (bucket) {
                return bucket.has(key, equalTo, hash >>> this.options.widthAs2sExponent);
            }
            return false;
        }

        delete(key, equalTo, hash) {
            const idx = hash & this.options.mask;
            let bucket = this.buckets[idx];
            if (bucket) {
                bucket = bucket.delete(key, equalTo, hash >>> this.options.widthAs2sExponent);
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
     * @extends SetIterable
     * @private
     */
    class SetIterableWrapper extends SetIterable {
        constructor(iterable, ctx) {
            super();
            this.iterable = iterable;
            this.ctx = ctx;
        }

        get size() {
            return this.iterable.size;
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
            this.ctx = ctx;
        }

        get size() {
            return this.iterable.size;
        }

        * [Symbol.iterator]() {
            yield* this.iterable;
        }

        has(key) {
            if (isFunction(this.iterable.has)) {
                return this.iterable.has(key);
            }
            return super.has(key);
        }

        get(key) {
            if (isFunction(this.iterable.get)) {
                return this.iterable.get(key);
            }
            return super.get(key);
        }
    }


    /**
     * Wraps any class that iterates with <code>[key,value]</code> pairs and provides higher order chained functions.
     *
     * @example <caption>Create a MapIterable from a Map.</caption>
     * const myMap = new Map();
     * const mapIterable = Mootable.mapIterable(myMap);
     * @example <caption>Create a MapIterable from a Set.</caption>
     * const mySet = new Set();
     * // sets wrapped in a map iterable must have a value of an Array matching [key,value]
     * mySet.add(["key", "value"]);
     * const mapIterable = Mootable.mapIterable(mySet);
     * @example <caption>Create a MapIterable from an Array.</caption>
     * // arrays wrapped in a map iterable must have be an array of arrays matching [key,value]
     * const myArray = [["key", "value"]];
     * const mapIterable = Mootable.mapIterable(myArray);
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
     * const mapIterable = Mootable.mapIterable(myIterable);
     * @example <caption>Create a MapIterable from a Mootable HashMap.</caption>
     * // all Mootable HashMaps extend Mapiterable, no need to wrap with the Mootable.mapIterable() function.
     * const mapIterable = new HashMap();
     * @example <caption>Create a MapIterable from a Mootable LinkedHashMap.</caption>
     * // all Mootable LinkedHashMaps extend Mapiterable, no need to wrap with the Mootable.mapIterable() function.
     * const mapIterable = new LinkedHashMap();
     * @function Mootable.mapIterable
     * @param {!(Set.<Array.<key,value>>|Map|Array.<Array.<key,value>>|Iterator.<Array.<key,value>>)} map the map to wrap
     * @return {MapIterable} the wrapped Map.
     */
    const mapIterable = function (map) {
        return new MapIterableWrapper(map);
    };
    /**
     * Wraps any class that iterates any value and provides higher order chained functions.

     * @example <caption>Create a SetIterable from a Map.</caption>
     * const myMap = new Map();
     * // iterating over a set, will yield [key,value] arrays.
     * const setIterable = Mootable.setIterable(myMap);
     * @example <caption>Create a SetIterable from a Set.</caption>
     * const mySet = new Set();
     * const setIterable = Mootable.setIterable(mySet);
     * @example <caption>Create a SetIterable from an Array.</caption>
     * const setIterable = Mootable.setIterable([]);
     * @example <caption>Create a SetIterable from an Iterable.</caption>
     * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]() can be used.
     * const myIterable = {
     *     *[Symbol.iterator]() {
     *         yield "value1";
     *         yield "value2";
     *         yield "value3";
     *     }
     * }
     * const setIterable = Mootable.setIterable(myIterable);
     * @example <caption>Create a SetIterable from a Mootable HashMap.</caption>
     * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
     * const setIterable =  Mootable.setIterable(new HashMap());
     * @example <caption>Create a SetIterable by using <code>HashMap.map()</code>.</caption>
     * // iterating over any unparametrized MapIterable.map() will yield [key,value] arrays
     * const setIterable =  new HashMap().map();
     * @example <caption>Create a SetIterable from a Mootable LinkedHashMap.</caption>
     * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
     * const setIterable =  Mootable.setIterable(new LinkedHashMap());
     * @example <caption>Create a SetIterable by using <code>LinkedHashMap.map()</code>.</caption>
     * // iterating over any unparametrized MapIterable.map() will yield [key,value] arrays
     * const setIterable =  new LinkedHashMap().map();
     * @function Mootable.setIterable
     * @param {(Set|Map|Array|Iterator)} set the map to wrap
     * @return {SetIterable} the wrapped Set.
     */
    const setIterable = function (set) {
        return new SetIterableWrapper(set);
    };

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
            for (const i of this) { // jshint ignore:line
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

        has(key) {
            if (super.has(key)) {
                if (isFunction(this.iterable.has)) {
                    return this.filterPredicate.call(this.ctx, this.iterable.get(key), key, this);
                }
                return true;
            }
            return false;
        }

        get(key) {
            const value = super.get(key);
            if (isFunction(this.iterable.get)) {
                if (this.filterPredicate.call(this.ctx, value, key, this)) {
                    return value;
                }
            }
            return undefined;
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

        get(key) {
            if (this.has(key)) {
                const value = super.get(key);
                return this.mapFunction.call(this.ctx, value, key, this);
            }
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
            if (this.has(key)) {
                const value = super.get(key);
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
            return this.iterable.size + (this.otherIterable.size | this.otherIterable.length);
        }

        * [Symbol.iterator]() {
            yield* this.iterable;
            yield* this.otherIterable;
        }

        has(key) {
            if (this.iterable.has(key)) {
                return true;
            }
            if (isFunction(this.otherIterable.has)) {
                return this.otherIterable.has(key);
            }
            const equalTo = hashEquals(key).equalTo;
            for (let [otherKey,] of this.otherIterable) {
                if (equalTo(key, otherKey)) {
                    return true;
                }
            }
            return false;
        }

        get(key) {
            const ret = this.iterable.get(key);
            if (ret) {
                return ret;
            }
            if (isFunction(this.otherIterable.get)) {
                return this.otherIterable.get(key);
            }
            const equalTo = hashEquals(key).equalTo;
            for (let [otherKey, value] of this.otherIterable) {
                if (equalTo(key, otherKey)) {
                    return value;
                }
            }
            return undefined;
        }
    }

// The following are set iterables.
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
            return this.iterable.size + (this.otherIterable.size | this.otherIterable.length);
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
                yield this.mapFunction.call(this.ctx, value, this);
            }
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
            for (const i of this) { // jshint ignore:line
                accumulator++;
            }
            return accumulator;
        }

        * [Symbol.iterator]() {
            for (let value of this.iterable) {
                if (this.filterPredicate.call(this.ctx, value, this)) {
                    yield value;
                }
            }
        }
    }

    return {
        HashMap, LinkedHashMap, Mootable: {
            HashMap,
            LinkedHashMap,
            mapIterator: mapIterable,
            setIterator: setIterable,
            hashCode,
            SetIterable,
            MapIterable
        }
    };
}));