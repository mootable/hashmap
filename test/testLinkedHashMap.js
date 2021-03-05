/*jshint -W030,-W121 */
var expect = require('chai').expect,
	HashMap = require('../hashmap').LinkedHashMap,
	linkedHashMap;

describe('linkedHashMap', function() {
	beforeEach(function() {
		linkedHashMap = new HashMap();
	});


	describe('method chaining', function() {
		it('should return the instance on some methods', function() {
			expect(linkedHashMap.set('key', 'value')).to.equal(linkedHashMap);
			expect(linkedHashMap.delete('key')).to.equal(linkedHashMap);
			expect(linkedHashMap.copy(linkedHashMap)).to.equal(linkedHashMap);
			expect(linkedHashMap.clear()).to.equal(linkedHashMap);
			expect(linkedHashMap.forEach(function(){})).to.equal(linkedHashMap);
		});
	});

	describe('linkedHashMap.has()', function() {
		it('should return false when it does not have an entry with a key', function() {
			expect(linkedHashMap.has('key')).to.be.false;
		});

		it('should return true when it has an entry with a key', function() {
			linkedHashMap.set('key', 'value');
			expect(linkedHashMap.has('key')).to.be.true;
		});

		// TODO: Check other types?
	});

	describe('linkedHashMap.search()', function() {
		it('should return undefined when it does not have an entry with a value', function() {
			expect(linkedHashMap.search('value')).to.be.undefined;
		});

		it('should return key under which a value is stored', function() {
			linkedHashMap.set('key', 'value');
			expect(linkedHashMap.search('value')).to.equal('key');
		});
	});

	describe('linkedHashMap.delete()', function() {
		it('should delete an entry by key', function() {
			linkedHashMap.set('key', 'value1');
			linkedHashMap.delete('key');
			expect(linkedHashMap.has('key')).to.be.false;
		});

		it('should not fail when the key is not found', function() {
			linkedHashMap.delete('key');
			expect(linkedHashMap.has('key')).to.be.false;
		});
	});

	describe('linkedHashMap.get()', function() {
		var uid = 1;
		function val() { return 'value'+uid++; }

		it('should map the same key consistenly to the same hash', function() {
			function check(key) {
				var value = val();
				linkedHashMap.set(key, value);
				expect(linkedHashMap.get(key)).to.equal(value);
			}

			check(null);
			check(undefined);
			check(false);
			check(NaN);
			check(1);
			check('Test');
			check(/test/);
			check(new Date(1986, 7, 15, 12, 5, 0, 0));
			check([]);
			check({});
			check(HashMap);
			check(linkedHashMap);
		});

		it('should map these pair of keys to the same hash', function() {
			function check(key, key2) {
				var value = val();
				linkedHashMap.set(key, value);
				expect(linkedHashMap.get(key2)).to.equal(value);
			}

			check(null, null);
			check(undefined, undefined);
			check(false, false);
			check(NaN, NaN);
			check(1, 1);
			check('Test', 'Test');
			check(/test/, /test/);
			check(new Date(1986, 7, 15, 12, 5, 0, 0), new Date(1986, 7, 15, 12, 5, 0, 0));
			check([], []);
			check([1, 2, 'Q'], [1, 2, 'Q']);
			check([null, /a/, NaN], [null, /a/, NaN]);
		});

		it('should NOT map these pair of keys to the same hash', function() {
			function check(key, key2) {
				var value = val();
				linkedHashMap.set(key, value);
				expect(linkedHashMap.get(key2)).not.to.equal(value);
			}

			check(null, undefined);
			check(null, false);
			check(false, 0);
			check(false, '');
			check(1, '1');
			check(/test/, /test2/);
			check(/test/, '/test/');
			check(new Date(123456789), new Date(987654321));
			check({}, {});
			check(linkedHashMap, Object.create(linkedHashMap));
		});
	});

	describe('linkedHashMap.forEach()', function() {
		function collect() {
			var pairs = [];
			linkedHashMap.forEach(function(value, key) {
				pairs.push({key:key, value:value});
			});
			return pairs;
		}

		it('should pass the basic test', function() {
			linkedHashMap.set('key', 'value');
			var called = 0;
			linkedHashMap.forEach(function(value, key) {
				called++;
				expect(value).to.equal('value');
				expect(key).to.equal('key');
				expect(this).to.equal(linkedHashMap);
			});
			expect(called).to.equal(1);
		});

		it('should call the callback once per key', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			linkedHashMap.set('key2', 'value2a');
			expect(collect().length).to.equal(2);
		});

		it('should not call the callback on delete keys', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.delete('key');
			expect(collect()).to.be.empty;
		});

		it('should remain consistent among calls', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			expect(collect()).to.deep.equal(collect());
		});

		it('should respect forEach context', function() {
			linkedHashMap.set('key', 'value');
			var ctx = {};
			linkedHashMap.forEach(function(value, key) {
				expect(this).to.equal(ctx);
			}, ctx);
		});
	});

	describe('linkedHashMap.keys()', function() {
		it('should return an empty array for an empty linkedHashMap', function() {
			expect(linkedHashMap.keys()).to.be.empty;
		});

		it('should return an array with one key once added', function() {
			linkedHashMap.set('key', 'value');
			expect(linkedHashMap.keys()).to.deep.equal(['key']);
		});

		it('should work for several keys', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			expect(linkedHashMap.keys().sort()).to.deep.equal(['key', 'key2']);
		});
	});

	describe('linkedHashMap.values()', function() {
		it('should return an empty array for an empty linkedHashMap', function() {
			expect(linkedHashMap.values()).to.be.empty;
		});

		it('should return an array with one value once added', function() {
			linkedHashMap.set('key', 'value');
			expect(linkedHashMap.values()).to.deep.equal(['value']);
		});

		it('should work for several values', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			expect(linkedHashMap.values().sort()).to.deep.equal(['value', 'value2']);
		});
	});

	describe('linkedHashMap.entries()', function() {
		it('should return an empty array for an empty linkedHashMap', function() {
			expect(linkedHashMap.entries()).to.be.empty;
		});

		it('should return an array with one value once added', function() {
			linkedHashMap.set('key', 'value');
			expect(linkedHashMap.entries()).to.deep.equal([['key','value']]);
		});

		it('should work for several values', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			expect(linkedHashMap.entries().sort()).to.deep.equal([['key','value'], ['key2','value2']]);
		});
	});

	describe('ES6 Iterators', function() {
		it('should do nothing on an empty linkedHashMap', function() {
			var called = false;
			for (var pair of linkedHashMap) { // jshint ignore:line
				// (`pair` is not used)
				called = true;
			}
			expect(called).to.be.false;
		});

		it('should iterate over all entries exactly once', function() {
			// Since order of iteration is not guaranteed, we'll keep track of which key-value pair has been checked, and how many times.
			var numberOfTries = 10;
			var calls = new Array(numberOfTries).fill(0);
			// Populate linkedHashMap with ['keyI': I] pairs
			for (var i = 0; i < numberOfTries; i++) {
				linkedHashMap.set('key' + i, i);
			}
			// Perform ES6 iteration
			for (var pair of linkedHashMap) {
				expect(pair.key).to.equal('key' + pair.value);
				calls[pair.value]++;
			}
			expect(calls).to.deep.equal(new Array(numberOfTries).fill(1));
		});
	});

	describe('linkedHashMap.length', function() {
		// will be checked only in this unit test!
		it('should return 0 when nothing was added', function() {
			expect(linkedHashMap.length).to.equal(0);
		});

		it('should return 1 once an entry was added', function() {
			linkedHashMap.set('key', 'value');
			expect(linkedHashMap.length).to.equal(1);
		});

		it('should not increase when setting an existing key', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key', 'value2');
			expect(linkedHashMap.length).to.equal(1);
		});

		it('should increase when setting different key', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			expect(linkedHashMap.length).to.equal(2);
		});

		it('should decrease when deleting a key', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value');
			linkedHashMap.delete('key');
			expect(linkedHashMap.length).to.equal(1);

			linkedHashMap.delete('key2');
			expect(linkedHashMap.length).to.equal(0);
		});
	});

	describe('linkedHashMap.clear()', function() {
		it('should do nothing when empty', function() {
			linkedHashMap.clear();
			expect(linkedHashMap.length).to.equal(0);
		});

		it('should delete the only entry', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.clear();
			expect(linkedHashMap.length).to.equal(0);
		});

		it('should delete multiple entries', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			linkedHashMap.clear();
			expect(linkedHashMap.length).to.equal(0);
		});
	});

	describe('linkedHashMap.copy()', function() {
		it('should work on an empty linkedHashMap', function() {
			var map = new HashMap();
			map.copy(linkedHashMap);
			expect(map.length).to.equal(0);
		});

		it('should copy all values', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');

			var map = new HashMap();
			map.copy(linkedHashMap);

			expect(map.length).to.equal(2);
			expect(map.get('key')).to.equal('value');
			expect(map.get('key2')).to.equal('value2');
		});
	});

	describe('linkedHashMap.clone()', function() {
		it('should return a new linkedHashMap', function() {
			var clone = linkedHashMap.clone();
			expect(clone).to.be.instanceOf(HashMap);
			expect(clone).not.to.equal(linkedHashMap);
		});

		it('should work on an empty linkedHashMap', function() {
			var clone = linkedHashMap.clone();
			expect(clone.length).to.equal(0);
		});

		it('should retain all values', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');
			var clone = linkedHashMap.clone();
			expect(clone.length).to.equal(2);
			expect(clone.get('key')).to.equal('value');
			expect(clone.get('key2')).to.equal('value2');
			expect(linkedHashMap.length).to.equal(2);
			expect(linkedHashMap.get('key')).to.equal('value');
			expect(linkedHashMap.get('key2')).to.equal('value2');
		});
	});


	describe('constructor', function() {
		this.timeout(0);

		it('should create an empty linkedHashMap when no arguments', function() {
			expect(linkedHashMap.length).to.equal(0);
		});

		it('should clone a linkedHashMap when one argument', function() {
			linkedHashMap.set('key', 'value');
			linkedHashMap.set('key2', 'value2');

			var map = new HashMap(linkedHashMap);
			expect(map.length).to.equal(2);
			expect(map.get('key')).to.equal('value');
			expect(map.get('key2')).to.equal('value2');
		});

		it('should initialize from a 2D array for a single Array argument', function() {
			var map = new HashMap(
				[['key', 'value'],
				 ['key2', 'value2']]
			);
			expect(map.length).to.equal(2);
			expect(map.get('key')).to.equal('value');
			expect(map.get('key2')).to.equal('value2');
		});

		it('should initialize from a 2D array for a nested Array argument', function() {
			var map = new HashMap(
				[[[1, 'key'], ['value', 1]],
				 [[2, 'key2'], ['value2', 2]]]
			);
			expect(map.length).to.equal(2);
			expect(map.get([1, 'key'])).to.deep.equal(['value', 1]);
			expect(map.get([2, 'key2'])).to.deep.equal(['value2', 2]);
		});
	});
});