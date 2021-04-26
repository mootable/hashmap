function underTest() {
    const rootDirectory = '../../';
    const name = process.env.UNDER_TEST_NAME;
    const location = rootDirectory+process.env.UNDER_TEST_LOCATION;
    const esm = process.env.UNDER_TEST_ESM === 'true';
    if (esm) {
        const esmRequire = require("esm")(module/*, options*/);
        const {LinkedHashMap, HashMap, Mootable} = esmRequire(location);
        return {
            LinkedHashMap,
            HashMap,
            Mootable,
            name, location, esm
        };
    } else {
        const {LinkedHashMap, HashMap, Mootable} = require(location);
        return {
            LinkedHashMap,
            HashMap,
            Mootable,
            name, location, esm
        };
    }
}
module.exports = {underTest};