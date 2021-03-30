/**
 * HashMap - HashMap Implementation for JavaScript
 * @namespace Mootable.hashmap.entry
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.12.6
 * Homepage: https://github.com/mootable/hashmap
 */
/**
 * @private
 */
export class Entry {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    overwrite(oldEntry) {
        oldEntry.value = this.value;
    }

    delete() {
    }
}
