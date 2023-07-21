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

export default function ScrollBeyondLastColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollBeyondLastColumn: undefined !== value ? toNumber( value, 0, 20 ) : 5,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __(
					'Number of columns to scroll past the last column',
					'custom-html-block-extension'
				) }
				value={ editorOptions.scrollBeyondLastColumn }
				min="0"
				max="20"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Number of columns to scroll past the last column',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							0
						),
						image: 'editor-options/suggest-line-height_1.jpg',
						value: 0,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							20
						),
						image: 'editor-options/suggest-line-height_2.jpg',
						value: 20,
					},
				] }
				value={ editorOptions.scrollBeyondLastColumn }
			/>
		</div>
	);
}
