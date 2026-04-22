// ESLint v10+ config for telegram-comm-agent

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = [
  {
    ignores: ["node_modules/**", "test/**", "*.config.js", "*.example.js", "lib/**"],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly"
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
