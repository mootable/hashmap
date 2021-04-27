import {HashMap} from "./hashmap/";
import {LinkedHashMap} from "./linkedhashmap/";
import {
    isFunction,
    isIterable,
    isString,
    sameValueZero,
    strictEquals,
    abstractEquals,
    sameValue,
    hammingWeight
} from './utils/';
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
    Option,
    sameValueZero, strictEquals, abstractEquals, sameValue, hammingWeight
};


export {
    HashMap,
    LinkedHashMap,
    Mootable
};
export default LinkedHashMap;
