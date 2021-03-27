import {
    HashMap,
    LinkedHashMap,
    MapIterable,
    SetIterable,
    hashCode,
    isFunction,
    isIterable,
    isString,
    isNumber
} from "./hashmap.js";

/**
 * @module @mootable/hashmap
 */

export default HashMap;
const Mootable = {
    HashMap,
    LinkedHashMap,
    MapIterable,
    SetIterable,
    Utils : {
        hashCode,
        isFunction,
        isIterable,
        isString,
        isNumber
    }
};
export {
    HashMap,
    LinkedHashMap,
    Mootable
};
