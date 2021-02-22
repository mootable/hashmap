# HashMap Implementation for JavaScript

## Installation

[![NPM](https://nodei.co/npm/@mootable/hashmap.png?compact=true)](https://npmjs.org/package/@mootable/hashmap)

Using [npm](https://npmjs.org/package/@mootable/hashmap):

    $ npm install @mootable/hashmap

You can download the last stable version from the [releases page](https://github.com/mootable/hashmap/releases).

If you like risk, you can download the [latest master version](https://raw.github.com/mootable/hashmap/master/hashmap.js), it's usually stable.

To run the tests:

    $ npm test

## Description

This project provides a `HashMap` class that works both on __Node.js__ and the __browser__.
HashMap instances __store key/value pairs__ allowing __keys of any type__.

Unlike regular objects, __keys will not be stringified__. For example numbers and strings won't be mixed, you can pass `Date`'s, `RegExp`'s, DOM Elements, anything! (even `null` and `undefined`)

## Background
This repository is a refactored version of the [npm hashmap](https://npmjs.org/package/hashmap) repository. It takes that implementation as a starting point, and moves it closer to the core functionality hashmaps are designed to achieve. As such, whilst the interface is based on the originator repository, it has four notable exceptions:

1 As per spec, ordering of hashmaps is not guarenteed to meet order of insertion when iterating over it.

2 Although initial creation time is significantly increased, the speed of insertion, deletion and retrieval, is 2 - 5 times faster.

3 Memory footprint will be a little larger, albeit will compress faster and more readily.

4 The keys are now truly typed and unique, this means if you have written code that uses the graphemes fronting strings to hack the map, those will no longer work.

This means you should only use the hasmap as hashmaps were intended, it is no longer a generic mapping implementation, and you may want to consider an alternate collection for different use cases.

## HashMap constructor overloads
- `new HashMap()` creates an empty hashmap
- `new HashMap(map:HashMap)` creates a hashmap with the key-value pairs of `map`
- `new HashMap(arr:Array)` creates a hashmap from the 2D key-value array `arr`, e.g. `[['key1','val1'], ['key2','val2']]`
- `new HashMap(key:*, value:*, key2:*, value2:*, ...)` creates a hashmap with several key-value pairs

## HashMap methods

- `get(key:*) : *` returns the value stored for that key.
- `set(key:*, value:*) : HashMap` stores a key-value pair
- `multi(key:*, value:*, key2:*, value2:*, ...) : HashMap` stores several key-value pairs
- `copy(other:HashMap) : HashMap` copies all key-value pairs from other to this instance
- `has(key:*) : Boolean` returns whether a key is set on the hashmap
- `search(value:*) : *` returns key under which given value is stored (`null` if not found)
- `delete(key:*) : HashMap` deletes a key-value pair by key
- `remove(key:*) : HashMap` Alias for `delete(key:*)` *(deprecated)*
- `type(key:*) : String` returns the data type of the provided key (used internally)
- `keys() : Array<*>` returns an array with all the registered keys
- `values() : Array<*>` returns an array with all the values
- `entries() : Array<[*,*]>` returns an array with [key,value] pairs
- `size : Number` the amount of key-value pairs
- `count() : Number` returns the amount of key-value pairs *(deprecated)*
- `clear() : HashMap` deletes all the key-value pairs on the hashmap
- `clone() : HashMap` creates a new hashmap with all the key-value pairs of the original
- `forEach(function(value, key)) : HashMap` iterates the pairs and calls the function for each one

### Method chaining

All methods that don't return something, will return the HashMap instance to enable chaining.

## Examples

Assume this for all examples below

```js
var map = new HashMap();
```

If you're using this within Node, you first need to import the class

```js
var HashMap = require('hashmap').HashMap;
```

### Basic use case

```js
map.set("some_key", "some value");
map.get("some_key"); // --> "some value"
```

### Map size / number of elements

```js
var map = new HashMap();
map.set("key1", "val1");
map.set("key2", "val2");
map.size; // -> 2
```

### Deleting key-value pairs

```js
map.set("some_key", "some value");
map.delete("some_key");
map.get("some_key"); // --> undefined
```

### No stringification

```js
map.set("1", "string one");
map.set(1, "number one");
map.get("1"); // --> "string one"
```

A regular `Object` used as a map would yield `"number one"`

### Objects as keys

```js
var key = {};
var key2 = {};
map.set(key, 123);
map.set(key2, 321);
map.get(key); // --> 123
```
A regular `Object` used as a map would yield `321`

### Iterating

```js
map.set(1, "test 1");
map.set(2, "test 2");
map.set(3, "test 3");

map.forEach(function(value, key) {
    console.log(key + " : " + value);
});
// ES6 Iterators version
for (const pair of map) {
    console.log(`${pair.key} : ${pair.value}`)
}
```

### Method chaining

```js
map
  .set(1, "test 1")
  .set(2, "test 2")
  .set(3, "test 3")
  .forEach(function(value, key) {
      console.log(key + " : " + value);
  });
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2021 Jack Moxley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF
