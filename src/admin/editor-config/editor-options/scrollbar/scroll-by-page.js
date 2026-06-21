/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarScrollByPage() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Scroll by page', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
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
		<HStack justify="start" align="start" wrap>
			<ToggleControl
				__nextHasNoMarginBottom
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
				image="editor-options/scrollbar/scroll-by-page.gif"
				value={ editorOptions.scrollbar.scrollByPage }
			/>
		</HStack>
	);
}
