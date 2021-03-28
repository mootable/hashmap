import {HashMap,} from "./hashmap/";
import {LinkedHashMap,} from "./linkedhashmap/";
import {MapIterable, SetIterable,} from "./iterable/";
import {isFunction, isIterable, isString, hash, hashEquals, hashCodeFor, equalsFor, some, none, Option} from './utils/';

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
        hash,
        isFunction,
        isIterable,
        isString,
        hashEquals,
        hashCodeFor,
        equalsFor,
        some,
        none,
        Option
    }
};
export {
    HashMap,
    LinkedHashMap,
    Mootable
};
