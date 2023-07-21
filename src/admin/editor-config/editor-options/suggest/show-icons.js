/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function SuggestShowIcons() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			suggest: {
				...editorOptions.suggest,
				showIcons: value,
			},
		} );
	};

	return (
		<>
			<div className="chbe-admin-editor-config__item">
				<ToggleControl
					label={ __( 'Show icons', 'custom-html-block-extension' ) }
					checked={ editorOptions.suggest.showIcons }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ __( 'Suggest line height (px)', 'custom-html-block-extension' ) }
					items={ [
						{
							label: __( 'Enabl', 'custom-html-block-extension' ),
							image: 'editor-options/suggest/show-icons_1.jpg',
							value: true,
							isDefault: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/suggest/show-icons_2.jpg',
							value: false,
						},
					] }
					value={ editorOptions.suggest.showIcons }
				/>
			</div>
		</>
	);
}
