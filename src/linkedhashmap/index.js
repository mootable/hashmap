import {HashMap} from '../hashmap/';
import {Container} from '../hashmap/container';
import {equalsAndHash} from "../hashmap/hash";
import {some, none} from "../option";

/**
 * HashMap - LinkedHashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.1
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
 * @extends HashMap
 */
export class LinkedHashMap extends HashMap {

    /**
     * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
     * - `new LinkedHashMap()` creates an empty linked hashmap
     * - `new LinkedHashMap(copy:Iterable)` creates a linked hashmap which is a copy of the provided iterable.
     *   - One of
     *      - an object that provides a [Symbol.Iterator] function with the same signature as `Map.[Symbol.Iterator]`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *          - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *      - an object that provides a entries function with the same signature as `Map.entries`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *
     * @example <caption>Create an empty LinkedHashMap</caption>
     * const linkedhashmap = new LinkedHashMap();
     * // linkedhashmap.size === 0;
     * @example <caption>Create LinkedHashMap from an array of key value pairs</caption>
     * const arr = [[1,'value1'],[2,'value2'],[3,'value3']];
     * const linkedhashmap = new LinkedHashMap(arr);
     * // linkedhashmap.size === 3;
     * @example <caption>Create LinkedHashMap from another map</caption>
     * const map = new Map([[1,'value1'],[2,'value2'],[3,'value3']])
     * const linkedhashmap = new LinkedHashMap(map);
     * // linkedhashmap.size === 3;
     * @example <caption>Create LinkedHashMap from another HashMap</caption>
     * const first = new HashMap([[1,'value1'],[2,'value2'],[3,'value3']])
     * const linkedhashmap = new LinkedHashMap(first);
     * // linkedhashmap.size === 3;
     * // will accept LinkedHashMap as well
     * @example <caption>Create LinkedHashMap from a class with symbol iterator</caption>
     * class MyIterable = {
     *     *[Symbol.iterator] () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const iterable = new MyIterable();
     * const linkedhashmap = new LinkedHashMap(iterable);
     * // linkedhashmap.size === 4;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>Create LinkedHashMap from an object with an entries generator function</caption>
     * const entriesObj = {
     *     entries: function* () {
     *         yield ["key1", "value1"];
     *         yield ["key2", "value2"];
     *         yield ["key3", "value3"];
     *         yield ["key4", "value4"];
     *     }
     * }
     * const linkedhashmap = new LinkedHashMap(entriesObj);
     * // linkedhashmap.size === 4;
     * // it doesn't have to be a generator, an iterator works too.
     * @example <caption>Create LinkedHashMap from an object with a forEach function</caption>
     * const forEachObj = {
     *      forEach: (callback, ctx) => {
     *              for (let i = 1; i <= 4; i++) {
     *                  callback.call(ctx, 'value' + i, 'key' + i);
     *              }
     *      }
     * };
     * const linkedhashmap = new LinkedHashMap(forEachObj);
     * // linkedhashmap.size === 4;
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|ObjectWithForEach.<function(function(value, key))>|ObjectWithEntries.<function>)}[copy]
     */
    constructor(copy) {
        super(copy);
        if (this.size === 0) {
            this.start = undefined;
            this.end = undefined;
        }
    }

    /**
     * @inheritDoc
     * @return {HashMap}
     */
    clear() {
        this.start = undefined;
        this.end = undefined;
        return super.clear();
    }

