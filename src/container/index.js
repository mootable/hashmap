import {none, some} from '../option/';

/**
 * Container - Container Implementation for JavaScript
 * @namespace Mootable.Container
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */

/**
 * Holds a single entry, but expands to An array container if more than one entry is set on it.
 * @namespace Mootable.Container.SingleContainer
 */
export class SingleContainer {
    constructor(entry) {
        this.entry = entry;
        this.size = 1;
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
            this.entry.overwrite(newEntry);
            return this;
        }
        return new ArrayContainer(newEntry, this);
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

    * [Symbol.iterator]() {
        yield [this.key, this.value];
    }
}

/**
 * @namespace Mootable.Container.ArrayContainer
 * @extends Container
 */
export class ArrayContainer {
    constructor(entry, next) {
        this.contents = [entry, next];
    }

    get size() {
        return this.contents.length;
    }

    get(key, equals) {
        for (const entry of this.contents) {
            if (equals(key, entry.key)) {
                return entry.value;
            }
        }
        return undefined;
    }

    optionalGet(key, equals) {
        let container = this;
        for (const entry of this.contents) {
            if (equals(key, entry.key)) {
                return some(entry.value);
            }
        }
        return none;
    }

    set(newEntry, equals) {

        for (const entry of this.contents) {
            if (equals(newEntry.key, entry.key)) {
                entry.overwrite(newEntry);
                return this;
            }
        }
        this.contents.push(newEntry);
        return this;
    }

    has(key, equals) {
        for (const entry of this.contents) {
            if (equals(key, entry.key)) {
                return true;
            }
        }
        return false;
    }

    delete(key, equals) {
        const findPredicate = entry => equals(key, entry.key);
        const idx = this.contents.findIndex(findPredicate);

        if (idx >= 0) {
            if (this.contents.length === 2) {
                return new SingleContainer(this.contents[(idx + 1) % 2]);
            } else {
                this.contents.splice(idx, 1);
            }
        }
        return this;
    }

    * [Symbol.iterator]() {
        for (const entry of this.contents) {
            yield [entry.key, entry.value];
        }
    }
}