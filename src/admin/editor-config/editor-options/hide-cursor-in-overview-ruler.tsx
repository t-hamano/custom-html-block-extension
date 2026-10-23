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

export default function HideCursorInOverviewRuler() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			hideCursorInOverviewRuler: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Hide Cursor In Overview Ruler', 'custom-html-block-extension' ) }
			value={ editorOptions.hideCursorInOverviewRuler }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
					value: true,
					image: 'editor-options/hide-cursor-in-overview-ruler_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/hide-cursor-in-overview-ruler_2.jpg',
				},
			] }
			help={ {
				description: __(
					'Controls whether the cursor should be hidden in the overview ruler.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
