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

export default function AutoClosingOvertype() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'autoClosingOvertype' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingOvertype: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Auto Closing Overtype', 'custom-html-block-extension' ) }
			value={ editorOptions.autoClosingOvertype }
			onChange={ onChange }
			defaultValue="auto"
			options={ [
				{
					label: __( 'Always', 'custom-html-block-extension' ),
					value: 'always',
					image: 'editor-options/auto-closing-overtype_1.gif',
					description: __(
						'Always type over closing quotes or brackets.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
					value: 'auto',
					image: 'editor-options/auto-closing-overtype_2.gif',
					description: __(
						'Type over closing quotes or brackets only if they were automatically inserted.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Never', 'custom-html-block-extension' ),
					value: 'never',
					image: 'editor-options/auto-closing-overtype_3.gif',
					description: __(
						'Never type over closing quotes or brackets.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should type over closing quotes or brackets.',
					'custom-html-block-extension'
				),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
