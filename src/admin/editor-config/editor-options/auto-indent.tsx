/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../types';
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import SettingItem from '../components/setting-item';

export default function AutoIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	// Monaco also accepts 'full', but it only differs from 'advanced' with the
	// language's indentationRules, which none of the languages here define.

	const onChange = ( value: EditorOptions[ 'autoIndent' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoIndent: value,
		} );
		onRefreshEditor();
	};

	return (
		<SettingItem
			control="select"
			name="autoIndent"
			label={ __( 'Auto Indent', 'custom-html-block-extension' ) }
			value={ editorOptions.autoIndent }
			onChange={ onChange }
			defaultValue="advanced"
			options={ [
				{
					label: __( 'None', 'custom-html-block-extension' ),
					value: 'none',
					image: 'editor-options/auto-indent_1.gif',
					description: __(
						'The editor will not insert indentation automatically.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Keep', 'custom-html-block-extension' ),
					value: 'keep',
					image: 'editor-options/auto-indent_2.gif',
					description: __(
						"The editor will keep the current line's indentation.",
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Brackets', 'custom-html-block-extension' ),
					value: 'brackets',
					image: 'editor-options/auto-indent_3.gif',
					description: __(
						"The editor will keep the current line's indentation and honor language defined brackets.",
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Advanced', 'custom-html-block-extension' ),
					value: 'advanced',
					image: 'editor-options/auto-indent_4.gif',
					description: __(
						"The editor will keep the current line's indentation, honor language defined brackets and apply language-specific rules when pressing Enter.",
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines.',
					'custom-html-block-extension'
				),
				colCount: 4,
			} }
		/>
	);
}
