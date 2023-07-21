/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
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
				title={ __( 'Accept suggestions on enter key', 'custom-html-block-extension' ) }
				description={
					<>
						<span>
							{ __(
								'Always enable column selection. Following command can be used to select column selection even when disabled.',
								'custom-html-block-extension'
							) }
						</span>
						<span>{ __( 'Windows:', 'custom-html-block-extension' ) }</span>
						<span>
							{ __(
								'"Shift + Alt + drag mouse", or "Ctrl + Shift + Alt + arrow key"',
								'custom-html-block-extension'
							) }
						</span>
						<span>{ __( 'macOS:', 'custom-html-block-extension' ) }</span>
						<span>
							{ __(
								'"Shift + Option + drag mouse", or "Shift + Option + Command + arrow key"',
								'custom-html-block-extension'
							) }
						</span>
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
