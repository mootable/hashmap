import {none, some} from '../option/';

/**
 * HashMap Container Implementation for JavaScript
 * @author Jack Moxley
 * @copyright Jack Moxley <https://github.com/jackmoxley>
 * @licence MIT
 * Using an array this container stores key value pairs for our map.
 * This collection of entries is a leaf node of our Hash Array Trie.
 * As such all entries in the container will have the same hash. In most cases this will be single entry.
 * @private
 */
export class Container {

    /**
     * Constructs an empty container.
     *
     * @param [HashMap] map - the map this container belongs too.
     * @param hash - the hash code for the keys in this container.
     */
    constructor(map, parent, hash) {
        this.size = 0;
        this.contents = [];
        this.map = map;
        this.parent = parent;
        this.hash = hash;
    }

    /**
     * Does the provided hash conflict with this one, i.e. is it different.
     * This is used for ensuring only the correct keys are added.
     *
     * @param hash
     * @return {boolean}
     */
    hashConflicts(hash) {
        return hash !== this.hash;
    }

    /**
     * Used to fetch the key and value.
     *
     * @param {*} key the key we use to retrieve the value.
     * @param options must contain the equals function for this key.
     * @return {*|undefined} the value for the key, or undefined if none available.
     */
    get(key, options) {
        if (this.size !== 0) {
            const equals = options.equals;
            for (const entry of this.contents) {
                if (entry && equals(key, entry[0])) {
                    return entry[1];
                }
            }
        }
        return undefined;
    }

    optionalGet(key, options) {
        if (this.size !== 0) {
            const equals = options.equals;
            const entry = this.contents.find(entry => equals(key, entry[0]));
            if (entry) {
                return some(entry[1]);
            }
        }
        return none;
    }

    set(key, value, options) {
        const equals = options.equals;
        for (const entry of this.contents) {
            if (equals(key, entry[0])) {
                this.updateEntry(entry, value, options);
                return;
            }
        }
        this.createEntry(key, value, options);
    }

    emplace(key, handler, options) {
        const equals = options.equals;
        for (const entry of this.contents) {
            if (equals(key, entry[0])) {
                if('update' in handler) {
                    const value =  handler.update(entry[1], key, this.map);
                    this.updateEntry(entry, value, options);
                    return value;
                }
                return entry[1];
            }
        }
        const value = handler.insert(key, this.map);
        this.createEntry(key, value, options);
        return value;
    }

    createEntry(key, value) {
        const entry = [key, value];
        entry.parent = this;
        this.contents.push(entry);
        this.size += 1;
        return entry;
    }

    updateEntry(entry, newValue) {
        entry[1] = newValue;
    }

    deleteEntry(entry) {
        const idx = this.contents.indexOf(entry);
        if (idx !== -1) {
            this.deleteIndex(idx);
            let parent = this.parent;
            while (parent) {
                parent.size -= 1;
                parent = parent.parent;
            }
        }
    }

    deleteIndex(idx) {
        this.size -= 1;
        if (idx === 0) {
            return this.contents.shift();
        } else if (idx === this.size) {
            return this.contents.pop();
        } else {
            return this.contents.splice(idx, 1)[0];
        }
    }

    has(key, options) {
        if (this.size !== 0) {
            const equals = options.equals;
            return this.contents.some(entry => equals(key, entry[0]));
        }
        return false;
    }

    delete(key, options) {
        const equals = options.equals;
        const idx = this.contents.findIndex(entry => equals(key, entry[0]));

        if (idx === -1) {
            return false;
        }
        this.deleteIndex(idx);
        return true;
    }

    * [Symbol.iterator]() {
        for (const entry of this.contents) {
            yield entry.slice();
        }
    }

    * entriesRight() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            yield this.contents[idx].slice();
        }
    }

    * keys() {
        for (const entry of this.contents) {
            yield entry[0];
        }
    }

    * values() {
        for (const entry of this.contents) {
            yield entry[1];
        }
    }

    * keysRight() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            yield this.contents[idx][0];
        }
    }

    * valuesRight() {
        for (let idx = this.contents.length - 1; idx >= 0; idx--) {
            yield this.contents[idx][1];
        }
    }
}