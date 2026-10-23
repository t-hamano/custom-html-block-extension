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

export default function AutoClosingDelete() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'autoClosingDelete' ] ) => {
		setEditorOptions( {
			...editorOptions,
			autoClosingDelete: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Auto Closing Delete', 'custom-html-block-extension' ) }
			value={ editorOptions.autoClosingDelete }
			onChange={ onChange }
			defaultValue="auto"
			options={ [
				{
					label: __( 'Always', 'custom-html-block-extension' ),
					value: 'always',
					image: 'editor-options/auto-closing-delete_1.gif',
					description: __(
						'Always remove adjacent closing quotes or brackets when deleting.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Only automatically inserted characters', 'custom-html-block-extension' ),
					value: 'auto',
					image: 'editor-options/auto-closing-delete_2.gif',
					description: __(
						'Remove adjacent closing quotes or brackets only if they were automatically inserted.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Never', 'custom-html-block-extension' ),
					value: 'never',
					image: 'editor-options/auto-closing-delete_3.gif',
					description: __(
						'Never remove adjacent closing quotes or brackets when deleting.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should remove adjacent closing quotes or brackets when deleting.',
					'custom-html-block-extension'
				),
				colCount: 3,
			} }
		/>
	);
}
