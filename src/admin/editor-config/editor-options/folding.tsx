/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function Folding() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Folding', 'custom-html-block-extension' ),
				...editorOption( 'folding' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the editor has code folding enabled.',
						'custom-html-block-extension'
					),
					image: 'editor-options/folding.gif',
				},
			} }
		/>
	);
}
