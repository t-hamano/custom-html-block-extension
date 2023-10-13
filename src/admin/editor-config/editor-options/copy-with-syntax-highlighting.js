/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { EditorConfigContext } from '../index';
import ItemHelp from '../components/item-help';

export default function CopyWithSyntaxHighlighting() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Copy with syntax highlighting', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			copyWithSyntaxHighlighting: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ title }
				checked={ editorOptions.copyWithSyntaxHighlighting }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Example: How it looks when pasted into Microsoft Word',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/copy-with-syntax-highlighting_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/copy-with-syntax-highlighting_2.jpg',
					},
				] }
				value={ editorOptions.copyWithSyntaxHighlighting }
			/>
		</div>
	);
}
