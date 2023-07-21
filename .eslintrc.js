module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	parser: '@babel/eslint-parser',
	globals: {
		jQuery: true,
	},
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		'no-nested-ternary': 'off',
		'no-unused-expressions': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'jsdoc/require-param-type': 0,
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				singleQuote: true,
				printWidth: 100,
				bracketSpacing: true,
				parenSpacing: true,
				bracketSameLine: false,
			},
		],
	},
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: [ '@babel/preset-react' ],
		},
	},
	overrides: [
		{
			files: [ '**/test/**/*.js', '**/__tests__/**/*.js', '**/*.spec.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
			settings: {
				jest: {
					version: 26,
				},
			},
		},
		{
			files: [ 'test/e2e/**/*.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-e2e' ],
			rules: {
				'jest/expect-expect': 'off',
			},
		},
	],
};
