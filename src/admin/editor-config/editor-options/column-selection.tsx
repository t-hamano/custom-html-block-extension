/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import SettingItem from '../components/setting-item';
import { editorOption } from '../components/setting-item/helpers';

export default function ColumnSelection() {
	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Column Selection', 'custom-html-block-extension' ),
				...editorOption( 'columnSelection' ),
				defaultValue: false,
				help: {
					description: (
						<>
							<Text render={ <p /> }>
								{ isAppleOS()
									? createInterpolateElement(
											__(
												'Always enable column selection. Even when disabled, you can make a column selection with <code>Shift</code> + <code>Option</code> + drag mouse, or <code>Shift</code> + <code>Option</code> + <code>Command</code> + arrow key.',
												'custom-html-block-extension'
											),
											{
												code: <code />,
											}
										)
									: createInterpolateElement(
											__(
												'Always enable column selection. Even when disabled, you can make a column selection with <code>Shift</code> + <code>Alt</code> + drag mouse, or <code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + arrow key.',
												'custom-html-block-extension'
											),
											{
												code: <code />,
											}
										) }
							</Text>
						</>
					),
					image: 'editor-options/column-selection.gif',
				},
			} }
		/>
	);
}
