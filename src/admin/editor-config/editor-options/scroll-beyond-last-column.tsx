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

export default function ScrollBeyondLastColumn() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			scrollBeyondLastColumn: undefined !== value ? toNumber( value, 0, 20 ) : 4,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'range',
				label: __( 'Scroll Beyond Last Column', 'custom-html-block-extension' ),
				value: editorOptions.scrollBeyondLastColumn,
				onChange,
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
