/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';

export default function OccurrencesHighlight() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Occurrences Highlight', 'custom-html-block-extension' ),
				// monaco types this option as 'off' | 'singleFile' | 'multiFile'. 'multiFile'
				// highlights across every editor on the page, which is of little use for
				// separate Custom HTML blocks, so the toggle only maps between 'singleFile' and
				// 'off'.
				getValue: ( { editorOptions } ) => 'singleFile' === editorOptions.occurrencesHighlight,
				setValue: ( value ) => ( {
					editorOptions: { occurrencesHighlight: value ? 'singleFile' : 'off' },
				} ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should highlight semantic symbol occurrences.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/occurrences-highlight_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/occurrences-highlight_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
