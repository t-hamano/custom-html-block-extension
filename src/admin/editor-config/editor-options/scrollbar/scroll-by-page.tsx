/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function ScrollbarScrollByPage() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Scroll By Page', 'custom-html-block-extension' ),
				group: __( 'Scrollbar', 'custom-html-block-extension' ),
				...editorOption( 'scrollbar', 'scrollByPage' ),
				defaultValue: false,
				shouldRefreshEditor: true,
				help: {
					description: __(
						'Controls whether clicks scroll by page or jump to click position.',
						'custom-html-block-extension'
					),
					image: 'editor-options/scrollbar/scroll-by-page.gif',
				},
			} }
		/>
	);
}
