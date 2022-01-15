const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		modules: [ 'node_modules', 'src' ],
		extensions: [ '.js', '.jsx' ],
	},
	performance: {
		maxEntrypointSize: 1000000,
		maxAssetSize: 1000000,
	},
};
