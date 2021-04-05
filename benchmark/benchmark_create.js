/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const singleSuite = require("./handler_single.js");

// test(implementation)
const testForCreate = ({Impl}) => {
    return () => {
        const hashmap = new Impl();
        if (!hashmap) {
            throw "where is the hashmap?";
        }
    };
};

module.exports = singleSuite('create', testForCreate);