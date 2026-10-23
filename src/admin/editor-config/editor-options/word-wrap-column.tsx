/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function WordWrapColumn() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Word Wrap Column', 'custom-html-block-extension' ),
				...editorOption( 'wordWrapColumn' ),
				min: 20,
				max: 200,
				defaultValue: 80,
				help: {
					description: __(
						'Controls the wrapping column of the editor.',
						'custom-html-block-extension'
					),
					image: 'editor-options/word-wrap-column.gif',
				},
			} }
		/>
	);
}
