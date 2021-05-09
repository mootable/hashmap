/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 1.0.3
 * Homepage: https://github.com/mootable/hashmap
 */

const {save} = require('benny');

const sanitize = (text) => {
    return text.replace(/[\W_]+/g, "_");
};
const saves = (name) => {
    const fileName = sanitize(name);
    return [
        save({
            file: fileName,
            folder: 'benchmark_results',
            /**
             * Output format, currently supported:
             *   'json' | 'csv' | 'table.html' | 'chart.html'
             * Default: 'json'
             */
            format: 'chart.html',
            details: false,
        })
    ];
};

module.exports = {saves};

