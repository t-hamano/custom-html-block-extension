/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function MultiCursorPaste() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: string | number | undefined ) => {
		setEditorOptions( {
			...editorOptions,
			multiCursorPaste: value as typeof editorOptions.multiCursorPaste,
		} );
	};

	return (
		<SettingItem
			control="toggleGroup"
			name="multiCursorPaste"
			label={ __( 'Multi Cursor Paste', 'custom-html-block-extension' ) }
			value={ editorOptions.multiCursorPaste }
			onChange={ onChange }
			defaultValue="spread"
			options={ [
				{
					label: _x( 'Spread', 'setting option label', 'custom-html-block-extension' ),
					image: 'editor-options/multi-cursor-paste_1.gif',
					value: 'spread',
					description: __(
						'Each cursor pastes a single line of the text.',
						'custom-html-block-extension'
					),
				},
				{
					label: _x( 'Full', 'setting option label', 'custom-html-block-extension' ),
					image: 'editor-options/multi-cursor-paste_2.gif',
					value: 'full',
					description: __( 'Each cursor pastes the full text.', 'custom-html-block-extension' ),
				},
			] }
			help={ {
				description: __(
					'Controls pasting when the line count of the pasted text matches the cursor count.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
