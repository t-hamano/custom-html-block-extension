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
import editLegacy from './edit-legacy';

const customHtmlBlockExtension = ( settings: BlockConfiguration ): BlockConfiguration => {
	if ( 'core/html' !== settings.name ) {
		return settings;
	}

	// Since WordPress 7.1 the Custom HTML block stores its markup in
	// `innerContent` instead of the `content` attribute, so its `content`
	// attribute definition drops `source: 'raw'` in favor of `role: 'local'`.
	// Use that to pick the matching Edit implementation.
	// TODO: Remove `editLegacy` once the minimum supported version is 7.1.
	const hasInnerContent = settings.attributes?.content?.role === 'local';

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
		edit: ( hasInnerContent ? edit : editLegacy ) as BlockConfiguration[ 'edit' ],
	};
	return newSettings;
};

addFilter(
	'blocks.registerBlockType',
	'wildworks/custom-html-block-extension',
	customHtmlBlockExtension
);
