import {HashMap,} from "./hashmap/";
import {LinkedHashMap,} from "./linkedhashmap/";
import {MapIterable, SetIterable,} from "./iterable/";
import {isFunction, isIterable, hashCode, isString, isNumber,} from './utils/';

/**
 * @module @mootable/hashmap
 */

export default HashMap;
const Mootable = {
    HashMap,
    LinkedHashMap,
    MapIterable,
    SetIterable,
    Utils: {
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
