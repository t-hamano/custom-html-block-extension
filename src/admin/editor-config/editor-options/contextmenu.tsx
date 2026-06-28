/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function Contextmenu() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable context menu', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			contextmenu: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					label={ title }
					checked={ editorOptions.contextmenu }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
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
			</HStack>
		</div>
	);
}
