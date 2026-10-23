/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function OverviewRulerBorder() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Overview Ruler Border', 'custom-html-block-extension' ),
				...editorOption( 'overviewRulerBorder' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether a border should be drawn around the overview ruler.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							image: 'editor-options/overview-ruler-border_1.jpg',
							value: true,
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							image: 'editor-options/overview-ruler-border_2.jpg',
							value: false,
						},
					],
				},
			} }
		/>
	);
}
