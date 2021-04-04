import {none, some} from '../option/index.js';
import {sameValueZero} from "../utils";

/**
 * Container - Container Implementation for JavaScript
 * @namespace Mootable.Container
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */

const findPredicate = (key, equals) => entry => equals(key, entry.key);

/**
 * Holds multiple entries, but shrinks to a single container if reduced to a size of one.
 */
export class ArrayContainer {

    constructor(options) {
        this.size = 0;
        this.contents = [undefined];
        this.options = options;
    }

    prefill(key, value) {
        this.contents[0] = this.options.createEntry(key, value, true);
        this.size = 1;
        return this;
    }

    get(key, equals) {
        if (this.size !== 0) {
            const entry = this.contents.find(findPredicate(key, equals));
            if (entry) {
                return entry.value;
            }
        }
        return undefined;
    }

    optionalGet(key, equals) {
        if (this.size !== 0) {
            const entry = this.contents.find(findPredicate(key, equals));
            if (entry) {
                return some(entry.value);
            }
        }
        return none;
    }
    set(key, value, equals) {
        let idx = 0;
        let undefinedIdx;
        for(const entry of this.contents) {
            if(entry){
                if(equals(key, entry.key)) {
                    this.contents[idx] = this.options.overwriteEntry(key, value, entry);
                    return false;
                }
            } else if(undefinedIdx === undefined){
                undefinedIdx = idx;
            }
            idx += 1;
        }
        if(undefinedIdx === undefined){
            this.contents.push(this.options.createEntry(key, value));
        } else {
            this.contents[undefinedIdx] = this.options.createEntry(key, value);
        }
        return true;
    }
    set2(key, value, equals) {
        let idx = this.contents.findIndex(findPredicate(key, equals));
        if (idx < 0) {
            if (this.size === this.contents.length) {
                this.contents.push(this.options.createEntry(key, value));
                this.size++;
                return true;
            } else {
                idx = 0;
                for (const entry of this.contents) {
                    if (entry === undefined) {
                        this.contents[idx] = this.options.createEntry(key, value);
                        this.size++;
                        return true;
                    }
                    idx++;
                }
            }
        } else {
            this.contents[idx] = this.options.overwriteEntry(key, value, this.contents[idx]);
            return false;
        }
    }


    emplace(key, handler, equals) {
        let idx = this.contents.findIndex(findPredicate(key, equals));
        let value;
        if (idx < 0) {
            // we expect an error to be thrown if insert doesn't exist.
            // https://github.com/tc39/proposal-upsert
            value = handler.insert(key, this.options.map);
            if (this.size === this.contents.length) {
                this.contents.push(this.options.createEntry(key, value));
                this.size++;
                return {value, resized:true};
            } else {
                idx = 0;
                for (const entry of this.contents) {
                    if (entry === undefined) {
                        this.contents[idx] = this.options.createEntry(key, value);
                        this.size++;
                        return {value, resized:true};
                    }
                    idx++;
                }
            }
        } else if (handler.update) {
            value = handler.update(this.contents[idx].value, key, this.options.map);
            this.contents[idx] = this.options.overwriteEntry(key, value, this.contents[idx]);
            return {value, resized:false};
        }
    }

    has(key, equals) {
        if (this.size !== 0) {
            return this.contents.some(findPredicate(key, equals));
        }
        return false;
    }

    delete(key, equals) {
        const idx = this.contents.findIndex(findPredicate(key, equals));

        if (idx === -1) {
            return false;
        }
        if(this.options.deleteEntry){
            this.options.deleteEntry(this.contents[idx]);
        }
        //autocompress.
        // this.contents = this.contents.filter(entry => !!entry);

        this.contents[idx] = undefined;
        this.size--;
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