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

export default function ScrollBeyondLastLine() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			scrollBeyondLastLine: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Scroll Beyond Last Line', 'custom-html-block-extension' ),
				value: editorOptions.scrollBeyondLastLine,
				onChange,
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor will scroll beyond the last line.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/scroll-beyond-last-line_1.gif',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/scroll-beyond-last-line_2.gif',
						},
					],
				},
			} }
		/>
	);
}
