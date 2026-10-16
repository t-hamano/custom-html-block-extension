/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function CursorSurroundingLinesStyle() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Cursor Surrounding Lines Style', 'custom-html-block-extension' );
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
		<Stack
			className="chbe-admin-editor-config__setting-item"
			justify="start"
			align="start"
			wrap="wrap"
			gap="sm"
		>
			<SwitchControl
				label={ title }
				checked={ 'all' === editorOptions.cursorSurroundingLinesStyle }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls when "Cursor Surrounding Lines" should be enforced.',
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
	);
}
