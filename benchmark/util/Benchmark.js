const {add, cycle} = require('benny');

function isFunction(func) {
    return !!(func && func.constructor && func.call && func.apply);
}

class Benchmark {
    constructor(name, test, before, after) {
        this.name = name;
        this.withTest(test);
        this.before = before;
        this.after = after;
    }

    withBefore(before) {
        this.before = isFunction(before) ? before : function () {
        };
        return this;
    }

    withAfter(after) {
        this.after = isFunction(after) ? after : () => function () {
        };
        return this;
    }

    withTest(test) {
        this.test = isFunction(test) ? test : () => function () {
        };
        return this;
    }

    benchMethods(name, options) {
        const beforeOptions = this.before ? this.before(options) : {};
        const methods = [add(name, this.test(options,beforeOptions))];
        if (this.after) {
            methods.push(cycle(this.after(options, beforeOptions)));
        }
        return methods;
    }
}

module.exports = Benchmark;