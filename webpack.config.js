/**
 * External dependencies
 */
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const resolve = {
	...defaultConfig.resolve,
	modules: [ 'node_modules', 'src' ],
	extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
};

module.exports = [
	{
		...defaultConfig,
		entry: {
			admin: './src/admin',
			'block-editor': './src/block-editor',
			'classic-editor': './src/classic-editor',
			'theme-plugin-editor': './src/theme-plugin-editor',
		},
		resolve,
		output: {
			...defaultConfig.output,
			clean: false,
		},
		performance: {
			maxEntrypointSize: 1000000,
			maxAssetSize: 1000000,
		},
	},
	// The monaco editor is built separately, since it's loaded into each window that
	// shows an editor instead of being enqueued with the other scripts.
	{
		mode: defaultConfig.mode,
		devtool: false,
		entry: {
			monaco: './src/monaco',
		},
		resolve,
		output: {
			path: path.resolve( __dirname, 'build/monaco' ),
			filename: '[name].js',
			chunkFilename: '[name].js?ver=[chunkhash]',
			// Resolve chunks and workers from the URL of the loaded script.
			publicPath: 'auto',
			clean: true,
		},
		module: {
			rules: [
				// Transpile the source with babel.
				defaultConfig.module.rules.find( ( rule ) =>
					[].concat( rule.use ).some( ( use ) => use?.loader?.includes( 'babel-loader' ) )
				),
				{
					test: /\.css$/,
					use: [ MiniCssExtractPlugin.loader, require.resolve( 'css-loader' ) ],
				},
				{
					test: /\.ttf$/,
					type: 'asset/resource',
					generator: {
						filename: '[name][ext]?ver=[hash]',
					},
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin( { filename: '[name].css' } ),
			// Generate `monaco.asset.php` with the version of the bundle.
			defaultConfig.plugins.find(
				( plugin ) => plugin.constructor.name === 'DependencyExtractionWebpackPlugin'
			),
		],
		performance: {
			hints: false,
		},
	},
];
