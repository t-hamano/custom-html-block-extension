/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Stack, SwitchControl, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function BracketPairColorizationEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Colorize bracket pairs', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			bracketPairColorization: {
				...editorOptions.bracketPairColorization,
				enabled: value,
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
				checked={ editorOptions.bracketPairColorization.enabled }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					<Text render={ <p /> }>
						{ createInterpolateElement(
							__(
								'Color matching brackets, such as <code>()</code>, <code>[]</code>, and <code>{}</code>, according to their nesting level, so you can easily see which brackets form a pair.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						) }
					</Text>
				}
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/bracket-pair-colorization/enabled_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/bracket-pair-colorization/enabled_2.jpg',
					},
				] }
				value={ editorOptions.bracketPairColorization.enabled }
			/>
		</Stack>
	);
}
