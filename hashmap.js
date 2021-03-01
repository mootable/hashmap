/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.2.0
 * Homepage: https://github.com/mootable/hashmap
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object') {
        // Node js environment
        let HashMap = module.exports = factory();
        // Keep it backwards compatible
        HashMap.HashMap = HashMap;
    } else {
        // Browser globals (this is window)
        this.HashMap = factory();
    }
}(function () {

    /**
     * Interface Class
     * Methods to Implement
     *   has(key) : boolean
     *   get(key) : value
     *   search(value) : key
     *   set(key, value) : this
     *   copy(other) : this
     *   clone()
     *   delete(key) : this
     *   clear() : this
     *   count() : integer
     *   forEach(func, ctx) : this
     */
    class MootableMap {
        constructor(iterable) {
        }
    }

    class HashMap extends MootableMap {
        constructor(iterable, _depth, _widthB) {
            super();
            const depth = _depth ? _depth : 4;
            const widthB = _widthB ? _widthB : 4;
            const width = 1 << widthB; // 2 ^ widthB
            const mask = width - 1;
            this.options = Object.freeze({widthB, width, mask, depth});
            this.clear();
            if (iterable) {
                this.copy(iterable);
            }
        }

        has(key) {
            const hashEquals = HashMap.hashEquals(key);
            return this.buckets.has(key, hashEquals.equalTo, hashEquals.hash);
        }

        get(key) {
            const hashEquals = HashMap.hashEquals(key);
            return this.buckets.get(key, hashEquals.equalTo, hashEquals.hash);
        }

        search(value) {
            return this.buckets.search(value);
        }

        set(key, value) {
            const hashEquals = HashMap.hashEquals(key);
            if (this.buckets.set(key, value, hashEquals.equalTo, hashEquals.hash)) {
                this.length = this.buckets.length;
            }
            return this;
        }

        copy(other) {
            const map = this;
            if (Array.isArray(other)) {
                other.forEach(function (pair) {
                    map.set(pair[0], pair[1]);
                });
            } else {
                other.forEach(function (value, key) {
                    map.set(key, value);
                });
            }
            return this;
        }

        clone() {
            return new HashMap(this, this.options);
        }

        delete(key) {
            const hashEquals = HashMap.hashEquals(key);
            if (this.buckets.delete(key, hashEquals.equalTo, hashEquals.hash)) {
                this.length--;
            }
            return this;
        }

        clear() {
            // we clone the options as its dangerous to modify mid execution.
            this.buckets = new HashBuckets({
                widthB: this.options.widthB,
                width: this.options.width,
                mask: this.options.mask,
                depth: this.options.depth
            }, this.options.depth);
            this.length = 0;
            return this;
        }

        forEach(func, ctx) {
            this.buckets.forEach(func, ctx || this);
            return this;
        }
        [Symbol.iterator]() {
            const entries = this.entries();
            let i = 0;
            return {
                next: function () {
                    if (i === entries.length) {
                        return {done: true};
                    }
                    const currentEntry = entries[i++];
                    return {
                        value: {key: currentEntry[0], value: currentEntry[1]},
                        done: false
                    };
                }
            };
        }

        keys() {
            const keys = new Array(this.length);
            let i = 0;
            this.forEach(function (_, key) {
                keys[i++] = key;
            });
            return keys;
        }

        values() {
            const values = new Array(this.length);
            let i = 0;
            this.forEach(function (value) {
                values[i++] = value;
            });
            return values;
        }

        entries() {
            const entries = new Array(this.length);
            let i = 0;
            this.forEach(function (value, key) {
                entries[i++] = [key, value];
            });
            return entries;
        }


        static hashEquals(key) {
            switch (typeof key) {
                case 'boolean':
                    return {
                        equalTo: HashMap.defaultEquals, hash: key ? 0 : 1
                    };
                case 'number':
                    if (Number.isNaN(key)) {
                        return {
                            equalTo: function (me, them) {
                                return Number.isNaN(them);
                            },
                            hash: 0
                        };
                    }
                    if (!Number.isFinite(key)) {
                        return {
                            equalTo: HashMap.defaultEquals, hash: 0
                        };
                    }
                    if (Number.isInteger(key)) {
                        return {
                            equalTo: HashMap.defaultEquals, hash: key
                        };
                    }
                    return {
                        equalTo: HashMap.defaultEquals, hash: compute_hash(key.toString())
                    };

                case 'string':
                    return {
                        equalTo: HashMap.defaultEquals, hash: compute_hash(key)
                    };
                case 'undefined':
                    return {
                        equalTo: HashMap.defaultEquals, hash: 0
                    };
                default:
                    // null
                    if (!key) {
                        return {
                            equalTo: HashMap.defaultEquals, hash: 0
                        };
                    }

                    if (key instanceof RegExp) {
                        return {
                            equalTo: function (me, them) {
                                if (them instanceof RegExp) {
                                    return me + '' === them + '';
                                }
                                return false;
                            }, hash: compute_hash(key + '')
                        };
                    }
                    if (key instanceof Date) {
                        return {
                            equalTo: function (me, them) {
                                if (them instanceof Date) {
                                    return me.getTime() === them.getTime();
                                }
                                return false;
                            }, hash: key.getTime() | 0
                        };
                    }
                    if (key instanceof Array) {
                        let functions = [];
                        let hash_code = key.length;
                        for (let i = 0; i < key.length; i++) {
                            const hashEquals = HashMap.hashEquals(key[i]);
                            functions.push(hashEquals.equalTo);
                            hash_code = hash_code + (hashEquals.hash * prime_powers[i & 0xFF]);
                        }
                        Object.freeze(functions);
                        return {
                            equalTo: function (me, them) {
                                if (them instanceof Array && me.length === them.length) {
                                    for (let i = 0; i < me.length; i++) {
                                        if (!functions[i](me[i], them[i])) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                                return false;
                            },
                            hash: hash_code | 0
                        };
                    }
                    if (!key.hasOwnProperty('_hmuid_')) {
                        key._hmuid_ = ++HashMap.uid;
                        hide(key, '_hmuid_');
                    }

                    return HashMap.hashEquals(key._hmuid_);
            }
        }
        static defaultEquals(me, them) {
            return me === them;
        }
    }

    class Entry {
        constructor(key, value) {
            this.key = key;
            this.value = value;
            this.length = 1;
        }
        get ( key, equalTo) {
            if (equalTo(key, this.key)) {
                return this.value;
            }
            return undefined;
        }
        set ( key, value, equalTo) {
           if(equalTo(key, this.key)) {
               this.value = value;
               return this;
           }
           return new LinkedStack(key, value, this);
        }
        has (key, equalTo) {
            return equalTo(key, this.key);
        }
        search (value) {
           return value === this.value ? this.key : undefined;
        }
        delete (key, equalTo) {
            if(equalTo(key, this.key)) {
                this.length = 0;
            }
            return this;
        }
        forEach (func, ctx) {
            func.call(ctx, this.value, this.key);
            return this;
        }
    }

    /**
     * Last in First out
     */
    class LinkedStack extends Entry {
        constructor(key, value, next) {
            super(key, value);
            this.next = next;
            this.length = next.length + 1;
        }

        get (key, equalTo) {
            let entry = this;
            // avoid recursion
            do {
                if (equalTo(key, entry.key)) {
                    return entry.value;
                }
                entry = entry.next;
            }
            while (entry);
            return undefined;
        }

        set (key, value, equalTo) {
            let entry = this;
            // avoid recursion
            while (entry) {
                if (equalTo(key, entry.key)) {
                    entry.value = value;
                    return this;
                }
                entry = entry.next;
            }
            return new LinkedStack(key, value, this);
        }

        has (key, equalTo) {
            let entry = this;
            // avoid recursion
            do {
                if (equalTo(key, entry.key)) {
                    return true;
                }
                entry = entry.next;
            }
            while (entry);
            return false;
        }

        search (value) {
            let entry = this;
            // avoid recursion
            do {
                if (entry.value === value) {
                    return entry.key;
                }
                entry = entry._next;
            }
            while (entry);
            return undefined;
        }

        delete (key, equalTo) {
            // first on the list.
            if (equalTo(key, this.key)) {
                // lengths are not necessarily consistent.
                if(this.next){
                    this.next.length = this.length-1;
                }
                return this.next;
            }

            let entry = this.next;
            let prev = this;
            // avoid recursion
            while (entry != null) {
                if (equalTo(key, entry.key)) {
                    const next = entry.next;
                    if (next) {
                        entry.key = next.key;
                        entry.value = next.value;
                        entry.next = next.next;
                    } else {
                        prev.next = undefined;
                    }
                    this.length--;
                    return this;
                }
                prev = entry;
                entry = entry.next;
            }
            return this;
        }

        forEach (func, ctx) {
            let entry = this;
            // avoid recursion
            do {
                func.call(ctx, entry._value, entry.key);
                entry = entry.next;
            }
            while (entry != null);
        }
    }

    class HashBuckets{
        constructor(options, depth) {
            this.options = options;
            this.length = 0;
            this.depth = depth;
            this.buckets = new Array(this.options.width);
        }
        get (key, equalTo, hash) {
            const bucket = this.buckets[hash & this.options.mask];
            if (bucket) {
                return bucket.get(key, equalTo, hash >> this.options.widthB);
            }
            return null;
        }
        set ( key, value, equalTo, hash) {
            const idx = hash & this.options.mask;
            let bucket = this.buckets[idx];
            if (bucket) {
                const len = bucket.length;
                this.buckets[idx] = bucket.set(key, value, equalTo, hash >> this.options.widthB);
                if(this.buckets[idx].length > len) {
                    this.length++;
                }
            } else if (this.depth > 0) {
                bucket = new HashBuckets(this.options, this.depth - 1);
                this.buckets[idx] = bucket.set(key, value, equalTo, hash >> this.options.widthB);
                this.length++;
            } else {
                this.buckets[idx] = new Entry(key, value);
                this.length++;
            }
            return this;
        }

        has (key, equalTo, hash) {
            const bucket = this.buckets[hash & this.options.mask];
            if (bucket) {
                return bucket.has(key, equalTo, hash >> this.options.widthB);
            }
            return false;
        }
        search (value) {

            for (let idx in this.buckets) {
                const bucket = this.buckets[idx];
                const key = bucket ? bucket.search(value) : undefined;
                if (key) {
                    return key;
                }
            }
            return undefined;
        }

        delete (key, equalTo, hash) {
            const idx = hash & this.options.mask;
            let bucket = this.buckets[idx];
            if (bucket) {
                bucket = bucket.delete( key, equalTo, hash >> this.options.widthB);
                if ((!bucket) || bucket.length === 0) {
                    this.buckets[idx] = undefined;
                    this.length--;
                }
            }
            return this;
        }

        forEach (func, ctx) {
            this.buckets.filter(bucket => bucket).forEach(bucket => {
                bucket.forEach(func, ctx);
            });
        }
    }

    HashMap.uid = 0;

    // Note: In this version, all arithmetic is performed with unsigned 32-bit integers.
    //       In the case of overflow, the result is reduced modulo 232.
    function compute_hash(key, seed, len) {
        len = len ? Math.min(len, key.length) : key.length;
        seed = seed ? seed : 0;
        const remaining = len & 3;
        const bytes = len - remaining;
        let hash = seed | 0, k = 0, i = 0;

        while (i < bytes) {
            k = (key.codePointAt(i++) & 0xff) |
                ((key.codePointAt(i++) & 0xff) << 8) |
                ((key.codePointAt(i++) & 0xff) << 16) |
                ((key.codePointAt(i++) & 0xff) << 24);

            k *= (k * 0xcc9e2d51) | 0;
            k = (k << 15) | (k >>> 17);
            k = (k * 0x1b873593) | 0;

            hash ^= k;
            hash = (hash << 13) | (hash >>> 19);
            hash = (hash * 5 + 0xe6546b64) | 0;
        }
        switch (remaining) {
            case 3:
                k ^= (key.codePointAt(i + 2) & 0xff) << 16;
            /* falls through */
            case 2:
                k ^= (key.codePointAt(i + 1) & 0xff) << 8;
            /* falls through */
            case 1:
                k ^= (key.codePointAt(i) & 0xff);

                k = k * 0xcc9e2d51 | 0;
                k = (k << 15) | (k >>> 17);
                k = k * 0x1b873593 | 0;
                hash ^= k;
                break;
            default:
            // do nothing
        }

        hash ^= len;

        hash ^= hash >>> 16;
        hash = hash * 0x85ebca6b | 0;
        hash ^= hash >>> 13;
        hash = hash * 0xc2b2ae35 | 0;
        hash ^= hash >>> 16;
        return hash;
    }

    //256 prime_powers
    const prime_powers = Object.freeze(
        [1, 127, 16129, 2048383, 260144641, 597538102, 192065909, 602427486, 813017677, 1605306890,
            578098852, 2048725333, 661466851, 1822850771, 90784608, 716034781, 102089533, 2151760256, 770569550, 539838935,
            1515160048, 2105782440, 1419553179, 777320512, 1397211109, 102599709, 53830521, 348309906, 980916322,
            1301213935, 887291133, 224425367, 386634478, 1522692792, 899718841, 1802744283, 1862704806, 826802879,
            1193305457, 159246949, 759863740, 1342923152, 1858917518, 345817303, 664355741, 27017714, 1268527591,
            1061569619, 730572219, 1948344159, 889390275, 491016401, 1802864491, 1877971222, 602915624, 875011203,
            827596344, 1294075512, 2143433499, 1875793498, 326344676, 354054199, 1710441533, 953865991, 28543985,
            1462364008, 1888851621, 1984726297, 1184477627, 1200834626, 1115451412, 1085393669, 1593504482, 1241915123,
            2007230357, 1879771160, 831507750, 1790824074, 348838263, 1048017661, 1172195640, 1803744364, 1989715093,
            1818054719, 1644408091, 1218507205, 1197146858, 647104876, 2161602033, 2020475229, 1399147817, 348561625,
            1012884635, 1035745512, 1776354804, 673963060, 1247147227, 508985478, 1922215183, 1896454497, 787569462,
            536105672, 1041035647, 285479862, 1652389082, 69370975, 159225477, 757136796, 996601264, 1130479482, 831236472,
            1756371768, 298839575, 1186350546, 1438695339, 1045652745, 871851308, 426289679, 70737058, 332718018,
            1163468633, 695414475, 1808754845, 463324093, 448663462, 749485412, 24875496, 996465905, 1113288889, 810753248,
            1317724407, 821398990, 507011554, 1671526835, 337143519, 1725507260, 704491233, 798781024, 1959974046,
            203663837, 2075364342, 1881898907, 1101731619, 1505702045, 904616059, 261968882, 829216709, 1499861867,
            162913453, 1225509748, 2086469819, 1129572399, 716036931, 102362583, 23715519, 849148826, 1868518639,
            1565159670, 1967568173, 1168117966, 1285879766, 1102573757, 1612653571, 1511127339, 1593628397, 1257652328,
            1843133305, 503944339, 1281990530, 608640785, 1602106650, 171668372, 174662374, 554900628, 1265272972,
            648233006, 142152456, 751585216, 291550604, 260651229, 661874778, 1874657500, 182072930, 1496041240,
            1840415911, 158835301, 707584444, 1191618821, 2107766264, 1671498827, 333586503, 1273766228, 1726876518,
            878386999, 1256322436, 1674237021, 681337141, 20933427, 495823142, 250598511, 1547901679, 1938525403,
            1805130350, 3013228, 382679956, 1020468498, 1998896113, 821322172, 497255668, 432529313, 863170576,
            1486558802, 636146285, 769860976, 449850037, 900180437, 1861366975, 656898342, 1242650128, 2100575992,
            758334283, 1148682113, 980248522, 1216403335, 929955368, 1317339038, 772457127, 779561214, 1681780263,
            1639328875, 573446773, 1457911300, 1323357705, 1536827836, 532147342, 538327737, 1323237902, 1521612855,
            762566842, 1686217106, 40085849, 765458649, 2053476595, 1264877125, 597960437, 245702454, 926102440, 828017182,
            1347521938, 280241253, 987085739, 2084729894, 908601924, 768173737, 235570684, 1802089737]);

    function hide(obj, prop) {
        // Make non iterable if supported
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop, {enumerable: false});
        }
    }

    return HashMap;
}));
