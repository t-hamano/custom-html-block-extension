/**
 * External dependencies
 */
const reactHooksPlugin = require( 'eslint-plugin-react-hooks' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ '**/node_modules/**', '**/vendor/**', '**/build/**', 'artifacts/**' ],
	},
	// React Compiler rules. `@wordpress/eslint-plugin` overrides the classic hooks rules below.
	reactHooksPlugin.configs.flat[ 'recommended-latest' ],
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
			'@wordpress/data-no-store-string-literals': 'error',
			'@wordpress/components-no-unsafe-button-disabled': 'error',
			'@wordpress/components-no-missing-40px-size-prop': 'error',
			'@wordpress/react-no-unsafe-timeout': 'error',
			'@wordpress/use-recommended-components': [ 'error', { allowUseWithCaution: true } ],
			'react-hooks/config': [
				'error',
				{
					environment: {
						enableTreatRefLikeIdentifiersAsRefs: true,
						validateRefAccessDuringRender: false,
					},
				},
			],
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
			'@typescript-eslint/ban-ts-comment': [
				'error',
				{
					'ts-expect-error': 'allow-with-description',
					'ts-ignore': true,
					'ts-nocheck': true,
					'ts-check': false,
				},
			],
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
	{
		files: [ 'src/**' ],
		rules: {
			'import/no-extraneous-dependencies': 'error',
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
