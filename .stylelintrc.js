module.exports = {
	extends: [ '@wordpress/stylelint-config/scss' ],
	ignoreFiles: [
		'build/**/*.css',
		'node_modules/**/*.css',
		'vendor/**/*.css',
		'**/*.js',
		'**/*.svg',
	],
	rules: {
		'no-descending-specificity': null,
		'font-weight-notation': null,
		'font-family-no-missing-generic-family-keyword': null,
		'selector-class-pattern': null,
		'at-rule-empty-line-before': null,
		'declaration-property-unit-allowed-list': {
			'line-height': [],
		},
	},
};
