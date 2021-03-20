(function (factory) {
  typeof define === 'function' && define.amd ? define(['core-js/modules/es6.symbol.js', 'core-js/modules/es6.string.iterator.js', 'core-js/modules/es6.object.to-string.js', 'core-js/modules/es6.array.iterator.js', 'core-js/modules/web.dom.iterable.js', 'core-js/modules/es7.symbol.async-iterator.js', 'core-js/modules/es6.object.get-prototype-of.js', 'core-js/modules/es6.function.name.js', 'core-js/modules/es6.promise.js', 'core-js/modules/es6.regexp.to-string.js', 'core-js/modules/es6.array.slice.js', 'core-js/modules/es6.number.constructor.js', 'core-js/modules/es6.number.is-nan.js', 'core-js/modules/es6.number.is-finite.js', 'core-js/modules/es6.number.is-integer.js', 'core-js/modules/es6.regexp.constructor.js', 'core-js/modules/es6.object.freeze.js', 'core-js/modules/es6.array.from.js', 'core-js/modules/es6.array.find.js', 'core-js/modules/es6.map.js', 'core-js/modules/es6.array.map.js', 'core-js/modules/es6.object.assign.js', 'core-js/modules/es6.set.js'], factory) :
  factory();
}((function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }

    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function define(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" ? module.exports : {});

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }

  /**
   * HashMap - HashMap Implementation for JavaScript
   * @namespace Mootable
   * @author Jack Moxley <https://github.com/jackmoxley>
   * @version 0.11.1
   * Homepage: https://github.com/mootable/hashmap
   */

  /**
   * Modified Murmur3 HashCode generator, with capped lengths.
   * This is NOT a cryptographic hash, this hash is designed to create as even a spread across a 32bit integer as is possible.
   * @see {@link https://github.com/aappleby/smhasher|MurmurHash specification on Github}
   * @see {@link https://en.wikipedia.org/wiki/MurmurHash|MurmurHash on Wikipedia}
   * @function Mootable.hashCode
   * @param key the string being hashed
   * @param seed an optional random seed
   * @param len the max limit on the number of characters to hash
   * @returns {number} the hash
   */
  function hashCode(key) {
    var seed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    len = len && len > 0 ? Math.min(len, key.length) : key.length;
    seed = seed | 0;
    var remaining = len & 1;
    var bytes = len - remaining;
    var hash = seed,
        k = 0,
        i = 0;

    while (i < bytes) {
      k = key.charCodeAt(i++) & 0xffff | (key.charCodeAt(i++) & 0xffff) << 16;
      k *= k * 0xcc9e2d51 | 0;
      k = k << 15 | k >>> 17;
      k = k * 0x1b873593;
      hash ^= k;
      hash = hash << 13 | hash >>> 19;
      hash = hash * 5 + 0xe6546b64;
    }

    if (remaining) {
      k ^= key.charCodeAt(i) & 0xffff;
      k = k * 0xcc9e2d51;
      k = k << 15 | k >>> 17;
      k = k * 0x1b873593;
      hash ^= k;
    }

    hash ^= len;
    hash ^= hash >>> 16;
    hash = hash * 0x85ebca6b;
    hash ^= hash >>> 13;
    hash = hash * 0xc2b2ae35;
    hash ^= hash >>> 16;
    return hash | 0;
  }
  /**
   * Is the passed value not null and a function
   * @param func
   * @returns {boolean}
   */


  var isFunction = function isFunction(func) {
    return !!(func && func.constructor && func.call && func.apply);
  };
  /**
   * Is the passed object iterable
   * @param iterable
   * @return {boolean}
   */


  var isIterable = function isIterable(iterable) {
    return !!(iterable && isFunction(iterable[Symbol.iterator]));
  };
  /**
   * The default Equals method we use this in most cases.
   *
   * @param me
   * @param them
   * @returns {boolean}
   */


  var defaultEquals = function defaultEquals(me, them) {
    return me === them;
  };
  /**
   * Does a wider equals for use with arrays.
   *
   * @param me
   * @param them
   * @param depth
   * @return {boolean}
   */


  var deepEquals = function deepEquals(me, them) {
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

    if (depth === 0 || Array.isArray(me) && Array.isArray(them)) {
      return me.length === them.length && me.every(function (el, ix) {
        return deepEquals(el, them[ix], --depth);
      });
    }

    return me === them;
  };
  /**
   * Returns back a pair of equalTo Methods and hash values, for a raft of different objects.
   * TODO: Revisit this at some point.
   * @param key
   * @returns {{equalTo: (function(*, *): boolean), hash: number}}
   */


  var hashEquals = function hashEquals(key) {
    switch (_typeof(key)) {
      case 'boolean':
        return {
          equalTo: defaultEquals,
          hash: key ? 0 : 1
        };

      case 'number':
        if (Number.isNaN(key)) {
          return {
            equalTo: function equalTo(me, them) {
              return Number.isNaN(them);
            },
            hash: 0
          };
        }

        if (!Number.isFinite(key)) {
          return {
            equalTo: defaultEquals,
            hash: 0
          };
        }

        if (Number.isInteger(key)) {
          return {
            equalTo: defaultEquals,
            hash: key
          };
        }

        return {
          equalTo: defaultEquals,
          hash: hashCode(key.toString())
        };

      case 'string':
        return {
          equalTo: defaultEquals,
          hash: hashCode(key)
        };

      case 'undefined':
        return {
          equalTo: defaultEquals,
          hash: 0
        };

      default:
        // null
        if (!key) {
          return {
            equalTo: defaultEquals,
            hash: 0
          };
        }

        if (key instanceof RegExp) {
          return {
            equalTo: function equalTo(me, them) {
              if (them instanceof RegExp) {
                return me + '' === them + '';
              }

              return false;
            },
            hash: hashCode(key + '')
          };
        }

        if (key instanceof Date) {
          return {
            equalTo: function equalTo(me, them) {
              if (them instanceof Date) {
                return me.getTime() === them.getTime();
              }

              return false;
            },
            hash: key.getTime() | 0
          };
        }

        if (key instanceof Array) {
          var functions = [];
          var hash_code = key.length;

          for (var i = 0; i < key.length; i++) {
            var currHE = hashEquals(key[i]);
            functions.push(currHE.equalTo);
            hash_code = hash_code + currHE.hash * 31;
          }

          Object.freeze(functions);
          return {
            equalTo: function equalTo(me, them) {
              if (them instanceof Array && me.length === them.length) {
                for (var _i = 0; _i < me.length; _i++) {
                  if (!functions[_i](me[_i], them[_i])) {
                    return false;
                  }
                }

                return true;
              }

              return false;
            },
            hash: hash_code | 0
          };
        } // Ew get rid of this.


        if (!key.hasOwnProperty('_hmuid_')) {
          key._hmuid_ = ++HashMap.uid; // hide(key, '_hmuid_');
        }

        return hashEquals(key._hmuid_);
    }
  };
  /**
   * The base class for the Map Implementations, and the Higher Order Functions for Maps
   * @example <caption>Create a MapIterable from a Map.</caption>
   * const myMap = new Map();
   * const mapIterable = MapIterable.from(myMap);
   * @example <caption>Create a MapIterable from a Set.</caption>
   * const mySet = new Set();
   * // sets wrapped in a map iterable must have a value of an Array matching [key,value]
   * mySet.add(["key", "value"]);
   * const mapIterable = MapIterable.from(mySet);
   * @example <caption>Create a MapIterable from an Array.</caption>
   * // arrays wrapped in a map iterable must have be an array of arrays matching [key,value]
   * const myArray = [["key", "value"]];
   * const mapIterable = MapIterable.from(myArray);
   * @example <caption>Create a MapIterable from an Iterable.</caption>
   * // iterables wrapped in a map iterable must yield arrays matching [key,value],
   * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]()
   * // can be used as long as they follow that contract.
   * const myIterable = {
   *     *[Symbol.iterator]() {
   *         yield ["key1", "value1"];
   *         yield ["key2", "value2"];
   *         yield ["key3", "value3"];
   *     }
   * }
   * const mapIterable = MapIterable.from(myIterable);
   * @example <caption>Create a MapIterable from a Mootable HashMap.</caption>
   * // all Mootable HashMaps extend MapIterable, no need to wrap with the MapIterable.from() function.
   * const mapIterable = new HashMap();
   * @example <caption>Create a MapIterable from a Mootable LinkedHashMap.</caption>
   * // all Mootable LinkedHashMaps extend MapIterable, no need to wrap with the MapIterable.from() function.
   * const mapIterable = new LinkedHashMap();
   * @abstract
   */


  var MapIterable = /*#__PURE__*/function () {
    function MapIterable() {
      _classCallCheck(this, MapIterable);
    }

    _createClass(MapIterable, [{
      key: "size",
      get:
      /**
       * Returns the number of elements returned by this Map Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concatenation, it just queries the base collection size.
       * @example <caption>Return the size of this mapIterable.</caption>
       * const myMap = new Map();
       * // sets 2 values, and replaces 1 of them
       * myMap.set("key1","val1").set("key2","val2").set("key2","val2a");
       * const mapIterable = MapIterable.from(myMap);
       * // returns 2
       * const theSize = mapIterable.size;
       * @returns {number} the total number of elements in this MapIterable
       */
      function get() {
        var accumulator = 0;

        var _iterator = _createForOfIteratorHelper(this),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) // jshint ignore:line
          {
            var i = _step.value;
            accumulator++;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return accumulator;
      }
      /**
       * Wraps any class that iterates with <code>[key,value]</code> pairs and provides higher order chained functions.
       *
       * @example <caption>Create a MapIterable from a Map.</caption>
       * const myMap = new Map();
       * const mapIterable = MapIterable.from(myMap);
       * @example <caption>Create a MapIterable from a Set.</caption>
       * const mySet = new Set();
       * // sets wrapped in a map iterable must have a value of an Array matching [key,value]
       * mySet.add(["key", "value"]);
       * const mapIterable = MapIterable.from(mySet);
       * @example <caption>Create a MapIterable from an Array.</caption>
       * // arrays wrapped in a map iterable must have be an array of arrays matching [key,value]
       * const myArray = [["key", "value"]];
       * const mapIterable = MapIterable.from(myArray);
       * @example <caption>Create a MapIterable from an Iterable.</caption>
       * // iterables wrapped in a map iterable must yield arrays matching [key,value],
       * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]()
       * // can be used as long as they follow that contract.
       * const myIterable = {
       *     *[Symbol.iterator]() {
       *         yield ["key1", "value1"];
       *         yield ["key2", "value2"];
       *         yield ["key3", "value3"];
       *     }
       * }
       * const mapIterable = MapIterable.from(myIterable);
       * @example <caption>Create a MapIterable from a Mootable HashMap.</caption>
       * // all Mootable HashMaps extend MapIterable, no need to wrap with the MapIterable.from function. If you do it will just return it back.
       * const mapIterable = new HashMap();
       * @example <caption>Create a MapIterable from a Mootable LinkedHashMap.</caption>
       * // all Mootable LinkedHashMaps extend MapIterable, no need to wrap with the MapIterable.from() function.If you do it will just return it back.
       * const mapIterable = new LinkedHashMap();
       * @param {(Set.<Array.<key,value>>|Map|Array.<Array.<key,value>>|Iterator.<Array.<key,value>>|SetIterable.<Array.<key,value>>)} mapIterable the map to wrap
       * @return {MapIterable} the wrapped Map.
       */

    }, {
      key: "filter",
      value:
      /**
       * Test each element of the map to see if it matches and return
       *  - true if the key and value match.
       *  - false if it doesn't.
       * @example <caption>Only match keys divisible by 2</caption>
       * const myMatchPredicate = (value, key) => key % 2 === 0;
       * @example <caption>Only match values which are equal to another key in the map</caption>
       * const myMatchPredicate = (value, key, mapIterable) => mapIterable.has(value);
       * @example <caption>An alternative implementation, (but potentially slower, and assumes no undefined value)</caption>
       * const myMatchPredicate = (value, key, mapIterable) => mapIterable.indexOf(key) !== undefined;
       * @callback MapIterable#MatchesPredicate
       * @param {*} [value] - the entry value.
       * @param {*} [key] - the entry key
       * @param {MapIterable} [iterable] - the calling Map Iterable.
       * @return {boolean} a value that coerces to true if it matches, or to false otherwise.
       */

      /**
       * Test each element of the map and only include entries where the <code>MatchesPredicate</code> returns true.
       * @example <caption>Only match keys which are odd numbered.</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const filteredIterable = hashmap.filter((value,key) => key % 2 !== 0);
       * filteredIterable.forEach((value) => console.log(value));
       * // will log to the console:
       * // value1
       * // value3
       * @param {MapIterable#MatchesPredicate} [filterPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, that entry is excluded.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
       * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
       */
      function filter() {
        var filterPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        return new MapFilter(this, filterPredicate, ctx);
      }
      /**
       * For Each Function
       * A callback to execute on every <code>[key,value]</code> pair of this map iterable.
       * @example <caption>log the keys and values</caption>
       * const forEachFunction = (value, key) => console.log(key,value)
       * @callback MapIterable#ForEachCallback
       * @param {*} [value] - the entry value.
       * @param {*} [key] - the entry key
       * @param {MapIterable|SetIterable} [iterable] - the calling Map Iterable.
       */

      /**
       * Execute the provided callback on every <code>[key,value]</code> pair of this map iterable.
       * @example <caption>Log all the keys and values.</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * mapIterable.forEach((value) => console.log(key, value));
       * // will log to the console:
       * // 1 value1
       * // 2 value2
       * // 3 value3
       * @param {MapIterable#ForEachCallback} [forEachCallback=(value, key, iterable) => {}]
       * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
       * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
       */

    }, {
      key: "forEach",
      value: function forEach() {
        var forEachCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator2 = _createForOfIteratorHelper(this),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                key = _step2$value[0],
                value = _step2$value[1];

            forEachCallback.call(ctx, value, key, this);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        return this;
      }
      /**
       * Fills the provided collector, or an array if none provided, and fills it with the values of this {@link MapIterable}. Then return the collector.
       * The original collector, with the exception of arrays, will be modified as we call functions directly against it.
       *
       * A collector will be resolved in this order:
       *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}
       *    - a new array is created and passed back with the filled values, and the original is not changed.
       *  - Object with a function <code>.set</code>.
       *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}, {@link HashMap} or {@link LinkedHashMap}
       *    - it will call <code>set(key,value)</code> for every entry, if the value already exists for that key it is typically overridden. The original is modified.
       *  - Object with a function <code>.add</code>
       *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}
       *    - it will call <code>add([key,value])</code> for every entry, so that a <code>[key,value]</code> pair is added to the collection. The original is modified.
       *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}
       *    - It will call <code>obj[key] = value</code> for every entry, so that a property of <code>key</code> has a value of <code>value</code> set on it. The original is modified.
       *
       * @example <caption>Collect to a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const myArray = mapIterable.collect();
       * // myArray === [[1,'value1'],[2,'value2'],[3,'value3']]:
       * @example <caption>Collect with an empty existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldArray = [];
       * const newArray = mapIterable.collect(oldArray);
       * // newArray === [[1,'value1'],[2,'value2'],[3,'value3']]
       * // oldArray === []
       * @example <caption>Collect with an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldArray = [[2,'someOtherValue']];
       * const newArray = mapIterable.collect(oldArray);
       * // newArray === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
       * // oldArray === [[2,'someOtherValue']]
       * @example <caption>Collect to an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values, modifying the old array.</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const array  = [[2,'someOtherValue']];
       * array.push(mapIterable.collect())
       * // array === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
       * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldSet = new Set().add('willRemain');
       * const newSet = mapIterable.collect(oldSet);
       * // oldSet === newSet === ['willRemain',[1,'value1'],[2,'value2'],[3,'value3']]
       * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldMap = new Map().set(2,'willBeOverwritten').set(5,'willRemain');
       * const newMap = mapIterable.collect(oldMap);
       * // oldMap === newMap === [[2,'value2'],[5,'willRemain'],[1,'value1'],[3,'value3']]
       * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldObject = {'1','willBeOverridden'};
       * const newObject = mapIterable.collect(oldObject);
       * // oldObject === newObject === {'1': 'value1', '2': 'value2', '3': 'value3'}
       * @param {(Array|Set|Map|HashMap|LinkedHashMap|Object)} [collector=[]] the collection to fill
       * @returns {(Array|Set|Map|HashMap|LinkedHashMap|Object)} The collector that was passed in.
       */

    }, {
      key: "collect",
      value: function collect() {
        var collector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (Array.isArray(collector)) {
          if (collector.length) {
            return collector.concat(Array.from(this));
          }

          return Array.from(this);
        } else if (isFunction(collector.set)) {
          var _iterator3 = _createForOfIteratorHelper(this),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _step3$value = _slicedToArray(_step3.value, 2),
                  key = _step3$value[0],
                  value = _step3$value[1];

              collector.set(key, value);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        } else if (isFunction(collector.add)) {
          var _iterator4 = _createForOfIteratorHelper(this),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var entry = _step4.value;
              collector.add(entry);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        } else {
          var _iterator5 = _createForOfIteratorHelper(this),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _step5$value = _slicedToArray(_step5.value, 2),
                  _key = _step5$value[0],
                  _value = _step5$value[1];

              collector[_key] = _value;
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }

        return collector;
      }
      /**
       * Test to see if ALL elements pass the test implemented by the passed <code>MatchesPredicate</code>.
       * - if any element does not match, returns false
       * - if all elements match, returns true.
       * - if no elements match, returns false.
       * - if the iterable is empty, returns true. (irrespective of the predicate)
       * - if no predicate is provided, returns true.
       *
       * @example <caption>Do all values start with value. (yes)</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const everyResult = hashmap.every((value) => value.startsWith('value'));
       * // everyResult === true
       * @example <caption>Do all values start with value. (no)</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'doesntStart'],[3,'value3']]);
       * const everyResult = hashmap.every((value) => value.startsWith('value'));
       * // everyResult === false
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every|Array.every}
       * @param {MapIterable#MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
       * @returns {boolean} true if all elements match, false if one or more elements fails to match.
       */

    }, {
      key: "every",
      value: function every() {
        var everyPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator6 = _createForOfIteratorHelper(this),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _step6$value = _slicedToArray(_step6.value, 2),
                key = _step6$value[0],
                value = _step6$value[1];

            if (!everyPredicate.call(ctx, value, key, this)) {
              return false;
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }

        return true;
      }
      /**
       * Test to see if ANY element pass the test implemented by the passed <code>MatchesPredicate</code>.
       * - if any element matches, returns true.
       * - if all elements match returns true.
       * - if no elements match returns false.
       * - if the iterable is empty, returns true.
       * - if no predicate is provided, returns true.
       *
       * @example <caption>Do any values start with value. (yes all of them)</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const someResult = hashmap.some((value) => value.startsWith('value'));
       * // someResult === true
       * @example <caption>Do any values start with value. (yes 2 of them)</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'doesntStart'],[3,'value3']]);
       * const someResult = hashmap.some((value) => value.startsWith('value'));
       * // someResult === true
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.some}
       * @param {MapIterable#MatchesPredicate} [somePredicate=(value, key, iterable) => true] - the predicate to identify if we have a match.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>somePredicate</code>
       * @returns {boolean} - true if all elements match, false if one or more elements fails to match.
       */

    }, {
      key: "some",
      value: function some() {
        var somePredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator7 = _createForOfIteratorHelper(this),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _step7$value = _slicedToArray(_step7.value, 2),
                key = _step7$value[0],
                value = _step7$value[1];

            if (somePredicate.call(ctx, value, key, this)) {
              return true;
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }

        return false;
      }
      /**
       * Find the first value in the map which passes the provided <code>MatchesPredicate</code>.
       * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
       * - if no elements match, it returns undefined.
       * - if no predicate is defined, will return the first value it finds.
       * @example <caption>Find a value</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const findResult = hashmap.find((value) => value.endsWith('ue2'));
       * // findResult === 'value2'
       * @example <caption>Can't find a value</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const findResult = hashmap.find((value) => value.startsWith('something'));
       * // findResult === undefined
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
       * @param {MapIterable#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findPredicate</code>
       * @returns {*} - the value of the element that matches.
       */

    }, {
      key: "find",
      value: function find() {
        var findPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator8 = _createForOfIteratorHelper(this),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _step8$value = _slicedToArray(_step8.value, 2),
                key = _step8$value[0],
                value = _step8$value[1];

            if (findPredicate.call(ctx, value, key, this)) {
              return value;
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        return undefined;
      }
      /**
       * Find the first value in the key which passes the provided  <code>MatchesPredicate</code>.
       * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
       * - if no elements match, it returns undefined.
       * - if no predicate is defined, will return the first key it finds.
       *
       * @example <caption>Find a key</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const findIndexResult = hashmap.findIndex((value) => value.endsWith('ue2'));
       * // findIndexResult === 2
       * @example <caption>Can't find a key</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const findIndexResult = hashmap.findIndex((value) => value.startsWith('something'));
       * // findIndexResult === undefined
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex|Array.findIndex}
       * @param {MapIterable#MatchesPredicate} [findIndexPredicate=(value, key, iterable) => key] - the predicate to identify if we have a match.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findIndexPredicate</code>
       * @returns {*} - the key of the element that matches..
       */

    }, {
      key: "findIndex",
      value: function findIndex() {
        var findIndexPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value, key) {
          return key;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator9 = _createForOfIteratorHelper(this),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _step9$value = _slicedToArray(_step9.value, 2),
                key = _step9$value[0],
                value = _step9$value[1];

            if (findIndexPredicate.call(ctx, value, key, this)) {
              return key;
            }
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }

        return undefined;
      }
      /**
       * Find the first key in the map whose value is <code>===</code> to the provided value.
       * - return the first <code>key</code> from the <code>[key,value]</code> pair that matches
       * - if no elements match, it returns undefined.
       * - it is legitimate for values to be null or undefined, and if set, will find a key.
       *
       * Values are not indexed, this is potentially an expensive operation.
       *
       * @example <caption>Find the key for a value</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const indexOfResult = hashmap.indexOf('value2');
       * // indexOfResult === 2
       * @example <caption>what is the key of a non existent value</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const indexOfResult = hashmap.indexOf('something');
       * // indexOfResult === undefined
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf|Array.indexOf}
       * @param {*} valueToCheck - the value we use to === against the entries value to identify if we have a match.
       * @param {number} [depth=-1] - if using an array, marks how deep we go through to test equality.
       * @returns {*} - the key of the element that matches..
       */

    }, {
      key: "indexOf",
      value: function indexOf(valueToCheck) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

        if (Array.isArray(valueToCheck)) {
          var _iterator10 = _createForOfIteratorHelper(this),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var _step10$value = _slicedToArray(_step10.value, 2),
                  key = _step10$value[0],
                  value = _step10$value[1];

              if (deepEquals(valueToCheck, value, depth)) {
                return key;
              }
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
        } else {
          var _iterator11 = _createForOfIteratorHelper(this),
              _step11;

          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var _step11$value = _slicedToArray(_step11.value, 2),
                  _key2 = _step11$value[0],
                  _value2 = _step11$value[1];

              if (defaultEquals(valueToCheck, _value2)) {
                return _key2;
              }
            }
          } catch (err) {
            _iterator11.e(err);
          } finally {
            _iterator11.f();
          }
        }

        return undefined;
      }
      /**
       * Does the map have this key.
       * If backed by a Map or HashMap, or in fact any collection that implements the <code>.has(key)</code> function, then it will utilize that, otherwise it will iterate across the collection.
       * - return true if the <code>key</code> matches a <code>[key,value]</code> pair.
       * - if no elements match, it returns false.
       * - it is legitimate for keys to be null or undefined, and if set, will return true
       *
       * Maps typically index keys, and so is generally a fast operation.
       * @example <caption>>Does this contain a key that is there</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const hasResult = hashmap.has(1);
       * // hasResult === true
       * @example <caption>Does this contain a key that isn't there</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const hasResult = hashmap.has(4);
       * // hasResult === false
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has|Map.has}
       * @param {*} key - the key we use to === against the entries key to identify if we have a match.
       * @returns {boolean} - if it holds the key or not.
       */

    }, {
      key: "has",
      value: function has(key) {
        var equalTo = hashEquals(key).equalTo;
        return this.some(function (_, otherKey) {
          return equalTo(otherKey, key);
        });
      }
      /**
       * Get a value from the map using this key.
       * If backed by a Map or HashMap, or in fact any collection that implements the <code>.get(key)</code> function, then it will utilize that, otherwise it will iterate across the collection.
       * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
       * - if no elements match, it returns undefined.
       * - it is legitimate for keys to be null or undefined, and if set, will find a value.
       * - if a map is earlier on in the chain, the value, will be mapped along the way.
       *   - However there is no way to reverse map the key, as we do the fetch, which means the key has to be the same as the one in the original collection.
       *
       * Maps typically index keys, and so is generally a fast operation.
       * @example <caption>>What is the value for a key</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const getResult = hashmap.get(1);
       * // getResult === 'value1'
       * @example <caption>What is the value for a key that isn't there</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const getResult = hashmap.get(4);
       * // getResult === undefined
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get|Map.get}
       * @param {*} key - the key we use to === against the entries key to identify if we have a match.
       * @returns {*} - the value of the element that matches.
       */

    }, {
      key: "get",
      value: function get(key) {
        var equalTo = hashEquals(key).equalTo;
        return this.find(function (value, otherKey) {
          return equalTo(key, otherKey);
        });
      }
      /**
       * Get a value from the map using this as an optional. This is effectively a combination of calling has and get at the same time.
       * If backed by a Map or HashMap, or in fact any collection that implements the <code>.optionalGet(key)</code> function, then it will utilize that, otherwise depending on the existence of has and get functions it may iterate across the collection.
       * - return the first <code>value</code> from the <code>[key,value]</code> pair that matches
       * - if no elements match, it returns undefined.
       * - it is legitimate for keys to be null or undefined, and if set, will find a value.
       * - if a map is earlier on in the chain, the value, will be mapped along the way.
       *   - However there is no way to reverse map the key, as we do the fetch, which means the key has to be the same as the one in the original collection.
       *
       * Maps typically index keys, and so is generally a fast operation.
       * @example <caption>>What is the value for a key</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const getResult = hashmap.get(1);
       * // getResult === 'value1'
       * @example <caption>What is the value for a key that isn't there</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const getResult = hashmap.get(4);
       * // getResult === undefined
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get|Map.get}
       * @param {*} key - the key we use to === against the entries key to identify if we have a match.
       * @returns {{has: boolean, value:*}} - an optional result.
       */

    }, {
      key: "optionalGet",
      value: function optionalGet(key) {
        var equalTo = hashEquals(key).equalTo;
        var found = false;
        var val = this.find(function (value, otherKey) {
          if (equalTo(key, otherKey)) {
            found = true;
            return true;
          }

          return false;
        });

        if (found) {
          return Optional.of(val);
        }

        return Optional.none();
      }
      /**
       * Reduce Function
       * A callback to accumulate values from the Map Iterables <code>[key,value]</code> into a single value.
       * if initial value is <code>undefined</code> or <code>null</code>, unlike Array.reduce,
       * no error occurs, and it is imply passed as the accumulator value
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
       * @example <caption>add all the keys</caption>
       * const reduceFunction = (accumulator, value, key) => accumulator+key
       * @callback MapIterable#ReduceFunction
       * @param {*} [accumulator] - the value from the last execution of this function.
       * @param {*} [value] - the entry value.
       * @param {*} [key] - the entry key
       * @param {MapIterable} [iterable] - the calling Map Iterable.
       * @return {*} [accumulator] - the value to pass to the next time this function is called or the final return value.
       */

      /**
       * Iterate through the map iterable reducing it to a single value.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
       * @example <caption>add all the keys</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const reduceResult = hashmap.reduce((accumulator, value, key) => accumulator+key, 0);
       * // reduceResult === 6
       * @example <caption>add all the values into one string in reverse order</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const reduceResult = hashmap.reduce((accumulator, value) => value+accumulator, '');
       * // reduceResult === 'value3value2value1'
       * @param {MapIterable#ReduceFunction} [reduceFunction=(accumulator, value, key, iterable) => true] - the predicate to identify if we have a match.
       * @param {*} [initialValue] the initial value to start on the reduce.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {*} - the final accumulated value.
       */

    }, {
      key: "reduce",
      value: function reduce() {
        var reduceFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (accumulator, value) {
          return value;
        };
        var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
        var accumulator = initialValue;

        var _iterator12 = _createForOfIteratorHelper(this),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var _step12$value = _slicedToArray(_step12.value, 2),
                key = _step12$value[0],
                value = _step12$value[1];

            accumulator = reduceFunction.call(ctx, accumulator, value, key, this);
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        return accumulator;
      }
      /**
       * Map Function
       * A callback that takes a <code>[key,value]</code> and the current iterable, and returns a mapped value.
       * How this mapped value is used depends on the calling function.
       *  - mapKeys the key is transformed to the returned value
       *  - mapValues the value is transformed to the returned value
       *  - mapEntries the value should be of the form [key, value] and transforms each accordingly
       *  - map the MapIterable is turned into a SetIterable, and this returned value is the resultant entry.
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
       * @example <caption>swap key and value</caption>
       * const mapEntriesFunction = ( value, key) => [value, key];
       * // the typical response is [key, value]
       * @callback MapIterable#MapFunction
       * @param {*} [value] - the entry value.
       * @param {*} [key] - the entry key
       * @param {MapIterable} [iterable] - the calling Map Iterable.
       * @return {*} [mappedValue] - the mapped value to return.
       */

      /**
       * For every entry, use the mapKeyFunction to transform the existing key.
       * This does not modify the original collection, and execution is deferred until it is fetched.
       * @example <caption>add one to all the keys and turn them into strings</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const mappedKeysIterable = hashmap.mapKeys((value, key) => 'k'+(key+1));
       * const mappedKeysArray = mappedKeysIterable.collect();
       * // mappedKeysArray === [['k2','value1'],['k3','value2'],['k4','value3']]
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
       * @param {MapIterable#MapFunction} [mapKeyFunction=(value, key, iterable) => key] - the function that transforms the key.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
       */

    }, {
      key: "mapKeys",
      value: function mapKeys() {
        var mapKeyFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value, key) {
          return key;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        return new MapKeyMapper(this, mapKeyFunction, ctx);
      }
      /**
       * For every entry, use the mapValueFunction to transform the existing value.
       * This does not modify the original collection, and execution is deferred until it is fetched.
       * @example <caption>prepend the values with the keys</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const mappedValuesIterable = hashmap.mapValues((value, key) => key + value);
       * const mappedValuesArray = mappedValuesIterable.collect();
       * // mappedValuesArray === [['1','1value1'],[2,'2value2'],[3,'3value3']]
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
       * @param {MapIterable#MapFunction} [mapValueFunction=(value, key, iterable) => value] - the function that transforms the value.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
       */

    }, {
      key: "mapValues",
      value: function mapValues() {
        var mapValueFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value) {
          return value;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        return new MapValueMapper(this, mapValueFunction, ctx);
      }
      /**
       * For every entry, use the mapEntryFunction to transform the existing value and existing key.
       * This does not modify the original collection, and execution is deferred until it is fetched.
       * - If one Function is provided
       *   - The function MUST return an array with at least 2 entries, the first entry is the key, the second is the value.
       *   - if the parameter is not an array or a function a TypeError is thrown.
       * - If an array of Functions is provided
       *   - The first function, (if defined), modifies the key. It needs only return the key. see {@link MapIterable#mapKeys mapKeys}
       *   - the second function, (if defined), modifies the value. see {@link MapIterable#mapValues mapValues}
       *   - if both the first and second values in the array are not functions a TypeError is thrown.
       * - In both cases will return {@link MapIterable}
       * @example <caption>swap the keys and the values</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const mapEntriesIterable = hashmap.mapEntries((value, key) => [value,key])
       * const mapEntriesArray = mapEntriesIterable.collect();
       * // mapEntriesArray === [['value1',1],['value2',2],['value3',3]]
       * @example <caption>swap the keys and the values with 2 functions</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const mapEntriesIterable = hashmap.mapEntries([(value) => value,(value, key) => key])
       * const mapEntriesArray = mapEntriesIterable.collect();
       * // mapEntriesArray === [['value1',1],['value2',2],['value3',3]]
       * @example <caption>modify just the keys</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * // Notice we are passing an array of one function.
       * const mapEntriesIterable = hashmap.mapEntries([(value, key) => value])
       * const mapEntriesArray = mapEntriesIterable.collect();
       * // mapEntriesArray === [['value1','value1'],['value2','value2'],['value2','value2']]
       * @example <caption>modify just the values</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * // Notice we are passing an array of two, but have only defined the last as a function.
       * const mapEntriesIterable = hashmap.mapEntries([undefined,(value, key) => key])
       * const mapEntriesArray = mapEntriesIterable.collect();
       * // mapEntriesArray === [[1,1],[2,2],[3,3]]
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
       * @param {MapIterable#MapFunction|Array.<MapIterable#MapFunction,MapIterable#MapFunction>} [mapEntryFunction=(value, key, iterable) => [key, value]] - the function that transforms the key and value.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {MapIterable} an iterable that allows you to iterate key value pairs.
       * @throws {TypeError} if at least one function is not provided.
       */

    }, {
      key: "mapEntries",
      value: function mapEntries() {
        var mapEntryFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value, key) {
          return [key, value];
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        if (Array.isArray(mapEntryFunction)) {
          if (mapEntryFunction.length === 1 && isFunction(mapEntryFunction[0])) {
            // we are just mapping keys
            return this.mapKeys(mapEntryFunction[0], ctx);
          } else if (mapEntryFunction.length > 1) {
            if (isFunction(mapEntryFunction[0])) {
              if (isFunction(mapEntryFunction[1])) {
                // We don't chain, as we don't want the transformed value or key, to appear in either functions as arguments.
                var joinedFunction = function joinedFunction(value, key, iterable) {
                  return [mapEntryFunction[0].call(ctx, value, key, iterable), mapEntryFunction[1].call(ctx, value, key, iterable)];
                };

                return new MapEntryMapper(this, joinedFunction, this);
              } else {
                // we are just mapping keys
                return this.mapKeys(mapEntryFunction[0], ctx);
              }
            } else if (isFunction(mapEntryFunction[1])) {
              // we are just mapping values
              return this.mapValues(mapEntryFunction[1], ctx);
            }
          }
        } else if (isFunction(mapEntryFunction)) {
          return new MapEntryMapper(this, mapEntryFunction, ctx);
        } // we aren't mapping, lets give the developer a hint as to what the problem is


        throw new TypeError('MapIterable.mapEntries expects a function or an array of functions');
      }
      /**
       * For every entry, use the mapFunction to transform the existing value and existing key.
       * - If one Function is provided, we are transforming the map into a set.
       *   - The function can return any value. This is the equivalent of turning the MapIterable into a SetIterable.
       *   - if the parameter is not an array or a function a TypeError is thrown.
       *   - Will return a {@link SetIterable}
       * - If an array of Functions is provided, we are transforming the map into another map. see {@link MapIterable#mapEntries mapEntries}
       *   - The first function, (if defined), modifies the key. It needs only return the key. see {@link MapIterable#mapKeys mapKeys}
       *   - the second function, (if defined), modifies the value. see {@link MapIterable#mapKeys mapValues}
       *   - if both the first and second values in the array are not functions a TypeError is thrown.
       *   - Will return a {@link MapIterable}.
       * @example <caption>return just values</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const setIterable = hashmap.map((value, key) => value)
       * const mapArray = setIterable.collect();
       * // mapArray === ['value1','value2','value3']
       * // setIterable instanceof SetIterable
       * @example <caption>swap the keys and the values</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const setIterable = hashmap.map((value, key) => [value,key])
       * const mapArray = setIterable.collect();
       * // mapArray === [['value1',1],['value2',2],['value3',3]]
       * // setIterable instanceof SetIterable
       * @example <caption>swap the keys and the values with 2 functions</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const mapIterable = hashmap.map([(value) => value,(value, key) => key])
       * const mapArray = mapIterable.collect();
       * // mapArray === [['value1',1],['value2',2],['value3',3]]
       * // mapIterable instanceof MapIterable
       * @example <caption>modify just the keys</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * // Notice we are passing an array of one function.
       * const mapIterable = hashmap.map([(value, key) => value])
       * const mapArray = mapIterable.collect();
       * // mapArray === [['value1','value1'],['value2','value2'],['value2','value2']]
       * // mapIterable instanceof MapIterable
       * @example <caption>modify just the values</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * // Notice we are passing an array of two, but have only defined the last as a function.
       * const mapIterable = hashmap.map([undefined,(value, key) => key])
       * const mapArray = mapIterable.collect();
       * // mapArray === [[1,1],[2,2],[3,3]]
       * // mapIterable instanceof MapIterable
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
       * @param {MapIterable#MapFunction|Array.<MapIterable#MapFunction,MapIterable#MapFunction>} [mapFunction=(value, key, iterable) => [key, value]] - the function that transforms the key and value.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {SetIterable|MapIterable} an iterable that allows you to iterate single entries in a set, or an iterable that allows you to iterate a map.
       * @throws {TypeError} if at least one function is not provided.
       */

    }, {
      key: "map",
      value: function map() {
        var mapFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value, key) {
          return [key, value];
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        if (Array.isArray(mapFunction)) {
          return this.mapEntries(mapFunction, ctx);
        }

        if (isFunction(mapFunction)) {
          return new MapMapper(this, mapFunction, ctx);
        }

        throw new TypeError('MapIterable.map expects a function or an array of functions');
      }
      /**
       * Return a SetIterable or MapIterable which is a concatenation of this and the provided iterable.
       * - If the provided value is a MapIterable or a Map then the returned iterable is a MapIterable.
       * - Otherwise since we have no idea if it will return key value pairs we return a SetIterable.
       *   - If you know the container stores [key,value] pairs and want to return a MapIterable, use {@link MapIterable#concatMap concatMap}
       * This is based on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} it does not modify the original iterables, and returns a new one.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat|Array.concat}
       * @example <caption>concatenate 2 maps</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const hashmap2 = new LinkedHashMap([[1,'value1a'],[2,'value2a'],[3,'value3a']]);
       * const mapIterable = hashmap.concat(hashmap2);
       * // Notice how the keys are repeated, any unique constraints are gone.
       * // mapIterable === [[1,'value1'],[2,'value2'],[3,'value3'],[1,'value1a'],[2,'value2a'],[3,'value3a']]
       * // mapIterable instanceof MapIterable
       * @example <caption>concatenate an array</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const array = ['hello','world'];
       * const setIterable = hashmap.concat(array);
       * // Notice how we have key value pairs and strings mixed.
       * // setIterable === [[1,'value1'],[2,'value2'],[3,'value3'],'hello','world']
       * // setIterable instanceof SetIterable
       * @param {(Array|Set|Map|HashMap|LinkedHashMap)} otherIterable the iterable to concat to this one.
       * @return {SetIterable|MapIterable} the new iterable to return
       */

    }, {
      key: "concat",
      value: function concat(otherIterable) {
        if (otherIterable) {
          if (otherIterable instanceof MapIterable || otherIterable instanceof Map) {
            return this.concatMap(otherIterable);
          }

          return new SetConcat(this, SetIterable.from(otherIterable));
        }

        return this;
      }
      /**
       * Return a MapIterable which is a concatenation of this and the provided iterable.
       * - If the provided value is a MapIterable or a Map then the returned iterable is a MapIterable.
       * - Otherwise the iterable MUST return [key,value] pairs
       *
       * @example <caption>concatenate 2 maps</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const hashmap2 = new LinkedHashMap([[1,'value1a'],[2,'value2a'],[3,'value3a']]);
       * const mapIterable = hashmap.concatMap(hashmap2);
       * // Notice how the keys are repeated, any unique constraints are gone.
       * // mapIterable === [[1,'value1'],[2,'value2'],[3,'value3'],[1,'value1a'],[2,'value2a'],[3,'value3a']]
       * // mapIterable instanceof MapIterable
       * @example <caption>concatenate an array</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const array = [[1,'hello'],[3,'world']];
       * const mapIterable = hashmap.concatMap(array);
       * // Notice how everything is a key value pair.
       * // mapIterable === [[1,'value1'],[2,'value2'],[3,'value3'],[1,'hello'],[3,'world']]
       * // mapIterable instanceof MapIterable
       * @param {(Array.<Array.<key,value>>|Set.<Array.<key,value>>|Map|HashMap|LinkedHashMap)} otherMapIterable the iterable to concat to this one, has to return [key,value] pairs
       * @return {MapIterable} the new iterable to return
       */

    }, {
      key: "concatMap",
      value: function concatMap(otherMapIterable) {
        if (otherMapIterable) {
          return new MapConcat(this, MapIterable.from(otherMapIterable));
        }

        return this;
      }
      /**
       * Return a SetIterable which is just the keys in this map.
       * @example <caption>collect all the keys</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const keysIterable = hashmap.keys();
       * // keysIterable instanceof SetIterable
       * const keys = keysIterable.collect();
       * // keys === [1,2,3]
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys keys}
       * @return {SetIterable} the keys as a set iterable.
       */

    }, {
      key: "keys",
      value: function keys() {
        return new MapMapper(this, function (_, key) {
          return key;
        }, this);
      }
      /**
       * Return a SetIterable which is just the values in this map.
       * @example <caption>collect all the values</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const valuesIterable = hashmap.values();
       * // valuesIterable instanceof SetIterable
       * const values = valuesIterable.collect();
       * // values === ['value1','value2','value3']
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values values}
       * @return {SetIterable} the values as a set iterable.
       */

    }, {
      key: "values",
      value: function values() {
        return new MapMapper(this, function (value) {
          return value;
        }, this);
      }
      /**
       * Return a MapIterable which is the entries in this map, this is just a short hand for the [Symbol.Iterator]() implementation
       * @example <caption>collect all the entries</caption>
       * const hashmap = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const entriesIterable = hashmap.entries();
       * // entriesIterable instanceof MapIterable
       * const entries = entriesIterable.collect();
       * // entries === [[1,'value1'],[2,'value2'],[3,'value3']]
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries entries}
       * @return {MapIterable}
       */

    }, {
      key: "entries",
      value: function entries() {
        return this;
      }
    }], [{
      key: "from",
      value: function from(mapIterable) {
        if (mapIterable instanceof MapIterable) {
          return mapIterable;
        }

        return new MapIterableWrapper(mapIterable);
      }
    }]);

    return MapIterable;
  }();
  /**
   * The base class for the Set Implementations, and the Higher Order Functions for Sets, many Map functions result in SetIterables
   *
   * @example <caption>Create a SetIterable from a Map.</caption>
   * const myMap = new Map();
   * // iterating over a setIterable backed by a map, will yield [key,value] arrays.
   * const setIterable = SetIterable.from(myMap);
   * @example <caption>Create a SetIterable from a Set.</caption>
   * const mySet = new Set();
   * const setIterable = SetIterable.from(mySet);
   * @example <caption>Create a SetIterable from an Array.</caption>
   * const setIterable = SetIterable.from([]);
   * @example <caption>Create a SetIterable from an Iterable.</caption>
   * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]() can be used.
   * const myIterable = {
   *     *[Symbol.iterator]() {
   *         yield "value1";
   *         yield "value2";
   *         yield "value3";
   *     }
   * }
   * const setIterable = SetIterable.from(myIterable);
   * @example <caption>Create a SetIterable from a Mootable HashMap.</caption>
   * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
   * const setIterable =  SetIterable.from(new HashMap());
   * @example <caption>Create a SetIterable from a Mootable LinkedHashMap.</caption>
   * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
   * const setIterable =  SetIterable.from(new LinkedHashMap());
   * @abstract
   */


  var SetIterable = /*#__PURE__*/function () {
    function SetIterable() {
      _classCallCheck(this, SetIterable);
    }

    _createClass(SetIterable, [{
      key: "size",
      get:
      /**
       * Returns the number of elements returned by this Set Iterable. If filter is used in the method chain, it is forced to iterate over all the elements, and will be slower. Otherwise even with concatenation, it just queries the base collection size.
       * @returns {number}
       */
      function get() {
        var accumulator = 0;

        var _iterator13 = _createForOfIteratorHelper(this),
            _step13;

        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) // jshint ignore:line
          {
            var i = _step13.value;
            accumulator++;
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
        }

        return accumulator;
      }
      /**
       * Wraps any class that iterates any value and provides higher order chained functions.
         * @example <caption>Create a SetIterable from a Map.</caption>
       * const myMap = new Map();
       * // iterating over a set, will yield [key,value] arrays.
       * const setIterable = SetIterable.from(myMap);
       * @example <caption>Create a SetIterable from a Set.</caption>
       * const mySet = new Set();
       * const setIterable = SetIterable.from(mySet);
       * @example <caption>Create a SetIterable from an Array.</caption>
       * const setIterable = SetIterable.from([]);
       * @example <caption>Create a SetIterable from an Iterable.</caption>
       * // any object that implements *[Symbol.iterator]() or [Symbol.iterator]() can be used.
       * const myIterable = {
       *     *[Symbol.iterator]() {
       *         yield "value1";
       *         yield "value2";
       *         yield "value3";
       *     }
       * }
       * const setIterable = SetIterable.from(myIterable);
       * @example <caption>Create a SetIterable from a Mootable HashMap.</caption>
       * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
       * const setIterable =  SetIterable.from(new HashMap());
       * @example <caption>Create a SetIterable from a Mootable LinkedHashMap.</caption>
       * // iterating over a SetIterable backed by a map, will yield [key,value] arrays.
       * const setIterable =  SetIterable.from(new LinkedHashMap());
       * @param {(Set|Map|Array|Iterator)} setIterable the set to wrap
       * @return {SetIterable} the wrapped Set.
       */

    }, {
      key: "filter",
      value:
      /**
       * Test each element of the set and only include entries where the <code>MatchesPredicate</code> returns true.
       * @example <caption>Only match values which are odd numbered.</caption>
       * const hashmap = SetIterable.from([1,2,3]);
       * const filteredIterable = hashmap.filter((value) => value % 2 !== 0);
       * filteredIterable.forEach((value) => console.log(value));
       * // will log to the console:
       * // 1
       * // 3
       * @param {MapIterable#MatchesPredicate} [filterPredicate=(value, key, setIterable) => true] - if the provided function returns <code>false</code>, that entry is excluded.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>filterPredicate</code>
       * @returns {SetIterable} - an iterable that allows you to iterate values.
       */
      function filter() {
        var filterPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        return new SetFilter(this, filterPredicate, ctx);
      }
      /**
       * Execute the provided callback on every <code>value</code> of this set iterable.
       * @example <caption>Log all the  values.</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * mapIterable.forEach((value) => console.log(value));
       * // will log to the console:
       * // value1
       * // value2
       * // value3
       * @param {MapIterable#ForEachCallback} [forEachCallback=(value, key, iterable) => {}]
       * @param {*} [ctx=this] Value to use as <code>this</code> when executing <code>forEachCallback</code>
       * @returns {SetIterable} - an iterable that allows you to iterate on values.
       */

    }, {
      key: "forEach",
      value: function forEach() {
        var forEachCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator14 = _createForOfIteratorHelper(this),
            _step14;

        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var value = _step14.value;
            forEachCallback.call(ctx, value, value, this);
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
        }
      }
      /**
       * Fills the provided collector, or an array if none provided, and fills it with the values of this {@link MapIterable}. Then return the collector.
       * The original collector, with the exception of arrays, will be modified as we call functions directly against it.
       *
       * A collector will be resolved in this order:
       *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}
       *    - a new array is created and passed back with the filled values, and the original is not changed.
       *  - Object with a function <code>.set</code>.
       *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}, {@link HashMap} or {@link LinkedHashMap}
       *    - it will call <code>set(key,value)</code> for every entry, if the value already exists for that key it is typically overridden. The original is modified.
       *  - Object with a function <code>.add</code>
       *    - such as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}
       *    - it will call <code>add([key,value])</code> for every entry, so that a <code>[key,value]</code> pair is added to the collection. The original is modified.
       *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}
       *    - It will call <code>obj[key] = value</code> for every entry, so that a property of <code>key</code> has a value of <code>value</code> set on it. The original is modified.
       *
       * @example <caption>Collect to a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const myArray = mapIterable.collect();
       * // myArray === [[1,'value1'],[2,'value2'],[3,'value3']]:
       * @example <caption>Collect with an empty existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldArray = [];
       * const newArray = mapIterable.collect(oldArray);
       * // newArray === [[1,'value1'],[2,'value2'],[3,'value3']]
       * // oldArray === []
       * @example <caption>Collect with an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldArray = [[2,'someOtherValue']];
       * const newArray = mapIterable.collect(oldArray);
       * // newArray === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
       * // oldArray === [[2,'someOtherValue']]
       * @example <caption>Collect to an existing {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array Array} with values, modifying the old array.</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const array  = [[2,'someOtherValue']];
       * array.push(mapIterable.collect())
       * // array === [[2,'someOtherValue'],[1,'value1'],[2,'value2'],[3,'value3']]
       * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set Set}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldSet = new Set().add('willRemain');
       * const newSet = mapIterable.collect(oldSet);
       * // oldSet === newSet === ['willRemain',[1,'value1'],[2,'value2'],[3,'value3']]
       * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map Map}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldMap = new Map().set(2,'willBeOverwritten').set(5,'willRemain');
       * const newMap = mapIterable.collect(oldMap);
       * // oldMap === newMap === [[2,'value2'],[5,'willRemain'],[1,'value1'],[3,'value3']]
       * @example <caption>Collect to a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object Object}</caption>
       * const mapIterable = new LinkedHashMap([[1,'value1'],[2,'value2'],[3,'value3']]);
       * const oldObject = {'1','willBeOverridden'};
       * const newObject = mapIterable.collect(oldObject);
       * // oldObject === newObject === {'1': 'value1', '2': 'value2', '3': 'value3'}
       * @param {(Array|Set|Map|HashMap|LinkedHashMap|Object)} [collector=[]] the collection to fill
       * @returns {(Array|Set|Map|HashMap|LinkedHashMap|Object)} The collector that was passed in.
       */

    }, {
      key: "collect",
      value: function collect() {
        var collector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (Array.isArray(collector)) {
          if (collector.length) {
            return collector.concat(Array.from(this));
          }

          return Array.from(this);
        } else if (isFunction(collector.add)) {
          var _iterator15 = _createForOfIteratorHelper(this),
              _step15;

          try {
            for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
              var entry = _step15.value;
              collector.add(entry);
            }
          } catch (err) {
            _iterator15.e(err);
          } finally {
            _iterator15.f();
          }
        } else if (isFunction(collector.set)) {
          var _iterator16 = _createForOfIteratorHelper(this),
              _step16;

          try {
            for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
              var _entry = _step16.value;
              collector.set(_entry);
            }
          } catch (err) {
            _iterator16.e(err);
          } finally {
            _iterator16.f();
          }
        }

        return collector;
      }
      /**
       * Iterate through the set iterable reducing it to a single value.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|Array.reduce}
       * @example <caption>add all the values</caption>
       * const set = new Set().add(1).add(2).add(3);
       * const setIterable = SetIterable.from(set);
       * const reduceResult = setIterable.reduce((accumulator, value) => accumulator+value, 0);
       * // reduceResult === 6
       * @example <caption>add all the values into one string in reverse order</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const reduceResult = setIterable.reduce((accumulator, value) => value+accumulator, '');
       * // reduceResult === 'value3value2value1'
       * @param {MapIterable#ReduceFunction} [reduceFunction=(accumulator, value, key, iterable) => true] - the predicate to identify if we have a match.
       * @param {*} [initialValue] the initial value to start on the reduce.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {*} - the final accumulated value.
       */

    }, {
      key: "reduce",
      value: function reduce() {
        var reduceFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (accumulator, value) {
          return value;
        };
        var initialValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
        var accumulator = initialValue;

        var _iterator17 = _createForOfIteratorHelper(this),
            _step17;

        try {
          for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
            var value = _step17.value;
            accumulator = reduceFunction.call(ctx, accumulator, value, value, this);
          }
        } catch (err) {
          _iterator17.e(err);
        } finally {
          _iterator17.f();
        }

        return accumulator;
      }
      /**
       * Test to see if ALL values pass the test implemented by the passed <code>MatchesPredicate</code>.
       * - if any value does not match, returns false
       * - if all values match, returns true.
       * - if no values match, returns false.
       * - if the iterable is empty, returns true. (irrespective of the predicate)
       * - if no predicate is provided, returns true.
       *
       * @example <caption>Do all values start with value. (yes)</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const everyResult = setIterable.every((value) => value.startsWith('value'));
       * // everyResult === true
       * @example <caption>Do all values start with value. (no)</caption>
       * const set = new Set().add('value1').add('doesntStart').add('value3');
       * const setIterable = SetIterable.from(set);
       * const everyResult = setIterable.every((value) => value.startsWith('value'));
       * // everyResult === false
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every|Array.every}
       * @param {MapIterable#MatchesPredicate} [everyPredicate=(value, key, iterable) => true] - if the provided function returns <code>false</code>, at any point the <code>every()</code> function returns false.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>everyPredicate</code>
       * @returns {boolean} true if all elements match, false if one or more elements fails to match.
       */

    }, {
      key: "every",
      value: function every() {
        var everyPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator18 = _createForOfIteratorHelper(this),
            _step18;

        try {
          for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
            var value = _step18.value;

            if (!everyPredicate.call(ctx, value, value, this)) {
              return false;
            }
          }
        } catch (err) {
          _iterator18.e(err);
        } finally {
          _iterator18.f();
        }

        return true;
      }
      /**
       * Test to see if ANY value pass the test implemented by the passed <code>MatchesPredicate</code>.
       * - if any value matches, returns true.
       * - if all values match returns true.
       * - if no values match returns false.
       * - if the iterable is empty, returns true.
       * - if no predicate is provided, returns true.
       *
       * @example <caption>Do any values start with value. (yes all of them)</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const someResult = setIterable.some((value) => value.startsWith('value'));
       * // someResult === true
       * @example <caption>Do any values start with value. (yes 2 of them)</caption>
       * const set = new Set().add('value1').add('doesntStart').add('value3');
       * const setIterable = SetIterable.from(set);
       * const someResult = setIterable.some((value) => value.startsWith('value'));
       * // someResult === true
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.some}
       * @param {MapIterable#MatchesPredicate} [somePredicate=(value, key, iterable) => true] - the predicate to identify if we have a match.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>somePredicate</code>
       * @returns {boolean} - true if all values match, false if one or more values fails to match.
       */

    }, {
      key: "some",
      value: function some() {
        var somePredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator19 = _createForOfIteratorHelper(this),
            _step19;

        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var value = _step19.value;

            if (somePredicate.call(ctx, value, this)) {
              return true;
            }
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }

        return false;
      }
      /**
       * Does the set have this value.
       * If backed by a Set, or in fact any collection that implements the <code>.has(key)</code> function, then it will utilize that, otherwise it will iterate across the collection.
       * If backed by a Map or HashMap, then it will match [key,value] pairs not keys.
       * - return true if the <code>value</code> matches.
       * - if no values match, it returns false.
       * - it is legitimate for values to be null or undefined, and if added, will return true
       *
       * Sets typically index values, and so is generally a fast operation. However if it backed by a map, then this will be slow as it will be matching entries not keys.
       * @example <caption>Does this contain a value that is there</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const hasResult = setIterable.has('value2');
       * // hasResult === true
       * @example <caption>Does this contain a value that isn't there</caption>
       * const set = new Set().add(1).add(2).add(3);
       * const setIterable = SetIterable.from(set);
       * const hasResult = setIterable.has(4);
       * // hasResult === false
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has|Map.has}
       * @param {*} value - the value we use to === against the entries key to identify if we have a match.
       * @param {number} [depth=-1] - if using an array, marks how deep we go through to test equality.
       * @returns {boolean} - if it holds the key or not.
       */

    }, {
      key: "has",
      value: function has(value) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

        if (Array.isArray(value)) {
          return this.some(function (otherValue) {
            return deepEquals(otherValue, value, depth);
          });
        }

        return this.some(function (otherValue) {
          return defaultEquals(otherValue, value);
        });
      }
      /**
       * Find the first value in the set which passes the provided <code>MatchesPredicate</code>.
       * - return the first <code>value</code> that matches
       * - if no value matches, it returns undefined.
       * - if no predicate is defined, will return the first value it finds.
       * @example <caption>Find a value</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const findResult = setIterable.find((value) => value.endsWith('ue2'));
       * // findResult === 'value2'
       * @example <caption>Can't find a value</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const findResult = setIterable.find((value) => value.startsWith('something'));
       * // findResult === undefined
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find|Array.find}
       * @param {MapIterable#MatchesPredicate} [findPredicate=(value, key, iterable) => value] - the predicate to identify if we have a match.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>findPredicate</code>
       * @returns {*} - the value that matches.
       */

    }, {
      key: "find",
      value: function find() {
        var findPredicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return true;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

        var _iterator20 = _createForOfIteratorHelper(this),
            _step20;

        try {
          for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
            var value = _step20.value;

            if (findPredicate.call(ctx, value, value, this)) {
              return value;
            }
          }
        } catch (err) {
          _iterator20.e(err);
        } finally {
          _iterator20.f();
        }

        return undefined;
      }
      /**
       * For every entry, use the mapFunction to transform the existing value.
       *   - Will return a {@link SetIterable}
       * @example <caption>return just values with 'ish' on the end</caption>
       * const set = new Set().add('value1').add('value2').add('value3');
       * const setIterable = SetIterable.from(set);
       * const mapped = setIterable.map((value, key) => value+'ish');
       * const mapArray = mapped.collect();
       * // mapArray === ['value1ish','value2ish','value3ish']
       * // mapped instanceof SetIterable
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|Array.map}
       * @param {MapIterable#MapFunction} [mapFunction=(value, key, iterable) =>value] - the function that transforms the value.
       * @param {*} [ctx=this] - Value to use as <code>this</code> when executing <code>reduceFunction</code>
       * @returns {SetIterable} an iterable that allows you to iterate single entries in the mapped set
       */

    }, {
      key: "map",
      value: function map() {
        var mapFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (value) {
          return value;
        };
        var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        return new SetMapper(this, mapFunction, ctx);
      }
      /**
       * Return a SetIterable which is a concatenation of this and the provided iterable.
       * This is based on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} it does not modify the original iterables, and returns a new one.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat|Array.concat}
       * @example <caption>concatenate 2 sets</caption>
       * const set1 = new Set(['value1','value2','value3']);
       * const set2 = new Set(['value1a','value2a','value3a']);
       * const setIterable = SetIterable.from(set1).concat(set2);
       * // Notice how any unique constraints are gone.
       * // setIterable === ['value1','value2','value3','value1a','value2a'],'value3a']
       * // setIterable instanceof SetIterable
       * @example <caption>concatenate an array</caption>
       * const set = new Set(['value1','value2','value3']);
       * const array = ['hello','world'];
       * const setIterable = SetIterable.from(set).concat(array);
       * // setIterable === ['value1','value2','value3','hello','world']
       * // setIterable instanceof SetIterable
       * @param {(Array|Set|Map|HashMap|LinkedHashMap)} otherIterable the iterable to concat to this one.
       * @return {SetIterable} the new iterable to return
       */

    }, {
      key: "concat",
      value: function concat() {
        var otherIterable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return new SetConcat(this, SetIterable.from(otherIterable));
      }
      /**
       * Return a SetIterable which is basically this SetIterable.
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values values}
       * @return {SetIterable} the values as a set iterable.
       */

    }, {
      key: "values",
      value: function values() {
        return this;
      }
      /**
       * Return a SetIterable which is basically this SetIterable.
       * Behaves the same way as the JS Set Object in that it just returns values
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/keys keys}
       * @return {SetIterable} the values as a set iterable.
       */

    }, {
      key: "keys",
      value: function keys() {
        return this;
      }
      /**
       * Return a MapIterable which are a value pair, returns [value,value]
       * @example <caption>collect all the entries</caption>
       * const set = new Set([1,2,3]);
       * const entriesIterable = SetIterable.from(set).entries();
       * // entriesIterable instanceof MapIterable
       * const entries = entriesIterable.collect();
       * // entries === [[1,1],[2,'2],[3,3]]
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries entries}
       * @return {MapIterable}
       */

    }, {
      key: "entries",
      value: function entries() {
        return MapIterable.from(this.map(function (value) {
          return [value, value];
        }));
      }
    }], [{
      key: "from",
      value: function from(setIterable) {
        if (setIterable instanceof SetIterable) {
          return setIterable;
        }

        return new SetIterableWrapper(setIterable);
      }
    }]);

    return SetIterable;
  }();
  /**
   * to get round the fact gets might be undefined but the value exists,
   * @private
   */


  var Optional = /*#__PURE__*/function () {
    function Optional(has, value) {
      _classCallCheck(this, Optional);

      this.has = has;
      this.value = value;
    }

    _createClass(Optional, null, [{
      key: "of",
      value: function of(value) {
        return new Optional(true, value);
      }
    }, {
      key: "none",
      value: function none() {
        return new Optional(false, undefined);
      }
    }]);

    return Optional;
  }();
  /**
   * @private
   */


  var Entry = /*#__PURE__*/function () {
    function Entry(key, value) {
      _classCallCheck(this, Entry);

      this.key = key;
      this.value = value;
    }

    _createClass(Entry, [{
      key: "overwrite",
      value: function overwrite(oldEntry) {
        oldEntry.value = this.value;
      }
    }, {
      key: "delete",
      value: function _delete() {}
    }]);

    return Entry;
  }();
  /**
   * @private
   * @extends Entry
   */


  var LinkedEntry = /*#__PURE__*/function (_Entry) {
    _inherits(LinkedEntry, _Entry);

    var _super = _createSuper(LinkedEntry);

    function LinkedEntry(key, value) {
      var _this;

      _classCallCheck(this, LinkedEntry);

      _this = _super.call(this, key, value);
      _this.previous = undefined;
      _this.next = undefined;
      return _this;
    }

    _createClass(LinkedEntry, [{
      key: "overwrite",
      value: function overwrite(oldEntry) {
        oldEntry.value = this.value;
        this.deleted = true;
      }
    }, {
      key: "delete",
      value: function _delete() {
        if (this.previous) {
          this.previous.next = this.next;
        }

        if (this.next) {
          this.next.previous = this.previous;
        }

        this.deleted = true;
      }
    }]);

    return LinkedEntry;
  }(Entry);
  /**
   * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
   * @extends MapIterable
   */


  var HashMap = /*#__PURE__*/function (_MapIterable) {
    _inherits(HashMap, _MapIterable);

    var _super2 = _createSuper(HashMap);

    /**
     * @typedef HashMap~ConstructorOptions
     * @property {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>)} [copy] - an object that provides a forEach function with the same signature as`Map.forEach`.
     * such as `Map` or this `HashMap` and `LinkedHashMap`, or any iterable that provides [key,value] pairs such as a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * @property {number} [depth] - how many layers deep our hashtrie goes.
     * - Minimum: `1`
     * - Maximum/Default: `(32/widthAs2sExponent)-1`
     * @property {number} [widthAs2sExponent] - how many buckets in each hashtrie layer we use 2 to the power of widthAs2sExponent, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     * - Minimum: `1`
     * - Maximum: `16`
     * - Default: `6` (64 Buckets)
     */

    /**
     * This HashMap is backed by a hashtrie, and can be tuned to specific use cases.
     * - `new HashMap()` creates an empty hashmap
     * - `new HashMap(copy:Iterable)` creates a hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * - `new HashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a hashmap with optional `depth` and `widthAs2sExponent`. If `copy` is provided (map, array or iterable), it's keys and values are inserted into this map.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *   2) `depth` is how many layers deep our hashtrie goes.
     *      - Minimum: `1`, Maximum/Default: `(32/widthAs2sExponent)-1`
     *   3) `widthAs2sExponent` is how many buckets in each hashtrie layer we use to the power of 2, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     *      - Minimum: `1`, Maximum: `16`, Default: `6` (64 Buckets)
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
     */
    function HashMap() {
      var _this2;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        copy: undefined,
        depth: undefined,
        widthAs2sExponent: 6
      };

      _classCallCheck(this, HashMap);

      _this2 = _super2.call(this);
      var depth = args.depth,
          widthAs2sExponent = args.widthAs2sExponent,
          copy = args.copy;
      widthAs2sExponent = Math.max(1, Math.min(16, widthAs2sExponent)); // 2^6 = 64 buckets

      var defaultDepth = (32 / widthAs2sExponent >> 0) - 1;
      depth = Math.max(0, Math.min(depth && depth > 0 ? depth - 1 : defaultDepth, defaultDepth)); // 0 indexed so 3 is a depth of 4.

      var width = 1 << widthAs2sExponent; // 2 ^ widthAs2sExponent

      var mask = width - 1;
      _this2.options = Object.freeze({
        widthAs2sExponent: widthAs2sExponent,
        width: width,
        mask: mask,
        depth: depth
      });

      _this2.clear();

      if (args.forEach || copy && copy.forEach) {
        _this2.copy(args.forEach ? args : copy);
      }

      return _this2;
    }

    _createClass(HashMap, [{
      key: "size",
      get: function get() {
        return this.length;
      }
    }, {
      key: "has",
      value: function has(key) {
        if (this.buckets) {
          var currHE = hashEquals(key);
          return this.buckets.has(key, currHE.equalTo, currHE.hash);
        }

        return false;
      }
    }, {
      key: "get",
      value: function get(key) {
        if (this.buckets) {
          var currHE = hashEquals(key);
          return this.buckets.get(key, currHE.equalTo, currHE.hash);
        }

        return undefined;
      } // noinspection JSCheckFunctionSignatures

    }, {
      key: "optionalGet",
      value: function optionalGet(key) {
        if (this.buckets) {
          var currHE = hashEquals(key);
          return this.buckets.optionalGet(key, currHE.equalTo, currHE.hash);
        }

        return Optional.none();
      }
      /**
       * Sets a value onto this map, using the key as its reference.
       *
       * @param {*} key - the key we want to key our value to
       * @param {*} value - the value we are setting
       * @return {HashMap}
       */

    }, {
      key: "set",
      value: function set(key, value) {
        this.addEntry(new Entry(key, value));
        return this;
      }
      /**
       * @ignore
       * @param entry
       * @return {*}
       */

    }, {
      key: "addEntry",
      value: function addEntry(entry) {
        var currHE = hashEquals(entry.key);

        if (this.buckets) {
          this.buckets = this.buckets.set(entry, currHE.equalTo, currHE.hash);
          this.length = this.buckets.length;
        } else {
          this.buckets = new HashContainer(entry, currHE.hash, Object.assign({}, this.options), this.options.depth);
          this.length = 1;
        }

        return entry;
      }
      /**
       *
       * @param {Map|HashMap|LinkedHashMap|MapIterable|SetIterable.<Array.<key,value>>|Iterator.<Array.<key,value>>|Array.<Array.<key,value>>} other - the iterable to copy
       * @return {HashMap} this hashmap, with the values copied to it.
       * @throws {TypeError} if the provided object other is null or not iterable.
       */

    }, {
      key: "copy",
      value: function copy(other) {
        var map = this;

        if (isIterable(other)) {
          var _iterator21 = _createForOfIteratorHelper(other),
              _step21;

          try {
            for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
              var _step21$value = _slicedToArray(_step21.value, 2),
                  key = _step21$value[0],
                  value = _step21$value[1];

              map.set(key, value);
            }
          } catch (err) {
            _iterator21.e(err);
          } finally {
            _iterator21.f();
          }

          return this;
        } else if (isFunction(other.entries)) {
          var _iterator22 = _createForOfIteratorHelper(other.entries()),
              _step22;

          try {
            for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
              var _step22$value = _slicedToArray(_step22.value, 2),
                  _key3 = _step22$value[0],
                  _value3 = _step22$value[1];

              map.set(_key3, _value3);
            }
          } catch (err) {
            _iterator22.e(err);
          } finally {
            _iterator22.f();
          }

          return this;
        } else if (isFunction(other.forEach)) {
          other.forEach(function (value, key) {
            map.set(key, value);
          });
          return this;
        }

        throw new TypeError('HashMap.copy expects an object which is iterable or has a forEach function on it');
      }
      /**
       * Makes a copy of this hashmap and returns a new one.
       * @return {HashMap}
       */

    }, {
      key: "clone",
      value: function clone() {
        return new HashMap({
          copy: this,
          depth: this.options.depth,
          widthAs2sExponent: this.options.widthAs2sExponent
        });
      }
      /**
       * Deletes an entry from this hashmap, using the provided key
       * @param key
       * @return {HashMap}
       */

    }, {
      key: "delete",
      value: function _delete(key) {
        if (this.buckets) {
          var currHE = hashEquals(key);
          this.buckets = this.buckets.delete(key, currHE.equalTo, currHE.hash);

          if (this.buckets) {
            this.length = this.buckets.length;
          } else {
            this.length = 0;
          }
        }

        return this;
      }
      /**
       * clears the data from this hashmap.
       * @return {HashMap}
       */

    }, {
      key: "clear",
      value: function clear() {
        // we clone the options as its dangerous to modify mid execution.
        this.buckets = undefined;
        this.length = 0;
        return this;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator23, _step23, entry;

        return regeneratorRuntime.wrap(function value$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.buckets) {
                  _context.next = 18;
                  break;
                }

                _iterator23 = _createForOfIteratorHelper(this.buckets);
                _context.prev = 2;

                _iterator23.s();

              case 4:
                if ((_step23 = _iterator23.n()).done) {
                  _context.next = 10;
                  break;
                }

                entry = _step23.value;
                _context.next = 8;
                return entry;

              case 8:
                _context.next = 4;
                break;

              case 10:
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](2);

                _iterator23.e(_context.t0);

              case 15:
                _context.prev = 15;

                _iterator23.f();

                return _context.finish(15);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, value, this, [[2, 12, 15, 18]]);
      })
    }]);

    return HashMap;
  }(MapIterable);

  HashMap.uid = 0;
  /**
   * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
   * @extends HashMap
   */

  var LinkedHashMap = /*#__PURE__*/function (_HashMap) {
    _inherits(LinkedHashMap, _HashMap);

    var _super3 = _createSuper(LinkedHashMap);

    /**
     * This LinkedHashMap is is an extension of {@link HashMap} however LinkedHashMap also maintains insertion order of keys, and guarantees to iterate over them in that order.
     * - `new LinkedHashMap()` creates an empty linked hashmap
     * - `new LinkedHashMap(copy:Iterable)` creates a linked hashmap which is a copy of the provided iterable.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     * - `new LinkedHashMap({copy:?Iterable, depth:?int, widthAs2sExponent:?int})` creates a linked hashmap with optional `depth` and `widthAs2sExponent`. If `copy` is provided (map, array or iterable), it's keys and values are inserted into this map.
     *   1) `copy` either
     *      - an object that provides a forEach function with the same signature as `Map.forEach`, such as `Map` or this `HashMap` and `LinkedHashMap`
     *      - or a 2 dimensional key-value array, e.g. `[['key1','val1'], ['key2','val2']]`.
     *   2) `depth` is how many layers deep our hashtrie goes.
     *      - Minimum: `1`, Maximum/Default: `(32/widthAs2sExponent)-1`
     *   3) `widthAs2sExponent` is how many buckets in each hashtrie layer we use to the power of 2, for instance a widthAs2sExponent of 4 is 2 ^ 4 = 16 buckets.
     *      - Minimum: `2`, Maximum: `16`, Default: `6` (64 Buckets)
     * @param {(Map|HashMap|LinkedHashMap|Iterable.<Array.<key,value>>|HashMap~ConstructorOptions)} [args]
     */
    function LinkedHashMap() {
      var _this3;

      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        copy: undefined,
        depth: undefined,
        widthAs2sExponent: 6
      };

      _classCallCheck(this, LinkedHashMap);

      _this3 = _super3.call(this, args);
      _this3.start = undefined;
      _this3.end = undefined;
      return _this3;
    }

    _createClass(LinkedHashMap, [{
      key: "set",
      value: function set(key, value) {
        var entry = this.addEntry(new LinkedEntry(key, value)); // if we added at the end, shift forward one.

        if (this.end) {
          if (!entry.deleted) {
            this.end.next = entry;
            entry.previous = this.end;
            this.end = entry;
          }
        } else {
          this.end = this.start = entry;
        }

        return this;
      }
    }, {
      key: "delete",
      value: function _delete(key) {
        _get(_getPrototypeOf(LinkedHashMap.prototype), "delete", this).call(this, key);

        if (this.start && this.start.deleted) {
          this.start = this.start.next;
        }

        if (this.end && this.end.deleted) {
          this.end = this.end.previous;
        }

        return this;
      }
      /**
       * Makes a copy of this LinkedHashMap
       * @return {LinkedHashMap}
       */

    }, {
      key: "clone",
      value: function clone() {
        return new LinkedHashMap({
          copy: this,
          depth: this.options.depth,
          widthAs2sExponent: this.options.widthAs2sExponent
        });
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var entry;
        return regeneratorRuntime.wrap(function value$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                entry = this.start;

              case 1:
                if (!entry) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 4;
                return [entry.key, entry.value];

              case 4:
                entry = entry.next;
                _context2.next = 1;
                break;

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, value, this);
      })
    }]);

    return LinkedHashMap;
  }(HashMap);
  /**
   * @private
   */


  var Container = /*#__PURE__*/function () {
    function Container(entry) {
      _classCallCheck(this, Container);

      this.entry = entry;
      this.length = 1;
    }

    _createClass(Container, [{
      key: "key",
      get: function get() {
        return this.entry.key;
      }
    }, {
      key: "value",
      get: function get() {
        return this.entry.value;
      }
    }, {
      key: "get",
      value: function get(key, equalTo) {
        if (equalTo(key, this.key)) {
          return this.entry.value;
        }

        return undefined;
      }
    }, {
      key: "optionalGet",
      value: function optionalGet(key, equalTo) {
        if (equalTo(key, this.key)) {
          return Optional.of(this.entry.value);
        }

        return Optional.none();
      }
    }, {
      key: "set",
      value: function set(newEntry, equalTo) {
        if (equalTo(newEntry.key, this.key)) {
          newEntry.overwrite(this.entry);
          return this;
        }

        return new LinkedStack(newEntry, this);
      }
    }, {
      key: "has",
      value: function has(key, equalTo) {
        return equalTo(key, this.key);
      }
    }, {
      key: "delete",
      value: function _delete(key, equalTo) {
        if (equalTo(key, this.key)) {
          this.entry.delete();
          return undefined;
        }

        return this;
      }
    }, {
      key: "forEach",
      value: function forEach(func, ctx) {
        func.call(ctx, this.value, this.key);
        return this;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        return regeneratorRuntime.wrap(function value$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.length !== 0)) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return [this.key, this.value];

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, value, this);
      })
    }]);

    return Container;
  }();
  /**
   * @private
   * @extends Container
   */


  var LinkedStack = /*#__PURE__*/function (_Container) {
    _inherits(LinkedStack, _Container);

    var _super4 = _createSuper(LinkedStack);

    function LinkedStack(entry, next) {
      var _this4;

      _classCallCheck(this, LinkedStack);

      _this4 = _super4.call(this, entry);
      _this4.next = next;
      _this4.length = next.length + 1;
      return _this4;
    }

    _createClass(LinkedStack, [{
      key: "get",
      value: function get(key, equalTo) {
        var container = this; // avoid recursion

        do {
          if (equalTo(key, container.key)) {
            return container.value;
          }

          container = container.next;
        } while (container);

        return undefined;
      }
    }, {
      key: "optionalGet",
      value: function optionalGet(key, equalTo) {
        var container = this; // avoid recursion

        do {
          if (equalTo(key, container.key)) {
            return Optional.of(container.value);
          }

          container = container.next;
        } while (container);

        return Optional.none();
      }
    }, {
      key: "set",
      value: function set(newEntry, equalTo) {
        var container = this; // avoid recursion

        while (container) {
          if (equalTo(newEntry.key, container.key)) {
            newEntry.overwrite(this.entry);
            return this;
          }

          container = container.next;
        }

        return new LinkedStack(newEntry, this);
      }
    }, {
      key: "has",
      value: function has(key, equalTo) {
        var container = this; // avoid recursion

        do {
          if (equalTo(key, container.key)) {
            return true;
          }

          container = container.next;
        } while (container);

        return false;
      }
    }, {
      key: "delete",
      value: function _delete(key, equalTo) {
        // first on the list.
        if (equalTo(key, this.key)) {
          this.entry.delete(); // lengths are not necessarily consistent.

          if (this.next) {
            this.next.length = this.length - 1;
          }

          return this.next;
        }

        var container = this.next;
        var prev = this; // avoid recursion

        while (container) {
          if (equalTo(key, container.key)) {
            container.entry.delete();
            var next = container.next;

            if (next) {
              container.entry = next.entry;
              container.next = next.next;
            } else {
              prev.next = undefined;
            }

            this.length--;
            return this;
          }

          prev = container;
          container = container.next;
        }

        return this;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var container;
        return regeneratorRuntime.wrap(function value$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                container = this;

              case 1:
                if (!container) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 4;
                return [container.key, container.value];

              case 4:
                container = container.next;
                _context4.next = 1;
                break;

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, value, this);
      })
    }]);

    return LinkedStack;
  }(Container);
  /**
   * @private
   * @extends Container
   */


  var HashContainer = /*#__PURE__*/function (_Container2) {
    _inherits(HashContainer, _Container2);

    var _super5 = _createSuper(HashContainer);

    function HashContainer(entry, hash, options, depth) {
      var _this5;

      _classCallCheck(this, HashContainer);

      _this5 = _super5.call(this, entry);
      _this5.hash = hash;
      _this5.options = options;
      _this5.depth = depth;
      return _this5;
    }

    _createClass(HashContainer, [{
      key: "set",
      value: function set(newEntry, equalTo, hash) {
        if (hash === this.hash && equalTo(newEntry.key, this.key)) {
          newEntry.overwrite(this.entry);
          return this;
        }

        var bucket = new HashBuckets(this.options, this.depth);
        bucket.set(this.entry, function () {
          return false;
        }, this.hash);
        bucket.set(newEntry, function () {
          return false;
        }, hash);
        return bucket;
      }
    }, {
      key: "get",
      value: function get(key, equalTo, hash) {
        if (hash === this.hash && equalTo(key, this.key)) {
          return this.value;
        }

        return undefined;
      }
    }, {
      key: "optionalGet",
      value: function optionalGet(key, equalTo, hash) {
        if (hash === this.hash && equalTo(key, this.key)) {
          return Optional.of(this.value);
        }

        return Optional.none();
      }
    }, {
      key: "has",
      value: function has(key, equalTo, hash) {
        return hash === this.hash && equalTo(key, this.key);
      }
    }, {
      key: "delete",
      value: function _delete(key, equalTo, hash) {
        if (hash === this.hash && equalTo(key, this.key)) {
          this.entry.delete();
          return undefined;
        }

        return this;
      }
    }]);

    return HashContainer;
  }(Container);
  /**
   * @private
   */


  var HashBuckets = /*#__PURE__*/function () {
    function HashBuckets(options, depth) {
      _classCallCheck(this, HashBuckets);

      this.options = options;
      this.length = 0;
      this.depth = depth;
      this.buckets = new Array(this.options.width);
    }

    _createClass(HashBuckets, [{
      key: "get",
      value: function get(key, equalTo, hash) {
        var bucket = this.buckets[hash & this.options.mask];

        if (bucket) {
          return bucket.get(key, equalTo, hash >>> this.options.widthAs2sExponent);
        }

        return undefined;
      }
    }, {
      key: "optionalGet",
      value: function optionalGet(key, equalTo, hash) {
        var bucket = this.buckets[hash & this.options.mask];

        if (bucket) {
          return bucket.optionalGet(key, equalTo, hash >>> this.options.widthAs2sExponent);
        }

        return Optional.none();
      }
    }, {
      key: "set",
      value: function set(entry, equalTo, hash) {
        var idx = hash & this.options.mask;
        var bucket = this.buckets[idx];

        if (bucket) {
          var len = bucket.length;
          this.buckets[idx] = bucket.set(entry, equalTo, hash >>> this.options.widthAs2sExponent);

          if (this.buckets[idx].length !== len) {
            this.length++;
          }
        } else if (this.depth) {
          this.buckets[idx] = new HashContainer(entry, hash >>> this.options.widthAs2sExponent, this.options, this.depth - 1);
          this.length++;
        } else {
          this.buckets[idx] = new Container(entry);
          this.length++;
        }

        return this;
      }
    }, {
      key: "has",
      value: function has(key, equalTo, hash) {
        var bucket = this.buckets[hash & this.options.mask];

        if (bucket) {
          return bucket.has(key, equalTo, hash >>> this.options.widthAs2sExponent);
        }

        return false;
      }
    }, {
      key: "delete",
      value: function _delete(key, equalTo, hash) {
        var idx = hash & this.options.mask;
        var bucket = this.buckets[idx];

        if (bucket) {
          bucket = bucket.delete(key, equalTo, hash >>> this.options.widthAs2sExponent);

          if (!bucket || bucket.length === 0) {
            this.buckets[idx] = undefined;
            this.length--;
          }
        }

        return this;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator24, _step24, bucket, _iterator25, _step25, entry;

        return regeneratorRuntime.wrap(function value$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _iterator24 = _createForOfIteratorHelper(this.buckets);
                _context5.prev = 1;

                _iterator24.s();

              case 3:
                if ((_step24 = _iterator24.n()).done) {
                  _context5.next = 25;
                  break;
                }

                bucket = _step24.value;

                if (!bucket) {
                  _context5.next = 23;
                  break;
                }

                _iterator25 = _createForOfIteratorHelper(bucket);
                _context5.prev = 7;

                _iterator25.s();

              case 9:
                if ((_step25 = _iterator25.n()).done) {
                  _context5.next = 15;
                  break;
                }

                entry = _step25.value;
                _context5.next = 13;
                return entry;

              case 13:
                _context5.next = 9;
                break;

              case 15:
                _context5.next = 20;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](7);

                _iterator25.e(_context5.t0);

              case 20:
                _context5.prev = 20;

                _iterator25.f();

                return _context5.finish(20);

              case 23:
                _context5.next = 3;
                break;

              case 25:
                _context5.next = 30;
                break;

              case 27:
                _context5.prev = 27;
                _context5.t1 = _context5["catch"](1);

                _iterator24.e(_context5.t1);

              case 30:
                _context5.prev = 30;

                _iterator24.f();

                return _context5.finish(30);

              case 33:
              case "end":
                return _context5.stop();
            }
          }
        }, value, this, [[1, 27, 30, 33], [7, 17, 20, 23]]);
      })
    }]);

    return HashBuckets;
  }();
  /**
   * @extends SetIterable
   * @private
   */


  var SetIterableWrapper = /*#__PURE__*/function (_SetIterable) {
    _inherits(SetIterableWrapper, _SetIterable);

    var _super6 = _createSuper(SetIterableWrapper);

    function SetIterableWrapper(iterable, ctx) {
      var _this6;

      _classCallCheck(this, SetIterableWrapper);

      _this6 = _super6.call(this);
      _this6.iterable = iterable;
      _this6.ctx = ctx;
      return _this6;
    }

    _createClass(SetIterableWrapper, [{
      key: "size",
      get: function get() {
        return this.iterable.length ? this.iterable.length : this.iterable.size;
      }
    }, {
      key: "has",
      value: function has(value, depth) {
        // if is a map iterable then we want to return the entry not the key. otherwise we can shortcut
        if (this.iterable instanceof Set || this.iterable instanceof SetIterable) {
          return this.iterable.has(value, depth);
        }

        return _get(_getPrototypeOf(SetIterableWrapper.prototype), "has", this).call(this, value, depth);
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        return regeneratorRuntime.wrap(function value$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.delegateYield(this.iterable, "t0", 1);

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, value, this);
      })
    }]);

    return SetIterableWrapper;
  }(SetIterable);
  /**
   * @extends MapIterable
   * @private
   */


  var MapIterableWrapper = /*#__PURE__*/function (_MapIterable2) {
    _inherits(MapIterableWrapper, _MapIterable2);

    var _super7 = _createSuper(MapIterableWrapper);

    function MapIterableWrapper(iterable, ctx) {
      var _this7;

      _classCallCheck(this, MapIterableWrapper);

      _this7 = _super7.call(this);
      _this7.iterable = iterable;
      _this7.ctx = ctx;
      return _this7;
    }

    _createClass(MapIterableWrapper, [{
      key: "size",
      get: function get() {
        return this.iterable.length ? this.iterable.length : this.iterable.size;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        return regeneratorRuntime.wrap(function value$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.delegateYield(this.iterable, "t0", 1);

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, value, this);
      })
    }, {
      key: "has",
      value: function has(key) {
        if (isFunction(this.iterable.optionalGet)) {
          return this.iterable.optionalGet(key).has;
        }

        if (isFunction(this.iterable.has)) {
          return this.iterable.has(key);
        }

        return _get(_getPrototypeOf(MapIterableWrapper.prototype), "has", this).call(this, key);
      }
    }, {
      key: "optionalGet",
      value: function optionalGet(key) {
        if (isFunction(this.iterable.optionalGet)) {
          return this.iterable.optionalGet(key);
        }

        if (isFunction(this.iterable.has)) {
          if (this.iterable.has(key)) {
            if (isFunction(this.iterable.get)) {
              Optional.of(this.iterable.get(key));
            }

            return Optional.of(_get(_getPrototypeOf(MapIterableWrapper.prototype), "get", this).call(this, key));
          }

          return Optional.none();
        }

        return _get(_getPrototypeOf(MapIterableWrapper.prototype), "optionalGet", this).call(this, key);
      }
    }, {
      key: "get",
      value: function get(key) {
        if (isFunction(this.iterable.optionalGet)) {
          return this.iterable.optionalGet(key).value;
        }

        if (isFunction(this.iterable.get)) {
          return this.iterable.get(key);
        }

        return _get(_getPrototypeOf(MapIterableWrapper.prototype), "get", this).call(this, key);
      }
    }]);

    return MapIterableWrapper;
  }(MapIterable);
  /**
   * @extends MapIterableWrapper
   * @private
   */


  var MapFilter = /*#__PURE__*/function (_MapIterableWrapper) {
    _inherits(MapFilter, _MapIterableWrapper);

    var _super8 = _createSuper(MapFilter);

    function MapFilter(iterable, filterPredicate, ctx) {
      var _this8;

      _classCallCheck(this, MapFilter);

      _this8 = _super8.call(this, iterable, ctx);
      _this8.filterPredicate = filterPredicate;
      return _this8;
    }

    _createClass(MapFilter, [{
      key: "size",
      get: function get() {
        var accumulator = 0;

        var _iterator26 = _createForOfIteratorHelper(this),
            _step26;

        try {
          for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) // jshint ignore:line
          {
            var i = _step26.value;
            accumulator++;
          }
        } catch (err) {
          _iterator26.e(err);
        } finally {
          _iterator26.f();
        }

        return accumulator;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator27, _step27, _step27$value, key, _value4;

        return regeneratorRuntime.wrap(function value$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _iterator27 = _createForOfIteratorHelper(this.iterable);
                _context8.prev = 1;

                _iterator27.s();

              case 3:
                if ((_step27 = _iterator27.n()).done) {
                  _context8.next = 10;
                  break;
                }

                _step27$value = _slicedToArray(_step27.value, 2), key = _step27$value[0], _value4 = _step27$value[1];

                if (!this.filterPredicate.call(this.ctx, _value4, key, this)) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 8;
                return [key, _value4];

              case 8:
                _context8.next = 3;
                break;

              case 10:
                _context8.next = 15;
                break;

              case 12:
                _context8.prev = 12;
                _context8.t0 = _context8["catch"](1);

                _iterator27.e(_context8.t0);

              case 15:
                _context8.prev = 15;

                _iterator27.f();

                return _context8.finish(15);

              case 18:
              case "end":
                return _context8.stop();
            }
          }
        }, value, this, [[1, 12, 15, 18]]);
      })
    }, {
      key: "optionalGet",
      value: function optionalGet(key) {
        var opt = _get(_getPrototypeOf(MapFilter.prototype), "optionalGet", this).call(this, key);

        if (opt.has && !this.filterPredicate.call(this.ctx, opt.value, key, this)) {
          return Optional.none();
        }

        return opt;
      }
    }, {
      key: "has",
      value: function has(key) {
        return this.optionalGet(key).has;
      }
    }, {
      key: "get",
      value: function get(key) {
        return this.optionalGet(key).value;
      }
    }]);

    return MapFilter;
  }(MapIterableWrapper);
  /**
   * @extends MapIterableWrapper
   * @private
   */


  var MapKeyMapper = /*#__PURE__*/function (_MapIterableWrapper2) {
    _inherits(MapKeyMapper, _MapIterableWrapper2);

    var _super9 = _createSuper(MapKeyMapper);

    function MapKeyMapper(iterable, mapFunction, ctx) {
      var _this9;

      _classCallCheck(this, MapKeyMapper);

      _this9 = _super9.call(this, iterable, ctx);
      _this9.mapFunction = mapFunction;
      return _this9;
    }

    _createClass(MapKeyMapper, [{
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator28, _step28, _step28$value, key, _value5;

        return regeneratorRuntime.wrap(function value$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _iterator28 = _createForOfIteratorHelper(this.iterable);
                _context9.prev = 1;

                _iterator28.s();

              case 3:
                if ((_step28 = _iterator28.n()).done) {
                  _context9.next = 9;
                  break;
                }

                _step28$value = _slicedToArray(_step28.value, 2), key = _step28$value[0], _value5 = _step28$value[1];
                _context9.next = 7;
                return [this.mapFunction.call(this.ctx, _value5, key, this), _value5];

              case 7:
                _context9.next = 3;
                break;

              case 9:
                _context9.next = 14;
                break;

              case 11:
                _context9.prev = 11;
                _context9.t0 = _context9["catch"](1);

                _iterator28.e(_context9.t0);

              case 14:
                _context9.prev = 14;

                _iterator28.f();

                return _context9.finish(14);

              case 17:
              case "end":
                return _context9.stop();
            }
          }
        }, value, this, [[1, 11, 14, 17]]);
      })
    }]);

    return MapKeyMapper;
  }(MapIterableWrapper);
  /**
   * @extends MapIterableWrapper
   * @private
   */


  var MapValueMapper = /*#__PURE__*/function (_MapIterableWrapper3) {
    _inherits(MapValueMapper, _MapIterableWrapper3);

    var _super10 = _createSuper(MapValueMapper);

    function MapValueMapper(iterable, mapFunction, ctx) {
      var _this10;

      _classCallCheck(this, MapValueMapper);

      _this10 = _super10.call(this, iterable, ctx);
      _this10.mapFunction = mapFunction;
      return _this10;
    }

    _createClass(MapValueMapper, [{
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator29, _step29, _step29$value, key, _value6;

        return regeneratorRuntime.wrap(function value$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _iterator29 = _createForOfIteratorHelper(this.iterable);
                _context10.prev = 1;

                _iterator29.s();

              case 3:
                if ((_step29 = _iterator29.n()).done) {
                  _context10.next = 9;
                  break;
                }

                _step29$value = _slicedToArray(_step29.value, 2), key = _step29$value[0], _value6 = _step29$value[1];
                _context10.next = 7;
                return [key, this.mapFunction.call(this.ctx, _value6, key, this)];

              case 7:
                _context10.next = 3;
                break;

              case 9:
                _context10.next = 14;
                break;

              case 11:
                _context10.prev = 11;
                _context10.t0 = _context10["catch"](1);

                _iterator29.e(_context10.t0);

              case 14:
                _context10.prev = 14;

                _iterator29.f();

                return _context10.finish(14);

              case 17:
              case "end":
                return _context10.stop();
            }
          }
        }, value, this, [[1, 11, 14, 17]]);
      })
    }, {
      key: "optionalGet",
      value: function optionalGet(key) {
        var opt = _get(_getPrototypeOf(MapValueMapper.prototype), "optionalGet", this).call(this, key);

        if (opt.has) {
          return Optional.of(this.mapFunction.call(this.ctx, opt.value, key, this));
        }

        return opt;
      }
    }]);

    return MapValueMapper;
  }(MapIterableWrapper);
  /**
   * @extends MapIterableWrapper
   * @private
   */


  var MapEntryMapper = /*#__PURE__*/function (_MapIterableWrapper4) {
    _inherits(MapEntryMapper, _MapIterableWrapper4);

    var _super11 = _createSuper(MapEntryMapper);

    function MapEntryMapper(iterable, mapFunction, ctx) {
      var _this11;

      _classCallCheck(this, MapEntryMapper);

      _this11 = _super11.call(this, iterable, ctx);
      _this11.mapFunction = mapFunction;
      return _this11;
    }

    _createClass(MapEntryMapper, [{
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator30, _step30, _step30$value, key, _value7, _this$mapFunction$cal, _this$mapFunction$cal2, newKey, newValue;

        return regeneratorRuntime.wrap(function value$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _iterator30 = _createForOfIteratorHelper(this.iterable);
                _context11.prev = 1;

                _iterator30.s();

              case 3:
                if ((_step30 = _iterator30.n()).done) {
                  _context11.next = 10;
                  break;
                }

                _step30$value = _slicedToArray(_step30.value, 2), key = _step30$value[0], _value7 = _step30$value[1];
                _this$mapFunction$cal = this.mapFunction.call(this.ctx, _value7, key, this), _this$mapFunction$cal2 = _slicedToArray(_this$mapFunction$cal, 2), newKey = _this$mapFunction$cal2[0], newValue = _this$mapFunction$cal2[1];
                _context11.next = 8;
                return [newKey, newValue];

              case 8:
                _context11.next = 3;
                break;

              case 10:
                _context11.next = 15;
                break;

              case 12:
                _context11.prev = 12;
                _context11.t0 = _context11["catch"](1);

                _iterator30.e(_context11.t0);

              case 15:
                _context11.prev = 15;

                _iterator30.f();

                return _context11.finish(15);

              case 18:
              case "end":
                return _context11.stop();
            }
          }
        }, value, this, [[1, 12, 15, 18]]);
      })
    }, {
      key: "get",
      value: function get(key) {
        if (this.iterable.has(key)) {
          var _value8 = this.iterable.get(key);

          return this.mapFunction.call(this.ctx, _value8, key, this)[1];
        }

        return undefined;
      }
    }]);

    return MapEntryMapper;
  }(MapIterableWrapper);
  /**
   * @extends MapIterable
   * @private
   */


  var MapConcat = /*#__PURE__*/function (_MapIterable3) {
    _inherits(MapConcat, _MapIterable3);

    var _super12 = _createSuper(MapConcat);

    function MapConcat(iterable, otherIterable) {
      var _this12;

      _classCallCheck(this, MapConcat);

      _this12 = _super12.call(this);
      _this12.iterable = iterable;
      _this12.otherIterable = otherIterable;
      return _this12;
    }

    _createClass(MapConcat, [{
      key: "size",
      get: function get() {
        return this.iterable.size + this.otherIterable.size;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        return regeneratorRuntime.wrap(function value$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.delegateYield(this.iterable, "t0", 1);

              case 1:
                return _context12.delegateYield(this.otherIterable, "t1", 2);

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        }, value, this);
      })
    }, {
      key: "optionalGet",
      value: function optionalGet(key) {
        var opt = this.iterable.optionalGet(key);
        return opt.has ? opt : this.otherIterable.optionalGet(key);
      }
    }, {
      key: "has",
      value: function has(key) {
        return this.iterable.has(key) || this.otherIterable.has(key);
      }
    }, {
      key: "get",
      value: function get(key) {
        return this.iterable.get(key) || this.otherIterable.get(key);
      }
    }]);

    return MapConcat;
  }(MapIterable); // The following are set iterables.

  /**
   * @extends SetIterable
   * @private
   */


  var SetConcat = /*#__PURE__*/function (_SetIterable2) {
    _inherits(SetConcat, _SetIterable2);

    var _super13 = _createSuper(SetConcat);

    function SetConcat(iterable, otherIterable) {
      var _this13;

      _classCallCheck(this, SetConcat);

      _this13 = _super13.call(this);
      _this13.iterable = iterable;
      _this13.otherIterable = otherIterable;
      return _this13;
    }

    _createClass(SetConcat, [{
      key: "size",
      get: function get() {
        return this.iterable.size + this.otherIterable.size;
      }
    }, {
      key: "has",
      value: function has(value) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
        return _get(_getPrototypeOf(SetConcat.prototype), "has", this).call(this, value, depth) || this.otherIterable.has(value, depth);
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        return regeneratorRuntime.wrap(function value$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.delegateYield(this.iterable, "t0", 1);

              case 1:
                return _context13.delegateYield(this.otherIterable, "t1", 2);

              case 2:
              case "end":
                return _context13.stop();
            }
          }
        }, value, this);
      })
    }]);

    return SetConcat;
  }(SetIterable);
  /**
   * @extends SetIterableWrapper
   * @private
   */


  var MapMapper = /*#__PURE__*/function (_SetIterableWrapper) {
    _inherits(MapMapper, _SetIterableWrapper);

    var _super14 = _createSuper(MapMapper);

    function MapMapper(iterable, mapFunction, ctx) {
      var _this14;

      _classCallCheck(this, MapMapper);

      _this14 = _super14.call(this, iterable, ctx);
      _this14.mapFunction = mapFunction;
      return _this14;
    }

    _createClass(MapMapper, [{
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator31, _step31, _step31$value, key, _value9;

        return regeneratorRuntime.wrap(function value$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _iterator31 = _createForOfIteratorHelper(this.iterable);
                _context14.prev = 1;

                _iterator31.s();

              case 3:
                if ((_step31 = _iterator31.n()).done) {
                  _context14.next = 9;
                  break;
                }

                _step31$value = _slicedToArray(_step31.value, 2), key = _step31$value[0], _value9 = _step31$value[1];
                _context14.next = 7;
                return this.mapFunction.call(this.ctx, _value9, key, this);

              case 7:
                _context14.next = 3;
                break;

              case 9:
                _context14.next = 14;
                break;

              case 11:
                _context14.prev = 11;
                _context14.t0 = _context14["catch"](1);

                _iterator31.e(_context14.t0);

              case 14:
                _context14.prev = 14;

                _iterator31.f();

                return _context14.finish(14);

              case 17:
              case "end":
                return _context14.stop();
            }
          }
        }, value, this, [[1, 11, 14, 17]]);
      })
    }, {
      key: "has",
      value: function has(value) {
        if (Array.isArray(value)) {
          return this.iterable.some(function (otherValue) {
            return deepEquals(value, otherValue);
          });
        } else {
          return false;
        }
      }
    }]);

    return MapMapper;
  }(SetIterableWrapper);
  /**
   * @extends SetIterableWrapper
   * @private
   */


  var SetMapper = /*#__PURE__*/function (_SetIterableWrapper2) {
    _inherits(SetMapper, _SetIterableWrapper2);

    var _super15 = _createSuper(SetMapper);

    function SetMapper(iterable, mapFunction, ctx) {
      var _this15;

      _classCallCheck(this, SetMapper);

      _this15 = _super15.call(this, iterable, ctx);
      _this15.mapFunction = mapFunction;
      return _this15;
    }

    _createClass(SetMapper, [{
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator32, _step32, _value10;

        return regeneratorRuntime.wrap(function value$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _iterator32 = _createForOfIteratorHelper(this.iterable);
                _context15.prev = 1;

                _iterator32.s();

              case 3:
                if ((_step32 = _iterator32.n()).done) {
                  _context15.next = 9;
                  break;
                }

                _value10 = _step32.value;
                _context15.next = 7;
                return this.mapFunction.call(this.ctx, _value10, _value10, this);

              case 7:
                _context15.next = 3;
                break;

              case 9:
                _context15.next = 14;
                break;

              case 11:
                _context15.prev = 11;
                _context15.t0 = _context15["catch"](1);

                _iterator32.e(_context15.t0);

              case 14:
                _context15.prev = 14;

                _iterator32.f();

                return _context15.finish(14);

              case 17:
              case "end":
                return _context15.stop();
            }
          }
        }, value, this, [[1, 11, 14, 17]]);
      })
    }, {
      key: "has",
      value: function has(value) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

        if (Array.isArray(value)) {
          return this.some(function (otherValue) {
            return deepEquals(value, otherValue, depth);
          });
        } else {
          return this.some(function (otherValue) {
            return defaultEquals(value, otherValue);
          });
        }
      }
    }]);

    return SetMapper;
  }(SetIterableWrapper);
  /**
   * @extends SetIterableWrapper
   * @private
   */


  var SetFilter = /*#__PURE__*/function (_SetIterableWrapper3) {
    _inherits(SetFilter, _SetIterableWrapper3);

    var _super16 = _createSuper(SetFilter);

    function SetFilter(iterable, filterPredicate, ctx) {
      var _this16;

      _classCallCheck(this, SetFilter);

      _this16 = _super16.call(this, iterable, ctx);
      _this16.filterPredicate = filterPredicate;
      return _this16;
    }

    _createClass(SetFilter, [{
      key: "size",
      get: function get() {
        var accumulator = 0;

        var _iterator33 = _createForOfIteratorHelper(this),
            _step33;

        try {
          for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) // jshint ignore:line
          {
            var i = _step33.value;
            accumulator++;
          }
        } catch (err) {
          _iterator33.e(err);
        } finally {
          _iterator33.f();
        }

        return accumulator;
      }
    }, {
      key: Symbol.iterator,
      value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
        var _iterator34, _step34, _value11;

        return regeneratorRuntime.wrap(function value$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _iterator34 = _createForOfIteratorHelper(this.iterable);
                _context16.prev = 1;

                _iterator34.s();

              case 3:
                if ((_step34 = _iterator34.n()).done) {
                  _context16.next = 10;
                  break;
                }

                _value11 = _step34.value;

                if (!this.filterPredicate.call(this.ctx, _value11, _value11, this)) {
                  _context16.next = 8;
                  break;
                }

                _context16.next = 8;
                return _value11;

              case 8:
                _context16.next = 3;
                break;

              case 10:
                _context16.next = 15;
                break;

              case 12:
                _context16.prev = 12;
                _context16.t0 = _context16["catch"](1);

                _iterator34.e(_context16.t0);

              case 15:
                _context16.prev = 15;

                _iterator34.f();

                return _context16.finish(15);

              case 18:
              case "end":
                return _context16.stop();
            }
          }
        }, value, this, [[1, 12, 15, 18]]);
      })
    }, {
      key: "has",
      value: function has(value) {
        var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

        if (this.iterable.has(value, depth)) {
          return this.filterPredicate.call(this.ctx, value, value, this);
        }

        return false;
      }
    }]);

    return SetFilter;
  }(SetIterableWrapper);

  module.exports = {
    HashMap: HashMap,
    LinkedHashMap: LinkedHashMap,
    Mootable: {
      HashMap: HashMap,
      LinkedHashMap: LinkedHashMap,
      hashCode: hashCode,
      SetIterable: SetIterable,
      MapIterable: MapIterable
    }
  };

})));
