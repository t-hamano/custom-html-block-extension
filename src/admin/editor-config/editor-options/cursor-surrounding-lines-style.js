/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import ItemHelp from '../components/item-help';

export default function CursorSurroundingLinesStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSurroundingLinesStyle: !! value ? 'all' : 'default',
		} );
	};

	return (
		<div className="chbe-admin-editor-config__item">
			<ToggleControl
				label={ __(
					'Keep lines before and after the cursor even when the cursor is moved by mouse click',
					'custom-html-block-extension'
				) }
				checked={ 'all' === editorOptions.cursorSurroundingLinesStyle }
				onChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ __( 'Enable context menu', 'custom-html-block-extension' ) }
				description={ __(
					'Sets the context menu when right-click in the editor.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/cursor-surrounding-lines-style_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/cursor-surrounding-lines-style_2.gif',
						isDefault: true,
					},
				] }
				value={ 'all' === editorOptions.cursorSurroundingLinesStyle }
			/>
		</div>
	);
}
