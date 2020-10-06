module.exports = {
  // refer to this documentation if time to lint becomes a problem
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md

  // see [https://eslint.org/docs/user-guide/configuring]
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
	},
  env: {
    'es2017': true,
    'node': true
	},
  rules: {
    // see [https://eslint.org/docs/rules/]
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'indent': ['error', 2],
		'no-tabs': ['error'],
		'no-trailing-spaces': ['warn'],
    'no-unexpected-multiline': ['error'], // related to rule `semi`
    'no-unreachable': ['warn'], // related to rule `semi`
    'nonblock-statement-body-position': ['warn', 'beside'],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'], // maybe redundant due to @typescript-eslint/member-delimiter-style
		'space-infix-ops': ['warn', { 'int32Hint': false }],
		'require-await': 'off', // handled by @typescript-eslint/require-await

		// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
    '@typescript-eslint/camelcase': [ 'off', { allow: ['^config_.*'] } ], // changed to warn due to knex bindings
    '@typescript-eslint/explicit-function-return-type': ['off'], // allow compiler-inferred return types
    '@typescript-eslint/explicit-module-boundary-types': ['warn', { allowDirectConstAssertionInArrowFunctions: true, allowHigherOrderFunctions: true, allowTypedFunctionExpressions: true }],
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' }, singleline: { delimiter: 'semi' } }],
    '@typescript-eslint/no-namespace': ['off'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' } ],
		'@typescript-eslint/no-use-before-define': ['off'],
		'@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true, allowBoolean: true }],
  },
};
