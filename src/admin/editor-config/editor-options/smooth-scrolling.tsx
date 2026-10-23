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

export default function SmoothScrolling() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			smoothScrolling: value,
		} );
	};

	return (
		<SettingItem
			control="toggle"
			label={ __( 'Smooth Scrolling', 'custom-html-block-extension' ) }
			value={ editorOptions.smoothScrolling }
			onChange={ onChange }
			defaultValue={ false }
			help={ {
				description: __(
					'Controls whether the editor will scroll using an animation.',
					'custom-html-block-extension'
				),
				items: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/smooth-scrolling_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/smooth-scrolling_2.gif',
					},
				],
			} }
		/>
	);
}
