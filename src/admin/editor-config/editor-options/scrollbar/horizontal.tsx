/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import { EditorConfigContext } from '../../index';
import SettingItem from '../../components/setting-item';

export default function ScrollbarHorizontal() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const onChange = ( value: EditorOptions[ 'scrollbar' ][ 'horizontal' ] ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontal: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Horizontal', 'custom-html-block-extension' ) }
			group={ __( 'Scrollbar', 'custom-html-block-extension' ) }
			value={ editorOptions.scrollbar.horizontal }
			onChange={ onChange }
			defaultValue="auto"
			options={ [
				{
					label: __( 'Auto', 'custom-html-block-extension' ),
					image: 'editor-options/scrollbar/horizontal_1.gif',
					value: 'auto',
				},
				{
					label: __( 'Visible', 'custom-html-block-extension' ),
					image: 'editor-options/scrollbar/horizontal_2.jpg',
					value: 'visible',
				},
				{
					label: __( 'Hidden', 'custom-html-block-extension' ),
					image: 'editor-options/scrollbar/horizontal_3.jpg',
					value: 'hidden',
				},
			] }
			help={ {
				description: __(
					'Controls the visibility of the horizontal scrollbar.',
					'custom-html-block-extension'
				),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
