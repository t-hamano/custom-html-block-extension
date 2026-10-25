module.exports = {
	extends: [ '@wordpress/stylelint-config/scss-stylistic' ],
	rules: {
		'no-descending-specificity': null,
		'font-family-no-missing-generic-family-keyword': null,
		'selector-class-pattern': null,
		'at-rule-empty-line-before': null,
		'declaration-property-unit-allowed-list': {
			'line-height': [],
		},
	},
};
