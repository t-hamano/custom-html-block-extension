/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function CursorSurroundingLinesStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSurroundingLinesStyle: !! value ? 'all' : 'default',
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Cursor Surrounding Lines Style', 'custom-html-block-extension' ) }
			value={ 'all' === editorOptions.cursorSurroundingLinesStyle }
			onChange={ onChange }
			defaultValue={ false }
			help={ {
				description: __(
					'Controls when "Cursor Surrounding Lines" should be enforced.',
					'custom-html-block-extension'
				),
				items: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/cursor-surrounding-lines-style_1.gif',
						description: __(
							'"Cursor Surrounding Lines" is always enforced, including when the cursor is moved by a mouse click.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/cursor-surrounding-lines-style_2.gif',
						description: __(
							'"Cursor Surrounding Lines" is enforced only when the cursor is moved with the keyboard.',
							'custom-html-block-extension'
						),
					},
				],
			} }
		/>
	);
}
