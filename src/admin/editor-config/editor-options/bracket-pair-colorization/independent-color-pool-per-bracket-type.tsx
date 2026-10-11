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
				description={ __(
					'Give each bracket type, such as (), [], and {}, its own color sequence, instead of sharing one sequence across all types.',
					'custom-html-block-extension'
				) }
				items={ [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image:
							'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_1.jpg',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image:
							'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_2.jpg',
						isDefault: true,
					},
				] }
				value={ editorOptions.bracketPairColorization.independentColorPoolPerBracketType }
			/>
		</Stack>
	);
}
