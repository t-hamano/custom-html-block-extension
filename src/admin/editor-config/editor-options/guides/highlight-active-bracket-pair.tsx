/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { Stack, SwitchControl, Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function GuidesHighlightActiveBracketPair() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Highlight Active Bracket Pair', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title, __( 'Guides', 'custom-html-block-extension' ) );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				highlightActiveBracketPair: value,
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
				checked={ editorOptions.guides.highlightActiveBracketPair }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				description={
					<Text render={ <p /> }>
						{ __(
							'Draw the guide of the bracket pair at the cursor in the highlight color. When disabled, the guide is still shown in the normal color.',
							'custom-html-block-extension'
						) }
					</Text>
				}
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/guides/highlight-active-bracket-pair_1.jpg',
						isDefault: true,
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/guides/highlight-active-bracket-pair_2.jpg',
					},
				] }
				value={ editorOptions.guides.highlightActiveBracketPair }
			/>
		</Stack>
	);
}
