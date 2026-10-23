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

export default function Contextmenu() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			contextmenu: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Context Menu', 'custom-html-block-extension' ) }
			value={ editorOptions.contextmenu }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/contextmenu_1.jpg',
					description: __( 'Show the editor context menu.', 'custom-html-block-extension' ),
				},
				{
					value: false,
					image: 'editor-options/contextmenu_2.jpg',
					description: __( 'Show the browser context menu.', 'custom-html-block-extension' ),
				},
			] }
			help={ {
				description: __( 'Enable custom context menu.', 'custom-html-block-extension' ),
			} }
		/>
	);
}
