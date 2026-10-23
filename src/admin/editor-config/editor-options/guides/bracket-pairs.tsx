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
import { selectSetting } from '../../components/setting-item/helpers';

type Value = EditorOptions[ 'guides' ][ 'bracketPairs' ];

export default function GuidesBracketPairs() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: Value ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				bracketPairs: value,
			},
		} );
	};

	return (
		<SettingItem
			setting={ selectSetting( {
				control: 'select',
				label: __( 'Bracket Pairs', 'custom-html-block-extension' ),
				group: __( 'Guides', 'custom-html-block-extension' ),
				value: editorOptions.guides.bracketPairs,
				onChange,
				defaultValue: false,
				options: [
					{
						label: __( 'All bracket pairs', 'custom-html-block-extension' ),
						value: true,
						image: 'editor-options/guides/bracket-pairs_1.jpg',
					},
					{
						label: __( 'Only the active bracket pair', 'custom-html-block-extension' ),
						value: 'active',
						image: 'editor-options/guides/bracket-pairs_2.jpg',
					},
					{
						label: __( 'None', 'custom-html-block-extension' ),
						value: false,
						image: 'editor-options/guides/bracket-pairs_3.jpg',
					},
				],
				help: {
					description: (
						<Text render={ <p /> }>
							{ __(
								'Draw vertical lines between matching brackets, so you can see which code is inside each pair.',
								'custom-html-block-extension'
							) }
						</Text>
					),
					showOptions: true,
					colCount: 3,
				},
			} ) }
		/>
	);
}
