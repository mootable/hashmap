module.exports = {
    "env": {
        "es2021": true,
        "browser": true,
        "node": true,
        "mocha" : true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
    },
    "rules": {
        "curly": ["error", "all"],
        "brace-style": ["warn", "1tbs", { "allowSingleLine": true }],
        "no-unneeded-ternary": "error",
    }
};
