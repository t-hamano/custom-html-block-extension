/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function CommentsInsertSpace() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Comments: Insert Space', 'custom-html-block-extension' ),
				group: __( 'Comments', 'custom-html-block-extension' ),
				...editorOption( 'comments', 'insertSpace' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether a space character is inserted when commenting.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/comments_insert-space_1.jpg',
							description: __(
								'A space is inserted between the comment characters and the text, such as <!-- text -->.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/comments_insert-space_2.jpg',
							description: __(
								'No space is inserted between the comment characters and the text, such as <!--text-->.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
