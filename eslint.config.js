/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ '**/node_modules/**', '**/vendor/**', '**/build/**' ],
	},
	...defaultConfig.configs.recommended,
	{
		languageOptions: {
			globals: {
				jQuery: 'readonly',
			},
		},
		rules: {
			'react/jsx-boolean-value': 'error',
			'react/jsx-curly-brace-presence': [ 'error', { props: 'never', children: 'never' } ],
			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': 'off',
			'@wordpress/no-unsafe-wp-apis': 'off',
			'@wordpress/dependency-group': 'error',
			'@wordpress/i18n-text-domain': [
				'error',
				{
					allowedTextDomain: 'custom-html-block-extension',
				},
			],
		},
	},
	...defaultConfig.configs[ 'test-e2e' ].map( ( config ) => ( {
		...config,
		files: [ 'test/e2e/**/*.ts' ],
		rules: {
			...config.rules,
			'jest/expect-expect': 'off',
			'react-hooks/rules-of-hooks': 'off',
		},
	} ) ),
];
