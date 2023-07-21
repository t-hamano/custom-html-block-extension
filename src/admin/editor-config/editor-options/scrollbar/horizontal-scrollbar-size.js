/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';
import { toNumber } from 'lib/helper';

export default function ScrollbarHorizontalScrollbarSize() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontalScrollbarSize: value ? toNumber( value, 5, 30 ) : 10,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __( 'Horizontal scrollbar size', 'custom-html-block-extension' ) }
				value={ editorOptions.scrollbar.horizontalScrollbarSize }
				min="5"
				max="30"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Horizontal scrollbar size', 'custom-html-block-extension' ) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							10
						),
						image: 'editor-options/scrollbar/horizontal-scrollbar-size_1.jpg',
						value: 10,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							30
						),
						image: 'editor-options/scrollbar/horizontal-scrollbar-size_2.jpg',
						value: 30,
					},
				] }
				value={ editorOptions.scrollbar.horizontalScrollbarSize }
			/>
		</div>
	);
}
