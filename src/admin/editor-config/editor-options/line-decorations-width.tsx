/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function LineDecorationsWidth() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Line Decorations Width (px)', 'custom-html-block-extension' ),
				...editorOption( 'lineDecorationsWidth' ),
				min: 0,
				max: 30,
				defaultValue: 0,
				help: {
					description: __(
						'The width reserved for line decorations. Line decorations are placed between line numbers and the editor content.',
						'custom-html-block-extension'
					),
					image: 'editor-options/line-decorations-width.gif',
				},
			} }
		/>
	);
}
