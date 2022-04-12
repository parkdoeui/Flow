module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        'comma-dangle': ['error', 'always-multiline'],
        'eol-last': ['error', 'always'],
        indent: ['error', 2],
        'object-curly-spacing': ['error', 'always'],
        quotes: ['error', 'single', { 'avoidEscape': true }],
        semi: ['error', 'never'],
        "react/prop-types": 0
    }
}
