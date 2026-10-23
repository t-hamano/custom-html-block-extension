/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption, selectSetting } from '../components/setting-item/helpers';

export default function Hover() {
	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Show Hover Information', 'custom-html-block-extension' ),
				...editorOption( 'hover', 'enabled' ),
				defaultValue: 'on',
				options: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: 'on',
					},
					{
						label: __( 'Enable only while holding a modifier key', 'custom-html-block-extension' ),
						value: 'onKeyboardModifier',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: 'off',
					},
				],
				help: {
					description: ( { editorOptions } ) => {
						// monaco shows hints on the modifier key that is not used for multi cursor.
						let modifierKey;
						if ( 'alt' === editorOptions.multiCursorModifier ) {
							modifierKey = isAppleOS()
								? __( 'Command', 'custom-html-block-extension' )
								: __( 'Ctrl', 'custom-html-block-extension' );
						} else {
							modifierKey = isAppleOS()
								? __( 'Option', 'custom-html-block-extension' )
								: __( 'Alt', 'custom-html-block-extension' );
						}
						return (
							<>
								<Text render={ <p /> }>
									{ __(
										'Shows hints when the mouse is over an element or attribute.',
										'custom-html-block-extension'
									) }
								</Text>
								<Text render={ <p /> }>
									{ createInterpolateElement(
										sprintf(
											/* translators: %s is replaced with the modifier key name, such as "Ctrl". */
											__(
												'If "Enable only while holding a modifier key" is selected, hints are shown only while holding the <code>%s</code> key.',
												'custom-html-block-extension'
											),
											modifierKey
										),
										{
											code: <code />,
										}
									) }
								</Text>
							</>
						);
					},
					image: 'editor-options/hover.gif',
				},
			} ) }
		/>
	);
}
