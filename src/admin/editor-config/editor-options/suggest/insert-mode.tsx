/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function SuggestInsertMode() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'suggest' ][ 'insertMode' ] ) => {
		setEditorOptions( {
			...editorOptions,
			suggest: {
				...editorOptions.suggest,
				insertMode: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Insert Mode', 'custom-html-block-extension' ) }
			group={ __( 'Suggest', 'custom-html-block-extension' ) }
			value={ editorOptions.suggest.insertMode }
			onChange={ onChange }
			defaultValue="insert"
			options={ [
				{
					label: __( 'Insert', 'custom-html-block-extension' ),
					value: 'insert',
					image: 'editor-options/suggest/insert-mode_1.gif',
					description: __(
						'Insert suggestion without overwriting text right of the cursor.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Replace', 'custom-html-block-extension' ),
					value: 'replace',
					image: 'editor-options/suggest/insert-mode_2.gif',
					description: __(
						'Insert suggestion and overwrite text right of the cursor.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether words are overwritten when accepting completions.',
					'custom-html-block-extension'
				),
				colCount: 2,
			} }
		/>
	);
}
