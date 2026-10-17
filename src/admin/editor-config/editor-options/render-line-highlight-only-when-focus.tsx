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

export default function RenderLineHighlightOnlyWhenFocus() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Render Line Highlight Only When Focus', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			renderLineHighlightOnlyWhenFocus: value,
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
				checked={ editorOptions.renderLineHighlightOnlyWhenFocus }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={ __(
					'Controls if the editor should render the current line highlight only when the editor is focused.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/render-line-highlight-only-when-focus_1.gif',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/render-line-highlight-only-when-focus_2.gif',
						isDefault: true,
					},
				] }
				value={ editorOptions.renderLineHighlightOnlyWhenFocus }
			/>
		</Stack>
	);
}
