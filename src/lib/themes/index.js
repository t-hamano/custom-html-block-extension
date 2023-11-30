/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const themes = [];

/* eslint-disable prettier/prettier */
const themeList = {
	active4d: __( 'Active4D', 'custom-html-block-extension' ),
	'all-hallows-eve': __( 'All Hallows Eve', 'custom-html-block-extension' ),
	amy: __( 'Amy', 'custom-html-block-extension' ),
	'birds-of-paradise': __( 'Birds of Paradise', 'custom-html-block-extension' ),
	blackboard: __( 'Blackboard', 'custom-html-block-extension' ),
	'brilliance-black': __( 'Brilliance Black', 'custom-html-block-extension' ),
	'brilliance-dull': __( 'Brilliance Dull', 'custom-html-block-extension' ),
	'chrome-devtools': __( 'Chrome DevTools', 'custom-html-block-extension' ),
	'clouds-midnight': __( 'Clouds Midnight', 'custom-html-block-extension' ),
	clouds: __( 'Clouds', 'custom-html-block-extension' ),
	cobalt: __( 'Cobalt', 'custom-html-block-extension' ),
	dawn: __( 'Dawn', 'custom-html-block-extension' ),
	dreamweaver: __( 'Dreamweaver', 'custom-html-block-extension' ),
	eiffel: __( 'Eiffel', 'custom-html-block-extension' ),
	'espresso-libre': __( 'Espresso Libre', 'custom-html-block-extension' ),
	github: __( 'GitHub', 'custom-html-block-extension' ),
	idle: __( 'IDLE', 'custom-html-block-extension' ),
	katzenmilch: __( 'Katzenmilch', 'custom-html-block-extension' ),
	'kuroir-theme': __( 'Kuroir Theme', 'custom-html-block-extension' ),
	lazy: __( 'LAZY', 'custom-html-block-extension' ),
	'magicwb-amiga': __( 'MagicWB (Amiga)', 'custom-html-block-extension' ),
	'merbivore-soft': __( 'Merbivore Soft', 'custom-html-block-extension' ),
	merbivore: __( 'Merbivore', 'custom-html-block-extension' ),
	'monokai-bright': __( 'Monokai Bright', 'custom-html-block-extension' ),
	monokai: __( 'Monokai', 'custom-html-block-extension' ),
	'night-owl': __( 'Night Owl', 'custom-html-block-extension' ),
	'oceanic-next': __( 'Oceanic Next', 'custom-html-block-extension' ),
	'pastels-on-dark': __( 'Pastels on Dark', 'custom-html-block-extension' ),
	'slush-and-poppies': __( 'Slush and Poppies', 'custom-html-block-extension' ),
	'solarized-dark': __( 'Solarized Dark', 'custom-html-block-extension' ),
	'solarized-light': __( 'Solarized Light', 'custom-html-block-extension' ),
	spacecadet: __( 'SpaceCadet', 'custom-html-block-extension' ),
	sunburst: __( 'Sunburst', 'custom-html-block-extension' ),
	'textmate-mac-classic': __( 'Textmate (Mac Classic)', 'custom-html-block-extension' ),
	'tomorrow-night': __( 'Tomorrow Night', 'custom-html-block-extension' ),
	'tomorrow-night-blue': __( 'Tomorrow Night Blue', 'custom-html-block-extension' ),
	'tomorrow-night-bright': __( 'Tomorrow Night Bright', 'custom-html-block-extension' ),
	'tomorrow-night-eighties': __( 'Tomorrow Night Eighties', 'custom-html-block-extension' ),
	tomorrow: __( 'Tomorrow', 'custom-html-block-extension' ),
	twilight: __( 'Twilight', 'custom-html-block-extension' ),
	'upstream-sunburst': __( 'Upstream Sunburst', 'custom-html-block-extension' ),
	'vibrant-ink': __( 'Vibrant Ink', 'custom-html-block-extension' ),
	'xcode-default': __( 'Xcode Default', 'custom-html-block-extension' ),
	zenburnesque: __( 'Zenburnesque', 'custom-html-block-extension' ),
	iplastic: __( 'iPlastic', 'custom-html-block-extension' ),
	idlefingers: __( 'idleFingers', 'custom-html-block-extension' ),
	krtheme: __( 'krTheme', 'custom-html-block-extension' ),
	monoindustrial: __( 'Monoindustrial', 'custom-html-block-extension' ),
};
/* eslint-enable prettier/prettier */

Object.keys( themeList ).forEach( function ( key ) {
	themes.push( {
		label: themeList[ key ],
		value: key,
		data: require( `./${ key }.json` ),
	} );
} );

export default themes;
