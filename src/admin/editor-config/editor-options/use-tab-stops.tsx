/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function UseTabStops() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			useTabStops: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="useTabStops"
			label={ __( 'Use Tab Stops', 'custom-html-block-extension' ) }
			value={ editorOptions.useTabStops }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					image: 'editor-options/use-tab-stops_1.gif',
					description: createInterpolateElement(
						__(
							'Indenting with <code>Tab</code> aligns to the next tab stop, and <code>Backspace</code> within the indentation deletes back to the previous tab stop.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
					value: true,
				},
				{
					image: 'editor-options/use-tab-stops_2.gif',
					description: createInterpolateElement(
						__(
							'Indenting with <code>Tab</code> always adds a full Tab Size of indentation, and <code>Backspace</code> deletes one character at a time.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
					value: false,
				},
			] }
			help={ {
				description: __(
					'Spaces and tabs are inserted and deleted in alignment with tab stops.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
