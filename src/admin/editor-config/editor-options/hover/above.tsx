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

export default function HoverAbove() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			hover: {
				...editorOptions.hover,
				above: value,
			},
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Prefer Hover Above', 'custom-html-block-extension' ) }
			group={ __( 'Hover', 'custom-html-block-extension' ) }
			value={ editorOptions.hover.above }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/hover/above_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/hover/above_2.jpg',
				},
			] }
			help={ {
				description: __(
					"Prefer showing hovers above the line, if there's space.",
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
