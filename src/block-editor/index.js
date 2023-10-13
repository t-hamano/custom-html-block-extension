/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import icon from '../components/block-icon';
import edit from './edit';

const customHtmlBlockExtension = ( settings ) => {
	if ( 'core/html' !== settings.name ) {
		return settings;
	}

	const newSettings = {
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
