/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import {
	ToggleControl,
	__experimentalText as Text,
	__experimentalHStack as HStack,
} from '@wordpress/components';

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
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
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
							<Text as="p">
								{ __(
									'Always enable column selection. Following command can be used to select column selection even when disabled.',
									'custom-html-block-extension'
								) }
							</Text>
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
					image="editor-options/column-selection.gif"
					value={ editorOptions.columnSelection }
				/>
			</HStack>
		</div>
	);
}
