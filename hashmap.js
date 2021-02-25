/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.1.1
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


    function HashMap(iterable, _depth, _widthB) {

        const widthB = _widthB ? _widthB : 5;
        const depth = _depth ? _depth : 2;
        const width = 1 << widthB; // 2 ^ widthB
        const mask = width - 1;
        this.options = Object.freeze({widthB, width, mask, depth});
        this.clear();
        if(iterable) {
            this.copy(iterable);
        }
    }

    function HashBucket(key, value) {
        this._key = key;
        this._value = value;
        this._next = null;
        this.length = 1;
    }

    HashBucket.prototype = {
        constructor: HashBucket,
        get: function (hash, equalTo, key) {
            let bucket = this;
            // avoid recursion
            do {
                if (equalTo(key, bucket._key)) {
                    return bucket._value;
                }
                bucket = bucket._next;
            }
            while (bucket != null);
            return null;
        },
        set: function (hash, equalTo, key, value) {
            let bucket = this;
            // avoid recursion
            while (true) {
                if (equalTo(key, bucket._key)) {
                    bucket._value = value;
                    return false;
                }
                if (bucket._next) {
                    bucket = bucket._next;
                } else {
                    bucket._next = new HashBucket(key, value);
                    this.length++;
                    return true;
                }
            }
        },

        has: function (hash, equalTo, key) {
            let bucket = this;
            // avoid recursion
            do {
                if (equalTo(key, bucket._key)) {
                    return true;
                }
                bucket = bucket._next;
            }
            while (bucket != null);
            return false;
        },

        search: function (value) {
            let bucket = this;
            // avoid recursion
            do {
                if (bucket._value === value) {
                    return bucket._key;
                }
                bucket = bucket._next;
            }
            while (bucket != null);
            return null;
        },

        delete: function (hash, equalTo, key) {
            let bucket = this;
            let prev = null;
            // avoid recursion
            do {
                if (equalTo(key, bucket._key)) {
                    let next = bucket._next;
                    if (bucket._next) {
                        bucket._key = next._key;
                        bucket._value = next._value;
                        bucket._next = next._next;
                    } else if (prev) {
                        delete prev._next;
                    }
                    this.length--;
                    return true;
                }
                prev = bucket;
                bucket = bucket._next;
            }
            while (bucket != null);
            return false;
        },

        forEach: function (func, ctx) {
            let bucket = this;
            // avoid recursion
            do {
                func.call(ctx, bucket._value, bucket._key);
                bucket = bucket._next;
            }
            while (bucket != null);
        }
    };

    function HashBuckets(options, depth) {
        this._options = options;
        this.length = 0;
        this._depth = depth;
        this._buckets = new Array(this._options.width);
        this._buckets.fill(undefined);
        Object.seal(this._buckets);
    }

    HashBuckets.prototype = {
        constructor: HashBuckets,
        get: function (hash, equalTo, key) {
            const bucket = this._buckets[hash & this._options.mask];
            if (bucket) {
                return bucket.get(hash >> this._options.widthB, equalTo, key);
            }
            return null;
        },
        set: function (hash, equalTo, key, value) {
            const idx = hash & this._options.mask;
            let bucket = this._buckets[idx];
            if (bucket) {
                return bucket.set(hash >> this._options.widthB, equalTo, key, value);
            }
            if (this._depth > 0) {
                bucket = new HashBuckets(this._options, this._depth - 1);
                bucket.set(hash >> this._options.widthB, equalTo, key, value);
                this._buckets[idx] = bucket;
            } else {
                this._buckets[idx] = new HashBucket(key, value);
            }
            this.length++;
            return true;
        },

        has: function (hash, equalTo, key) {
            const bucket = this._buckets[hash & this._options.mask];
            if (bucket) {
                return bucket.has(hash >> this._options.widthB, equalTo, key);
            }
            return false;
        },
        search: function (value) {
            for (let idx in this._buckets) {
                const data = this._buckets[idx];
                const key = data ? data.search(value) : null;
                if (key) {
                    return key;
                }
            }
            return null;
        },

        delete: function (hash, equalTo, key) {
            const idx = hash & this._options.mask;
            const bucket = this._buckets[idx];
            if (bucket) {
                if (bucket.delete(hash >> this._options.widthB, equalTo, key)) {
                    if (bucket.length === 0) {
                        this._buckets[idx] = undefined;
                        this.length--;
                    }
                    return true;
                }
            }
            return false;
        },

        forEach: function (func, ctx) {
            this._buckets.filter(bucket => bucket).forEach(bucket => {
                bucket.forEach(func, ctx);
            });
        }
    };


    var proto = HashMap.prototype = {
        constructor: HashMap,

        get: function (key) {
            const hashEquals = this.hashEquals(key);
            return this._buckets.get(hashEquals.hash, hashEquals.equalTo, key);
        },

        set: function (key, value) {
            const hashEquals = this.hashEquals(key);
            if (this._buckets.set(hashEquals.hash, hashEquals.equalTo, key, value)) {
                this.length++;
            }
        },

        copy: function (other) {
            const map = this;
            if(Array.isArray(other)){
                other.forEach(function (pair) {
                    map.set(pair[0], pair[1]);
                });
            } else {
                other.forEach(function (value, key) {
                    map.set(key, value);
                });
            }
        },

        has: function (key) {
            const hashEquals = this.hashEquals(key);
            return this._buckets.has(hashEquals.hash, hashEquals.equalTo, key);
        },

        search: function (value) {
            return this._buckets.search(value);
        },

        delete: function (key) {
            const hashEquals = this.hashEquals(key);
            if (this._buckets.delete(hashEquals.hash, hashEquals.equalTo, key)) {
                this.length--;
            }
        },
        keys: function () {
            const keys = [];
            this.forEach(function (_, key) {
                keys.push(key);
            });
            return keys;
        },

        values: function () {
            const values = [];
            this.forEach(function (value) {
                values.push(value);
            });
            return values;
        },

        entries: function () {
            const entries = [];
            this.forEach(function (value, key) {
                entries.push([key, value]);
            });
            return entries;
        },
        clear: function () {
            // we clone the options as its dangerous to modify mid execution.
            this._buckets = new HashBuckets({
                widthB: this.options.widthB,
                width: this.options.width,
                mask: this.options.mask,
                depth: this.options.depth
            }, this.options.depth);
            this.length = 0;
        },

        clone: function () {
            return new HashMap(this, this.options);
        },
        hashEquals: function (key) {
            switch (typeof key) {
                case 'boolean':
                    return {
                        equalTo: defaultEquals, hash: key ? 0 : 1
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
                            equalTo: defaultEquals, hash: 0
                        };
                    }
                    if (Number.isInteger(key)) {
                        return {
                            equalTo: defaultEquals, hash: key
                        };
                    }
                    return {
                        equalTo: defaultEquals, hash: compute_hash(key.toString())
                    };

                case 'string':
                    return {
                        equalTo: defaultEquals, hash: compute_hash(key)
                    };
                case 'undefined':
                    return {
                        equalTo: defaultEquals, hash: 0
                    };
                default:
                    // null
                    if(!key){
                        return {
                            equalTo: defaultEquals, hash: 0
                        };
                    }

                    if(key instanceof RegExp){
                        return {
                            equalTo: function (me, them) {
                                if (them instanceof RegExp) {
                                    return me + '' === them + '';
                                }
                                return false;
                            }, hash: compute_hash(key + '')
                        };
                    }
                    if(key instanceof Date){
                        return {
                            equalTo: function (me, them) {
                                if (them instanceof Date) {
                                    return me.getTime() === them.getTime();
                                }
                                return false;
                            }, hash: key.getTime() | 0
                        };
                    }
                    if(key instanceof Array){
                        let functions = [];
                            let hash_code = key.length;
                            for (let i = 0; i < key.length; i++) {
                                const hashEquals = this.hashEquals(key[i]);
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

                    return this.hashEquals(key._hmuid_);
            }
        },
        forEach: function (func, ctx) {
            this._buckets.forEach(func, ctx || this);
        }
    };

    HashMap.uid = 0;

    // Iterator protocol for ES6
    if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
        proto[Symbol.iterator] = function () {
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
        };
    }

    //- Add chaining to all methods that don't return something

    ['set', 'copy', 'delete', 'clear', 'forEach'].forEach(function (method) {
        const fn = proto[method];
        proto[method] = function () {
            fn.apply(this, arguments);
            return this;
        };
    });


    function defaultEquals(me, them) {
        return me === them;
    }

    // Note: In this version, all arithmetic is performed with unsigned 32-bit integers.
    //       In the case of overflow, the result is reduced modulo 232.
    function compute_hash(key, seed, len) {
        len = len ? Math.min(len, key.length) : key.length;
        seed = seed ? seed : 0;
        const remaining = len & 3;
        const bytes = len - remaining;
        let hash = seed | 0, k = 0, i  =0;

        while (i< bytes)
        {
            k = (key.codePointAt(i++) & 0xff) |
                ((key.codePointAt(i++) & 0xff) << 8) |
                ((key.codePointAt(i++) & 0xff) << 16) |
                ((key.codePointAt(i++) & 0xff) << 24);

            k *= (k * 0xcc9e2d51) | 0;
            k = (k << 15) | (k >>> 17);
            k =  (k * 0x1b873593) | 0;

            hash ^= k;
            hash = (hash << 13) | (hash >>> 19);
            hash = (hash*5+0xe6546b64) | 0;
        }
        switch(remaining)
        {
            case 3: k ^= (key.codePointAt(i + 2) & 0xff) << 16;
            /* falls through */
            case 2: k ^= (key.codePointAt(i + 1) & 0xff) << 8;
            /* falls through */
            case 1: k ^= (key.codePointAt(i) & 0xff);

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
