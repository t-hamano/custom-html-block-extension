/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingItem from '../../components/setting-item';
import { editorOption } from '../../components/setting-item/helpers';

export default function HoverSticky() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Keep Hover Visible on Mouse Over', 'custom-html-block-extension' ),
				group: __( 'Hover', 'custom-html-block-extension' ),
				...editorOption( 'hover', 'sticky' ),
				defaultValue: true,
				help: {
					description: __(
						'Controls whether the hover should remain visible when mouse is moved over it.',
						'custom-html-block-extension'
					),
					image: 'editor-options/hover/sticky.gif',
				},
			} }
		/>
	);
}
