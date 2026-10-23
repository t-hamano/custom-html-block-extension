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

export default function OverviewRulerBorder() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			overviewRulerBorder: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Overview Ruler Border', 'custom-html-block-extension' ) }
			value={ editorOptions.overviewRulerBorder }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					image: 'editor-options/overview-ruler-border_1.jpg',
					value: true,
				},
				{
					image: 'editor-options/overview-ruler-border_2.jpg',
					value: false,
				},
			] }
			help={ {
				description: __(
					'Controls whether a border should be drawn around the overview ruler.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
