/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function BracketPairColorizationIndependentColorPoolPerBracketType() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
		<SettingItem
			control="toggle"
			name="bracketPairColorization.independentColorPoolPerBracketType"
			label={ __( 'Independent Color Pool Per Bracket Type', 'custom-html-block-extension' ) }
			value={ editorOptions.bracketPairColorization.independentColorPoolPerBracketType }
			onChange={ onChange }
			defaultValue={ false }
			options={ [
				{
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
					value: false,
					image:
						'editor-options/bracket-pair-colorization/independent-color-pool-per-bracket-type_2.jpg',
					description: __(
						'All bracket types share one color sequence, colored by their combined nesting level.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: __(
					'Controls whether each bracket type has its own independent color pool.',
					'custom-html-block-extension'
				),
			} }
		/>
	);
}
