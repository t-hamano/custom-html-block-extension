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

export default function WrappingIndent() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'wrappingIndent' ] ) => {
		setEditorOptions( {
			...editorOptions,
			wrappingIndent: value,
		} );
	};

	return (
		<SettingItem
			control="select"
			name="wrappingIndent"
			label={ __( 'Wrapping Indent', 'custom-html-block-extension' ) }
			value={ editorOptions.wrappingIndent }
			onChange={ onChange }
			defaultValue="same"
			options={ [
				{
					label: __( 'None', 'custom-html-block-extension' ),
					image: 'editor-options/wrapping-indent_1.jpg',
					description: __(
						'No indentation. Wrapped lines begin at column 1.',
						'custom-html-block-extension'
					),
					value: 'none',
				},
				{
					label: __( 'Same', 'custom-html-block-extension' ),
					image: 'editor-options/wrapping-indent_2.jpg',
					description: __(
						'Wrapped lines get the same indentation as the parent.',
						'custom-html-block-extension'
					),
					value: 'same',
				},
				{
					label: __( 'Indent', 'custom-html-block-extension' ),
					image: 'editor-options/wrapping-indent_3.jpg',
					description: __(
						'Wrapped lines get +1 indentation toward the parent.',
						'custom-html-block-extension'
					),
					value: 'indent',
				},
				{
					label: __( 'Deep indent', 'custom-html-block-extension' ),
					image: 'editor-options/wrapping-indent_4.jpg',
					description: __(
						'Wrapped lines get +2 indentation toward the parent.',
						'custom-html-block-extension'
					),
					value: 'deepIndent',
				},
			] }
			help={ {
				description: __(
					'Controls the indentation of wrapped lines.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
