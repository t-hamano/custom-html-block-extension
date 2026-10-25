/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { EditorOptions } from '../../../../types';
import { AdminContext } from '../../../index';
import SettingItem from '../../components/setting-item';

export default function GuidesBracketPairsHorizontal() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: EditorOptions[ 'guides' ][ 'bracketPairsHorizontal' ] ) => {
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
			name="guides.bracketPairsHorizontal"
			label={ __( 'Bracket Pairs Horizontal', 'custom-html-block-extension' ) }
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
				description: __(
					'Add horizontal lines to the guides shown by Bracket Pairs, pointing to the brackets that are not at the start of a line.',
					'custom-html-block-extension'
				),
				colCount: 3,
			} }
		/>
	);
}
