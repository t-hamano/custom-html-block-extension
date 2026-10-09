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
import { withBlockHTMLListBlock, withBlockHTMLEdit } from './block-html';

const extendCustomHtmlBlockSettings = ( settings: BlockConfiguration ): BlockConfiguration => {
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
			showPreviewByDefault: {
				type: 'boolean',
				default: false,
			},
		},
		edit: edit as BlockConfiguration[ 'edit' ],
	};
	return newSettings;
};

addFilter(
	'blocks.registerBlockType',
	'custom-html-block-extension/custom-html-block/extend-settings',
	extendCustomHtmlBlockSettings
);

addFilter(
	'editor.BlockListBlock',
	'custom-html-block-extension/block-html-list-block',
	withBlockHTMLListBlock
);

addFilter( 'editor.BlockEdit', 'custom-html-block-extension/block-html-edit', withBlockHTMLEdit );
