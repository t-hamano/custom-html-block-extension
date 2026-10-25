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

export default function CopyWithSyntaxHighlighting() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			copyWithSyntaxHighlighting: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="copyWithSyntaxHighlighting"
			label={ __( 'Copy With Syntax Highlighting', 'custom-html-block-extension' ) }
			value={ editorOptions.copyWithSyntaxHighlighting }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/copy-with-syntax-highlighting_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/copy-with-syntax-highlighting_2.jpg',
				},
			] }
			help={ {
				description: __(
					'Controls whether syntax highlighting should be copied into the clipboard. Example: How it looks when pasted into Microsoft Word.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
