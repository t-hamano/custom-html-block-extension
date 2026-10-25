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
import SettingItem from '../components/setting-item';

export default function AutoClosingBrackets() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'autoClosingBrackets' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingBrackets: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="autoClosingBrackets"
			label={ __( 'Auto Closing Brackets', 'custom-html-block-extension' ) }
			value={ editorOptions.autoClosingBrackets }
			onChange={ onChange }
			defaultValue="languageDefined"
			options={ [
				{
					label: __( 'Always', 'custom-html-block-extension' ),
					value: 'always',
					image: 'editor-options/auto-closing-brackets_1.gif',
					description: __( 'Always autoclose brackets.', 'custom-html-block-extension' ),
				},
				{
					label: __( 'Determined by the language', 'custom-html-block-extension' ),
					value: 'languageDefined',
					image: 'editor-options/auto-closing-brackets_2.gif',
					description: __(
						'Use language configurations to determine when to autoclose brackets.',
						'custom-html-block-extension'
					),
				},
				{
					label: __(
						'Only when there is whitespace right after the cursor',
						'custom-html-block-extension'
					),
					value: 'beforeWhitespace',
					image: 'editor-options/auto-closing-brackets_3.gif',
					description: __(
						'Autoclose brackets only when the cursor is to the left of whitespace.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Never', 'custom-html-block-extension' ),
					value: 'never',
					image: 'editor-options/auto-closing-brackets_4.gif',
					description: __( 'Never autoclose brackets.', 'custom-html-block-extension' ),
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should automatically close brackets after the user adds an opening bracket.',
					'custom-html-block-extension'
				),
				colCount: 2,
			} }
		/>
	);
}
