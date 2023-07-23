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
import ItemHelp from '../components/item-help';

export default function Contextmenu() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			contextmenu: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Enable context menu', 'custom-html-block-extension' ) }
				checked={ editorOptions.contextmenu }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Enable context menu', 'custom-html-block-extension' ) }
				description={ __(
					'Sets the context menu when right-click in the editor.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/contextmenu_1.jpg',
						isDefault: true,
						description: __( 'Show the editor context menu.', 'custom-html-block-extension' ),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/contextmenu_2.jpg',
						description: __( 'Show the browser context menu.', 'custom-html-block-extension' ),
					},
				] }
				value={ editorOptions.contextmenu }
			/>
		</div>
	);
}
