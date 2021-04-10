import {HashMap, Container} from '../hashmap/';

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
        this.start = undefined;
        this.end = undefined;
    }

    __createContainer(hash) {
        return new LinkedContainer(this,hash);
    }

    /**
     * Makes a copy of this LinkedHashMap
     * @return {LinkedHashMap}
     */
    clone() {
        return new LinkedHashMap(this);
    }

    * [Symbol.iterator]() {
        let entry = this.start;
        while (entry) {
            yield entry.slice();
            entry = entry.next;
        }
    }
    * reverse() {
        let entry = this.end;
        while (entry) {
            yield entry.slice();
            entry = entry.previous;
        }
    }
}


/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 */
export class LinkedContainer extends Container {

    constructor(map, hash) {
        super(map,hash);
    }

    createEntry(key,value) {
        const entry = super.createEntry(key,value);
        const map = this.map;
        if (map.end) {
            map.end.next = entry;
            entry.previous = map.end;
            map.end = entry;
        } else {
            map.end = map.start = entry;
        }
        return entry;
    }

    deleteEntry(idx){
        const oldEntry = super.deleteEntry(idx);
        const map = this.map;
        if (oldEntry.previous) {
            oldEntry.previous.next = oldEntry.next;
        } else if (map.start === oldEntry) {
            map.start = oldEntry.next;
        }
        if (oldEntry.next) {
            oldEntry.next.previous = oldEntry.previous;
        } else if (map.end === oldEntry) {
            map.end = oldEntry.previous;
        }
    }
}