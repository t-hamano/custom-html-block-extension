/**
 * External dependencies
 */
const { devices } = require( '@playwright/test' );

/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/playwright.config.js' );

export default {
	...config,
	testDir: './test/e2e',
	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ] },
		},
		{
			name: 'firefox',
			use: { ...devices[ 'Desktop Firefox' ] },
		},
		{
			name: 'webkit',
			use: { ...devices[ 'Desktop Safari' ] },
		},
	],
};
