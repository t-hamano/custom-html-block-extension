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

export default function GuidesIndentation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				indentation: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			name="guides.indentation"
			label={ __( 'Indentation', 'custom-html-block-extension' ) }
			value={ editorOptions.guides.indentation }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/guides/indentation_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/guides/indentation_2.jpg',
				},
			] }
			help={ {
				description: __(
					'Controls whether the editor should render indent guides.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
