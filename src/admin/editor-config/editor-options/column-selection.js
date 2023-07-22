/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from 'admin';
import ItemHelp from 'admin/editor-config/components/item-help';

export default function ColumnSelection() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			columnSelection: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __( 'Enable column selection', 'custom-html-block-extension' ) }
				checked={ editorOptions.columnSelection }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Enable column selection', 'custom-html-block-extension' ) }
				description={
					<>
						<p>
							{ __(
								'Always enable column selection. Following command can be used to select column selection even when disabled.',
								'custom-html-block-extension'
							) }
						</p>
						<ul>
							<li>
								{ createInterpolateElement(
									__(
										'Windows: <code>Shift</code> + <code>Alt</code> + drag mouse, or "<code>Ctrl</code> + <code>Shift</code> + <code>Alt</code> + arrow key',
										'custom-html-block-extension'
									),
									{
										code: <code />,
									}
								) }
							</li>
							<li>
								{ createInterpolateElement(
									__(
										'macOS: <code>Shift</code> + <code>Option</code> + drag mouse, or <code>Shift</code> + <code>Option</code> + <code>Command</code> + arrow key',
										'custom-html-block-extension'
									),
									{
										code: <code />,
									}
								) }
							</li>
						</ul>
					</>
				}
				isToggle
				defaultToggle={ false }
				image={ 'editor-options/column-selection.gif' }
				value={ editorOptions.columnSelection }
			/>
		</div>
	);
}
