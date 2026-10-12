/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Stack, SwitchControl } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import { useSearchVisibility } from '../../index';
import ItemHelp from '../../components/item-help';

export default function BracketPairColorizationIndependentColorPoolPerBracketType() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const title = __( 'Use separate colors for each bracket type', 'custom-html-block-extension' );
	const isVisible = useSearchVisibility( title );

	if ( ! isVisible ) {
		return null;
	}

	const onChange = ( value: boolean ) => {
		setEditorOptions( {
			...editorOptions,
			bracketPairColorization: {
				...editorOptions.bracketPairColorization,
				independentColorPoolPerBracketType: value,
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
				checked={ editorOptions.bracketPairColorization.independentColorPoolPerBracketType }
				onCheckedChange={ onChange }
			/>
			<ItemHelp
				onChange={ onChange }
				title={ title }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image:
							'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_1.jpg',
						description: createInterpolateElement(
							__(
								'Each bracket type, such as <code>()</code>, <code>[]</code>, and <code>{}</code>, is colored by its own nesting level.',
								'custom-html-block-extension'
							),
							{
								code: <code />,
							}
						),
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image:
							'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_2.jpg',
						isDefault: true,
						description: __(
							'All bracket types share one color sequence, colored by their combined nesting level.',
							'custom-html-block-extension'
						),
					},
				] }
				value={ editorOptions.bracketPairColorization.independentColorPoolPerBracketType }
			/>
		</Stack>
	);
}
