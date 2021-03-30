import {none, some} from '../../option/';

/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable.hashmap.container
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
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
            newEntry.overwrite(this.entry);
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
        if (this.size !== 0) {
            yield [this.key, this.value];
        }
    }
}

/**
 * @private
 * @extends Container
 */
export class ArrayContainer {
    constructor(entry, next) {
        this.contents = [entry,next];
    }

    get size(){
        return this.contents.length;
    }

    get(key, equals) {
        for(const entry of this.contents){
            if(equals(key, entry.key)){
                return entry.value;
            }
        }
        return undefined;
    }

    optionalGet(key, equals) {
        let container = this;
        for(const entry of this.contents){
            if(equals(key, entry.key)){
                return some(entry.value);
            }
        }
        return none;
    }

    set(newEntry, equals) {

        for(const entry of this.contents){
            if(equals(newEntry.key, entry.key)){
                newEntry.overwrite(entry);
                return this;
            }
        }
        this.contents.push(newEntry);
        return this;
    }

    has(key, equals) {
        for(const entry of this.contents){
            if(equals(key, entry.key)){
                return true;
            }
        }
        return false;
    }

    delete(key, equals) {
        const findPredicate = entry => equals(key, entry.key);

        if(this.contents.length === 2) {
            const newEntry = this.contents.find(findPredicate);
            if(newEntry){
                return new SingleContainer(newEntry);
            }
        } else {
            const idx = this.contents.findIndex(entry => equals(key, entry.key));
            if(idx >= 0){
                this.contents = this.contents.splice(idx,1);
            }
        }
        return this;
    }

    * [Symbol.iterator]() {
        for(const entry of this.contents){
            yield [entry.key, entry.value];
        }
    }
}