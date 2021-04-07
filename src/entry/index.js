/**
 * Entry - internal keyvalue storage for Mapping Collections
 * @namespace Mootable.Entry
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.14.0
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * A Key value pair store.
 */
export class Entry {

    /**
     * Entry constructor takes a key and a value
     * @param {*} key
     * @param {*} value
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}