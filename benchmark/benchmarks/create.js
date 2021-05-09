/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * Homepage: https://github.com/mootable/hashmap
 */
const Benchmark = require("../util/Benchmark.js");
const singleSuite = require("../handlers/single.js");

// test(implementation)

const benchmark = new Benchmark('create').withTest( ({Impl, constructorParameters}) => {
    if(constructorParameters){
        return function() {
            const hashmap = new Impl(constructorParameters);
            if (!hashmap) {
                throw "where is the hashmap?";
            }
        };
    }
    return function() {
        const hashmap = new Impl();
        if (!hashmap) {
            throw "where is the hashmap?";
        }
    };
});

module.exports = singleSuite(benchmark);