/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { isAppleOS } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function MouseWheelZoom() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Mouse Wheel Zoom', 'custom-html-block-extension' ),
				...editorOption( 'mouseWheelZoom' ),
				defaultValue: false,
				help: {
					description: isAppleOS()
						? __(
								'Zoom the font of the editor when using mouse wheel and holding Cmd.',
								'custom-html-block-extension'
							)
						: __(
								'Zoom the font of the editor when using mouse wheel and holding Ctrl.',
								'custom-html-block-extension'
							),
					image: 'editor-options/mouse-wheel-zoom.gif',
				},
			} }
		/>
	);
}
