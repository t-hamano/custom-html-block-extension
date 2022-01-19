const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

defaultConfig.plugins.shift();

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		modules: [ 'src/lib', 'node_modules', 'src' ],
		extensions: [ '.js', '.jsx' ],
	},
	performance: {
		maxEntrypointSize: 1000000,
		maxAssetSize: 1000000,
	},
};
