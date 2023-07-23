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

export default function FontLigatures() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Enable font ligatures', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			fontLigatures: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ title }
				checked={ editorOptions.fontLigatures }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Ligatures are special characters in a font that combine two or more characters into one. Only Fira Code font supports ligatures.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/font-ligatures_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/font-ligatures_2.jpg',
					},
				] }
				value={ editorOptions.fontLigatures }
			/>
		</div>
	);
}
