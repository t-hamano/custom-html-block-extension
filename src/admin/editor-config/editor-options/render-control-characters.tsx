/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function RenderControlCharacters() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			renderControlCharacters: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Render Control Characters', 'custom-html-block-extension' ) }
			value={ editorOptions.renderControlCharacters }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Controls whether the editor should render control characters.',
					'custom-html-block-extension'
				),
				items: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/render-control-characters_1.jpg',
						description: __(
							'Control characters are shown as labeled symbols such as SOH or ETX.',
							'custom-html-block-extension'
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/render-control-characters_2.jpg',
						description: __(
							'Control characters are shown as a generic placeholder symbol.',
							'custom-html-block-extension'
						),
					},
				],
			} }
		/>
	);
}
