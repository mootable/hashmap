import {HashMap} from "./hashmap/";
import {LinkedHashMap} from "./linkedhashmap/";
import {isFunction, isIterable, isString} from './utils/';
import {hash, equalsAndHash, hashCodeFor, equalsFor} from './hashmap/hash';
import {none, some, Option} from './option/';

/**
 * @module @mootable/hashmap
 */

const Mootable = {
    HashMap,
    LinkedHashMap,
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
};
export {
    HashMap,
    LinkedHashMap,
    Mootable
};
export default LinkedHashMap;
