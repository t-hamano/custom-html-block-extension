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

export default function ScrollbarScrollByPage() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				scrollByPage: value,
			},
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Scroll by page', 'custom-html-block-extension' ) }
				checked={ editorOptions.scrollbar.scrollByPage }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Scroll by page', 'custom-html-block-extension' ) }
				description={ __(
					'Scroll by page when the scroll bar is clicked.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ false }
				image={ 'editor-options/scrollbar/scroll-by-page.gif' }
				value={ editorOptions.scrollbar.scrollByPage }
			/>
		</div>
	);
}
