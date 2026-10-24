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

export default function SuggestPreview() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			suggest: {
				...editorOptions.suggest,
				preview: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Preview', 'custom-html-block-extension' ) }
			value={ editorOptions.suggest.preview }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					value: true,
					image: 'editor-options/suggest/preview_1.gif',
					description: __(
						'The selected suggestion is shown in the editor before it is accepted.',
						'custom-html-block-extension'
					),
				},
				{
					value: false,
					image: 'editor-options/suggest/preview_2.gif',
					description: __(
						'The selected suggestion is shown only in the suggestion list until it is accepted.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether to preview the suggestion outcome in the editor.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
