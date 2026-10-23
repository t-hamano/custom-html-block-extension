/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function StickyScrollEnabled() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Sticky Scroll', 'custom-html-block-extension' ),
				group: __( 'Sticky Scroll', 'custom-html-block-extension' ),
				...editorOption( 'stickyScroll', 'enabled' ),
				defaultValue: true,
				help: {
					description: __(
						'Shows the nested current scopes during the scroll at the top of the editor.',
						'custom-html-block-extension'
					),
					image: 'editor-options/sticky-scroll/enabled.gif',
				},
			} }
		/>
	);
}
