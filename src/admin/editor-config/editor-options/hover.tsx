/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Text } from '@wordpress/ui';

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
			? __( 'Command', 'custom-html-block-extension' )
			: __( 'Ctrl', 'custom-html-block-extension' );
	} else {
		modifierKey = isAppleOS()
			? __( 'Option', 'custom-html-block-extension' )
			: __( 'Alt', 'custom-html-block-extension' );
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
			label={ __( 'Show Hover Information', 'custom-html-block-extension' ) }
			value={ editorOptions.hover.enabled }
			onChange={ onChange }
			defaultValue="on"
			options={ [
				{
					label: __( 'Enable', 'custom-html-block-extension' ),
					value: 'on',
				},
				{
					label: __( 'Enable only while holding a modifier key', 'custom-html-block-extension' ),
					value: 'onKeyboardModifier',
				},
				{
					label: __( 'Disable', 'custom-html-block-extension' ),
					value: 'off',
				},
			] }
			help={ {
				hideOptions: true,
				description: (
					<>
						<Text render={ <p /> }>
							{ __(
								'Shows hints when the mouse is over an element or attribute.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ createInterpolateElement(
								sprintf(
									/* translators: %s is replaced with the modifier key name, such as "Ctrl". */
									__(
										'If "Enable only while holding a modifier key" is selected, hints are shown only while holding the <code>%s</code> key.',
										'custom-html-block-extension'
									),
									modifierKey
								),
								{
									code: <code />,
								}
							) }
						</Text>
					</>
				),
				image: 'editor-options/hover.gif',
			} }
		/>
	);
}
