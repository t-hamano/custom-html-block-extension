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

export default function ScrollbarVertical() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const onChange = ( value: EditorOptions[ 'scrollbar' ][ 'vertical' ] ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				vertical: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Vertical', 'custom-html-block-extension' ) }
			group={ __( 'Scrollbar', 'custom-html-block-extension' ) }
			value={ editorOptions.scrollbar.vertical }
			onChange={ onChange }
			defaultValue="auto"
			options={ [
				{
					label: __( 'Auto', 'custom-html-block-extension' ),
					image: 'editor-options/scrollbar/vertical_1.gif',
					value: 'auto',
				},
				{
					label: __( 'Visible', 'custom-html-block-extension' ),
					image: 'editor-options/scrollbar/vertical_2.jpg',
					value: 'visible',
				},
				{
					label: __( 'Hidden', 'custom-html-block-extension' ),
					image: 'editor-options/scrollbar/vertical_3.jpg',
					value: 'hidden',
				},
			] }
			help={ {
				description: __(
					'Controls the visibility of the vertical scrollbar.',
					'custom-html-block-extension'
				),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
