module.exports = {
	extends: [
		'stylelint-config-rational-order',
		'stylelint-config-wordpress/scss',
	],
	rules: {
		'no-descending-specificity': null,
		'font-weight-notation': null,
		'font-family-no-missing-generic-family-keyword': null,
		'selector-class-pattern': null,
		'at-rule-empty-line-before': null,
		'declaration-property-unit-whitelist': null,
		'declaration-property-unit-allowed-list': {
			'line-height': []
		},
	}
}
