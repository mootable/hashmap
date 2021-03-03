![The Moo Tableau](mootableau_sm.png)

---
# HashMap Implementation for JavaScript
## Description
This project provides a `HashMap` class that works both on __Node.js__ and the __browser__. 
HashMap instances __store key/value pairs__ allowing __keys of any type__.

Unlike regular objects, __keys will not be stringified__. For example numbers and strings won't be mixed, you can pass `Date`'s, `RegExp`'s, DOM Elements, anything! (even `null` and `undefined`)

## Background
This repository is a refactored version of the [npm hashmap](https://npmjs.org/package/hashmap) repository. It takes that implementation as a starting point, and moves it closer to the core functionality hashmaps are designed to achieve. As such, whilst the interface is based on the originator repository, it has four notable exceptions:

1) As per spec, ordering of hashmaps is not guaranteed to meet order of insertion when iterating over it.
2) Memory footprint will be a little larger, albeit will compress faster and more readily.
3) The keys are now truly typed and unique, this means if you have written code that uses the graphemes fronting strings to hack the map, those will no longer work.

This means you should only use the hashmap as hashmaps were intended, it is no longer a generic mapping implementation, and you may want to consider an alternate collection for different use cases.

### Choose your map wisely.
- When choosing a collection it is worth understanding the problem you are trying to solve.
- JS Map for small numbers of entries, will be significantly faster.
- However once the map reaches 10'000 or more the Mootable Hashmap really shows its strengths. At some point I will do a memory comparison too.
- The JS Map is likely to have improved speed characteristics if repeating operations in a loop, via things such as JIT compilation. It is worth benchmarking to see if Map works better for you in those situations.

### Benchmarks
- Current Benchmarks can be found [here](Benchmarks.md).
  Each benchmark does a single set, get and delete against a hashmap of a specific size. 
  It does this thousands of times, and finds an approximate average.
  
### Benchmarks on version 0.4.2
| Hashmap | create | 0 Entries | 64 Entries | 256 Entries | 4096 Entries | 16384 Entries | 65536 Entries | 262144 Entries | 1048576 Entries |
| ------- | ------ | --------- | ---------- | ----------- | ------------ | ------------- | ------------- | -------------- | --------------- |
| mootable-hashmap | 7890772 op/sec | 876074 op/sec | 870144 op/sec | 839829 op/sec | **864686** op/sec | **828014** op/sec | **823861** op/sec | **710420** op/sec | **750642** op/sec |
| map | **10819102** op/sec | **1993329** op/sec | **3316291** op/sec | **1332715** op/sec | 105962 op/sec | 27003 op/sec | 6503 op/sec | 7671 op/sec | 7463 op/sec |
| **Fastest** | **map** | **map** | **map** | **map** | **mootable-hashmap** | **mootable-hashmap** | **mootable-hashmap** | **mootable-hashmap** | **mootable-hashmap** |
| Fastest inc % | 37% | 370% | 705% | 222% | 716% | 2966% | 12568% | 9161% | 9958% |

## Installation

[![NPM](https://nodei.co/npm/@mootable/hashmap.png?compact=true)](https://npmjs.org/package/@mootable/hashmap)

Using [npm](https://npmjs.org/package/@mootable/hashmap):

    $ npm install @mootable/hashmap

You can download the last stable version from the [releases page](https://github.com/mootable/hashmap/releases).

If you like risk, you can download the [latest master version](https://raw.github.com/mootable/hashmap/master/hashmap.js), it's usually stable.

To run the tests:

    $ npm test

To run the benchmarks: (Ensure you have the memory to run them)

    $ node  --max_old_space_size=8192 --expose-gc test\benchmark.js

## HashMap constructor overloads
- `new HashMap()` creates an empty hashmap
- `new HashMap(map:HashMap)` creates a hashmap with the key-value pairs of `map`
- `new HashMap(map:Map)` creates a hashmap with the key-value pairs of `map`
- `new HashMap(arr:Array)` creates a hashmap from the 2D key-value array `arr`, e.g. `[['key1','val1'], ['key2','val2']]`

## HashMap methods

- `get(key:*) : *` returns the value stored for that key.
- `set(key:*, value:*) : HashMap` stores a key-value pair
- `copy(other:HashMap) : HashMap` copies all key-value pairs from other to this instance
- `has(key:*) : Boolean` returns whether a key is set on the hashmap
- `search(value:*) : *` returns key under which given value is stored (`null` if not found)
- `delete(key:*) : HashMap` deletes a key-value pair by key
- `keys() : Array<*>` returns an array with all the registered keys
- `values() : Array<*>` returns an array with all the values
- `entries() : Array<[*,*]>` returns an array with [key,value] pairs
- `length : Number` the amount of key-value pairs
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
