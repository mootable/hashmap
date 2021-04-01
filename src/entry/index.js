/**
 * Entry - internal keyvalue storage for Mapping Collections
 * @namespace Mootable.Entry
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
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

    /**
     * replaces this key and value with the entry provided
     * @param overwritingEntry
     */
    overwrite(overwritingEntry) {
        this.key = overwritingEntry.key;
        this.value = overwritingEntry.value;
        overwritingEntry.deleted = true;
    }

    /**
     * Marks this entry as deleted
     */
    delete() {
        this.deleted = true;
    }
}

/**
 * A Key value pair store, linked to other entries.
 * @extends Entry
 */
export class LinkedEntry extends Entry{

    /**
     * Entry constructor takes a key and a value
     * @param {*} key
     * @param {*} value
     */
    constructor(key, value) {
        super(key, value);
        this.previous = undefined;
        this.next = undefined;
    }

    /**
     * Marks this entry as deleted,
     * it will also ensure any or previous and next values point to each other rather than this.
     */
    delete() {
        super.delete();
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
    }
}