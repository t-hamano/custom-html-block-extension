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

export default function MultiCursorModifier() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: string | number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorModifier: value as typeof editorOptions.multiCursorModifier,
		} );
	};

	return (
		<SettingItem
			control="toggleGroup"
			name="multiCursorModifier"
			label={ __( 'Multi Cursor Modifier', 'custom-html-block-extension' ) }
			value={ editorOptions.multiCursorModifier }
			onChange={ onChange }
			defaultValue="alt"
			options={ [
				{
					label: isAppleOS()
						? __( 'Option', 'custom-html-block-extension' )
						: __( 'Alt', 'custom-html-block-extension' ),
					value: 'alt',
				},
				{
					label: isAppleOS()
						? __( 'Command', 'custom-html-block-extension' )
						: __( 'Ctrl', 'custom-html-block-extension' ),
					value: 'ctrlCmd',
				},
			] }
			help={ {
				hideOptions: true,
				description: __(
					'The modifier to be used to add multiple cursors with the mouse.',
					'custom-html-block-extension'
				),
				image: 'editor-options/multi-cursor-modifier.gif',
			} }
		/>
	);
}
