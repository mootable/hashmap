/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.7.1
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
     * Murmur3 HashCode generator
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
     * @abstract
     */
    class MapIterable {

        /**
         * Returns the number of elements returned by this Map Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concats, it just queries the base collection size.
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
         * Test each element of the map to see if it matches and return
         *  - true if the key and value match.
         *  - false if it doesn't.
         * @callback MapCallbacks.MatchesPredicate
         * @param {*} [value] - the entry value.
         * @param {*} [key] - the entry key
         * @param {MapIterable} [iterable] - the calling Map Iterable.
         * @return {boolean} - a value that coerces to true if it matches, or to false otherwise.
         */

        /**
         * Test each element of the map and only include entries where the <code>MatchesPredicate</code> returns true.
         *
         * @param {MapCallbacks.MatchesPredicate} [filterPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, that entry is excluded.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
         * @returns {MapIterable} - an iterable that allows you to iterate key value pairs.
         */
        filter(filterPredicate = (value, key, iterable) => true, ctx = this) {
            return new MapFilter(this, filterPredicate, ctx);
        }

        /**
         * For Each Function
         * A callback to execute on every <code>[key,value]</code> pair of this map iterable.
         *
         * @callback MapCallbacks.ForEachCallback
         * @param {*} [value] - the entry value.
         * @param {*} [key] - the entry key
         * @param {MapIterable} [iterable] - the calling Map Iterable.
         */

        /**
         * Execute the provided callback on every <code>[key,value]</code> pair of this map iterable.
         * @param {MapCallbacks.ForEachCallback} [forEachCallback=(value, key, iterable) => {}]
         * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
         * @returns {MapIterable} - an iterable that allows you to iterate key value pairs.
         */
        forEach(forEachCallback = (value, key, iterable) => {
        }, ctx = this) {
            for (const [key, value] of this) {
                forEachCallback.call(ctx, value, key, this);
            }
            return this;
        }

        /**
         * Executes the MapIterable chain, and fills it with the <code>[key,value]</code> pairs,
         *
         * if it is an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} a new array is created and passed back with the filled values, and the orignal is not changed.
         * If it is a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set} a <code>[key,value]</code> pair is added to it. The original is modified.
         * If it is a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}, {@link HashMap} or {@link LinkedHashMap} a value is set to key, if the value already exists for that key it is overriden. The original is modified.
         * If it is an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object} a property of <code>key</code> has a value of <code>value</code> set on it. The original is modified.
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
         * Test each element of the map against the <code>MatchesPredicate</code>.
         * - if any element does not match, returns false
         * - if all elements match, returns true.
         * - if no elements match, returns false.
         * - if the iterable is empty, returns true
         * - if no predicate is provided, returns true.
         *
         * @param {MapCallbacks.MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
         * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
         * @returns {boolean} - true if all elements match, false if one or more elements fails to match.
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
         * Test each element of the map against the <code>MatchesPredicate</code>.
         * - if any element matches, returns true.
         * - if all elements match returns true.
         * - if no elements match returns false.
         * - if the iterable is empty, returns true.
         * - if no predicate is provided, returns true.
         *
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
         * Test each element of the map against the <code>MatchesPredicate</code> until we get a match.
         * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
         * - if no elements match, it returns undefined.
         * - if no predicate is defined, will return the first value it finds.
         *
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
         * Test each element of the map against the <code>MatchesPredicate</code> until we get a match.
         * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
         * - if no elements match, it returns undefined.
         * - if no predicate is defined, will return the first key it finds.
         *
         * @see Array.findIndex
         *
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
         * Test each element of the map to see if it contains a value that is <code>===</code> to the provided value.
         * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
         * - if no elements match, it returns undefined.
         * - it is legitimate for values to be null or undefined, and if set, will find a key.
         *
         * Values are not indexed, this is potentially an expensive operation.
         *
         * @see Array.indexOf
         *
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
         *
         * @see Map.has
         *
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
         *
         * Maps typically index keys, and so is generally a fast operation.
         *
         * @see Map.has
         *
         * @param {*} key - the key we use to === against the entries key to identify if we have a match.
         * @returns {*} - the value of the element that matches..
         */
        get(key) {
            const equalTo = hashEquals(key).equalTo;
            return this.find((value, otherKey) => equalTo(key, otherKey));
        }

        /**
         *
         * @param reduceFunction
         * @param initialValue
         * @param ctx
         * @return {*}
         */
        reduce(reduceFunction = (accumulator, value, key, iterable) => value, initialValue = undefined, ctx = this) {
            let accumulator = initialValue;
            for (const [key, value] of this) {
                accumulator = reduceFunction.call(ctx, accumulator, value, key, this);
            }
            return accumulator;
        }

        /**
         *
         * @param mapKeyFunction
         * @param ctx
         * @return {MapIterable}
         */
        mapKeys(mapKeyFunction = (value, key, iterable) => key, ctx = this) {
            return new MapKeyMapper(this, mapKeyFunction, ctx);
        }

        /**
         *
         * @param mapValueFunction
         * @param ctx
         * @return {MapIterable}
         */
        mapValues(mapValueFunction = (value, key, iterable) => value, ctx = this) {
            return new MapValueMapper(this, mapValueFunction, ctx);
        }

        /**
         *
         * @param mapEntryFunction
         * @param ctx
         * @return {MapIterable}
         */
        mapEntries(mapEntryFunction = (value, key, iterable) => [key, value], ctx = this) {
            return new MapEntryMapper(this, mapEntryFunction, ctx);
        }

        /**
         *
         * @param mapFunction
         * @param ctx
         * @return {MapIterable}
         */
        map(mapFunction = (value, key, map) => {
            return [key, value];
        }, ctx = this) {
            return new MapMapper(this, mapFunction, ctx);
        }

        /**
         *
         * @param otherIterable
         * @return {MapIterable}
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
         * @return {MapIterable}
         */
        keys() {
            return new MapMapper(this, (_, key) => key, this);
        }

        /**
         *
         * @return {MapIterable}
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
         * such as `Map` or this `HashMap` and `LinkedHashMap`or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
         * @property {number} [depth] - how many layers deep our hashtrie goes.
         * - Minimum: `1`
         * - Maximum/Default: `(32/widthB)-1`
         * @property {number} [widthB] - how many buckets in each hashtrie layer we use to the power of 2, for instance a `widthB` of 4 = 16 buckets.
         * - Minimum: `2`
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
         * - `new HashMap({copy:?Iterable, depth:?int, widthB:?int})` creates a hashmap with optional `depth` and `widthB`.  If `copy` is provided (`map` or `array`, its keys and values are inserted into this map.
         *   1) `copy` either
         *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
         *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
         *   2) `depth` is how many layers deep our hashtrie goes.
         *      - Minimum: `1`, Maximum/Default: `(32/widthB)-1`
         *   3) `widthB` is how many buckets in each hashtrie layer we use to the power of 2, for instance a `widthB` of 4 = 16 buckets.
         *      - Minimum: `2`, Maximum: `16`, Default: `6` (64 Buckets)
         * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
         */
        constructor(args = {copy: undefined, depth: undefined, widthB: 6}) {
            super();
            let {depth, widthB, copy} = args;
            widthB = Math.max(2, Math.min(16, widthB)); // 2^6 = 64 buckets
            const defaultDepth = ((32 / widthB) >> 0) - 1;
            depth = Math.max(0, Math.min(depth && depth > 0 ? depth - 1 : defaultDepth, defaultDepth)); // 0 indexed so 3 is a depth of 4.
            const width = 1 << widthB; // 2 ^ widthB
            const mask = width - 1;
            this.options = Object.freeze({widthB, width, mask, depth});
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
            return new HashMap({copy: this, depth: this.options.depth, widthB: this.options.widthB});
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
         * - `new LinkedHashMap({copy:?Iterable, depth:?int, widthB:?int})` creates a linked hashmap with optional `depth` and `widthB`.  If `copy` is provided (`map` or `array`, its keys and values are inserted into this map.
         *   1) `copy` either
         *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
         *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
         *   2) `depth` is how many layers deep our hashtrie goes.
         *      - Minimum: `1`, Maximum/Default: `(32/widthB)-1`
         *   3) `widthB` is how many buckets in each hashtrie layer we use to the power of 2, for instance a `widthB` of 4 = 16 buckets.
         *      - Minimum: `2`, Maximum: `16`, Default: `6` (64 Buckets)
         * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
         */
        constructor(args = {copy: undefined, depth: undefined, widthB: 6}) {
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
            return new LinkedHashMap({copy: this, depth: this.options.depth, widthB: this.options.widthB});
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
                return bucket.get(key, equalTo, hash >>> this.options.widthB);
            }
            return null;
        }

        set(entry, equalTo, hash) {
            const idx = hash & this.options.mask;
            let bucket = this.buckets[idx];
            if (bucket) {
                const len = bucket.length;
                this.buckets[idx] = bucket.set(entry, equalTo, hash >>> this.options.widthB);
                if (this.buckets[idx].length !== len) {
                    this.length++;
                }
            } else if (this.depth) {
                this.buckets[idx] = new HashContainer(entry, hash >>> this.options.widthB, this.options, this.depth - 1);
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
                return bucket.has(key, equalTo, hash >>> this.options.widthB);
            }
            return false;
        }

        delete(key, equalTo, hash) {
            const idx = hash & this.options.mask;
            let bucket = this.buckets[idx];
            if (bucket) {
                bucket = bucket.delete(key, equalTo, hash >>> this.options.widthB);
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
     * @function Mootable.mapIterator
     * @param {!(Set.<Array.<key,value>>|Map|Array.<Array.<key,value>>|Iterator.<Array.<key,value>>)} map the map to wrap
     * @return {MapIterable} the wrapped Map.
     */
    const mapIterator = function (map) {
        return new MapIterableWrapper(map);
    };
    /**
     * Wraps any class that iterates any value and provides higher order chained functions.
     * @function Mootable.setIterator
     * @param {(Set|Map|Array|Iterator)} set the map to wrap
     * @return {SetIterable} the wrapped Set.
     */
    const setIterator = function (set) {
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
            HashMap, LinkedHashMap, mapIterator, setIterator, hashCode, SetIterable, MapIterable
        }
    };
}));
