/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function CommentsInsertSpace() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			comments: {
				...editorOptions.comments,
				insertSpace: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="comments.insertSpace"
			label={ __( 'Comments: Insert Space', 'custom-html-block-extension' ) }
			value={ editorOptions.comments.insertSpace }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/comments_insert-space_1.jpg',
					description: createInterpolateElement(
						sprintf(
							/* translators: %s: An example of a comment, such as "<!-- text -->". */
							__(
								'A space is inserted between the comment characters and the text, such as <code>%s</code>.',
								'custom-html-block-extension'
							),
							'<!-- text -->'
						),
						{
							code: <code />,
						}
					),
				},
				{
					value: false,
					image: 'editor-options/comments_insert-space_2.jpg',
					description: createInterpolateElement(
						sprintf(
							/* translators: %s: An example of a comment, such as "<!--text-->". */
							__(
								'No space is inserted between the comment characters and the text, such as <code>%s</code>.',
								'custom-html-block-extension'
							),
							'<!--text-->'
						),
						{
							code: <code />,
						}
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether a space character is inserted when commenting.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
