/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext, useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function ScrollbarScrollByPage() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const title = __( 'Scroll By Page', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Scrollbar', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ editorOptions.scrollbar.scrollByPage }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls whether clicks scroll by page or jump to click position.',
					'custom-html-block-extension'
				) }
				isToggle
				defaultToggle={ false }
				image="editor-options/scrollbar/scroll-by-page.gif"
				value={ editorOptions.scrollbar.scrollByPage }
			/>
		</Stack>
	);
}
