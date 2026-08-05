// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...angular.configs.tsRecommended,
		],
		plugins: {
			'unused-imports': unusedImports,
		},
		processor: angular.processInlineTemplates,
		rules: {
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
			quotes: ['error', 'single'],
			'comma-dangle': ['error', 'always-multiline'],
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended],
		rules: {},
	},
);
