/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import { useSearchVisibility } from '../index';
import ItemHelp from '../components/item-help';

export default function CopyWithSyntaxHighlighting() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Copy With Syntax Highlighting', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			copyWithSyntaxHighlighting: value,
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
				checked={ editorOptions.copyWithSyntaxHighlighting }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					<>
						<Text render={ <p /> }>
							{ __(
								'Controls whether syntax highlighting should be copied into the clipboard.',
								'custom-html-block-extension'
							) }
						</Text>
						<Text render={ <p /> }>
							{ __(
								'Example: How it looks when pasted into Microsoft Word.',
								'custom-html-block-extension'
							) }
						</Text>
					</>
				}
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/copy-with-syntax-highlighting_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/copy-with-syntax-highlighting_2.jpg',
					},
				] }
				value={ editorOptions.copyWithSyntaxHighlighting }
			/>
		</Stack>
	);
}
