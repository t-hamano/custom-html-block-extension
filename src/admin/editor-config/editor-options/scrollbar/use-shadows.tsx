/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function ScrollbarUseShadows() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			scrollbar: {
				...editorOptions.scrollbar,
				useShadows: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Use Shadows', 'custom-html-block-extension' ) }
			value={ editorOptions.scrollbar.useShadows }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					image: 'editor-options/scrollbar/use-shadows_1.jpg',
					value: true,
				},
				{
					image: 'editor-options/scrollbar/use-shadows_2.jpg',
					value: false,
				},
			] }
			help={ {
				description: __(
					'Controls whether horizontal and vertical shadows are cast when the content is scrolled.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
