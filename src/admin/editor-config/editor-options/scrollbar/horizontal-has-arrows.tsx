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

export default function ScrollbarHorizontalHasArrows() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const onChange = ( value: boolean ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				horizontalHasArrows: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Horizontal Has Arrows', 'custom-html-block-extension' ) }
			value={ editorOptions.scrollbar.horizontalHasArrows }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					image: 'editor-options/scrollbar/horizontal-has-arrows_1.jpg',
					value: true,
				},
				{
					image: 'editor-options/scrollbar/horizontal-has-arrows_2.jpg',
					value: false,
				},
			] }
			help={ {
				description: __(
					'Controls whether arrows are rendered at the left and right of the horizontal scrollbar.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
