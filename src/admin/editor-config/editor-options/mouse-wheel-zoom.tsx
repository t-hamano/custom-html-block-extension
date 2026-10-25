/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isAppleOS } from '@wordpress/keycodes';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function MouseWheelZoom() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			mouseWheelZoom: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="mouseWheelZoom"
			label={ __( 'Mouse Wheel Zoom', 'custom-html-block-extension' ) }
			value={ editorOptions.mouseWheelZoom }
			onChange={ onChange }
			defaultValue={ false }
			help={ {
				description: isAppleOS()
					? createInterpolateElement(
							__(
								'Zoom the font of the editor when using mouse wheel and holding <code>Command</code>.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						)
					: createInterpolateElement(
							__(
								'Zoom the font of the editor when using mouse wheel and holding <code>Ctrl</code>.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						),
				image: 'editor-options/mouse-wheel-zoom.gif',
			} }
		/>
	);
}
