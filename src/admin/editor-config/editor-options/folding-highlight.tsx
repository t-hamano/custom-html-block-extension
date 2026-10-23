/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function FoldingHighlight() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Folding Highlight', 'custom-html-block-extension' ),
				...editorOption( 'foldingHighlight' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor should highlight folded ranges.',
						'custom-html-block-extension'
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/folding-highlight_1.jpg',
							description: __(
								'Folded lines are shown with a background highlight.',
								'custom-html-block-extension'
							),
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/folding-highlight_2.jpg',
							description: __(
								'Folded lines are shown without a background highlight.',
								'custom-html-block-extension'
							),
						},
					],
				},
			} }
		/>
	);
}
