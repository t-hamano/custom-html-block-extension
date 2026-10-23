/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function ShowFoldingControls() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Show Folding Controls', 'custom-html-block-extension' ),
				...editorOption( 'showFoldingControls' ),
				defaultValue: 'mouseover',
				options: [
					{
						label: __( 'Always show', 'custom-html-block-extension' ),
						image: 'editor-options/show-folding-controls_1.jpg',
						description: __( 'Always show the folding controls.', 'custom-html-block-extension' ),
						value: 'always',
					},
					{
						label: __( 'Show on mouseover', 'custom-html-block-extension' ),
						image: 'editor-options/show-folding-controls_2.gif',
						description: __(
							'Only show the folding controls when the mouse is over the gutter.',
							'custom-html-block-extension'
						),
						value: 'mouseover',
					},
					{
						label: __( 'Never show', 'custom-html-block-extension' ),
						image: 'editor-options/show-folding-controls_3.gif',
						description: __(
							'Never show the folding controls and reduce the gutter size.',
							'custom-html-block-extension'
						),
						value: 'never',
					},
				],
				help: {
					description: __(
						'Controls when the folding controls on the gutter are shown.',
						'custom-html-block-extension'
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
