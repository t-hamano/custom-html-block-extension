/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import icon from '../components/block-icon';
import edit from './edit';

type HtmlBlockSettings = {
	name: string;
	attributes?: Record< string, unknown >;
	[ key: string ]: unknown;
};

const customHtmlBlockExtension = ( settings: HtmlBlockSettings ): HtmlBlockSettings => {
	if ( 'core/html' !== settings.name ) {
		return settings;
	}

	const newSettings: HtmlBlockSettings = {
		...settings,
		icon,
		attributes: {
			...settings.attributes,
			height: {
				type: 'number',
				default: 300,
			},
		},
		edit,
	};
	return newSettings;
};

addFilter(
	'blocks.registerBlockType',
	'wildworks/custom-html-block-extension',
	customHtmlBlockExtension
);
