/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

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
			label={ __( 'Comments: Insert Space', 'custom-html-block-extension' ) }
			group={ __( 'Comments', 'custom-html-block-extension' ) }
			value={ editorOptions.comments.insertSpace }
			onChange={ onChange }
			defaultValue
			help={ {
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
			} }
		/>
	);
}
