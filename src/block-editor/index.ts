/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import type { BlockConfiguration } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import icon from '../components/block-icon';
import edit from './edit';

const customHtmlBlockExtension = ( settings: BlockConfiguration ): BlockConfiguration => {
	if ( 'core/html' !== settings.name ) {
		return settings;
	}

	const newSettings: BlockConfiguration = {
		...settings,
		icon,
		attributes: {
			...settings.attributes,
			height: {
				type: 'number',
				default: 300,
			},
		},
		edit: edit as BlockConfiguration[ 'edit' ],
	};
	return newSettings;
};

addFilter(
	'blocks.registerBlockType',
	'wildworks/custom-html-block-extension',
	customHtmlBlockExtension
);
