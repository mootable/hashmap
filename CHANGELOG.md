# Changelog
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
    - Exposed Mootable.hashCode function
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
