/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { isAppleOS } from '@wordpress/keycodes';
import { ToggleControl } from '@wordpress/components';
import { Stack, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function ColumnSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Enable column selection', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			columnSelection: value,
		} );
	};

	return (
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<ToggleControl
				label={ __( 'Enable column selection', 'custom-html-block-extension' ) }
				checked={ editorOptions.columnSelection }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
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
				}
				isToggle
				defaultToggle={ false }
				image="editor-options/column-selection.gif"
				value={ editorOptions.columnSelection }
			/>
		</Stack>
	);
}
