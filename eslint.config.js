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
			'@wordpress/use-import-as': [
				'error',
				{
					'@wordpress/components': {
						__experimentalConfirmDialog: 'ConfirmDialog',
						__experimentalHeading: 'Heading',
						__experimentalToggleGroupControl: 'ToggleGroupControl',
						__experimentalToggleGroupControlOption: 'ToggleGroupControlOption',
						__experimentalToolsPanel: 'ToolsPanel',
						__experimentalToolsPanelItem: 'ToolsPanelItem',
					},
				},
			],
		},
	},
	{
		// Functions passed to `page.evaluate()` run in the browser and reuse the
		// names of their arguments.
		files: [ 'bin/capture-help-images/**/*.mjs' ],
		languageOptions: {
			globals: {
				getComputedStyle: 'readonly',
				HTMLInputElement: 'readonly',
			},
		},
		rules: {
			'no-console': 'off',
			'no-shadow': 'off',
		},
	},
	...defaultConfig.configs[ 'test-playwright' ].map( ( config ) => ( {
		...config,
		files: [ 'test/e2e/**/*.ts' ],
		rules: {
			...config.rules,
			'react-hooks/rules-of-hooks': 'off',
		},
	} ) ),
];
