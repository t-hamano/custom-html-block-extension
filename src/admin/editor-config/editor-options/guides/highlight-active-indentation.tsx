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

type Value = EditorOptions[ 'guides' ][ 'highlightActiveIndentation' ];

export default function GuidesHighlightActiveIndentation() {
	const { editorOptions, setEditorOptions } = useContext( AdminContext );

	const onChange = ( value: Value ) => {
		setEditorOptions( {
			...editorOptions,
			guides: {
				...editorOptions.guides,
				highlightActiveIndentation: value,
			},
		} );
	};

	return (
		<SettingItem
			control="select"
			label={ __( 'Highlight Active Indentation', 'custom-html-block-extension' ) }
			group={ __( 'Guides', 'custom-html-block-extension' ) }
			value={ editorOptions.guides.highlightActiveIndentation }
			onChange={ onChange }
			defaultValue
			options={ [
				{
					label: __( 'Enable', 'custom-html-block-extension' ),
					value: true,
					image: 'editor-options/guides/highlight-active-indentation_1.gif',
					description: __(
						'Highlights the active indent guide. Not highlighted on lines where a bracket pair guide is shown.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Always', 'custom-html-block-extension' ),
					value: 'always',
					image: 'editor-options/guides/highlight-active-indentation_2.gif',
					description: __(
						'Highlights the active indent guide even if bracket guides are highlighted.',
						'custom-html-block-extension'
					),
				},
				{
					label: __( 'Disable', 'custom-html-block-extension' ),
					value: false,
					image: 'editor-options/guides/highlight-active-indentation_3.gif',
					description: __(
						'Do not highlight the active indent guide.',
						'custom-html-block-extension'
					),
				},
			] }
			help={ {
				description: (
					<Text render={ <p /> }>
						{ __(
							'Highlight the indent guide of the block at the cursor. This applies to the indent guides shown by Indentation, not to the bracket pair guides.',
							'custom-html-block-extension'
						) }
					</Text>
				),
				showOptions: true,
				colCount: 3,
			} }
		/>
	);
}
