/**
 * WordPress dependencies
 */
import { __, sprintf, _x } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function Hover() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	// monaco shows hints on the modifier key that is not used for multi cursor.
	let modifierKey;
	if ( 'alt' === editorOptions.multiCursorModifier ) {
		modifierKey = isAppleOS()
			? _x( 'Command', 'setting option label', 'custom-html-block-extension' )
			: _x( 'Ctrl', 'setting option label', 'custom-html-block-extension' );
	} else {
		modifierKey = isAppleOS()
			? _x( 'Option', 'setting option label', 'custom-html-block-extension' )
			: _x( 'Alt', 'setting option label', 'custom-html-block-extension' );
	}

	const onChange = ( value: EditorOptions[ 'hover' ][ 'enabled' ] ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				enabled: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			name="hover.enabled"
			label={ __( 'Show Hover Information', 'custom-html-block-extension' ) }
			value={ editorOptions.hover.enabled }
			onChange={ onChange }
			defaultValue="on"
			options={ [
				{
					label: _x( 'Enable', 'setting option label', 'custom-html-block-extension' ),
					value: 'on',
				},
				{
					label: __( 'Enable only while holding a modifier key', 'custom-html-block-extension' ),
					value: 'onKeyboardModifier',
				},
				{
					label: _x( 'Disable', 'setting option label', 'custom-html-block-extension' ),
					value: 'off',
				},
			] }
			help={ {
				hideOptions: true,
				description: createInterpolateElement(
					sprintf(
						/* translators: %s is replaced with the modifier key name, such as "Ctrl". */
						__(
							'Shows hints when the mouse is over an element or attribute. If "Enable only while holding a modifier key" is selected, hints are shown only while holding the <code>%s</code> key.',
							'custom-html-block-extension'
						),
						modifierKey
					),
					{
						code: <code />,
					}
				),
				image: 'editor-options/hover.gif',
			} }
		/>
	);
}
