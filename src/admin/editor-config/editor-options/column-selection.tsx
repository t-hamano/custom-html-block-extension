/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function ColumnSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			columnSelection: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Column Selection', 'custom-html-block-extension' ),
				value: editorOptions.columnSelection,
				onChange,
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
