// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
	{
		ignores: ['.angular/', 'dist/', 'node_modules/'],
	},
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
			'@angular-eslint/component-class-suffix': [
				'error',
				{
					suffixes: ['Component'],
				},
			],
			'@angular-eslint/directive-class-suffix': [
				'error',
				{
					suffixes: ['Directive'],
				},
			],
			'@angular-eslint/no-async-lifecycle-method': 'error',
			'@angular-eslint/no-duplicates-in-metadata-arrays': 'error',
			'@angular-eslint/no-empty-lifecycle-method': 'error',
			'@angular-eslint/no-input-rename': 'error',
			'@angular-eslint/no-lifecycle-call': 'error',
			'@angular-eslint/no-output-native': 'error',
			'@angular-eslint/no-output-rename': 'error',
			'@angular-eslint/no-pipe-impure': 'error',
			'@angular-eslint/no-uncalled-signals': 'error',
			'@angular-eslint/prefer-host-metadata-property': 'error',
			'@angular-eslint/prefer-inject': 'error',
			'@angular-eslint/prefer-on-push-component-change-detection': 'error',
			'@angular-eslint/prefer-output-emitter-ref': 'error',
			'@angular-eslint/prefer-output-readonly': 'error',
			'@angular-eslint/prefer-signals': 'error',
			'@angular-eslint/prefer-standalone': 'error',
			'@angular-eslint/sort-lifecycle-methods': 'error',
			'@angular-eslint/use-lifecycle-interface': 'error',

			'@typescript-eslint/array-type': [
				'error',
				{
					default: 'array',
				},
			],
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true,
				},
			],
			'@typescript-eslint/no-duplicate-enum-values': 'error',
			'@typescript-eslint/no-empty-object-type': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-inferrable-types': 'error',
			'@typescript-eslint/no-misused-promises': 'error',
			'@typescript-eslint/no-unsafe-function-type': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-wrapper-object-types': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',

			'arrow-body-style': ['error', 'as-needed'],
			'comma-dangle': ['error', 'always-multiline'],
			curly: ['error', 'all'],
			'eol-last': ['error', 'always'],
			eqeqeq: ['error', 'always'],
			'key-spacing': [
				'error',
				{
					beforeColon: false,
					afterColon: true,
				},
			],
			'no-console': [
				'warn',
				{
					allow: ['warn', 'error'],
				},
			],
			'no-debugger': 'error',
			'no-multi-spaces': 'error',
			'no-return-await': 'error',
			'no-trailing-spaces': 'error',
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'object-shorthand': ['error', 'always'],
			'prefer-const': 'error',
			'prefer-regex-literals': 'error',
			'prefer-template': 'error',
			quotes: ['error', 'single'],
			'space-before-blocks': ['error', 'always'],
			'space-infix-ops': 'error',
			'spaced-comment': [
				'error',
				'always',
				{
					markers: ['/'],
				},
			],
			'template-curly-spacing': ['error', 'never'],
			'unused-imports/no-unused-imports': 'error',
			'sort-imports': [
				'error',
				{
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended],
		rules: {
			'@angular-eslint/template/prefer-control-flow': 'error',
			'@angular-eslint/template/prefer-self-closing-tags': 'error',
			'no-restricted-syntax': [
				'error',
				{
					selector: ':matches(BoundAttribute, TextAttribute)[name="ngClass"]',
					message: 'Use native class bindings instead of ngClass.',
				},
				{
					selector: ':matches(BoundAttribute, TextAttribute)[name="ngStyle"]',
					message: 'Use native style bindings instead of ngStyle.',
				},
			],
		},
	},
	{
		files: ['**/*.spec.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
		},
	},
);
