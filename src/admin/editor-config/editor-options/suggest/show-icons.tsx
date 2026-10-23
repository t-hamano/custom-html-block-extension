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

export default function SuggestShowIcons() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			suggest: {
				...editorOptions.suggest,
				showIcons: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Show Icons', 'custom-html-block-extension' ) }
			group={ __( 'Suggest', 'custom-html-block-extension' ) }
			value={ editorOptions.suggest.showIcons }
			onChange={ onChange }
			defaultValue
			help={ {
				description: __(
					'Controls whether to show or hide icons in suggestions.',
					'custom-html-block-extension'
				),
				items: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						image: 'editor-options/suggest/show-icons_1.jpg',
						value: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						image: 'editor-options/suggest/show-icons_2.jpg',
						value: false,
					},
				],
			} }
		/>
	);
}
