import {none, some} from '../option/index.js';
import {equalsFor} from "../hash";

/**
 * Container - Container Implementation for JavaScript
 * @namespace Mootable.Container
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */

const findPredicate = (key, equals) => entry => equals(key, entry.key);

function equalsForOptions(key, options) {
    if (options.equals === undefined) {
        options.equals = equalsFor(key);
    }
    return options.equals;
}

/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 */
export class Container {

    constructor(map) {
        this.size = 0;
        this.contents = [];
        this.map = map;
    }

    prefill(key, value) {
        this.contents[0] = this.map.createEntry(key, value, true);
        this.size = 1;
        return this;
    }

    get(key, options) {
        if (this.size !== 0) {
            const equals = equalsForOptions(key, options);
            for (const entry of this.contents) {
                if (entry && equals(key, entry.key)) {
                    return entry.value;
                }
            }
        }
        return undefined;
    }

    optionalGet(key, options) {
        if (this.size !== 0) {
            const equals = equalsForOptions(key, options);
            const entry = this.contents.find(findPredicate(key, equals));
            if (entry) {
                return some(entry.value);
            }
        }
        return none;
    }

    set(key, value, options) {
        let idx = 0;
        let undefinedIdx;
        const equals = equalsForOptions(key, options);
        for (const entry of this.contents) {
            if (entry) {
                if (equals(key, entry.key)) {
                    this.contents[idx] = this.map.overwriteEntry(key, value, entry);
                    return false;
                }
            } else if (undefinedIdx === undefined) {
                undefinedIdx = idx;
            }
            idx += 1;
        }
        if (undefinedIdx === undefined) {
            this.contents.push(this.map.createEntry(key, value));
        } else {
            this.contents[undefinedIdx] = this.map.createEntry(key, value);
        }
        this.size += 1;
        return true;
    }

    emplace(key, handler, options) {
        const equals = equalsForOptions(key, options);
        let idx = this.contents.findIndex(findPredicate(key, equals));
        let value;
        if (idx < 0) {
            // we expect an error to be thrown if insert doesn't exist.
            // https://github.com/tc39/proposal-upsert
            value = handler.insert(key, this.map);
            if (this.size === this.contents.length) {
                this.contents.push(this.map.createEntry(key, value));
                this.size++;
                return {value, resized: true};
            } else {
                idx = 0;
                for (const entry of this.contents) {
                    if (entry === undefined) {
                        this.contents[idx] = this.map.createEntry(key, value);
                        this.size++;
                        return {value, resized: true};
                    }
                    idx++;
                }
            }
        } else if (handler.update) {
            value = handler.update(this.contents[idx].value, key, this.map);
            this.contents[idx] = this.map.overwriteEntry(key, value, this.contents[idx]);
            return {value, resized: false};
        }
    }

    has(key, options) {
        if (this.size !== 0) {
            const equals = equalsForOptions(key, options);
            return this.contents.some(findPredicate(key, equals));
        }
        return false;
    }

    delete(key, options) {
        const equals = equalsForOptions(key, options);
        const idx = this.contents.findIndex(findPredicate(key, equals));

        if (idx === -1) {
            return false;
        }

        this.map.deleteEntry(this.contents[idx]);

        this.contents[idx] = undefined;

        //autocompress. compress off has yet to be implemented
        // if (this.map.compress) {
            this.contents = this.contents.filter(entry => entry !== undefined);
        // }
        this.size -= 1;
        return true;
    }

    * [Symbol.iterator]() {
        for (const entry of this.contents) {
            if (entry !== undefined) {
                yield [entry.key, entry.value];
            }
        }
    }
}