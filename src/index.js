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
const Utils = {
    hashCode,
    isFunction,
    isIterable,
    isString,
    isNumber
};
const Types = {
    HashMap,
    LinkedHashMap,
    MapIterable,
    SetIterable,
};
export default HashMap;
export {
    HashMap,
    LinkedHashMap,
    MapIterable,
    SetIterable,
    hashCode
};
export const Mootable = {...Types, Utils};