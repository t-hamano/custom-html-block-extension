/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function GuidesIndentation() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Indentation', 'custom-html-block-extension' ),
				group: __( 'Guides', 'custom-html-block-extension' ),
				...editorOption( 'guides', 'indentation' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should render indent guides.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/guides/indentation_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/guides/indentation_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
