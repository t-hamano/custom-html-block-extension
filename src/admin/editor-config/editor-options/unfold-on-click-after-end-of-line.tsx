/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function UnfoldOnClickAfterEndOfLine() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Unfold On Click After End Of Line', 'custom-html-block-extension' ),
				...editorOption( 'unfoldOnClickAfterEndOfLine' ),
				defaultValue: false,
				help: {
					description: __(
						'Controls whether clicking on the empty content after a folded line will unfold the line.',
						'custom-html-block-extension'
					),
					image: 'editor-options/unfold-on-click-after-end-of-line.gif',
				},
			} }
		/>
	);
}