    /**
     *
     * @param key
     * @param value
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {LinkedHashMap}
     */
    setLeft(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        op.addToStart = true;
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param key
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {*}
     */
    emplaceLeft(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        op.addToStart = true;
        return this.buckets.emplace(key, handler, op);
    }

    /**
     *
     * @param key
     * @param value
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {LinkedHashMap}
     */
    push(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param key
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {*}
     */
    pushEmplace(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        return this.buckets.emplace(key, handler, op);
    }

    /**
     *
     * @param key
     * @param value
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {LinkedHashMap}
     */
    unshift(key, value, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        op.addToStart = true;
        this.buckets.set(key, value, op);
        return this;
    }

    /**
     *
     * @param key
     * @param handler
     * @param {HashMap#overrides<equals, hash>} [overrides] - a set of optional overrides to allow a user to define the hashcode and equals methods, rather than them being looked up.     * @return {HashMap}
     * @return {*}
     */
    unshiftEmplace(key, handler, overrides) {
        const op = equalsAndHash(key, overrides);
        op.moveOnUpdate = true;
        op.addToStart = true;
        return this.buckets.emplace(key, handler, op);
    }

    /**
     *
     * @return {undefined|*}
     */
    shift() {
        const entry = this.start;
        if (entry) {
            entry.parent.deleteEntry(entry);
            return entry.slice();
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    pop() {
        const entry = this.end;
        if (entry) {
            entry.parent.deleteEntry(entry);
            return entry.slice();
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    head() {
        const entry = this.start;
        if (entry) {
            return entry[1];
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    tail() {
        const entry = this.end;
        if (entry) {
            return entry[1];
        }
        return undefined;
    }

    /**
     *
     * @return {Option}
     */
    optionalHead() {
        const entry = this.start;
        if (entry) {
            return some(entry[1]);
        }
        return none;
    }

    /**
     *
     * @return {Option}
     */
    optionalTail() {
        const entry = this.end;
        if (entry) {
            return some(entry[1]);
        }
        return none;
    }

    /**
     *
     * @return {undefined|*}
     */
    headKey() {
        const entry = this.start;
        if (entry) {
            return entry[0];
        }
        return undefined;
    }

    /**
     *
     * @return {undefined|*}
     */
    tailKey() {
        const entry = this.end;
        if (entry) {
            return entry[0];
        }
        return undefined;
    }

    /**
     *
     * @return {Option}
     */
    optionalHeadKey() {
        const entry = this.start;
        if (entry) {
            return some(entry[0]);
        }
        return none;
    }

    /**
     *
     * @return {Option}
     */
    optionalTailKey() {
        const entry = this.end;
        if (entry) {
            return some(entry[0]);
        }
        return none;
    }

    /**
     * @inheritDoc
     * @return {LinkedHashMap}
     */
    reverse(){
        if(this.size > 1){
            let entry = this.start;
            do {
                const previous = entry.previous;
                const next = entry.next;
                entry.previous = next;
                entry.next = previous;
                entry = next;
            } while(entry);
            const start = this.start;
            this.start = this.end;
            this.end = start;
        }
        return this;
    }

    /**
     * Makes a copy of this LinkedHashMap
     * @return {LinkedHashMap}
     */
    clone() {
        return new LinkedHashMap(this);
    }

    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map
     */
    * [Symbol.iterator]() {
        yield* this.entries();
    }
    /**
     * Iterates over all the entries in the map.
     *
     * @yields {entries:Array.<key,value>} each entry in the map
     */
    * entries() {
        let entry = this.start;
        while (entry) {
            yield entry.slice();
            entry = entry.next;
        }
    }

    /**
     * Iterates over all the entries in the map in reverse order.
     *
     * @yields {entries:Array.<key,value>} each entry in the map in reverse order
     */
    * entriesRight() {
        let entry = this.end;
        while (entry) {
            yield entry.slice();
            entry = entry.previous;
        }
    }

    /**
     * Iterates over all the keys in the map.
     *
     * @yields {key:any} each key in the map
     */
    * keys() {
        let entry = this.start;
        while (entry) {
            yield entry[0];
            entry = entry.next;
        }
    }

    /**
     * Iterates over all the values in the map.
     *
     * @yields {value:any} each value in the map
     */
    * values() {
        let entry = this.start;
        while (entry) {
            yield entry[1];
            entry = entry.next;
        }
    }

    /**
     * Iterates over all the keys in the map in reverse.
     * @yields {key:any} each key in the map in reverse order
     */
    * keysRight() {
        let entry = this.end;
        while (entry) {
            yield entry[0];
            entry = entry.previous;
        }
    }

    /**
     * Iterates over all the values in the map in reverse.
     * @yields {value:any} each value in the map in reverse order
     */
    * valuesRight() {
        let entry = this.end;
        while (entry) {
            yield entry[1];
            entry = entry.previous;
        }
    }
// private

    /**
     * @private
     * @param parent
     * @param hash
     * @return {LinkedContainer}
     */
    createContainer(parent, hash) {
        return new LinkedContainer(this, parent, hash);
    }
}


/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 * @private
 */
export class LinkedContainer extends Container {

    constructor(map, parent, hash) {
        super(map, parent, hash);
    }

    createEntry(key, value, overrides) {
        const entry = super.createEntry(key, value, overrides);
        const map = this.map;
        if (map.start === undefined) {
            map.end = map.start = entry;
        } else if (overrides.addToStart) {
            map.start.previous = entry;
            entry.next = map.start;
            map.start = entry;
        } else {
            map.end.next = entry;
            entry.previous = map.end;
            map.end = entry;
        }
        return entry;
    }

    updateEntry(entry, newValue, overrides) {
        super.updateEntry(entry, newValue, overrides);
        if (overrides.moveOnUpdate) {
            if (overrides.addToStart) {
                if (entry.previous) {
                    if (entry.next) {
                        entry.next.previous = entry.previous;
                    }
                    entry.previous.next = entry.next;
                    if (entry === this.map.end) {
                        this.map.end = entry.previous;
                    }
                    entry.previous = undefined;
                    this.map.start.previous = entry;
                    entry.next = this.map.start;
                    this.map.start = entry;
                }
            } else if (entry.next) {
                if (entry.previous) {
                    entry.previous.next = entry.next;
                }
                entry.next.previous = entry.previous;
                if (entry === this.map.start) {
                    this.map.start = entry.next;
                }
                entry.next = undefined;
                this.map.end.next = entry;
                entry.previous = this.map.end;
                this.map.end = entry;
            }
        }
    }

    deleteIndex(idx) {
        const oldEntry = super.deleteIndex(idx);
        const map = this.map;
        if (oldEntry.previous) {
            oldEntry.previous.next = oldEntry.next;
        } else {
            map.start = oldEntry.next;
        }
        if (oldEntry.next) {
            oldEntry.next.previous = oldEntry.previous;
        } else {
            map.end = oldEntry.previous;
        }
    }
}