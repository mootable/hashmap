import {HashMap} from "./hashmap/";
import {LinkedHashMap} from "./linkedhashmap/";
import {MapIterable, SetIterable} from "./iterable/";
import {isFunction, isIterable, isString} from './utils/';
import {hash, equalsAndHash, hashCodeFor, equalsFor} from './hash';
import {none, some, Option} from './option/';

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
        equalsAndHash,
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
