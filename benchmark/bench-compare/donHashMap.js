const HashMap = require('Z--bench-compare--donhash').HashMap;
class DonHashMap extends HashMap{
    constructor() {
        super();
    }
    has(key) {
        return !!super.get(key);
    }
    set(key,value) {
        return super.insert(key,value);
    }
    delete(key) {
        return super.remove(key);
    }
}
module.exports = {DonHashMap};