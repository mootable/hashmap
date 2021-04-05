/**
 * HashMap - HashMap Implementation for JavaScript
 * @author Jack Moxley <https://github.com/jackmoxley>
 * @version 0.13.1
 * Homepage: https://github.com/mootable/hashmap
 */
const esmRequire = require("esm")(module/*, options*/);
const mapImplsMetaData = {
    '@mootable/HashMap': {location: '../src/', esm: true, className: 'HashMap', classification: 'mootable'},
    '@mootable/LinkedHashMap': {location: '../src/', esm: true, className: 'LinkedHashMap', classification: 'mootable'},
    'map': {location: './nativeMap.js', esm: false, className: 'Map', classification: 'native'},
    'flesler-hashmap': {location: 'flesler-hashmap', esm: false, className: 'HashMap', classification: 'other'},
};

const mapImpls = Object.entries(mapImplsMetaData)
    .map(
        ([implName, props]) => {
            const {location, esm, className} = props;
            const required = esm ? esmRequire(location) : require(location);
            return { ...props, implName, Impl : required[className]};
        });
//{location, esm, className, implName, Impl}
module.exports = {mapImpls};