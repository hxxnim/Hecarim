module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-empty-function": "warn",
    "@typescript-eslint/no-empty-function": "off",
    "react/display-name": "wran",
    "react/prop-types": "wran",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "react/jsx-key": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "no-irregular-whitespace": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "off",
    "indent": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [".eslintrc.js"],
};
