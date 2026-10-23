/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import SettingItem from '../../components/setting-item';

export default function ScrollbarScrollByPage() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

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
		<SettingItem
			control="toggle"
			label={ __( 'Scroll By Page', 'custom-html-block-extension' ) }
			group="scrollbar"
			value={ editorOptions.scrollbar.scrollByPage }
			onChange={ onChange }
			defaultValue={ false }
			help={ {
				description: __(
					'Controls whether clicks scroll by page or jump to click position.',
					'custom-html-block-extension'
				),
				image: 'editor-options/scrollbar/scroll-by-page.gif',
			} }
		/>
	);
}
