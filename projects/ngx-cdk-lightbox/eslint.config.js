// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(
	...rootConfig,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: ['tsconfig.eslint.json'],
				tsconfigRootDir: __dirname,
			},
		},
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'lib',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'lib',
					style: 'kebab-case',
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		rules: {},
	},
	{
		files: ['**/*.spec.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
		},
	},
);
