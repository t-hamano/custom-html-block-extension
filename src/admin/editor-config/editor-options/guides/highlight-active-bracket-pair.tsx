/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Text } from '@wordpress/ui';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function GuidesHighlightActiveBracketPair() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

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
		<SettingItem
			control="toggle"
			label={ __( 'Highlight Active Bracket Pair', 'custom-html-block-extension' ) }
			value={ editorOptions.guides.highlightActiveBracketPair }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					value: true,
					image: 'editor-options/guides/highlight-active-bracket-pair_1.jpg',
				},
				{
					value: false,
					image: 'editor-options/guides/highlight-active-bracket-pair_2.jpg',
				},
			] }
			help={ {
				description: (
					<Text render={ <p /> }>
						{ __(
							'Draw the guide of the bracket pair at the cursor in the highlight color. When disabled, the guide is still shown in the normal color.',
							'custom-html-block-extension'
						) }
					</Text>
				),
			} }
		/>
	);
}
