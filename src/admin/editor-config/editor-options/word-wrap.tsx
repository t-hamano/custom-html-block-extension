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

export default function WordWrap() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'wordWrap' ] ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrap: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Word Wrap', 'custom-html-block-extension' ) }
			value={ editorOptions.wordWrap }
			onChange={ onChange }
			defaultValue="off"
			options={ [
				{
					label: __( 'Off', 'custom-html-block-extension' ),
					value: 'off',
					image: 'editor-options/word-wrap_1.gif',
					description: __( 'Lines will never wrap.', 'custom-html-block-extension' ),
				},
				{
					label: __( 'On', 'custom-html-block-extension' ),
					value: 'on',
					image: 'editor-options/word-wrap_2.gif',
					description: __(
						'Lines will wrap at the viewport width.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Depends on word wrap column', 'custom-html-block-extension' ),
					value: 'wordWrapColumn',
					image: 'editor-options/word-wrap_3.gif',
					description: __(
						'Lines will wrap at "Word Wrap Column".',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Flexible', 'custom-html-block-extension' ),
					value: 'bounded',
					image: 'editor-options/word-wrap_4.gif',
					description: __(
						'Lines will wrap at the minimum of viewport and "Word Wrap Column".',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __( 'Controls how lines should wrap.', 'custom-html-block-extension' ),
			} }
		/>
	);
}
