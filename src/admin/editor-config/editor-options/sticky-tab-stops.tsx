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

export default function StickyTabStops() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			stickyTabStops: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="stickyTabStops"
			label={ __( 'Sticky Tab Stops', 'custom-html-block-extension' ) }
			value={ editorOptions.stickyTabStops }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					value: true,
					image: 'editor-options/sticky-tab-stops_1.gif',
					description: createInterpolateElement(
						__(
							'Within indentation made of spaces, the <code>Left</code> and <code>Right</code> arrow keys move the cursor by a full tab stop, as if the indentation were tab characters.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
				},
				{
					value: false,
					image: 'editor-options/sticky-tab-stops_2.gif',
					description: createInterpolateElement(
						__(
							'Within indentation made of spaces, the <code>Left</code> and <code>Right</code> arrow keys move the cursor one space at a time.',
							'custom-html-block-extension'
						),
						{
							code: <code />,
						}
					),
				},
			] }
			help={ {
				description: __(
					'Emulate selection behavior of tab characters when using spaces for indentation. Selection will stick to tab stops.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
