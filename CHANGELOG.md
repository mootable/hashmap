# Changelog
## 1.0.0
- Breaking Changes
- Functionality
  - HashMap & LinkedHashMap
    - Iterators
      - Added **entries()** iterator
      - Added **entriesRight()** reverse of **entries()** iterator
      - Added **keys()** iterator
      - Added **keysRight()** reverse of **keys()** iterator
      - Added **values()** iterator
      - Added **valuesRight()** reverse of **values()** iterator
    - Emplace
      - added **emplace()** method as per the proposed map spec
    - Get
      - added **keyOf()** which retrieves the key for a provided value.
      - added **optionalKeyOf()** which retrieves the key for a provided value, and wraps it in an option.
    - Higher Order Functions
      - Added **reduce()** similar to the array method
      - Added **reduceRight()** similar to the array method
      - Added **some()** similar to the array method
      - Added **every()** similar to the array method
      - Added **keyOf()** similar to the array method indexOf
      - Added **lastKeyOf()** similar to the array method indexOf
      - Added **find()** similar to the array method
      - Added **findLast()** find in the opposite directory
      - Added **findKey()** similar to the array method findIndex
      - Added **findLastKey()** findKey in the opposite directory
      - Added **optionalKeyOf()** an optional varient
      - Added **optionalLastKeyOf()** an optional varient
      - Added **optionalFind()** an optional varient
      - Added **optionalFindLast()** an optional varient
      - Added **optionalFindKey()** an optional varient
      - Added **optionalFindLastKey()** an optional varient
    - Parameters
      - length and size are now both derived.
  - LinkedHashMap only
    - Set
      - Added **setLeft()** to add to the head of the map, overwrites don't move
      - Added **push()** to add to the tail of the map, forces a move on overwrite, to the tail.
      - Added **unshift()** to add to the head of the map, forces a move on overwrite, to the head.
    - Emplace
      - Added **emplaceLeft()** to add to the head of the map, overwrites don't move
      - Added **pushEmplace()** to add to the tail of the map, forces a move on overwrite, to the tail.
      - Added **unshiftEmplace()** to add to the head of the map, forces a move on overwrite, to the head.
    - Get
      - added **tail()** which retrieves the value at the end of the map.
      - added **head()** which retrieves the value at the start of the map.
      - added **tailKey()** which retrieves the key at the end of the map.
      - added **headKey()** which retrieves the key at the start of the map.
      - added **optionalTail()** which retrieves the value at the end of the map. and wraps it in an Option
      - added **optionalHead()** which retrieves the value at the start of the map. and wraps it in an Option
      - added **optionalTailKey()** which retrieves the key at the end of the map. and wraps it in an Option
      - added **optionalHeadKey()** which retrieves the key at the start of the map. and wraps it in an Option
    - Delete
      - added **shift()** to remove the first element on the map. This is a very fast method.
      - added **pop()** to remove the last element on the map. This is a very fast method.
    - Reverse
      - Added **reverse()** method, this modifies the map, and reverses the order of its elements.
  - MapIterator & SetIterator the higher order wrappers, have gone.
     - They will be back at some point, but I want to focus on releasing hashmap and linkedhashmap first. I have migrated most functions to hashmap and linkedhashmap and there are plenty of libraries such as lodash that give similar functionality.
- Testing
  - 100% Code Coverage on Everything.
  - Some minor defects fixed as part of the process, these will improve performance.
  
## 0.15.0
- Functionality
  - Breaking changes
    - option to fine tune hashmap has been removed, as we can massively improve performance, by removing it. 
  - Introduced proper HAMT layers above the bottom the layer. This means we will get optimal performance, with only a small memory sacrifice for small maps.
  - Put back in the Containers at lower levels, but shift them a level now rather than copy them, if a collision occurs.
  - Improved performance of hashcode and equals, by recombining them.
    - uncovered a type collision bug when using option (fixed)
  - Removed entry class, and replaced with an array of length 2.
  - Moved container class into the hashmap implementation, and removed hashcontainer.
  - introduced a new linkedcontainer for linkedhashmaps
  - added reverse iterators for all maps.
