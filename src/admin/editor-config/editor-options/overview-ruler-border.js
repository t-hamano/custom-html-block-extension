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

export default function OverviewRulerBorder() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			overviewRulerBorder: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Show border on scrollbar', 'custom-html-block-extension' ) }
				checked={ editorOptions.overviewRulerBorder }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Show border on scrollbar', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						image: 'editor-options/overview-ruler-border_1.jpg',
						value: true,
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						image: 'editor-options/overview-ruler-border_2.jpg',
						value: false,
					},
				] }
				value={ editorOptions.overviewRulerBorder }
			/>
		</div>
	);
}
