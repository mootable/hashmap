const DonHashMap = require('donhash').HashMap;
class HashMap extends DonHashMap{
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
module.exports = {HashMap};