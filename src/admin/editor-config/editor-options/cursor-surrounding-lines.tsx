/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { toNumber } from '../../../lib/helper';
import SettingItem from '../components/setting-item';

export default function CursorSurroundingLines() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSurroundingLines: value ? toNumber( value, 0, 20 ) : 0,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Cursor Surrounding Lines', 'custom-html-block-extension' ),
				value: editorOptions.cursorSurroundingLines,
				onChange,
				min: 0,
				max: 20,
				defaultValue: 0,
				help: {
					description: __(
						'Controls the minimal number of visible leading lines (minimum 0) and trailing lines (minimum 1) surrounding the cursor.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'0'
							),
							image: 'editor-options/cursor-surrounding-lines_1.gif',
							value: 0,
						},
						{
							label: sprintf(
								/* translators: %s is replaced with the number. */
								__( 'Example: Set the value to %s', 'custom-html-block-extension' ),
								'5'
							),
							image: 'editor-options/cursor-surrounding-lines_2.gif',
							value: 5,
						},
					],
				},
			} }
		/>
	);
}
