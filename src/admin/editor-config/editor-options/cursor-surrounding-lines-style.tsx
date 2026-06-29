/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function CursorSurroundingLinesStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __(
		'Keep lines before and after the cursor even when the cursor is moved by mouse click',
		'custom-html-block-extension'
	);
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			cursorSurroundingLinesStyle: !! value ? 'all' : 'default',
		} );
	};

	return (
		<div className="chbe-admin-editor-config__setting-item">
			<Stack justify="start" align="start" wrap="wrap" gap="sm">
				<ToggleControl
					label={ title }
					checked={ 'all' === editorOptions.cursorSurroundingLinesStyle }
					onChange={ onChange }
				/>
				<ItemHelp
					onChange={ onChange }
					title={ title }
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
			</Stack>
		</div>
	);
}
