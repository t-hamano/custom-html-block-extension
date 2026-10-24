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

export default function ScrollbarVerticalHasArrows() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );
	const { onRefreshEditor } = useContext( EditorConfigContext );

	const onChange = ( value: boolean ) => {
		onRefreshEditor();
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				verticalHasArrows: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Vertical Has Arrows', 'custom-html-block-extension' ) }
			value={ editorOptions.scrollbar.verticalHasArrows }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					image: 'editor-options/scrollbar/vertical-has-arrows_1.jpg',
					value: true,
				},
				{
					image: 'editor-options/scrollbar/vertical-has-arrows_2.jpg',
					value: false,
				},
			] }
			help={ {
				description: __(
					'Controls whether arrows are rendered at the top and bottom of the vertical scrollbar.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
