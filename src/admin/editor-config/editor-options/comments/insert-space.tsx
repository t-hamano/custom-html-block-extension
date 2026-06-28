/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function CommentsInsertSpace() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Insert whitespace in comment', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

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
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					label={ title }
					checked={ editorOptions.comments.insertSpace }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					description={ __(
						'Insert whitespace inside the comment tokens when comment out using the keyboard shortcut.',
						'custom-html-block-extension'
					) }
					items={ [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/comments_insert-space_1.jpg',
							isDefault: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/comments_insert-space_2.jpg',
						},
					] }
					value={ editorOptions.comments.insertSpace }
				/>
			</HStack>
		</div>
	);
}
