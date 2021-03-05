# Changelog
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
