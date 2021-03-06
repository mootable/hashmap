const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const categories = argv.category ?
    (Array.isArray(argv.category) ? argv.category : [argv.category])
    : ['all'];
if (categories.length > 0) {
    console.info(`categories are ${categories}`);
}
/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * Homepage: https://github.com/mootable/hashmap
 */
const esmRequire = require("esm")(module/*, options*/);
const mapImplsMetaData = {
    '@mootable/HashMap': {location: '../../src/', esm: true, className: 'HashMap', classification: 'mootable'},
    '@mootable/LinkedHashMap': {
        location: '../../src/',
        esm: true,
        className: 'LinkedHashMap',
        classification: 'mootable'
    },
    'map': {location: '../bench-compare/nativeMap.js', esm: false, className: 'Map', classification: 'native'},
    // 'flesler-hashmap': {
    //     location: 'Z--bench-compare--flesler-hashmap',
    //     esm: false,
    //     className: 'HashMap',
    //     classification: 'other'
    // },
    // Very slow to load.
    //   'donhash': {location: '../bench-compare/donHashMap.js', esm: false, className: 'HashMap', classification: 'other'},
};

const mapImpls = Object.entries(mapImplsMetaData)
    .filter(([_, {classification}]) => (
        categories.length === 0 ||
        categories.includes('all') ||
        categories.includes(classification)) &&
        !categories.includes(`no-${classification}`)
    )
    .map(
        ([implName, props]) => {
            const {location, esm, className} = props;
            const required = esm ? esmRequire(location) : require(location);
            return {...props, implName, Impl: required[className]};
        });

//{location, esm, className, implName, Impl}
module.exports = {mapImpls};