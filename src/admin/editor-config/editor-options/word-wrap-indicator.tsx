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

export default function WordWrapIndicator() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			wordWrapIndicator: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Word Wrap Indicator', 'custom-html-block-extension' ),
				value: editorOptions.wordWrapIndicator,
				onChange,
				defaultValue: false,
				help: {
					description: __(
						'Controls whether an indicator is rendered at the wrapping column of lines that wrap.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/word-wrap-indicator_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/word-wrap-indicator_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
