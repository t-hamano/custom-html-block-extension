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
import { EditorConfigContext } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarScrollByPage() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor, searchQuery } = useContext( EditorConfigContext );

	const title = __( 'Scroll by page', 'custom-html-block-extension' );
	const isMatch = searchQuery && title.toLowerCase().includes( searchQuery.toLowerCase() );

	if ( searchQuery && ! isMatch ) {
		return null;
	}

	const onChange = ( value ) => {
		onRefreshEditor();
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
				label={ title }
				checked={ editorOptions.scrollbar.scrollByPage }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
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