- Testing
  - Removed or migrated old tests.
  - created tests for new equalsHashCode methos.
- Benchmarks
  - improved output graph and code of benchmarks.
  - tried to improve certainty of executions on the benchmark
    - this has some issues as map at 4 million entries grinds to a halt if I try to prestress it.
  - recollecting memory to be reported on in a later version.
  
## 0.14.0
- Breaking Changes
  - Switched to an options parameter for all methods.
  - Internal classes have been restructured.
- Switched to using Benny, for cleaner benchmarking.
- Cleaned up benchmarking, and included optional parameters.
- Added Graph for better comparison.
- Simplified code, ready for optimisation phase later on.
- Fixed some potential bugs around keys being overwritten when branching.
- Allowed arrays to resize themselves rather than provide a set size.
- Started work on the emplace method.
## 0.13.1
- Fixed readme
## 0.13.0
- Breaking Changes
  - Moved hash, MapIterable and SetIterable into the Mootable object, out of the standard exports.
  - Split classes out into separate functional areas, for my own sanity.
  - Simplified things drastically, by ensuring we follow sameValueZero, as per map, set and array, but allow people to define their own equals and hashing implementations.
  - Renamed hashCode to hash
  - removed isNumber Number.isFinite does the same thing.
  - split hashcode and equalsTo creation, and renamed to hashCodeFor and equalsFor
  - simplified hashCodeFor, to match sameValueZero.
  - simplified equalsFor, to match sameValueZero.
  - Re-added Date and Regex support in hashCodeFor and equalsFor
  - removed depth as an optional parameter, and replaced with equals an optional parameter. on has, get, set, optionalGet and delete.
  - added sameValueZero, sameValue, abstractEquals and strictEquals functions into utils, as helper functions, for defining equality.
  - Made Option iterable, and added size function.
  - Moved Option some and none into its own file.
  - Moved Hash functions into its own file.
  - Switched to a simpler array store over a linked store. This can be optimised later.
  - Split out Hashmap Further.
  - renamed internal length property to size
  - fixed a bug where array containers were deleting the wrong items.
- Developer Experience
  - Fixed a bug where the esm cache was preventing instrumentation during coverage.
    - we could fix this by removing the need for esm altogether
  - Cleaned and simplified package.json commands 
  - Put the expected testing around the build command.
- Testing
  - hash collision testing.
  - Utility Function testing.
  - Hash Function testing.
  - Option Function testing.
  - Differentiated between sanity testing and unit testing.
  - improved coverage reporting.

## 0.12.6
- Set Documentation links to the rightplace
## 0.12.5
- Added keys specific Mapper Class - to make iterating keys faster, with specialised functions.
- Added values specific Mapper Class - to make iterating values faster, with specialised functions.
- Fixed has methods, with depth, ensured that the Js Native Map functions retain same has semantics (i.e. don't depth check)
- Added More Tests and passed 80% Coverage Milestone. Yay!
- Some basic code simplification and optimisations.
## 0.12.4
- Set Documentation links to the rightplace
## 0.12.3
- Fixed a problem where the deep equals method wasn't respecting the deep values.
- Added tests for has in MapFilter and SetFilter. specifically around array matches.
- Increased code coverage limit to match.
## 0.12.2
- Fixed a problem where size didn't work for unsized iterables
- made public some of the more helpful utility functions.
- Made the doc more EJS compliant.
- added specific code coverage checks.
- More tests.
## 0.12.0
- (Breaking Change) Switched from a combined loader, to individual files (located in /dist) using roll up and babel.
- Refactored to pure module exports.
- Setup tests to test both dist and src files, whilst maintaining the ability to run within the ide.
- Updated to Node 15.
- Spelling fixes on the documentation.
## 0.11.1
- Finished the core API documentation of the exported classes.
- Optimized some methods
- Added entries() and keys() to SetIterable
- (Breaking Change) the signature of SetIterable callbacks now include a key, which is the value. This is to make it align more closely with JS Set.
## 0.10.1
- my instructions on require() were subject to find and replace. Rookie Mistakes ;-)
- added some more tags to package.json
## 0.10.0
- added optionalGet method for optimisation of methods. Improved the execution of some methods.
- added deep array checking, on indexOf and value checking.
- more examples and documentation.
- Properly implemented the setiterable has methods.
## 0.9.0
- removed setIterable and mapIterable methods and added from on the classes themselves.
- A bit more documentation and examples
## 0.8.1
- removed preprocessor causing issues.
## 0.8.0
- Added support in MapIterable.map for mapping to a map, as well as to a set.
- Added support to MapIterable.map and .mapEntries to allow for seperate key and value mapping.
- Added support for concat to return a mapIterable if a MapIterable or Map is provided.
- Added some validation resulting in TypeErrors.
- More documentation
- More examples

