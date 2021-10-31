const config = require( '@wordpress/scripts/config/jest-e2e.config' );

module.exports = {
	...config,
	testTimeout: 500000,
};
