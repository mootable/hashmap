/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.6.1
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
     * Murmur3 HashCode generator
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
     * @returns {equalTo: (function(*, *): boolean), hash: number}
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
     * The base class for both the Map Implementations, and the Higher Order Functions for Maps
     */
    class MapIterable {
        filter(filterPredicate = (value, key, iterable) => true, ctx = this) {
            return new MapFilter(this, filterPredicate, ctx);
        }

        forEach(forEachFunc = (value, key, iterable) => {}, ctx = this) {
            for (const [key, value] of this) {
                forEachFunc.call(ctx, value, key, this);
            }
            return this;
        }

        collect(collector = []) {
            if (Array.isArray(collector)) {
                for (const entry of this) {
                    collector.push(entry);
                }
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

        every(everyPredicate = (value, key, iterable) => false, ctx = this) {
            for (const [key, value] of this) {
                if (!everyPredicate.call(ctx, value, key, this)) {
                    return false;
                }
            }
            return true;
        }

        some(somePredicate = (value, key, iterable) => false, ctx = this) {
            for (const [key, value] of this) {
                if (somePredicate.call(ctx, value, key, this)) {
                    return true;
                }
            }
            return false;
        }

        find(findPredicate = (value, key, iterable) => true, ctx = this) {
            for (const [key, value] of this) {
                if (findPredicate.call(ctx, value, key, this)) {
                    return value;
                }
            }
            return undefined;
        }

        findIndex(findPredicate = (value, key, iterable) => key, ctx = this) {
            for (const [key, value] of this) {
                if (findPredicate.call(ctx, value, key, this)) {
                    return key;
                }
            }
            return undefined;
        }

        indexOf(valueToCheck) {
            for (const [key, value] of this) {
                if (valueToCheck === value) {
                    return key;
                }
            }
            return undefined;
        }

        has(key) {
            const equalTo = hashEquals(key).equalTo;
            return this.some((_, otherKey) => equalTo(otherKey, key));
        }

        get(key) {
            const equalTo = hashEquals(key).equalTo;
            return this.find((value, otherKey) => equalTo(key, otherKey));
        }

        reduce(reduceFunction = (accumulator, value, key, iterable) => value, initialValue = undefined, ctx = this) {
            let accumulator = initialValue;
            for (const [key, value] of this) {
                accumulator = reduceFunction.call(ctx, accumulator, value, key, this);
            }
            return accumulator;
        }

        get size() {
            let accumulator = 0;
            for (const i of this) { // jshint ignore:line
                accumulator++;
            }
            return accumulator;
        }

        mapKeys(mapKeyFunction = (value, key, iterable) => key, ctx = this) {
            return new MapKeyMapper(this, mapKeyFunction, ctx);
        }

        mapValues(mapValueFunction = (value, key, iterable) => value, ctx = this) {
            return new MapValueMapper(this, mapValueFunction, ctx);
        }

        mapEntries(mapEntryFunction = (value, key, iterable) => [key, value], ctx = this) {
            return new MapEntryMapper(this, mapEntryFunction, ctx);
        }

        map(mapFunction = (value, key, map) => {
            return {key: key, value: value};
        }, ctx = this) {
            return new MapMapper(this, mapFunction, ctx);
        }

        concat(otherIterable = []) {
            return new SetConcat(this, otherIterable);
        }
        concatMap(otherMapIterable = []) {
            return new MapConcat(this, otherMapIterable);
        }
        keys() {
            return new MapMapper(this, (_,key) => key, this);
        }

        values() {
            return new MapMapper(this, (value) => value, this);
        }

        entries() {
            return this;
        }
    }

    class SetIterable {
        * [Symbol.iterator]() {
            yield undefined;
        }

        forEach(forEachFunc = (value, map) => {
        }, ctx = this) {
            for (const value of this) {
                forEachFunc.call(ctx, value, this);
            }
        }

        collect(collector = []) {
            if (Array.isArray(collector)) {
                for (const entry of this) {
                    collector.push(entry);
                }
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

        reduce(reduceFunction = (accumulator, value, iterable) => value, initialValue = undefined, ctx = this) {
            let accumulator = initialValue;
            for (const value of this) {
                accumulator = reduceFunction.call(ctx, accumulator, value, this);
            }
            return accumulator;
        }

        get size() {
            let accumulator = 0;
            for (const i of this) { // jshint ignore:line
                accumulator++;
            }
            return accumulator;
        }

        every(everyPredicate = (value, iterable) => false, ctx = this) {
            for (const value of this) {
                if (!everyPredicate.call(ctx, value, this)) {
                    return false;
                }
            }
            return true;
        }

        some(somePredicate = (value, iterable) => false, ctx = this) {
            for (const value of this) {
                if (somePredicate.call(ctx, value, this)) {
                    return true;
                }
            }
            return false;
        }

        has(value) {
            return this.some((otherValue) => value === otherValue);
        }

        filter(filterPredicate = (value, map) => true, ctx = this) {
            return new SetFilter(this, filterPredicate, ctx);
        }

        find(findPredicate = (value, iterable) => true, ctx = this) {
            for (const value of this) {
                if (findPredicate.call(ctx, value, this)) {
                    return value;
                }
            }
            return undefined;
        }

        map(mapFunction = (value, map) => value, ctx = this) {
            return new SetMapper(this, mapFunction, ctx);
        }

        concat(otherIterable = []) {
            return new SetConcat(this, otherIterable);
        }

        values() {
            return this;
        }
    }


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
     * Interface Class
     * Methods to Implement
     *   has(key) : boolean
     *   get(key) : value
     *   search(value) : key
     *   set(key, value) : this
     *   copy(other) : this
     *   clone()
     *   delete(key) : this
     *   clear() : this
     *   count() : integer
     *   forEach(func, ctx) : this
     */
    class HashMap extends MapIterable {
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

        get size() {
            return this.length;
        }

        has(key) {
            if (this.buckets) {
                const currHE = hashEquals(key);
                return this.buckets.has(key, currHE.equalTo, currHE.hash);
            }
            return false;
        }

        get(key) {
            if (this.buckets) {
                const currHE = hashEquals(key);
                return this.buckets.get(key, currHE.equalTo, currHE.hash);
            }
            return undefined;
        }

        set(key, value) {
            this.addEntry(new Entry(key, value));
            return this;
        }

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

        clone() {
            return new HashMap({copy: this, depth: this.options.depth, widthB: this.options.widthB});
        }

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

    HashMap.uid = 0;

    class LinkedHashMap extends HashMap {
        constructor(args = {copy: undefined, depth: undefined, widthB: 6}) {
            super(args);
            this.start = undefined;
            this.end = undefined;
        }

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

        clone() {
            return new LinkedHashMap({copy: this, depth: this.options.depth, widthB: this.options.widthB});
        }

        * [Symbol.iterator]() {
            let entry = this.start;
            while (entry) {
                yield [entry.key, entry.value];
                entry = entry.next;
            }
        }
    }

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
     * Last in First out
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

    class SetIterableWrapper extends SetIterable {
        constructor(iterable, ctx) {
            super();
            this.iterable = iterable;
            this.ctx = ctx;
        }

        * [Symbol.iterator]() {
            yield* this.iterable;
        }
    }

    class MapIterableWrapper extends MapIterable {
        constructor(iterable, ctx) {
            super();
            this.iterable = iterable;
            this.ctx = ctx;
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
     * Wraps any class that iterates with [key,value] pairs and provides higher order chained functions.
     */
    const mapIterator = function (map) {
        return new MapIterableWrapper(map);
    };
    /**
     * Wraps any class that iterates entries and provides higher order chained functions.
     */
    const setIterator = function (set) {
        return new SetIterableWrapper(set);
    };

    class MapFilter extends MapIterableWrapper {

        constructor(iterable, filterPredicate, ctx) {
            super(iterable, ctx);
            this.filterPredicate = filterPredicate;
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

    class MapConcat extends MapIterable {
        constructor(iterable, otherIterable) {
            super();
            this.iterable = iterable;
            this.otherIterable = otherIterable;
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

    class SetConcat extends SetIterable {
        constructor(iterable, otherIterable) {
            super();
            this.iterable = iterable;
            this.otherIterable = otherIterable;
        }

        * [Symbol.iterator]() {
            yield* this.iterable;
            yield* this.otherIterable;
        }
    }

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

    class SetFilter extends SetIterableWrapper {

        constructor(iterable, filterPredicate, ctx) {
            super(iterable, ctx);
            this.filterPredicate = filterPredicate;
        }

        * [Symbol.iterator]() {
            for (let value of this.iterable) {
                if (this.filterPredicate.call(this.ctx, value, this)) {
                    yield value;
                }
            }
        }
    }

    return {HashMap, LinkedHashMap, Mootable : {
            HashMap, LinkedHashMap, mapIterator, setIterator, hashCode, SetIterable, MapIterable
        }};
}));
