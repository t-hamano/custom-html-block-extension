/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function EmptySelectionClipboard() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Empty Selection Clipboard', 'custom-html-block-extension' ),
				...editorOption( 'emptySelectionClipboard' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether copying without a selection copies the current line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/empty-selection-clipboard.gif',
				},
			} }
		/>
	);
}
