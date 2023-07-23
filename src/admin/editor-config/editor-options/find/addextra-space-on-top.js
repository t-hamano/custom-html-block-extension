/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import ItemHelp from '../../components/item-help';

export default function FindAddExtraSpaceOnTop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			find: {
				...editorOptions.find,
				addExtraSpaceOnTop: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Show search widget above the first line', 'custom-html-block-extension' ) }
				checked={ editorOptions.find.addExtraSpaceOnTop }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Show search widget above the first line', 'custom-html-block-extension' ) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/find/addextra-space-on-top_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/find/addextra-space-on-top_2.jpg',
					},
				] }
				value={ editorOptions.find.addExtraSpaceOnTop }
			/>
		</div>
	);
}
