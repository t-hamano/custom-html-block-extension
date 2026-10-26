/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ '**/node_modules/**', '**/vendor/**', '**/build/**', 'artifacts/**' ],
	},
	...defaultConfig.configs.recommended,
	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
		languageOptions: {
			globals: {
				jQuery: 'readonly',
			},
		},
		rules: {
			'react/jsx-boolean-value': 'error',
			'react/jsx-curly-brace-presence': [ 'error', { props: 'never', children: 'never' } ],
			'jsdoc/escape-inline-tags': 'error',
			'@wordpress/wp-global-usage': 'error',
			'import/no-extraneous-dependencies': 'off',
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
		files: [ '**/*.ts', '**/*.tsx' ],
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: false,
				},
			],
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react',
							message: 'Please use React API through `@wordpress/element` instead.',
							allowTypeImports: true,
						},
					],
				},
			],
		},
	},
	{
		files: [ 'src/admin/**' ],
		rules: {
			'@wordpress/use-recommended-components': [ 'error', { allowUseWithCaution: true } ],
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
	...defaultConfig.configs[ 'test-unit' ].map( ( config ) => ( {
		...config,
		files: [ 'test/unit/**/*.ts' ],
	} ) ),
	...defaultConfig.configs[ 'test-playwright' ].map( ( config ) => ( {
		...config,
		files: [ 'test/e2e/**/*.ts' ],
		rules: {
			...config.rules,
			'react-hooks/rules-of-hooks': 'off',
		},
	} ) ),
];
