/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function ScrollBeyondLastColumn() {
	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Scroll Beyond Last Column', 'custom-html-block-extension' ),
				...editorOption( 'scrollBeyondLastColumn' ),
				min: 0,
				max: 20,
				defaultValue: 4,
				help: {
					description: __(
						'Controls the number of extra characters beyond which the editor will scroll horizontally.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'0'
							),
							image: 'editor-options/scroll-beyond-last-column_1.gif',
							value: 0,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'20'
							),
							image: 'editor-options/scroll-beyond-last-column_2.gif',
							value: 20,
						},
					],
				},
			} }
		/>
	);
}
