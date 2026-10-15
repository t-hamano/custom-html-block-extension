/**
 * External dependencies
 */
const path = require( 'path' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// The monaco editor, which is loaded into each window that shows an editor instead
// of being enqueued with the other scripts. It's built into `build/monaco` only,
// and `webpack.config.js` keeps `clean: false`, so the two builds don't remove
// each other's files.
module.exports = {
	...defaultConfig,
	entry: {
		monaco: './src/monaco',
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, 'build/monaco' ),
		// Resolve chunks and workers from the URL of the loaded script.
		publicPath: 'auto',
	},
	optimization: {
		...defaultConfig.optimization,
		// Keep all of monaco's CSS in `monaco.css`, which the default config would
		// split into `style-monaco.css` for files named `style.css`.
		splitChunks: false,
	},
	performance: {
		hints: false,
	},
};
