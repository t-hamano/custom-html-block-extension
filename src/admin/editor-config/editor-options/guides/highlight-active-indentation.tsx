/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function GuidesHighlightActiveIndentation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight the active indent guide', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	// monaco also accepts 'always', which keeps highlighting the active indent
	// guide while a bracket pair guide is highlighted. The plugin doesn't enable
	// bracket pair guides, so it would behave the same as `true`.
	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				highlightActiveIndentation: value,
			},
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
				checked={ editorOptions.guides.highlightActiveIndentation }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/guides/highlight-active-indentation_1.gif',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/guides/highlight-active-indentation_2.gif',
					},
				] }
				value={ editorOptions.guides.highlightActiveIndentation }
			/>
		</Stack>
	);
}
