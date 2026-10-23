/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useContext } from '@wordpress/element';
import { Text } from '@wordpress/ui';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function BracketPairColorizationEnabled() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
		<SettingItem
			control="toggle"
			label={ __( 'Bracket Pair Colorization', 'custom-html-block-extension' ) }
			group={ __( 'Bracket Pair Colorization', 'custom-html-block-extension' ) }
			value={ editorOptions.bracketPairColorization.enabled }
			onChange={ onChange }
			defaultValue
			help={ {
				description: (
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
				),
				items: [
					{
						label: __( 'Enable', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/bracket-pair-colorization/enabled_1.jpg',
					},
					{
						label: __( 'Disable', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/bracket-pair-colorization/enabled_2.jpg',
					},
				],
			} }
		/>
	);
}
