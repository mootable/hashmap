import {HashMap} from '../hashmap/';
import {Entry} from '../hashmap/entry/';
import {equalsAndHash} from '../hash';
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
export class LinkedEntry extends Entry {
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
export class LinkedHashMap extends HashMap {

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
