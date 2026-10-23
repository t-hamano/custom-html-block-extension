/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isAppleOS } from '@wordpress/keycodes';
import { useContext } from '@wordpress/element';

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
			label={ __( 'Mouse Wheel Zoom', 'custom-html-block-extension' ) }
			value={ editorOptions.mouseWheelZoom }
			onChange={ onChange }
			defaultValue={ false }
			help={ {
				description: isAppleOS()
					? __(
							'Zoom the font of the editor when using mouse wheel and holding Cmd.',
							'custom-html-block-extension'
						)
					: __(
							'Zoom the font of the editor when using mouse wheel and holding Ctrl.',
							'custom-html-block-extension'
						),
				image: 'editor-options/mouse-wheel-zoom.gif',
			} }
		/>
	);
}
