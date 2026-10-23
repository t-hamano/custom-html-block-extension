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

export default function Links() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			links: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Clickable Links', 'custom-html-block-extension' ) }
			value={ editorOptions.links }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					image: 'editor-options/links_1.jpg',
					value: true,
				},
				{
					image: 'editor-options/links_2.jpg',
					value: false,
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should detect links and make them clickable.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
