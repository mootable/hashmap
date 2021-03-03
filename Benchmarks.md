| Hashmap | create | 0 Entries | 64 Entries | 256 Entries | 4096 Entries | 16384 Entries | 65536 Entries | 262144 Entries | 1048576 Entries |
| ------- | ------ | --------- | ---------- | ----------- | ------------ | ------------- | ------------- | -------------- | --------------- |
| mootable-hashmap | 7890772 op/sec | 876074 op/sec | 870144 op/sec | 839829 op/sec | **864686** op/sec | **828014** op/sec | **823861** op/sec | **710420** op/sec | **750642** op/sec |
| map | **10819102** op/sec | **1993329** op/sec | **3316291** op/sec | **1332715** op/sec | 105962 op/sec | 27003 op/sec | 6503 op/sec | 7671 op/sec | 7463 op/sec |
| flesler-hashmap | 8785221 op/sec | 423908 op/sec | 411813 op/sec | 413958 op/sec | 284348 op/sec | 374557 op/sec | 373618 op/sec | 388734 op/sec | 392934 op/sec |
| **Fastest** | **map** | **map** | **map** | **map** | **mootable-hashmap** | **mootable-hashmap** | **mootable-hashmap** | **mootable-hashmap** | **mootable-hashmap** |
| Fastest inc % | 37% | 370% | 705% | 222% | 716% | 2966% | 12568% | 9161% | 9958% |
