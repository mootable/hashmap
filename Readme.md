![The Moo Tableau](mootableau_sm.png)

[API Documentation](https://mootable.github.io/hashmap/HashMap.html)
---
# HashMap & LinkedHashMap
## Description
This project provides `HashMap` and `LinkedHashMap` classes that works both on __Node.js__ and the __browser__.
- They are both implementations of a simplified [HAMT](https://en.wikipedia.org/wiki/Hash_array_mapped_trie) like [hash trie](https://en.wikipedia.org/wiki/Hash_tree_(persistent_data_structure))
- It uses a modified [Murmer 3](https://en.wikipedia.org/wiki/MurmurHash) algorithm for generating hashes. This ensures the widest possible spread across all buckets.
- As per spec, the basic `Hashmap` is not guaranteed to meet order of insertion when iterating over it. If you want guaranteed insertion order when iterating, use `LinkedHashMap`.
- The keys are truly typed and unique, this means 1 !== "1".

### Choose your map wisely.
- When choosing a collection it is worth understanding the problem you are trying to solve.
- [Native JS Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) for small numbers of entries, will be significantly faster.
- However once the map reaches 1'000 or more the Mootable Hashmap really shows its strengths. It utilizes more memory, to do this.
- The [Native JS Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) is likely to have improved speed characteristics if repeating operations in a loop, via things such as JIT compilation. It is worth benchmarking to see if Map works better for you in those situations.

## Installation

[![NPM](https://nodei.co/npm/@mootable/hashmap.png?compact=true)](https://npmjs.org/package/@mootable/hashmap)

Using [npm](https://npmjs.org/package/@mootable/hashmap):

    $ npm install @mootable/hashmap

You can download the last stable version from the [releases page](https://github.com/mootable/hashmap/releases).

If you like risk, you can download the [latest master version](https://raw.github.com/mootable/hashmap/master/hashmap.js), it's usually stable.

To run the tests:

    $ npm test

To run the benchmarks: (Ensure you have the memory to run them)
- If you don't you can reduce the memory size (in MB) accordingly `--max_old_space_size` and remove the last items in `MAP_SIZES`

    $ node  --max_old_space_size=24576 --expose-gc test\benchmark.js

## [API Documentation](https://mootable.github.io/hashmap/)

### [HashMap](https://mootable.github.io/hashmap/HashMap.html) constructor
This [HashMap](https://mootable.github.io/hashmap/HashMap.html) is backed by a hashtrie, and can be tuned to specific use cases.
- `new HashMap()` creates an empty hashmap
- `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
  1) `copy` either
    - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
    - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.

### [LinkedHashMap](https://mootable.github.io/hashmap/LinkedHashMap.html) constructor
[LinkedHashMap](https://mootable.github.io/hashmap/LinkedHashMap.html) maintains insertion order of keys, it has a slightly larger memory footprint and is a little slower.
- `new LinkedHashMap()` creates an empty linked hashmap
- `new LinkedHashMap(copy:Iterable)` creates a linked hashmap which is a copy of the provided iterable.
  1) `copy` either
  - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
  - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
## Examples

Assume this for all examples below

```js
let map = new HashMap();
```
or for the linked hashmap
```js
let map = new LinkedHashMap();
```

If you're using this within Node, you first need to import the class(es)

```js
let {HashMap, LinkedHashMap} = require('@mootable/hashmap');
```
or

```js
let HashMap = require('@mootable/hashmap').HashMap;
```
or for the linked hashmap

```js
let LinkedHashMap = require('@mootable/hashmap').LinkedHashMap;
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

### Iterating

```js
map.set(1, "test 1");
map.set(2, "test 2");
map.set(3, "test 3");

map.forEach(function(value, key) {
    console.log(key + " : " + value);
});
// ES6 Iterators version
for (const [key,value] of map) {
    console.log(`${key} : ${value}`)
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

## Benchmarks
- Current Benchmarks can be found under benchmark_results.
  - The default benchmark does a single set, get and delete against a hashmap of a specific size. It does this thousands of times, and finds an approximate average.
  - If you would like me to include your library for benchmarking, raise an issue in github.
    - It must be in NPM
    - It must have an identical interface to JS Map
    - It must be fully written in JS. (Transpiling is acceptable) So that we can guarantee it works in the browser, not just node.

### Benchmarks on version 0.15.0
![Set Get And Delete](BenchmarkSGD.png)

## Background
- This repository is a reimplemented version of the [npm hashmap](https://npmjs.org/package/hashmap) repository. It takes that implementation as a starting point, and moves it closer to the core functionality hashmaps are designed to achieve.
- The tests have remained mostly the same, as has some documentation, everything else has changed. The interfaces have now diverged.

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
