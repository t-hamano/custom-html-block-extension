/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function FindLoop() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Loop', 'custom-html-block-extension' ),
				group: __( 'Find', 'custom-html-block-extension' ),
				...editorOption( 'find', 'loop' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the search automatically restarts from the beginning (or the end) when no further matches can be found.',
						'custom-html-block-extension'
					),
					image: 'editor-options/find/loop.gif',
				},
			} }
		/>
	);
}
