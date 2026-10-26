module.exports = {
	extends: [ '@wordpress/stylelint-config/scss-stylistic' ],
	rules: {
		'font-family-no-missing-generic-family-keyword': null,
		'selector-class-pattern': [
			'^[a-z][a-z0-9]*(?:(?:__|--|-)[a-z0-9]+)*$',
			{
				message:
					'Selector should use lowercase class segments separated with hyphens, double hyphens, or double underscores (selector-class-pattern)',
			},
		],
		'at-rule-empty-line-before': null,
		'declaration-property-unit-allowed-list': {
			'line-height': [],
		},
	},
};
