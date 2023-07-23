/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';
import { toNumber } from '../../../lib/helper';

export default function CursorSurroundingLines() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSurroundingLines: value ? toNumber( value, 0, 20 ) : 0,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<RangeControl
				label={ __(
					'Number of lines to keep before and after the cursor',
					'custom-html-block-extension'
				) }
				value={ editorOptions.cursorSurroundingLines }
				min="0"
				max="20"
				allowReset
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __(
					'Number of lines to keep before and after the cursor',
					'custom-html-block-extension'
				) }
				description={ __(
					'Sets the number of lines to keep before and after the cursor when the cursor is moved up and down.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							0
						),
						image: 'editor-options/cursor-surrounding-lines_1.gif',
						value: 0,
					},
					{
						label: sprintf(
							/* translators: %s is replaced with the number. */
							__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
							5
						),
						image: 'editor-options/cursor-surrounding-lines_2.gif',
						value: 5,
					},
				] }
				value={ editorOptions.cursorSurroundingLines }
			/>
		</div>
	);
}
