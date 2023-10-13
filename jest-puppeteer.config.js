const config = require( '@wordpress/scripts/config/puppeteer.config' );

module.exports = {
	...config,
	launch: {
		...config.launch,
		slowMo: 50,
	},
};
