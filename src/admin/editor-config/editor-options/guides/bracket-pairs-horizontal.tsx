/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Text } from '@wordpress/ui';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

type Value = EditorOptions[ 'guides' ][ 'bracketPairsHorizontal' ];

export default function GuidesBracketPairsHorizontal() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: Value ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				bracketPairsHorizontal: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Bracket Pairs Horizontal', 'custom-html-block-extension' ) }
			group={ __( 'Guides', 'custom-html-block-extension' ) }
			value={ editorOptions.guides.bracketPairsHorizontal }
			onChange={ onChange }
			defaultValue="active"
			options={ [
				{
					label: __( 'All bracket pairs', 'custom-html-block-extension' ),
					value: true,
					image: 'editor-options/guides/bracket-pairs-horizontal_1.jpg',
				},
				{
					label: __( 'Only the active bracket pair', 'custom-html-block-extension' ),
					value: 'active',
					image: 'editor-options/guides/bracket-pairs-horizontal_2.jpg',
				},
				{
					label: __( 'None', 'custom-html-block-extension' ),
					value: false,
					image: 'editor-options/guides/bracket-pairs-horizontal_3.jpg',
				},
			] }
			help={ {
				description: (
					<Text render={ <p /> }>
						{ __(
							'Add horizontal lines to the guides shown by Bracket Pairs, pointing to the brackets that are not at the start of a line.',
							'custom-html-block-extension'
						) }
					</Text>
				),
				colCount: 3,
			} }
		/>
	);
}
