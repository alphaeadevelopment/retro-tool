module.exports = {
  extends: 'airbnb',
  "plugins": [
    "class-property"
  ],
  "rules": {
    "arrow-body-style": "warn",
    "brace-style": ["error", "stroustrup"],
    "class-methods-use-this": "off",
    "function-paren-newline": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["to"]
    }],
    "jsx-quotes": ["error", "prefer-single"],
    "max-len": ["warn", { "code": 120 }],
    "no-plusplus": "off",
    "object-curly-newline": "off",
    "quote-props": ["error", "consistent"],
    "react/jsx-curly-brace-presence": "off",
    "react/prop-types": "off",
    "react/prefer-stateless-function": "off",
  },
  "parser": "babel-eslint"
}
