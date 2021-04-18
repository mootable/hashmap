import {HashMap} from '../hashmap/';
import {Container} from '../hashmap/container';
import {equalsAndHash} from "../hash";
import {some, none} from "../option";

/**
 * HashMap - LinkedHashMap Implementation for JavaScript
 * @namespace Mootable
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.15.0
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
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>)} [copy]
     */
    constructor(copy) {
        super(copy);
        if (this.size === 0) {
            this.start = undefined;
            this.end = undefined;
        }
    }

    clear() {
        this.start = undefined;
        this.end = undefined;
        return super.clear();
    }

    createContainer(parent, hash) {
        return new LinkedContainer(this, parent, hash);
    }

    setLeft(key, value, options) {
        const op = equalsAndHash(key, options);
        op.addToStart = true;
        this.buckets.set(key, value, op);
        return this;
    }

    emplaceLeft(key, handler, options) {
        const op = equalsAndHash(key, options);
        op.addToStart = true;
        return this.buckets.emplace(key, handler, op);
    }

    push(key, value, options) {
        const op = equalsAndHash(key, options);
        op.moveOnUpdate = true;
        this.buckets.set(key, value, op);
        return this;
    }

    pushEmplace(key, handler, options) {
        const op = equalsAndHash(key, options);
        op.moveOnUpdate = true;
        return this.buckets.emplace(key, handler, op);
    }

    unshift(key, value, options) {
        const op = equalsAndHash(key, options);
        op.moveOnUpdate = true;
        op.addToStart = true;
        this.buckets.set(key, value, op);
        return this;
    }

    unshiftEmplace(key, handler, options) {
        const op = equalsAndHash(key, options);
        op.moveOnUpdate = true;
        op.addToStart = true;
        return this.buckets.emplace(key, handler, op);
    }

    shift() {
        const entry = this.start;
        if (entry) {
            entry.parent.deleteEntry(entry);
            return entry.slice();
        }
        return undefined;
    }

    pop() {
        const entry = this.end;
        if (entry) {
            entry.parent.deleteEntry(entry);
            return entry.slice();
        }
        return undefined;
    }


    head() {
        const entry = this.start;
        if (entry) {
            return entry[1];
        }
        return undefined;
    }

    tail() {
        const entry = this.end;
        if (entry) {
            return entry[1];
        }
        return undefined;
    }

    optionalHead() {
        const entry = this.start;
        if (entry) {
            return some(entry[1]);
        }
        return none;
    }

    optionalTail() {
        const entry = this.end;
        if (entry) {
            return some(entry[1]);
        }
        return none;
    }

    headKey() {
        const entry = this.start;
        if (entry) {
            return entry[0];
        }
        return undefined;
    }

    tailKey() {
        const entry = this.end;
        if (entry) {
            return entry[0];
        }
        return undefined;
    }

    optionalHeadKey() {
        const entry = this.start;
        if (entry) {
            return some(entry[0]);
        }
        return none;
    }

    optionalTailKey() {
        const entry = this.end;
        if (entry) {
            return some(entry[0]);
        }
        return none;
    }

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
     * @return {Generator<any, void, any>}
     */
    * [Symbol.iterator]() {
        yield* this.entries();
    }

    * entries() {
        let entry = this.start;
        while (entry) {
            yield entry.slice();
            entry = entry.next;
        }
    }

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
     * @return {Generator<any, void, any>}
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
     * @return {Generator<any, void, any>}
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
     * @return {Generator<any, void, any>}
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
     * @return {Generator<any, void, any>}
     */
    * valuesRight() {
        let entry = this.end;
        while (entry) {
            yield entry[1];
            entry = entry.previous;
        }
    }
}


/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 */
export class LinkedContainer extends Container {

    constructor(map, parent, hash) {
        super(map, parent, hash);
    }

    createEntry(key, value, options) {
        const entry = super.createEntry(key, value, options);
        const map = this.map;
        if (map.start === undefined) {
            map.end = map.start = entry;
        } else if (options.addToStart) {
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

    updateEntry(entry, newValue, options) {
        super.updateEntry(entry, newValue, options);
        if (options.moveOnUpdate) {
            if (options.addToStart) {
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