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
			showPreviewByDefault: {
				type: 'boolean',
				default: false,
			},
		},
		edit: edit as BlockConfiguration[ 'edit' ],
	};
	return newSettings;
};

const { options } = window.chbeObj;

if ( options.permissionBlockEditor ) {
	addFilter(
		'blocks.registerBlockType',
		'wildworks/custom-html-block-extension',
		customHtmlBlockExtension
	);
}

if ( options.permissionBlockHtmlMode ) {
	addFilter(
		'editor.BlockListBlock',
		'wildworks/custom-html-block-extension/block-html',
		withBlockHTMLListBlock
	);
	addFilter(
		'editor.BlockEdit',
		'wildworks/custom-html-block-extension/block-html',
		withBlockHTMLEdit
	);
}