## 0.7.2
- Doc Styling
- Added more documentation
- Added examples
- Added support for mapping when get is called.
- Modified Readme.

## 0.7.1
- Doc Styling
- Each and Some now default to true, if no function is provided.
- Added more documentation
- Modified Readme.

## 0.7.0
- Breaking changes.
  - Search has been renamed indexOf to match Arrays methods more closely. 
  - entries, values and keys no longer return an array, they return a MapIterable in the case of Entries and a SetIterable in the case of values and keys.
- New Features
    - Higher Order Functions that replicate most of the Array functions, and Map functions. Have been added, these are chained defered executions, which means until you choose to collect your data, they don't do anything.
      - Map Iterable
        - ES6 Symbol.Iterator
        - Specialist: forEach, collect, every, has, some, find, reduce, findIndex, indexOf, get
        - Map Iterables: entries, filter, concatMap, mapEntries, mapKeys, mapValues
        - Set Iterables:  keys, values, map, concat
        - Properties: .size
      - Set Iterable
        - ES6 Symbol.Iterator
        - Specialist: forEach, collect, every, has, some, find, reduce
        - Set Iterables: values, filter, map, concat
        - Properties: .size
    - Exposed Mootable.hash function
    - Added functions to allow anyone use the higher order functions by wrapping an ES6 iteratable object (including arrays.
        - Mootable.mapIterator(map)
        - Mootable.setIterator(set)
- Documentation, started building a proper documentation site.
## 0.6.1
- Changed the Constructor parameters for HashMap and LinkedHashMap to allow sending an array or iterable without an object (This is an un-breaking change, :-) see previous change 0.6.0)
- Updated Readme documentation.
- Added more create tests.

## 0.6.0
- Changed the Constructor parameters for HashMap and LinkedHashMap (This is a breaking change, read documentation)
- Cleaned up benchmarking
- Updated Readme documentation.
- Added ordering tests for LinkedHashMap
- Ensured we have minimum and maximum values when using depth and widthB

## 0.5.0
- Added memory to benchmarking report
- Cleaned up benchmarking
- Switched to html rendering of benchmarks
- Added LinkedHashMap implementation, and refactored HashMap as the base for it.

## 0.4.2
- Added benchmark.md generation
- Cleaned up benchmarking
- Updated documentation

## 0.4.1
- Removed unneeded function storage

## 0.4.0
- Significant Performance Improvements
- Made sure we only create arrays if we have more than one entry for a bucket.
- Improved benchmarking ensuring we use the same key values
- Now beats JS Map on high number of entries (2^18 = 262144) 

## 0.3.0
- Modernized, to use Classes,
- optimised a few of the methods
- HashBucket has been renamed to LinkedStack.
- Fixed Depth bug, due to 0 indexing.
- Widened Buckets to 2^6 = 64 to see how it performs
- Added Automatic depth calculation.
- Added better benchmarks.

## 0.2.0
- Made the constructor more JS Map like
- Modernized a touch further
- Removed Superfluous Methods

## 0.1.1
- Added the advice to use JS Map

## 0.1.0
- Removed the not-a-hash, Hash Function
- Added Github actions to autodeploy on release
- Added more benchmarking for comparison.

## 0.0.5
- First implementation
