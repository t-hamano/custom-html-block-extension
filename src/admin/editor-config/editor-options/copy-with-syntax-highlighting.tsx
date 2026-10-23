/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Text } from '@wordpress/ui';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../index';
import SettingItem from '../components/setting-item';

export default function CopyWithSyntaxHighlighting() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			copyWithSyntaxHighlighting: value,
		} );
	};

	return (
		<SettingItem
			setting={ {
				control: 'toggle',
				label: __( 'Copy With Syntax Highlighting', 'custom-html-block-extension' ),
				value: editorOptions.copyWithSyntaxHighlighting,
				onChange,
				defaultValue: true,
				help: {
					description: (
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
					),
					items: [
						{
							label: __( 'Enable', 'custom-html-block-extension' ),
							value: true,
							image: 'editor-options/copy-with-syntax-highlighting_1.jpg',
						},
						{
							label: __( 'Disable', 'custom-html-block-extension' ),
							value: false,
							image: 'editor-options/copy-with-syntax-highlighting_2.jpg',
						},
					],
				},
			} }
		/>
	);
}
