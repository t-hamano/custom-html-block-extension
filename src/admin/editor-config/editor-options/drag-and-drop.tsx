/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl, __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function DragAndDrop() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Moving selections via drag and drop', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			dragAndDrop: value,
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<HStack justify="start" alignment="start" wrap>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ title }
					checked={ editorOptions.dragAndDrop }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
					isToggle
					defaultToggle={ false }
					image="editor-options/drag-and-drop.gif"
					value={ editorOptions.dragAndDrop }
				/>
			</HStack>
		</div>
	);
}
